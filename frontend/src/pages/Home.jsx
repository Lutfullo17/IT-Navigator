import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/progress';
import { useLanguage } from '../context/LanguageContext';
import HomeHeadline from '../components/HomeHeadline';
import HomeFooter from '../components/HomeFooter';
import {
  IconCompass,
  IconRoadmap,
  IconTasks,
  IconTest,
} from '../components/Icons';

const QUICK_LINKS = [
  { to: '/directions', labelKey: 'nav.directions', Icon: IconCompass },
  { to: '/tasks', labelKey: 'nav.tasks', Icon: IconTasks },
  { to: '/roadmap', labelKey: 'nav.roadmap', Icon: IconRoadmap },
];

function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await getDashboard();
        setData(dashboard);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="page-loading">{t('common.loading')}</div>;
  }

  const taskPercent = data?.tasks?.total
    ? Math.round((data.tasks.completed / data.tasks.total) * 100)
    : 0;

  const firstName = user?.full_name?.split(' ')[0] || t('home.guestName');

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg" aria-hidden="true">
        <div className="dashboard-grid" />
        <div className="dashboard-orb dashboard-orb--1" />
        <div className="dashboard-orb dashboard-orb--2" />
        <div className="dashboard-orb dashboard-orb--3" />
        <div className="dashboard-spark dashboard-spark--1" />
        <div className="dashboard-spark dashboard-spark--2" />
        <div className="dashboard-spark dashboard-spark--3" />
        <div className="dashboard-spark dashboard-spark--4" />
      </div>

      <section className="dashboard-hero-center">
        <p className="dashboard-greeting dashboard-greeting--glow">{t('home.greeting')}, {firstName}</p>

        <HomeHeadline />

        <div className="dashboard-cta-ring dashboard-cta-ring--outer" aria-hidden="true" />
        <div className="dashboard-cta-ring dashboard-cta-ring--inner" aria-hidden="true" />

        <Link to="/test" className="dashboard-cta-btn">
          <span className="dashboard-cta-shine" aria-hidden="true" />
          <span className="dashboard-cta-icon">
            <IconTest size={22} />
          </span>
          <span className="dashboard-cta-text">
            {t('home.ctaButton')}
          </span>
        </Link>

        <p className="dashboard-cta-hint">{t('home.ctaHint')}</p>
      </section>

      <nav className="dashboard-quick-nav">
        {QUICK_LINKS.map((item) => {
          const Icon = item.Icon;
          return (
            <Link key={item.to} to={item.to} className="dashboard-quick-link">
              <Icon size={18} />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      {data && (
        <section className="dashboard-stats">
          <div className="dashboard-stats-header">
            <h2>{t('home.stats')}</h2>
            <Link to="/progress" className="dashboard-stats-link">{t('home.details')} →</Link>
          </div>
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card dashboard-stat-card--glow">
              <span className="dashboard-stat-label">{t('home.statTests')}</span>
              <strong className="dashboard-stat-value">
                {data.tests.completed} / {data.tests.started}
              </strong>
              <span className="dashboard-stat-hint">{t('home.statCompleted')}</span>
            </div>
            <div className="dashboard-stat-card dashboard-stat-card--glow">
              <span className="dashboard-stat-label">{t('nav.tasks')}</span>
              <strong className="dashboard-stat-value">{taskPercent}%</strong>
              <span className="dashboard-stat-hint">
                {data.tasks.completed} / {data.tasks.total}
              </span>
            </div>
            <div className="dashboard-stat-card dashboard-stat-card--glow">
              <span className="dashboard-stat-label">{t('nav.roadmap')}</span>
              <strong className="dashboard-stat-value">{data.roadmap.directions}</strong>
              <span className="dashboard-stat-hint">{t('home.statRoadmapHint')}</span>
            </div>
          </div>

          {data.tests.latest_results?.length > 0 && (
            <div className="dashboard-recommendations">
              <p className="dashboard-recommendations-title">{t('home.recommendationsTitle')}</p>
              {data.tests.latest_results.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  to={`/roadmap?direction=${item.slug}`}
                  className="dashboard-recommendation-item"
                >
                  <span>{item.name}</span>
                  <strong>{item.percentage}%</strong>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <HomeFooter />
    </div>
  );
}

export default Home;
