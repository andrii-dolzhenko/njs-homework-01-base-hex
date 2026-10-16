import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isDebugMode,
  encodeToBase64,
  encodeToHex,
  decodeFromBase64,
  decodeFromHex,
  safeDecodeFromBase64,
  safeDecodeFromHex,
} from '../main.js';

function captureConsole(t) {
  return {
    log: t.mock.method(console, 'log', () => {}),
    error: t.mock.method(console, 'error', () => {}),
  };
}

test('isDebugMode checks the current environment and logs the result', (t) => {
  const { log } = captureConsole(t);
  const originalEnv = process.env.NODE_ENV;

  try {
    for (const value of ['development', 'production', 'test', 'Development', '']) {
      process.env.NODE_ENV = value;
      const expected = value === 'development';
      assert.equal(isDebugMode(), expected);
      assert.equal(log.mock.calls.at(-1).arguments[1], expected);
    }

    delete process.env.NODE_ENV;
    assert.equal(isDebugMode(), false);
  } finally {
    if (originalEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalEnv;
  }
});

test('encoding joins all arguments with colons', (t) => {
  const { log } = captureConsole(t);
  assert.equal(encodeToBase64('john@email.com', '123', 'extraData'), 'am9obkBlbWFpbC5jb206MTIzOmV4dHJhRGF0YQ==');
  assert.equal(encodeToHex('john@email.com', '123', 'extraData'), '6a6f686e40656d61696c2e636f6d3a3132333a657874726144617461');
  assert.equal(log.mock.callCount(), 2);
});

test('decoding returns the original text and logs the result', (t) => {
  const { log } = captureConsole(t);
  assert.equal(decodeFromBase64('Tm9kZTpqcw=='), 'Node:js');
  assert.equal(decodeFromHex('4e6f64653a6a73'), 'Node:js');
  assert.equal(log.mock.calls[0].arguments[1], 'Node:js');
  assert.equal(log.mock.calls[1].arguments[1], 'Node:js');
});

test('all decoders preserve Unicode, emoji, empty arguments and colons', (t) => {
  captureConsole(t);
  for (const args of [['Привіт', 'Node 👋'], ['a:b', '', 'c'], ['single'], [], ['']]) {
    const text = args.join(':');
    const base64 = encodeToBase64(...args);
    const hex = encodeToHex(...args);
    assert.equal(decodeFromBase64(base64), text);
    assert.equal(safeDecodeFromBase64(base64), text);
    assert.equal(decodeFromHex(hex), text);
    assert.equal(safeDecodeFromHex(hex), text);
  }
});

test('safe Base64 decoding accepts both padding forms and complete groups', (t) => {
  const { log } = captureConsole(t);
  for (const [input, expected] of [['YQ==', 'a'], ['YWI=', 'ab'], ['YWJj', 'abc'], ['', '']]) {
    assert.equal(safeDecodeFromBase64(input), expected);
    assert.equal(log.mock.calls.at(-1).arguments[1], expected);
  }
});

test('safe Hex decoding accepts lower and upper case', (t) => {
  const { log } = captureConsole(t);
  assert.equal(safeDecodeFromHex('4e6f6465'), 'Node');
  assert.equal(safeDecodeFromHex('4E6F6465'), 'Node');
  assert.equal(log.mock.calls.at(-1).arguments[1], 'Node');
});

test('safe Base64 decoding rejects invalid symbols, lengths and padding', (t) => {
  const { error } = captureConsole(t);
  const inputs = ['@@@', 'YQ', 'YQ=', 'YQ===', '=YQ=', 'a===', 'Y Q==', 'YQ==\n', 'YWJj\n'];
  for (const input of inputs) {
    assert.throws(() => safeDecodeFromBase64(input), { message: 'Invalid base64 string' });
    assert.deepEqual(error.mock.calls.at(-1).arguments, ['Invalid base64 string']);
  }
  assert.equal(error.mock.callCount(), inputs.length);
});

test('safe Hex decoding rejects odd lengths and invalid symbols', (t) => {
  const { error } = captureConsole(t);
  const inputs = ['a', 'abc', '61gg', '0x61', '6 1', '61\n'];
  for (const input of inputs) {
    assert.throws(() => safeDecodeFromHex(input), { message: 'Invalid hex string' });
    assert.deepEqual(error.mock.calls.at(-1).arguments, ['Invalid hex string']);
  }
  assert.equal(error.mock.callCount(), inputs.length);
});

test('safe decoders reject non-string values with the required messages', (t) => {
  captureConsole(t);
  for (const input of [undefined, null, 123, false, [], {}, Buffer.from('a'), Symbol('a')]) {
    assert.throws(() => safeDecodeFromBase64(input), { message: 'Invalid base64 string' });
    assert.throws(() => safeDecodeFromHex(input), { message: 'Invalid hex string' });
  }
});

test('ordinary decoders log and rethrow errors', (t) => {
  const { error } = captureConsole(t);
  assert.throws(() => decodeFromBase64(undefined), TypeError);
  assert.throws(() => decodeFromHex(undefined), TypeError);
  assert.equal(error.mock.callCount(), 2);
});

test('encoders log and rethrow argument conversion errors', (t) => {
  const { error } = captureConsole(t);
  assert.throws(() => encodeToBase64(Symbol('a')), TypeError);
  assert.throws(() => encodeToHex(Symbol('a')), TypeError);
  assert.equal(error.mock.callCount(), 2);
});
