import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const PUBLIC_PREFIXES = ['/motivation/', '/feedback/'];

function isPublicRequest(url = '') {
  return PUBLIC_PREFIXES.some((prefix) => url.includes(prefix));
}

function isRefreshRequest(url = '') {
  return url.includes('/users/token/refresh/');
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return false;

  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/users/token/refresh/`, { refresh })
      .then((response) => {
        localStorage.setItem('access_token', response.data.access);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function clearAuth() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.dispatchEvent(new Event('auth-change'));
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token && !isPublicRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401
      && originalRequest
      && !originalRequest._retry
      && !isPublicRequest(originalRequest.url)
      && !isRefreshRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
        return client(originalRequest);
      }

      clearAuth();
    }

    return Promise.reject(error);
  },
);

export default client;
