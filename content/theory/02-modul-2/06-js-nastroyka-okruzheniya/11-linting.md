---
title: "Линтинг"
module: "Модуль 2"
topic: "JS: Настройка окружения"
buildin_id: 4e2dbdb7-1bd2-4b83-8da3-6d7d52f29a31
source: platform
rewritten_at: 2026-06-24
reviewed_by:
---

# Линтинг

Код оценивают по разным критериям. С базового начинают все — **стиль**. Сравните:

```
// Без форматирования
const find_sum = (a, b) => {
  const c = a + b; return c
}

// С форматированием
const findSum = (a, b) => {
  const sum = a + b
  return sum
}
```

Второй вариант читается проще; на больших файлах разница заметнее. Единый стиль — норма в коммерческой разработке и важен в команде.

Универсальный инструмент форматирования — *prettier*: переформатирует файл по своим правилам. Но этого мало. Prettier не разбирает смысл кода. В JavaScript предпочитают `===` вместо `==` — меньше сюрпризов с приведением типов. Prettier не заменит `==` на `===` сам: можно сломать задуманное поведение.

За такими вещами следят **линтеры** — наборы правил с рекомендациями «так лучше / так рискованно». Плагины добавляют проверки под конкретные фреймворки.

В JavaScript чаще всего [eslint](https://eslint.org/). Правил [сотни](https://eslint.org/docs/rules/). Фрагмент кода:

```
let a = 5
a++
```

Форматирование нормальное. ESLint предупредит:

- Identifier name 'a' is too short [id-length](https://eslint.org/docs/rules/id-length). Слишком короткое имя.

- Unary operator '++' used [no-plusplus](https://eslint.org/docs/rules/no-plusplus). Инкремент считают рискованным.

- 'a' is assigned a value but never used [no-unused-vars](https://eslint.org/docs/rules/no-unused-vars). Переменная не используется.

На страницах правил объясняют «почему плохо» и «как лучше». Изучение правил ESLint полезно для привычек.

## Установка и настройка Eslint

ESLint ставят как *dev* зависимость:

```
npm install --save-dev eslint @eslint/create-config
```

Без конфигурации проверки не запустятся. Инициализация через *@eslint/create-config*. Вопросов много; при указанных версиях пакетов сценарий такой (на других версиях ответы могут отличаться — файл правят вручную):

`npx eslint --init ✔ What do you want to lint? · javascript ✔ How would you like to use ESLint? · problems ✔ What type of modules does your project use? · esm ✔ Which framework does your project use? · none ✔ Does your project use TypeScript? · no ✔ Where does your code run? · node The config that you've selected requires the following dependencies: eslint, @eslint/js, globals ✔ Would you like to install them now? · Yes ✔ Which package manager do you want to use? · npm ☕️Installing...`

*Выбор пунктов Browser/Node выполняется по клавише пробела, а подтверждение по Enter*

Появится конфиг — его коммитят:

```
// eslint.config.mjs
import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
])
```

Сам ESLint стиль не навязывает. Подключают [ESLint Stylistic](https://eslint.style/):

```
npm install --save-dev @stylistic/eslint-plugin
```

Итоговый *eslint.config.mjs*:

```
// eslint.config.mjs
import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  stylistic.configs.recommended,
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
])
```

Запуск:

```
# Обратите внимание на точку, это указание текущей директории и всех поддиректорий
npx eslint .
```

Без проблем — тихий выход. С ошибками — список и подсказки.

Конфиг можно расширять и ослаблять правила; для старта хватает стандартного набора.

Часть замечаний ESLint исправляет сам — флаг `--fix`:

```
npx eslint --fix .
```

## Самостоятельная работа

1. Повторите шаги из теории. Установите и настройте линтер в проект, над которым вы работали в течение курса (my*-js*)

1. Добавьте в *Makefile* команду `lint` для проверки линтинга и `lint-fix` для автоматического исправления ошибок. Не забудьте эти команды добавить в *README.md*

1. Подключите в ваш редактор интеграцию с линтером.

1. Запушьте изменения на Github.

В итоге у вас должны быть настроены ESLint и его интеграция с редактором.

## Дополнительные материалы

- [Документация ESlint](https://eslint.org/docs/latest/use/getting-started)

- Учебный npm-пакет *nodejs-package* с настроенным линтером (см. задания курса)

- [ESLint - расширение для VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Далее →
