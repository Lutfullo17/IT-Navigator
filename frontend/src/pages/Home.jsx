import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../api/progress';
import { getRandomMessage } from '../api/motivation';
import {
  IconCompass,
  IconRoadmap,
  IconTasks,
  IconTest,
} from '../components/Icons';

const QUICK_LINKS = [
  { to: '/directions', label: 'Yo\'nalishlar', Icon: IconCompass },
  { to: '/tasks', label: 'Vazifalar', Icon: IconTasks },
  { to: '/roadmap', label: 'O\'rganish rejasi', Icon: IconRoadmap },
];

function Home() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [motivation, setMotivation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashboard, msg] = await Promise.all([
          getDashboard(),
          getRandomMessage('general').catch(() => ({ text: 'Hamma dastlab qiynaladi — bu normal.' })),
        ]);
        setData(dashboard);
        setMotivation(msg.text);
      } catch {
        setMotivation('Hamma dastlab qiynaladi — bu normal. Siz ham qila olasiz.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="page-loading">Yuklanmoqda...</div>;
  }

  const taskPercent = data?.tasks?.total
    ? Math.round((data.tasks.completed / data.tasks.total) * 100)
    : 0;

  const firstName = user?.full_name?.split(' ')[0] || 'Do\'st';

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
        <p className="dashboard-greeting dashboard-greeting--glow">Salom, {firstName}</p>

        <div className="dashboard-cta-ring dashboard-cta-ring--outer" aria-hidden="true" />
        <div className="dashboard-cta-ring dashboard-cta-ring--inner" aria-hidden="true" />

        <Link to="/test" className="dashboard-cta-btn">
          <span className="dashboard-cta-shine" aria-hidden="true" />
          <span className="dashboard-cta-icon">
            <IconTest size={28} />
          </span>
          <span className="dashboard-cta-text">
            Testni ishlab IT dagi yo&apos;nalishingizni toping
          </span>
        </Link>

        <p className="dashboard-cta-hint">15 ta oddiy savol — 5 daqiqada</p>
      </section>

      {motivation && (
        <blockquote className="dashboard-motivation dashboard-motivation--float">
          {motivation}
        </blockquote>
      )}

      <nav className="dashboard-quick-nav">
        {QUICK_LINKS.map((item) => {
          const Icon = item.Icon;
          return (
            <Link key={item.to} to={item.to} className="dashboard-quick-link">
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {data && (
        <section className="dashboard-stats">
          <div className="dashboard-stats-header">
            <h2>Qisqacha natija</h2>
            <Link to="/progress" className="dashboard-stats-link">Batafsil →</Link>
          </div>
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card dashboard-stat-card--glow">
              <span className="dashboard-stat-label">Test</span>
              <strong className="dashboard-stat-value">
                {data.tests.completed} / {data.tests.started}
              </strong>
              <span className="dashboard-stat-hint">tugatilgan</span>
            </div>
            <div className="dashboard-stat-card dashboard-stat-card--glow">
              <span className="dashboard-stat-label">Vazifalar</span>
              <strong className="dashboard-stat-value">{taskPercent}%</strong>
              <span className="dashboard-stat-hint">
                {data.tasks.completed} / {data.tasks.total}
              </span>
            </div>
            <div className="dashboard-stat-card dashboard-stat-card--glow">
              <span className="dashboard-stat-label">O&apos;rganish rejasi</span>
              <strong className="dashboard-stat-value">{data.roadmap.directions}</strong>
              <span className="dashboard-stat-hint">ta yo&apos;nalish rejasi</span>
            </div>
          </div>

          {data.tests.latest_results?.length > 0 && (
            <div className="dashboard-recommendations">
              <p className="dashboard-recommendations-title">So&apos;nggi test tavsiyalari:</p>
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
    </div>
  );
}

export default Home;
