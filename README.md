# Node.js Homework 01 — Base64 & Hex

Seven functions for checking `NODE_ENV`, encoding colon-separated arguments,
and decoding Base64/Hex strings with Node.js `Buffer`.

## Run and test

Requires Node.js 24. No external dependencies are needed.

- `npm test` — run automated tests using `node:test`.
- `npm run build` — generate the demo in `dist/index.html`.
- `npm run check` — check syntax, run tests, and build the demo.

Safe decoders validate the input format. Empty strings are valid.
Invalid input throws `Invalid base64 string` or `Invalid hex string`.
The solution is in `main.js`; `demo/` and `scripts/` provide the demo page.

## Demo

[GitHub Pages](https://andrii-dolzhenko.github.io/njs-homework-01-base-hex/)
