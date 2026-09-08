/**
 * Lightweight validation utilities for the checkout form.
 *
 * Phone format: Pakistani mobile numbers.
 *   Accepts: 03XXXXXXXXX, +923XXXXXXXXX, 923XXXXXXXXX, 3XXXXXXXXX,
 *            and any of the above with spaces / dashes / parentheses.
 *   Auto-normalises to 03XXXXXXXXX on success.
 */

export const isValidPakistaniPhone = (raw) => {
  if (!raw) return false;
  // Strip spaces, dashes, parens, plus signs
  const cleaned = String(raw).replace(/[\s\-()]/g, '');
  // Must be 10–13 digits starting with 03 / 92 / 3
  return /^(?:\+?92|0)?3\d{9}$/.test(cleaned);
};

export const isValidEmail = (raw) => {
  if (!raw) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(raw).trim());
};

export const isNonEmpty = (raw) => Boolean(String(raw || '').trim());

/** Normalise a phone number to 03XXXXXXXXX (returns the cleaned form). */
export const normalizePhone = (raw) => {
  if (!raw) return '';
  const cleaned = String(raw).replace(/[\s\-()]/g, '');
  if (/^923\d{9}$/.test(cleaned)) return '0' + cleaned.slice(2);
  if (/^3\d{9}$/.test(cleaned)) return '0' + cleaned;
  return cleaned;
};

export const validateCheckout = (form) => {
  const errors = {};
  if (!isNonEmpty(form.customerName)) errors.customerName = 'Please enter your full name';
  if (!isValidPakistaniPhone(form.phone)) {
    errors.phone = 'Please enter a valid Pakistani mobile number (e.g. 03XX XXXXXXX)';
  }
  if (!isNonEmpty(form.address)) errors.address = 'Please enter your complete delivery address';
  if (!isNonEmpty(form.city)) errors.city = 'Please enter your city';
  if (form.email && !isValidEmail(form.email)) errors.email = 'Please enter a valid email or leave it empty';
  if (!form.quantity || Number(form.quantity) < 1) errors.quantity = 'Please select at least 1 jar';
  if (Number(form.quantity) > 50) errors.quantity = 'For bulk orders, please contact us on WhatsApp';
  return errors;
};
