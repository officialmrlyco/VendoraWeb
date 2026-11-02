// / note: Exercise the same visibility helper used by both live reset forms without Firebase or credentials.
import test from 'node:test';
import assert from 'node:assert/strict';
import { setPasswordVisibility } from './auth-password-visibility.mjs';

function makeField(id) {
  const attributes = new Map();
  const input = { id, type: 'password' };
  const button = {
    title: 'Show password',
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: (name) => attributes.get(name),
  };
  return { input, button };
}

test('reveals and conceals the selected reset field with matching accessible state', () => {
  const first = makeField('new-password');
  const confirmation = makeField('confirm-password');

  setPasswordVisibility(first.input, first.button, true);
  assert.equal(first.input.type, 'text');
  assert.equal(first.button.getAttribute('aria-pressed'), 'true');
  assert.equal(first.button.getAttribute('aria-label'), 'Hide new password');

  setPasswordVisibility(confirmation.input, confirmation.button, true);
  setPasswordVisibility(first.input, first.button, false);
  assert.equal(first.input.type, 'password');
  assert.equal(first.button.getAttribute('aria-pressed'), 'false');
  assert.equal(first.button.getAttribute('aria-label'), 'Show new password');
  assert.equal(confirmation.input.type, 'text');
  assert.equal(confirmation.button.getAttribute('aria-label'), 'Hide confirmation password');
});
