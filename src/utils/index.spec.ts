import test from 'ava';
import { normalizeNumber } from '.';

test('1', t => {
  t.is(normalizeNumber('1'), 1);
});

test('1.1', t => {
  t.is(normalizeNumber('1.2'), 1.2);
});

test('1k', t => {
  t.is(normalizeNumber('1k'), 1000);
});

test('1.1k', t => {
  t.is(normalizeNumber('1.1k'), 1100);
});

test('1.2 K', t => {
  t.is(normalizeNumber('1.2 K'), 1200);
});

test('1.3　M', t => {
  t.is(normalizeNumber('1.3　M'), 1300000);
});

test('1.4G', t => {
  t.is(normalizeNumber('1.4G'), 1400000000);
});

test('1,234.5 T', t => {
  t.is(normalizeNumber('1,234.5 T'), 1234500000000000);
});
