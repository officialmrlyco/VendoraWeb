// These tests cover validation and password rules without requiring Firebase,
// network access, credentials, or a browser automation environment.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTH_ACTION_MODES,
  authActionErrorMessage,
  isValidVendoraPassword,
  parseAuthActionRequest,
  passwordsMatch,
} from './auth-action-model.mjs';

// Supported Firebase action modes are explicit, and unsupported modes fail closed.
test('accepts each supported mode and ignores supplied apiKey and continueUrl', () => {
  for (const mode of AUTH_ACTION_MODES) {
    const result = parseAuthActionRequest(`?mode=${mode}&oobCode=Opaque_Code-123&apiKey=attacker&continueUrl=https%3A%2F%2Fevil.example`);
    assert.deepEqual(result, { ok: true, mode, code: 'Opaque_Code-123' });
  }
  assert.deepEqual(parseAuthActionRequest('?mode=signIn&oobCode=abc123'), { ok: false, reason: 'unsupported-mode' });
});

// Duplicate or malformed action parameters cannot select an ambiguous operation.
test('rejects missing, duplicated, empty, oversized, and whitespace-containing codes', () => {
  for (const query of ['', '?mode=verifyEmail', '?mode=verifyEmail&mode=resetPassword&oobCode=abc', '?mode=verifyEmail&oobCode=', '?mode=verifyEmail&oobCode=a%20b', `?mode=verifyEmail&oobCode=${'a'.repeat(4097)}`]) {
    assert.equal(parseAuthActionRequest(query).ok, false, query.slice(0, 80));
  }
});

// The public reset form enforces the same length and character mix as the app.
test('matches Vendora password requirements and confirmation', () => {
  assert.equal(isValidVendoraPassword('Strong7'), true);
  assert.equal(isValidVendoraPassword('short7'), false);
  assert.equal(isValidVendoraPassword('UPPER7'), false);
  assert.equal(isValidVendoraPassword('Lowercase'), false);
  assert.equal(isValidVendoraPassword('LongPassword7Over20Chars'), false);
  assert.equal(passwordsMatch('Strong7', 'Strong7'), true);
  assert.equal(passwordsMatch('Strong7', 'Strong8'), false);
  assert.equal(passwordsMatch('', ''), false);
});

// Error copy remains useful without exposing SDK internals or action codes.
test('maps common Firebase action failures to safe recovery instructions', () => {
  assert.match(authActionErrorMessage('expired-action-code'), /expired/i);
  assert.match(authActionErrorMessage('network-request-failed'), /connection/i);
  assert.match(authActionErrorMessage('unknown-error'), /fresh link/i);
});
