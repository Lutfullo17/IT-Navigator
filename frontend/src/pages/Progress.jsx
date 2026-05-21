import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DIRECTION_ICONS } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import { isLoggedIn } from '../api/auth';
import { getDashboard } from '../api/progress';

function formatDate(iso, language) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(
      language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ',
      { day: 'numeric', month: 'long', year: 'numeric' },
    );
  } catch {
    return '';
  }
}

function Progress() {
  const { t, language, getDirectionName } = useLanguage();
  const [data, setData] = useState(null);
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
      } catch {
        setError(t('error.load'));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [language, t]);

  if (!isLoggedIn()) {
    return (
      <div className="progress-page">
        <div className="progress-intro">
          <h1>{t('progress.title')}</h1>
          <Link to="/register" className="btn-primary">{t('nav.register')}</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="page-loading">{t('common.loading')}</div>;
  }

  if (error || !data) {
    return <div className="page-error">{error}</div>;
  }

  const results = (data.tests.latest_results || []).map((item) => ({
    ...item,
    name: getDirectionName(item.slug, item.name),
  }));

  const topMatch = results[0];

  return (
    <div className="progress-page">
      <header className="page-header">
        <h1>{t('progress.title')}</h1>
        <p>{t('progress.subtitle')}</p>
        {data.tests.completed_at && (
          <p className="progress-date">
            {t('progress.testDate')}: {formatDate(data.tests.completed_at, language)}
          </p>
        )}
      </header>

      {results.length === 0 ? (
        <div className="progress-empty">
          <h2>{t('progress.noTest')}</h2>
          <p>{t('progress.noTestHint')}</p>
          <Link to="/test" className="btn-primary">{t('progress.takeTest')}</Link>
        </div>
      ) : (
        <>
          {topMatch && (
            <section className="progress-hero">
              <p className="progress-hero-label">{t('progress.matchTitle')}</p>
              <div className="progress-hero-card">
                {(() => {
                  const Icon = DIRECTION_ICONS[topMatch.slug] || DIRECTION_ICONS.frontend;
                  return (
                    <span className="progress-hero-icon">
                      <Icon size={36} />
                    </span>
                  );
                })()}
                <div className="progress-hero-body">
                  <div className="progress-hero-top">
                    <h2>{topMatch.name}</h2>
                    <span className="progress-hero-percent">{topMatch.percentage}%</span>
                  </div>
                  <div className="progress-bar progress-bar--lg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${topMatch.percentage}%` }}
                    />
                  </div>
                  {topMatch.reason && (
                    <p className="progress-hero-reason">{topMatch.reason}</p>
                  )}
                  <div className="progress-hero-actions">
                    <Link to={`/roadmap?direction=${topMatch.slug}`} className="btn-primary">
                      {t('progress.roadmapBtn')}
                    </Link>
                    <Link to={`/tasks?direction=${topMatch.slug}`} className="btn-secondary">
                      {t('progress.tasksBtn')}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="progress-section">
            <h2>{t('progress.interests')}</h2>
            <div className="progress-results-list">
              {results.map((item, index) => {
                const Icon = DIRECTION_ICONS[item.slug] || DIRECTION_ICONS.frontend;
                return (
                  <article key={item.slug} className="progress-result-card">
                    <div className="progress-result-head">
                      <span className="progress-result-rank">{index + 1}</span>
                      <Icon size={22} />
                      <h3>{item.name}</h3>
                      <strong className="progress-result-percent">{item.percentage}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    {item.reason && (
                      <div className="progress-result-interest">
                        <span className="progress-result-interest-label">
                          {t('progress.interestLabel')}
                        </span>
                        <p>{item.reason}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="progress-section progress-learn">
            <h2>{t('progress.learnTitle')}</h2>
            <p className="progress-learn-hint">{t('progress.learnHint')}</p>
            <div className="progress-learn-grid">
              {results.map((item) => (
                <div key={item.slug} className="progress-learn-card">
                  <h3>{item.name}</h3>
                  <div className="progress-learn-actions">
                    <Link to={`/roadmap?direction=${item.slug}`} className="progress-link">
                      {t('progress.roadmapBtn')} →
                    </Link>
                    <Link to={`/tasks?direction=${item.slug}`} className="progress-link">
                      {t('progress.tasksBtn')} →
                    </Link>
                    <Link to={`/directions/${item.slug}`} className="progress-link">
                      {t('progress.directionBtn')} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="progress-footer-actions">
            <Link to="/test" className="btn-secondary">{t('progress.takeTest')}</Link>
            <Link to="/directions" className="btn-secondary">{t('progress.allDirections')}</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;
