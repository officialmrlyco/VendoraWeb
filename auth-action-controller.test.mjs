// / note: Run the real page controller against fake DOM and Firebase boundaries; no browser account or link is contacted.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { setPasswordVisibility } from './auth-password-visibility.mjs';
import {
  AUTH_ACTION_PRESENTATION,
  authActionErrorMessage,
  isValidVendoraPassword,
  parseAuthActionRequest,
  passwordsMatch,
} from './auth-action-model.mjs';

const controllerSource = await readFile(new URL('./wdhh/auth-action.mjs', import.meta.url), 'utf8');

function fakeElement(id = '') {
  return {
    id,
    type: '',
    value: '',
    hidden: false,
    disabled: false,
    title: '',
    textContent: '',
    dataset: {},
    attributes: new Map(),
    listeners: new Map(),
    children: [],
    addEventListener(type, listener) { this.listeners.set(type, listener); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    getAttribute(name) { return this.attributes.get(name); },
    focus() { this.focused = true; },
    reset() {},
    replaceChildren(...children) { this.children = children; },
    async dispatch(type) {
      let prevented = false;
      const event = { preventDefault() { prevented = true; } };
      await this.listeners.get(type)?.(event);
      return prevented;
    },
    async click() { await this.listeners.get('click')?.({}); },
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

async function createController({ confirmReset = async () => {} } = {}) {
  const ids = [
    'action-status', 'action-title', 'action-message', 'reset-form', 'auth-help',
    'retry-action', 'help-title', 'help-steps', 'reset-account', 'password-form',
    'new-password', 'confirm-password', 'submit-password',
  ];
  const elements = new Map(ids.map((id) => [id, fakeElement(id)]));
  elements.get('password-form').reset = () => {
    elements.get('new-password').value = '';
    elements.get('confirm-password').value = '';
  };
  const toggles = ['new-password', 'confirm-password'].map((inputId) => {
    const button = fakeElement(`toggle-${inputId}`);
    button.dataset.passwordToggle = inputId;
    return button;
  });
  for (const id of ['new-password', 'confirm-password']) elements.get(id).type = 'password';

  const calls = { verify: [], confirm: [], check: [], apply: [] };
  const firebaseAuth = {};
  const replacements = {
    initializeApp: () => ({}),
    getAuth: () => firebaseAuth,
    verifyPasswordResetCode: async (_auth, code) => { calls.verify.push(code); return 'example@vendora.test'; },
    confirmPasswordReset: async (_auth, code, password) => {
      calls.confirm.push({ code, password });
      return confirmReset();
    },
    checkActionCode: async (_auth, code) => { calls.check.push(code); },
    applyActionCode: async (_auth, code) => { calls.apply.push(code); },
    AUTH_ACTION_PRESENTATION,
    authActionErrorMessage,
    isValidVendoraPassword,
    parseAuthActionRequest,
    passwordsMatch,
    setPasswordVisibility,
  };

  // Strip only static imports; execute the original controller source unchanged against injected fakes.
  const executable = controllerSource.replace(/^import\s+\{[\s\S]*?\}\s+from\s+['"][^'"]+['"];\s*/gm, '');
  assert.notEqual(executable, controllerSource, 'expected controller imports to be replaced');
  const context = vm.createContext({
    ...replacements,
    document: {
      getElementById: (id) => elements.get(id) ?? null,
      querySelectorAll: (selector) => selector === '[data-password-toggle]' ? toggles : [],
      createElement: (tagName) => fakeElement(tagName),
    },
    window: {
      location: { search: '?mode=resetPassword&oobCode=fake-code', pathname: '/auth/' },
      history: { replaceState() {} },
    },
  });
  vm.runInContext(executable, context, { filename: 'wdhh/auth-action.mjs' });

  // Let the controller's initial async link validation settle before driving events.
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(elements.get('reset-form').hidden, false);
  return { elements, toggles, calls };
}

test('the actual eye listeners independently reveal fields and every status transition conceals both', async () => {
  const { elements, toggles } = await createController();
  await toggles[0].click();
  assert.equal(elements.get('new-password').type, 'text');
  assert.equal(elements.get('confirm-password').type, 'password');
  await toggles[1].click();
  assert.equal(elements.get('confirm-password').type, 'text');

  elements.get('new-password').value = 'weak';
  elements.get('confirm-password').value = 'weak';
  await elements.get('password-form').dispatch('submit');
  assert.equal(elements.get('action-status').dataset.state, 'error');
  assert.equal(elements.get('new-password').type, 'password');
  assert.equal(elements.get('confirm-password').type, 'password');
});

test('weak and mismatched values never reach Firebase password reset', async () => {
  const { elements, calls } = await createController();
  const form = elements.get('password-form');
  const password = elements.get('new-password');
  const confirmation = elements.get('confirm-password');

  password.value = 'weak';
  confirmation.value = 'weak';
  await form.dispatch('submit');
  assert.equal(password.getAttribute('aria-invalid'), 'true');
  assert.equal(calls.confirm.length, 0);

  password.value = 'Strong7';
  confirmation.value = 'Strong8';
  await form.dispatch('submit');
  assert.equal(confirmation.getAttribute('aria-invalid'), 'true');
  assert.equal(calls.confirm.length, 0);
});

test('valid policy is passed once and duplicate submits stay fenced while Firebase is pending', async () => {
  const pending = deferred();
  const { elements, calls } = await createController({ confirmReset: () => pending.promise });
  elements.get('new-password').value = 'Strong7';
  elements.get('confirm-password').value = 'Strong7';

  const first = elements.get('password-form').dispatch('submit');
  await Promise.resolve();
  const second = elements.get('password-form').dispatch('submit');
  await Promise.resolve();
  assert.deepEqual(calls.confirm, [{ code: 'fake-code', password: 'Strong7' }]);
  assert.equal(elements.get('submit-password').disabled, true);
  pending.resolve();
  await Promise.all([first, second]);
  assert.equal(elements.get('action-status').dataset.state, 'success');
  assert.equal(elements.get('new-password').type, 'password');
  assert.equal(elements.get('confirm-password').type, 'password');
  assert.equal(elements.get('new-password').value, '');
  assert.equal(elements.get('confirm-password').value, '');
});

test('Firebase failure and link retry conceal and clear both fields', async () => {
  let failReset = true;
  const { elements, toggles, calls } = await createController({
    confirmReset: async () => {
      if (failReset) {
        const error = new Error('private SDK details');
        error.code = 'auth/network-request-failed';
        throw error;
      }
    },
  });
  elements.get('new-password').value = 'Strong7';
  elements.get('confirm-password').value = 'Strong7';
  await toggles[0].click();
  await toggles[1].click();
  await elements.get('password-form').dispatch('submit');

  assert.equal(elements.get('reset-form').hidden, true);
  assert.equal(elements.get('new-password').type, 'password');
  assert.equal(elements.get('confirm-password').type, 'password');
  assert.equal(elements.get('new-password').value, '');
  assert.equal(elements.get('confirm-password').value, '');
  assert.equal(elements.get('retry-action').hidden, false);

  failReset = false;
  await elements.get('retry-action').click();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls.verify.length, 2);
  assert.equal(elements.get('reset-form').hidden, false);
  assert.equal(elements.get('new-password').type, 'password');
  assert.equal(elements.get('confirm-password').type, 'password');
  assert.equal(elements.get('new-password').value, '');
  assert.equal(elements.get('confirm-password').value, '');
});
