export const PHONE_PREFIX = '+998';

export function formatPhoneLocal(value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 9);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 7) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
}

export function parsePhoneLocal(value) {
  return String(value).replace(/\D/g, '').slice(0, 9);
}

export function isPhoneComplete(value) {
  return parsePhoneLocal(value).length === 9;
}

export function toPhonePayload(localValue) {
  const digits = parsePhoneLocal(localValue);
  if (digits.length !== 9) return null;
  return `+998${digits}`;
}

export function getApiErrorMessage(data, fallback) {
  if (!data || typeof data !== 'object') return fallback;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value[0]) return value[0];
    if (typeof value === 'string') return value;
  }

  return data.detail || fallback;
}
