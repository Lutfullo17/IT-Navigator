import client from './client';

const LANGUAGE_KEY = 'preferred_language';

export function getPreferredLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'uz';
}

export function setPreferredLanguage(language) {
  localStorage.setItem(LANGUAGE_KEY, language);
  window.dispatchEvent(new Event('language-change'));
}

function notifyAuthChange() {
  window.dispatchEvent(new Event('auth-change'));
}

async function syncUserLanguage(user) {
  if (user?.preferred_language) {
    setPreferredLanguage(user.preferred_language);
  }
}

export async function register(data) {
  const response = await client.post('/users/register/', data);
  const { tokens, user } = response.data;

  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
  await syncUserLanguage(user);
  notifyAuthChange();

  return response.data;
}

export async function login(phone) {
  const response = await client.post('/users/login/', { phone });
  const { tokens, user } = response.data;

  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
  await syncUserLanguage(user);
  notifyAuthChange();

  return response.data;
}

export async function getMe() {
  const response = await client.get('/users/me/');
  await syncUserLanguage(response.data);
  return response.data;
}

export async function updateProfile(data) {
  const response = await client.patch('/users/me/', data);
  await syncUserLanguage(response.data);
  notifyAuthChange();
  return response.data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem(LANGUAGE_KEY);
  notifyAuthChange();
}

export function isLoggedIn() {
  return !!localStorage.getItem('access_token');
}

export function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  return phone;
}
