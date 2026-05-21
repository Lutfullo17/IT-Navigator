import { useEffect, useState } from 'react';
import { getPreferredLanguage, setPreferredLanguage, updateProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_OPTIONS } from '../constants/languages';

function LanguageSwitcher({ className = '', compact = false }) {
  const { t } = useLanguage();
  const { user, loggedIn, refreshAuth } = useAuth();
  const [language, setLanguage] = useState(() => user?.preferred_language || getPreferredLanguage());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLanguage(user?.preferred_language || getPreferredLanguage());
  }, [user?.preferred_language]);

  useEffect(() => {
    function syncLanguage() {
      setLanguage(getPreferredLanguage());
    }

    window.addEventListener('auth-change', syncLanguage);
    window.addEventListener('language-change', syncLanguage);
    return () => {
      window.removeEventListener('auth-change', syncLanguage);
      window.removeEventListener('language-change', syncLanguage);
    };
  }, []);

  async function handleChange(e) {
    const nextLanguage = e.target.value;
    if (nextLanguage === language) return;

    const previous = language;
    setLanguage(nextLanguage);
    setPreferredLanguage(nextLanguage);
    setSaving(true);

    try {
      if (loggedIn) {
        await updateProfile({ preferred_language: nextLanguage });
        await refreshAuth();
      }
    } catch {
      setLanguage(previous);
      setPreferredLanguage(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className={`lang-switcher ${compact ? 'lang-switcher--compact' : ''} ${className}`.trim()}>
      {!compact && <span className="lang-switcher-label">{t('lang.label')}</span>}
      <select
        className="lang-switcher-select"
        value={language}
        onChange={handleChange}
        disabled={saving}
        aria-label={t('lang.label')}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSwitcher;
