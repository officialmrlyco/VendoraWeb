// Firebase web SDK is loaded from Google's pinned version; the public project
// config is fixed here so query-string apiKey values can never redirect actions.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import {
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import {
  AUTH_ACTION_PRESENTATION,
  authActionErrorMessage,
  isValidVendoraPassword,
  parseAuthActionRequest,
  passwordsMatch,
} from '../auth-action-model.mjs';

// Firebase browser identifiers are public project configuration, not secrets.
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCWWoAuyF4pfMOygk0j6kHQwpT5R3vX-9k',
  authDomain: 'vendora-lyco.firebaseapp.com',
  projectId: 'vendora-lyco',
  storageBucket: 'vendora-lyco.firebasestorage.app',
  messagingSenderId: '120525740578',
  appId: '1:120525740578:web:6c59dfffa88dd33dca887b',
});
const auth = getAuth(firebaseApp);
const byId = (id) => document.getElementById(id);
const status = byId('action-status');
const title = byId('action-title');
const message = byId('action-message');
const formRegion = byId('reset-form');
const help = byId('auth-help');
const retry = byId('retry-action');
const helpTitle = byId('help-title');
const helpSteps = byId('help-steps');
let request = null;

// Recovery steps are selected from fixed copy so links and account data never become markup.
function renderAccountHelp(completed) {
  const content = {
    verifyEmail: completed
      ? ['You are all set.', ['Open Vendora and sign in with your verified email address.']]
      : ['Request a fresh verification email', ['Open Vendora and go to Account.', 'Tap Resend verification email, then open the newest message.']],
    recoverEmail: ['Sign in to Vendora', ['Use the email address that was restored by this request.']],
    resetPassword: completed
      ? ['Sign in to Vendora', ['Use the new password you just created.']]
      : ['Request a fresh password link', ['Return to the Vendora sign-in screen.', 'Choose Forgot password and follow the new email link.']],
    verifyAndChangeEmail: completed
      ? ['Sign in to Vendora', ['Use the new email address you just confirmed.']]
      : ['Request a fresh confirmation email', ['Open Vendora and go to Account settings.', 'Start the email change again and open its newest message.']],
  }[request?.mode] ?? ['Need help?', ['Open Vendora or contact support for help with your account.']];
  helpTitle.textContent = content[0];
  helpSteps.replaceChildren(...content[1].map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

// UI updates use textContent only so action payloads and SDK data never become markup.
function setStatus(state, heading, detail, { showHelp = false, showRetry = false } = {}) {
  status.dataset.state = state;
  status.setAttribute('aria-busy', state === 'pending' ? 'true' : 'false');
  title.textContent = heading;
  message.textContent = detail;
  if (showHelp) renderAccountHelp(state === 'success');
  help.hidden = !showHelp;
  retry.hidden = !showRetry;
}

// Firebase exceptions are reduced to their stable code before mapping to safe copy.
function showFailure(error) {
  const code = typeof error?.code === 'string' ? error.code.split('/').pop() : '';
  setStatus('error', 'We could not use this link', authActionErrorMessage(code), { showHelp: true, showRetry: Boolean(request) });
  if (request?.mode === 'resetPassword') {
    byId('password-form').reset();
    byId('reset-account').textContent = '';
  }
  formRegion.hidden = true;
}

// Discard a consumed one-time credential from memory as soon as Firebase confirms success.
function discardCompletedCode() {
  if (request?.ok) request = { ...request, code: '' };
}

// Verify and change-email codes share Firebase's action-code validation and apply path.
async function runNonPasswordAction() {
  const presentation = AUTH_ACTION_PRESENTATION[request.mode];
  setStatus('pending', presentation.title, presentation.pending);
  await checkActionCode(auth, request.code);
  await applyActionCode(auth, request.code);
  discardCompletedCode();
  setStatus('success', presentation.success, presentation.successDetail, { showHelp: true });
  formRegion.hidden = true;
  retry.hidden = true;
}

// Password reset first validates the code and retrieves only the account email
// Firebase associates with that code; the value is displayed but never persisted.
async function preparePasswordReset() {
  const presentation = AUTH_ACTION_PRESENTATION.resetPassword;
  setStatus('pending', presentation.title, presentation.pending);
  const email = await verifyPasswordResetCode(auth, request.code);
  byId('reset-account').textContent = `Password reset for ${email}`;
  formRegion.hidden = false;
  help.hidden = true;
  setStatus('ready', presentation.title, 'Choose a new password for your Vendora account.');
  byId('new-password').focus();
}

// The request parser rejects malformed/unknown modes before processing an action.
async function processAction() {
  request = parseAuthActionRequest(window.location.search);
  if (!request.ok) {
    setStatus('error', 'This link is not valid', 'Open Vendora and request a fresh email from Account settings.', { showHelp: true });
    formRegion.hidden = true;
    retry.hidden = true;
    return;
  }
  // Keep the one-time code out of the visible URL/history and later referrers.
  window.history.replaceState(null, '', window.location.pathname);
  await runCurrentAction();
}

// Reuse only the validated in-memory request when the user retries this link.
async function runCurrentAction() {
  try {
    if (request.mode === 'resetPassword') await preparePasswordReset();
    else await runNonPasswordAction();
  } catch (error) {
    showFailure(error);
  }
}

// Password submission enforces Vendora's policy and leaves final validation to Firebase.
byId('password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = byId('new-password').value;
  const confirmation = byId('confirm-password').value;
  byId('new-password').setAttribute('aria-invalid', String(!isValidVendoraPassword(password)));
  byId('confirm-password').setAttribute('aria-invalid', String(!passwordsMatch(password, confirmation)));
  if (!isValidVendoraPassword(password)) {
    setStatus('error', 'Choose a stronger password', authActionErrorMessage('weak-password'));
    return;
  }
  if (!passwordsMatch(password, confirmation)) {
    setStatus('error', 'Passwords do not match', 'Enter the same new password in both fields, then try again.', { showHelp: false });
    byId('confirm-password').focus();
    return;
  }

  const submit = byId('submit-password');
  submit.disabled = true;
  setStatus('pending', 'Updating your password', 'Please wait while Firebase secures your account.');
  try {
    await confirmPasswordReset(auth, request.code, password);
    discardCompletedCode();
    byId('password-form').reset();
    byId('reset-account').textContent = '';
    formRegion.hidden = true;
    setStatus('success', AUTH_ACTION_PRESENTATION.resetPassword.success, AUTH_ACTION_PRESENTATION.resetPassword.successDetail, { showHelp: true });
    retry.hidden = true;
  } catch (error) {
    showFailure(error);
  } finally {
    // A failed or successful response always restores an actionable button state.
    submit.disabled = false;
  }
});

// Retrying revalidates the same link; it never sends a new email or follows a continuation URL.
retry.addEventListener('click', () => {
  if (request?.mode === 'resetPassword') preparePasswordReset().catch(showFailure);
  else runCurrentAction();
});

// No auth observer or analytics is needed for single-use email action handling.
processAction();
