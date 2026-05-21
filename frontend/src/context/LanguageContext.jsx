import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getPreferredLanguage } from '../api/auth';
import { DIRECTION_LABELS_I18N, translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getPreferredLanguage);

  useEffect(() => {
    function sync() {
      setLanguage(getPreferredLanguage());
    }
    window.addEventListener('language-change', sync);
    window.addEventListener('auth-change', sync);
    return () => {
      window.removeEventListener('language-change', sync);
      window.removeEventListener('auth-change', sync);
    };
  }, []);

  const t = useCallback(
    (key, vars) => {
      let text = translations[language]?.[key] ?? translations.uz[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([name, value]) => {
          text = text.replaceAll(`{${name}}`, String(value));
        });
      }
      return text;
    },
    [language],
  );

  const getDirectionName = useCallback(
    (slug, fallback = '') => {
      const labels = DIRECTION_LABELS_I18N[language] || DIRECTION_LABELS_I18N.uz;
      return labels[slug] || fallback || slug;
    },
    [language],
  );

  const value = useMemo(
    () => ({ language, t, getDirectionName }),
    [language, t, getDirectionName],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage LanguageProvider ichida ishlatilishi kerak');
  }
  return ctx;
}
