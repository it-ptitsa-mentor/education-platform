#!/usr/bin/env bash
# =============================================================================
# Одноразовый setup сервера для IT Птица API
# Запускать от root (или sudo) на Ubuntu-сервере
# =============================================================================
set -euo pipefail

APP_DIR=/opt/education-platform
SERVICE=education-platform-api
NGINX_SNIPPET=/etc/nginx/snippets/education-platform-api.conf
NGINX_SITE=/etc/nginx/sites-available/education.it-ptitsa-mentor.ru

echo "=== [1/6] Проверяем Node.js ==="
if ! command -v node &>/dev/null; then
  echo "Установка Node.js 20 через NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node --version

echo "=== [2/6] Проверяем pnpm ==="
if ! command -v pnpm &>/dev/null; then
  npm install -g pnpm
fi
pnpm --version

echo "=== [3/6] Клонируем / обновляем репозиторий ==="
if [ -d "$APP_DIR/.git" ]; then
  echo "Репозиторий уже есть, обновляем..."
  git -C "$APP_DIR" fetch origin main
  git -C "$APP_DIR" reset --hard origin/main
else
  echo "Клонируем репозиторий..."
  git clone https://github.com/it-ptitsa-mentor/education-platform.git "$APP_DIR"
fi
chown -R www-data:www-data "$APP_DIR"

echo "=== [4/6] Устанавливаем зависимости ==="
cd "$APP_DIR"
sudo -u www-data pnpm install --frozen-lockfile

echo "=== [5/6] Копируем и активируем systemd-сервис ==="
cp "$APP_DIR/deploy/education-platform-api.service" "/etc/systemd/system/${SERVICE}.service"
systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"
systemctl status "$SERVICE" --no-pager

echo "=== [6/6] Настраиваем nginx ==="
mkdir -p /etc/nginx/snippets
cp "$APP_DIR/deploy/nginx-api.conf" "$NGINX_SNIPPET"

echo ""
echo "Добавь строку в server-блок ${NGINX_SITE}:"
echo "  include /etc/nginx/snippets/education-platform-api.conf;"
echo ""
echo "Потом: nginx -t && systemctl reload nginx"
echo ""

# Автоматически добавляем include, если его ещё нет
if [ -f "$NGINX_SITE" ] && ! grep -q "education-platform-api" "$NGINX_SITE"; then
  sed -i '/# --- END INCLUDES ---/i\    include /etc/nginx/snippets/education-platform-api.conf;' "$NGINX_SITE"
  echo "include добавлен в $NGINX_SITE"
  nginx -t && systemctl reload nginx
  echo "nginx перезагружен ✅"
fi

echo ""
echo "=== Проверка ==="
sleep 2
if curl -sf http://localhost:4100/api/health | grep -q '"ok"'; then
  echo "✅ API health-check: OK"
else
  echo "⚠️  API health-check не отвечает — проверь: journalctl -u ${SERVICE} -n 50"
fi
