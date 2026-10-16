# Node.js Homework 01 — Base64 & Hex

Seven functions for checking `NODE_ENV`, encoding colon-separated arguments,
and decoding Base64/Hex strings with Node.js `Buffer`.

## Run and test

Requires Node.js 24.

```bash
npm ci
npm run check
```

- `npm test` — run automated tests using `node:test`.
- `npm run build` — generate the demo in `dist/index.html`.
- `npm run check` — check syntax, run tests, and build the demo.

Safe decoders validate the input format. Empty strings are valid.
Invalid input throws `Invalid base64 string` or `Invalid hex string`.
The solution is in `main.js`; `demo/` and `scripts/` provide the demo page.

The interactive demo uses the same functions as the Node.js solution. Enter one
argument per line, choose Base64 or Hex, and encode or decode your own data.
The format check can be toggled to compare regular and safe decoding.
The NODE_ENV selector supplies example values for `isDebugMode()`.

The browser build uses `esbuild` and the `buffer` package. The core homework
functions use built-in Node.js APIs. GitHub Actions installs the build
dependencies and publishes the demo to GitHub Pages.

## Demo

[GitHub Pages](https://andrii-dolzhenko.github.io/njs-homework-01-base-hex/)
