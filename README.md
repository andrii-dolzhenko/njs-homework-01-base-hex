# Node.js Homework 01 — Base64 та Hex

ДЗ 54.1: робота з `process.env` і `Buffer` у Node.js.

У `main.js` реалізовано сім функцій: перевірка режиму розробки,
кодування аргументів із роздільником `:`, декодування Base64/Hex
та безпечне декодування з перевіркою формату й обробкою помилок.

## Запуск і перевірка

Потрібен Node.js 24. Зовнішніх залежностей немає.

```bash
git clone https://github.com/andrii-dolzhenko/njs-homework-01-base-hex.git
cd njs-homework-01-base-hex
npm run check
```

- `npm test` — автоматичні перевірки через `node:test`.
- `npm run build` — створення демосторінки `dist/index.html` із результатами виконання функцій у Node.js. Файл можна відкрити в браузері.

Безпечне декодування приймає стандартний Base64 з коректним доповненням
`=` за потреби та Hex із парною кількістю символів. Порожній рядок допустимий.
Невалідні дані спричиняють `Invalid base64 string` або `Invalid hex string`.

Основне рішення міститься в `main.js`; файли `demo/` і `scripts/` потрібні
для демонстрації. GitHub Actions перевіряє код і публікує демо в GitHub Pages.
