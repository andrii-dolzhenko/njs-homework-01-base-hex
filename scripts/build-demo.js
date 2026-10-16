import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import {
  isDebugMode,
  encodeToBase64,
  encodeToHex,
  decodeFromBase64,
  decodeFromHex,
  safeDecodeFromBase64,
  safeDecodeFromHex,
} from '../main.js';

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

const args = ['john@email.com', '123', 'extraData'];
const base64 = encodeToBase64(...args);
const hex = encodeToHex(...args);
const examples = [
  ['encodeToBase64', "'john@email.com', '123', 'extraData'", () => encodeToBase64(...args)],
  ['encodeToHex', "'john@email.com', '123', 'extraData'", () => encodeToHex(...args)],
  ['decodeFromBase64', JSON.stringify(base64), () => decodeFromBase64(base64)],
  ['decodeFromHex', JSON.stringify(hex), () => decodeFromHex(hex)],
  ['safeDecodeFromBase64', "'0J/RgNC40LLRltGC'", () => safeDecodeFromBase64('0J/RgNC40LLRltGC')],
  ['safeDecodeFromHex', "'d09fd180d0b8d0b2d196d182'", () => safeDecodeFromHex('d09fd180d0b8d0b2d196d182')],
  ['safeDecodeFromBase64', "'@@@'", () => safeDecodeFromBase64('@@@')],
  ['safeDecodeFromHex', "'61gg'", () => safeDecodeFromHex('61gg')],
];

const originalEnv = process.env.NODE_ENV;
try {
  for (const value of ['development', 'production', undefined]) {
    if (value === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = value;
    const result = isDebugMode();
    examples.unshift(['isDebugMode', '', () => result, `NODE_ENV: ${value ?? 'не встановлено'}`]);
  }
} finally {
  if (originalEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalEnv;
}

const results = examples.map(([name, input, run, environment]) => {
  let result;
  let failed = false;
  try {
    result = run();
  } catch (error) {
    result = error.message;
    failed = true;
  }

  return `<li class="example${failed ? ' example--error' : ''}">
    <div class="example__heading"><h2>${escapeHtml(name)}</h2><span class="badge">${failed ? 'Помилку перехоплено' : 'Результат'}</span></div>
    ${environment ? `<p class="example__environment">${escapeHtml(environment)}</p>` : ''}
    <pre class="example__call"><code>${escapeHtml(name)}(${escapeHtml(input)})</code></pre>
    <p class="example__label">${failed ? 'Повідомлення помилки' : 'Повернене значення'}</p>
    <pre class="example__result"><code>${escapeHtml(result)}</code></pre>
  </li>`;
}).join('\n');

const template = await readFile(new URL('../demo/index.html', import.meta.url), 'utf8');
if (template.split('{{results}}').length !== 2) throw new Error('Expected one results placeholder');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), template.replace('{{results}}', results));
await build({
  entryPoints: [fileURLToPath(new URL('../demo/app.js', import.meta.url))],
  outfile: fileURLToPath(new URL('../dist/app.js', import.meta.url)),
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  inject: [fileURLToPath(new URL('../demo/node-shim.js', import.meta.url))],
  define: { 'process.env.NODE_ENV': 'demoProcess.env.NODE_ENV' },
  minify: true,
  keepNames: true,
});
console.log('Demo built: dist/index.html');
