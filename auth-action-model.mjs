// Keep action-link validation and password rules pure so malformed or hostile
// URLs can be rejected before any Firebase SDK call is made.
export const AUTH_ACTION_MODES = Object.freeze([
  'verifyEmail',
  'recoverEmail',
  'resetPassword',
  'verifyAndChangeEmail',
]);

// Firebase action URLs may include arbitrary continuation parameters. This
// handler intentionally extracts only one supported mode and one opaque code.
export function parseAuthActionRequest(search) {
  let params;
  try {
    params = new URLSearchParams(search);
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const modes = params.getAll('mode');
  const codes = params.getAll('oobCode');
  if (modes.length !== 1 || codes.length !== 1) {
    return { ok: false, reason: 'malformed' };
  }

  const mode = modes[0];
  const code = codes[0];
  if (!AUTH_ACTION_MODES.includes(mode)) return { ok: false, reason: 'unsupported-mode' };
  if (!code || code.length > 4096 || /[\u0000-\u0020\u007f]/.test(code)) {
    return { ok: false, reason: 'malformed' };
  }

  // Firebase's own project identity is pinned in the SDK config; query apiKey
  // and continueUrl values are never trusted as configuration or redirects.
  return { ok: true, mode, code };
}

// Vendora's app applies the same visible password constraints before submit.
export function isValidVendoraPassword(password) {
  return typeof password === 'string' && password.length >= 6 && password.length <= 20 &&
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

// Require a second entry so a reset cannot silently set a mistyped password.
export function passwordsMatch(password, confirmation) {
  return typeof password === 'string' && password.length > 0 && password === confirmation;
}

// All user-facing action labels come from this fixed table, never URL text.
export const AUTH_ACTION_PRESENTATION = Object.freeze({
  verifyEmail: Object.freeze({ title: 'Confirm your email', pending: 'Checking your verification link…', success: 'Your email is verified.', successDetail: 'You can now sign in to Vendora with this email address.' }),
  recoverEmail: Object.freeze({ title: 'Restore your email', pending: 'Checking your account recovery link…', success: 'Your previous email has been restored.', successDetail: 'Sign in to Vendora using the restored email address.' }),
  resetPassword: Object.freeze({ title: 'Choose a new password', pending: 'Checking your password reset link…', success: 'Your password has been updated.', successDetail: 'Use your new password the next time you sign in.' }),
  verifyAndChangeEmail: Object.freeze({ title: 'Confirm your new email', pending: 'Checking your email change link…', success: 'Your new email is confirmed.', successDetail: 'Use the new email address when you next sign in.' }),
});

// Firebase errors are intentionally translated to small, actionable messages;
// raw SDK messages can expose implementation details and are not user guidance.
export function authActionErrorMessage(code) {
  switch (code) {
    case 'expired-action-code':
    case 'invalid-action-code':
      return 'This link is invalid or has expired. Open Vendora and request a fresh email from Account settings.';
    case 'network-request-failed':
      return 'We could not reach Firebase. Check your connection, then try this link again.';
    case 'weak-password':
      return 'Use 6–20 characters with at least one uppercase letter, one lowercase letter, and one number.';
    case 'user-disabled':
      return 'This account is disabled. Contact Vendora support for help.';
    case 'too-many-requests':
      return 'Too many attempts were made. Wait a little, then request a new link in Vendora.';
    default:
      return 'We could not complete this request. Open Vendora and request a fresh link or contact support.';
  }
}
