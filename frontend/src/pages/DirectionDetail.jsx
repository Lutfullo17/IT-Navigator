import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDirection } from '../api/directions';
import { useLanguage } from '../context/LanguageContext';
import { taskDirectionAction } from '../utils/taskLabels';

function DirectionDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getDirection(slug);
        setDirection(data);
      } catch {
        setError(t('direction.notFound'));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug, t]);

  if (loading) {
    return <div className="page-loading">{t('common.loading')}</div>;
  }

  if (error || !direction) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="direction-detail-page">
      <header className="page-header">
        <Link to="/directions" className="back-link">{t('common.backDirections')}</Link>
        <h1>{direction.name}</h1>
      </header>

      <section className="detail-section">
        <h2>{t('direction.whatDoes')}</h2>
        <p>{direction.short_description}</p>
      </section>

      <section className="detail-section">
        <h2>{t('direction.whoFor')}</h2>
        <p>{direction.who_is_it_for}</p>
      </section>

      <section className="detail-grid">
        <div className="detail-box">
          <h3>{t('direction.difficulty')}</h3>
          <p>{direction.difficulty}</p>
        </div>
        <div className="detail-box">
          <h3>{t('direction.math')}</h3>
          <p>{direction.math_needed}</p>
        </div>
      </section>

      <section className="detail-section">
        <h2>{t('direction.whatLearn')}</h2>
        <p>{direction.what_you_learn}</p>
      </section>

      <section className="detail-section">
        <h2>{t('direction.jobMarket')}</h2>
        <p>{direction.job_market}</p>
      </section>

      <section className="detail-section highlight">
        <h2>{t('direction.realExample')}</h2>
        <p>{direction.real_life_example}</p>
      </section>

      <div className="detail-actions">
        <Link to={`/tasks?direction=${direction.slug}`} className="btn-primary">
          {taskDirectionAction(direction.name, t)}
        </Link>
        <Link to={`/roadmap?direction=${direction.slug}`} className="btn-secondary">
          {t('direction.learnPlan')}
        </Link>
      </div>
    </div>
  );
}

export default DirectionDetail;
