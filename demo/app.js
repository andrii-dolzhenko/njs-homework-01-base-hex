import {
  isDebugMode,
  encodeToBase64,
  encodeToHex,
  decodeFromBase64,
  decodeFromHex,
  safeDecodeFromBase64,
  safeDecodeFromHex,
} from '../main.js';
import { demoProcess } from './node-shim.js';

const encodeForm = document.querySelector('#encode-form');
const encodeInput = document.querySelector('#encode-input');
const encodeFormat = document.querySelector('#encode-format');
const encodeResult = document.querySelector('#encode-result');
const transferButton = document.querySelector('#transfer-result');
const decodeForm = document.querySelector('#decode-form');
const decodeInput = document.querySelector('#decode-input');
const decodeFormat = document.querySelector('#decode-format');
const safeMode = document.querySelector('#safe-mode');
const decodeResult = document.querySelector('#decode-result');
const environment = document.querySelector('#environment');
let encodedValue = '';
let encodedFormat = 'base64';

function showResult(element, name, value, failed = false) {
  element.querySelector('.result__name').textContent = name;
  element.querySelector('code').textContent = value === '' ? '""' : String(value);
  element.dataset.state = failed ? 'error' : 'success';
  element.hidden = false;
}

encodeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const args = encodeInput.value.replace(/\r\n?/g, '\n').split('\n');
    encodedFormat = encodeFormat.value;
    const encode = encodedFormat === 'base64' ? encodeToBase64 : encodeToHex;
    encodedValue = encode(...args);
    showResult(encodeResult, `${encode.name}(...args)`, encodedValue);
    transferButton.hidden = false;
  } catch (error) {
    showResult(encodeResult, 'Помилка', error.message, true);
    transferButton.hidden = true;
  }
});

encodeForm.addEventListener('input', () => {
  encodeResult.hidden = true;
  transferButton.hidden = true;
});

decodeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const decoders = safeMode.checked
    ? { base64: safeDecodeFromBase64, hex: safeDecodeFromHex }
    : { base64: decodeFromBase64, hex: decodeFromHex };
  const decode = decoders[decodeFormat.value];

  try {
    const result = decode(decodeInput.value);
    decodeInput.removeAttribute('aria-invalid');
    showResult(decodeResult, `${decode.name}(input)`, result);
  } catch (error) {
    decodeInput.setAttribute('aria-invalid', 'true');
    showResult(decodeResult, decode.name, error.message, true);
  }
});

decodeForm.addEventListener('input', () => {
  decodeResult.hidden = true;
  decodeInput.removeAttribute('aria-invalid');
});

transferButton.addEventListener('click', () => {
  decodeInput.value = encodedValue;
  decodeFormat.value = encodedFormat;
  decodeForm.requestSubmit();
  decodeInput.focus();
});

function updateEnvironment() {
  if (environment.value === 'unset') delete demoProcess.env.NODE_ENV;
  else demoProcess.env.NODE_ENV = environment.value;
  document.querySelector('#debug-result').textContent = String(isDebugMode());
}

environment.addEventListener('change', updateEnvironment);
updateEnvironment();
