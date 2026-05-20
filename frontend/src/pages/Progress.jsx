import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLanguage, isLoggedIn, updateProfile } from '../api/auth';
import { getDashboard } from '../api/progress';

const LANGUAGE_OPTIONS = [
  { value: 'uz', label: "O'zbek" },
  { value: 'ru', label: 'Rus' },
  { value: 'en', label: 'Ingliz' },
];

function Progress() {
  const [data, setData] = useState(null);
  const [language, setLanguage] = useState(getPreferredLanguage());
  const [languageSaving, setLanguageSaving] = useState(false);
  const [languageMessage, setLanguageMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const dashboard = await getDashboard();
        setData(dashboard);
        if (dashboard.preferred_language) {
          setLanguage(dashboard.preferred_language);
        }
      } catch {
        setError('Progress yuklab bo\'lmadi.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleLanguageChange(e) {
    const nextLanguage = e.target.value;
    setLanguage(nextLanguage);
    setLanguageSaving(true);
    setLanguageMessage('');

    try {
      await updateProfile({ preferred_language: nextLanguage });
      setLanguageMessage('Til saqlandi.');
    } catch {
      setLanguageMessage('Tilni saqlab bo\'lmadi.');
    } finally {
      setLanguageSaving(false);
    }
  }

  if (!isLoggedIn()) {
    return (
      <div className="progress-page">
        <div className="progress-intro">
          <h1>Natijalarim</h1>
          <p>Ko&apos;rish uchun avval ro&apos;yxatdan o&apos;ting.</p>
          <Link to="/register" className="btn-primary">Ro&apos;yxatdan o&apos;tish</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="page-loading">Yuklanmoqda...</div>;
  }

  if (error || !data) {
    return <div className="page-error">{error}</div>;
  }

  const taskPercent = data.tasks.total
    ? Math.round((data.tasks.completed / data.tasks.total) * 100)
    : 0;

  return (
    <div className="progress-page">
      <header className="page-header">
        <h1>Natijalarim</h1>
        <p>Qayerdasiz — barcha natijalar bir joyda.</p>
      </header>

      <div className="progress-settings">
        <div className="progress-card progress-settings-card">
          <h2>Interfeys tili</h2>
          <p className="progress-settings-note">
            Test, mentor va tavsiyalar qaysi tilda bo&apos;lishini shu yerdan tanlaysiz.
          </p>
          <label className="progress-language-label">
            Til
            <select
              className="progress-language-select"
              value={language}
              onChange={handleLanguageChange}
              disabled={languageSaving}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {languageSaving && <p className="progress-settings-status">Saqlanmoqda...</p>}
          {!languageSaving && languageMessage && (
            <p className="progress-settings-status">{languageMessage}</p>
          )}
        </div>
      </div>

      <div className="progress-cards">
        <div className="progress-card">
          <h2>Test</h2>
          <p className="progress-stat">
            {data.tests.completed} / {data.tests.started} tugatilgan
          </p>
          {data.tests.latest_results?.length > 0 && (
            <div className="progress-results">
              <p>So&apos;nggi tavsiyalar:</p>
              {data.tests.latest_results.map((item) => (
                <div key={item.slug} className="progress-result-item">
                  <span>{item.name}</span>
                  <strong>{item.percentage}%</strong>
                </div>
              ))}
            </div>
          )}
          <Link to="/test" className="progress-link">Test ishlash →</Link>
        </div>

        <div className="progress-card">
          <h2>Vazifalar</h2>
          <div className="progress-bar-wrap">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${taskPercent}%` }} />
            </div>
            <span>{data.tasks.completed} / {data.tasks.total} ({taskPercent}%)</span>
          </div>
          <Link to="/tasks" className="progress-link">Vazifalarga o&apos;tish →</Link>
        </div>

        <div className="progress-card">
          <h2>O&apos;rganish rejasi</h2>
          <p className="progress-stat">
            {data.roadmap.directions} ta yo&apos;nalish uchun to&apos;liq reja mavjud
          </p>
          <Link to="/roadmap" className="progress-link">Rejani tanlash →</Link>
        </div>
      </div>
    </div>
  );
}

export default Progress;
