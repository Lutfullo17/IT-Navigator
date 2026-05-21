import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDirections } from '../api/directions';
import { getRoadmapPlan } from '../api/roadmap';
import { useLanguage } from '../context/LanguageContext';
import { DIRECTION_ICONS } from '../components/Icons';
import ScrollReveal from '../components/ScrollReveal';
import { googleSearchUrl, youtubeSearchUrl } from '../utils/searchLinks';

function Roadmap() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const directionSlug = searchParams.get('direction');

  const [directions, setDirections] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDirections() {
      try {
        const data = await getDirections();
        setDirections(data);
      } catch {
        setError(t('common.errorLoadDirections'));
      }
    }

    loadDirections();
  }, [t]);

  useEffect(() => {
    if (!directionSlug) {
      setPlan(null);
      setLoading(false);
      return;
    }

    async function loadPlan() {
      setLoading(true);
      setError('');
      try {
        const data = await getRoadmapPlan(directionSlug);
        setPlan(data);
      } catch {
        setError(t('roadmap.errorLoad'));
        setPlan(null);
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [directionSlug, t]);

  function handleSelectDirection(slug) {
    navigate(`/roadmap?direction=${slug}`);
  }

  if (!directionSlug) {
    return (
      <div className="roadmap-page">
        <header className="page-header">
          <h1>{t('roadmap.title')}</h1>
          <p>{t('roadmap.subtitle')}</p>
        </header>

        <div className="roadmap-direction-grid">
          {directions.map((direction, index) => {
            const Icon = DIRECTION_ICONS[direction.slug] || DIRECTION_ICONS.frontend;
            return (
              <ScrollReveal key={direction.id} delay={(index % 4) + 1}>
                <button
                  type="button"
                  className="roadmap-direction-card"
                  onClick={() => handleSelectDirection(direction.slug)}
                >
                  <Icon size={28} />
                  <h2>{direction.name}</h2>
                  <p>{direction.short_description}</p>
                </button>
              </ScrollReveal>
            );
          })}
        </div>

        {error && <p className="auth-error">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return <div className="page-loading">{t('common.loading')}</div>;
  }

  if (!plan) {
    return (
      <div className="roadmap-page">
        <p className="roadmap-empty">{error || t('roadmap.notFound')}</p>
        <button type="button" className="btn-secondary" onClick={() => navigate('/roadmap')}>
          {t('common.selectDirection')}
        </button>
      </div>
    );
  }

  return (
    <div className="roadmap-page">
      <header className="page-header">
        <button
          type="button"
          className="back-link roadmap-back-btn"
          onClick={() => navigate('/roadmap')}
        >
          {t('common.backSelectDirection')}
        </button>
        <h1>{t('roadmap.planTitle', { name: plan.name })}</h1>
        <p>{plan.short_description}</p>
      </header>

      <article className="roadmap-article">
        <div className="roadmap-meta">
          <span><strong>{t('roadmap.metaDifficulty')}</strong> {plan.difficulty}</span>
          <span><strong>{t('roadmap.metaLearn')}</strong> {plan.what_you_learn}</span>
          <span><strong>{t('roadmap.metaMarket')}</strong> {plan.job_market}</span>
        </div>

        <section className="roadmap-highlight">
          <h2>{t('roadmap.whoFor')}</h2>
          <p>{plan.who_is_it_for}</p>
        </section>

        <section className="roadmap-highlight roadmap-highlight--warm">
          <h2>{t('roadmap.realExample')}</h2>
          <p>{plan.real_life_example}</p>
        </section>

        {plan.sections.map((section, index) => (
          <section key={section.title} className="roadmap-section">
            <h2>
              <span className="roadmap-section-num">{index + 1}</span>
              {section.title}
            </h2>
            <p>{section.content}</p>
          </section>
        ))}

        <footer className="roadmap-resources">
          <h2>{t('roadmap.resourcesTitle')}</h2>
          <p>{t('roadmap.resourcesHint')}</p>
          <div className="roadmap-resource-buttons">
            <a
              href={googleSearchUrl(plan.google_query)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary roadmap-resource-btn"
            >
              {t('roadmap.article')}
            </a>
            <a
              href={youtubeSearchUrl(plan.youtube_query)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary roadmap-resource-btn"
            >
              {t('roadmap.youtube')}
            </a>
          </div>
        </footer>
      </article>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

export default Roadmap;
