import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, isLoggedIn as checkLoggedIn, logout as authLogout } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(checkLoggedIn());
  const [user, setUser] = useState(null);

  const refreshAuth = useCallback(async () => {
    const hasToken = checkLoggedIn();
    setLoggedIn(hasToken);

    if (!hasToken) {
      setUser(null);
      return;
    }

    try {
      const data = await getMe();
      setUser(data);
    } catch {
      authLogout();
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshAuth();

    function onAuthChange() {
      refreshAuth();
    }

    window.addEventListener('auth-change', onAuthChange);
    return () => window.removeEventListener('auth-change', onAuthChange);
  }, [refreshAuth]);

  const logout = useCallback(() => {
    authLogout();
    setLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
  }, []);

  const value = useMemo(
    () => ({ loggedIn, user, refreshAuth, logout }),
    [loggedIn, user, refreshAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  }
  return context;
}
