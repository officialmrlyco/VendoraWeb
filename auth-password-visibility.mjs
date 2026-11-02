// / note: Keep visibility state and its accessible label in sync for both reset fields.
export function setPasswordVisibility(input, button, visible) {
  const isVisible = Boolean(visible);
  input.type = isVisible ? 'text' : 'password';
  button.setAttribute('aria-pressed', String(isVisible));

  const fieldName = input.id === 'confirm-password' ? 'confirmation password' : 'new password';
  button.setAttribute('aria-label', `${isVisible ? 'Hide' : 'Show'} ${fieldName}`);
  button.title = `${isVisible ? 'Hide' : 'Show'} password`;
}
