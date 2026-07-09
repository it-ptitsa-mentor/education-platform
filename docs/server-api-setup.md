# Настройка Backend API на сервере

Одноразовый мануал для поднятия `packages/api` как живого сервиса на Ubuntu-сервере.
После этого CI будет автоматически деплоить код и перезапускать сервис при каждом
мерже в `main`.

## Архитектура

```
Browser → nginx (443) → /app/* → /var/www/.../app/   (статика React)
                       → /api/* → localhost:4100       (Fastify API)
```

API слушает `127.0.0.1:4100`, снаружи недоступен напрямую.

## Одноразовый setup (root на сервере)

```bash
# 1. Скачать или обновить репозиторий (до настройки CI)
apt-get install -y git
git clone https://github.com/it-ptitsa-mentor/education-platform.git /opt/education-platform
cd /opt/education-platform

# 2. Установить Node.js 20 (если нет)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. Установить pnpm
npm install -g pnpm

# 4. Установить зависимости
pnpm install --frozen-lockfile

# 5. Зарегистрировать systemd-сервис
cp deploy/education-platform-api.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable education-platform-api
systemctl start education-platform-api
systemctl status education-platform-api

# 6. Проверить health-check
curl http://localhost:4100/api/health
# → {"ok":true}
```

## Nginx: добавить proxy для /api/

Найти server-блок для `education.it-ptitsa-mentor.ru` (обычно в
`/etc/nginx/sites-available/`) и добавить:

```nginx
# Proxy to Fastify API
location /api/ {
    proxy_pass         http://127.0.0.1:4100/api/;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
    proxy_connect_timeout 5s;
}
```

Или установить готовый сниппет из репозитория:

```bash
mkdir -p /etc/nginx/snippets
cp deploy/nginx-api.conf /etc/nginx/snippets/education-platform-api.conf
# Добавить в server-блок nginx:
#   include /etc/nginx/snippets/education-platform-api.conf;
nginx -t && systemctl reload nginx
```

## Проверка после настройки

```bash
# Локально на сервере
curl http://localhost:4100/api/health
# {"ok":true}

# Через nginx (снаружи)
curl https://education.it-ptitsa-mentor.ru/api/health
# {"ok":true}

# Логи сервиса
journalctl -u education-platform-api -n 50 -f
```

## Как работает CI деплой (после первоначальной настройки)

При каждом мерже в `main` CI автоматически:

1. `rsync` всего кода репозитория → `/opt/education-platform/` (без node_modules)
2. SSH: `pnpm install --frozen-lockfile` на сервере
3. SSH: `systemctl restart education-platform-api`
4. Проверяет `curl http://localhost:4100/api/health`

## Troubleshooting

```bash
# Статус сервиса
systemctl status education-platform-api

# Последние логи
journalctl -u education-platform-api -n 100 --no-pager

# Ручной перезапуск
systemctl restart education-platform-api

# Проверить, что порт слушается
ss -tlnp | grep 4100

# Перезапуск без systemd (для отладки)
cd /opt/education-platform
NODE_ENV=production PORT=4100 node_modules/.bin/tsx packages/api/src/server.ts
```
