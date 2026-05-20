import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDirections } from '../api/directions';
import { getRoadmapPlan } from '../api/roadmap';
import { DIRECTION_ICONS } from '../components/Icons';
import ScrollReveal from '../components/ScrollReveal';
import { googleSearchUrl, youtubeSearchUrl } from '../utils/searchLinks';

function Roadmap() {
  const navigate = useNavigate();
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
        setError('Yo\'nalishlarni yuklab bo\'lmadi.');
      }
    }

    loadDirections();
  }, []);

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
        setError('O\'rganish rejasini yuklab bo\'lmadi.');
        setPlan(null);
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [directionSlug]);

  function handleSelectDirection(slug) {
    navigate(`/roadmap?direction=${slug}`);
  }

  if (!directionSlug) {
    return (
      <div className="roadmap-page">
        <header className="page-header">
          <h1>O&apos;rganish rejasi</h1>
          <p>O&apos;rganmoqchi bo&apos;lgan yo&apos;nalishingizni tanlang — to&apos;liq tushuntirish va foydali havolalar.</p>
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
    return <div className="page-loading">Yuklanmoqda...</div>;
  }

  if (!plan) {
    return (
      <div className="roadmap-page">
        <p className="roadmap-empty">{error || 'Reja topilmadi.'}</p>
        <button type="button" className="btn-secondary" onClick={() => navigate('/roadmap')}>
          Yo&apos;nalish tanlash
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
          ← Yo&apos;nalish tanlash
        </button>
        <h1>{plan.name} — o&apos;rganish rejasi</h1>
        <p>{plan.short_description}</p>
      </header>

      <article className="roadmap-article">
        <div className="roadmap-meta">
          <span><strong>Qiyinlik:</strong> {plan.difficulty}</span>
          <span><strong>O&apos;rganasiz:</strong> {plan.what_you_learn}</span>
          <span><strong>Ish bozori:</strong> {plan.job_market}</span>
        </div>

        <section className="roadmap-highlight">
          <h2>Kimga mos?</h2>
          <p>{plan.who_is_it_for}</p>
        </section>

        <section className="roadmap-highlight roadmap-highlight--warm">
          <h2>Real hayot misoli</h2>
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
          <h2>Yana o&apos;rganmoqchimisiz?</h2>
          <p>Quyidagi tugmalar orqali internetda qo\'shimcha maqola va videolar topishingiz mumkin.</p>
          <div className="roadmap-resource-buttons">
            <a
              href={googleSearchUrl(plan.google_query)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary roadmap-resource-btn"
            >
              Maqola
            </a>
            <a
              href={youtubeSearchUrl(plan.youtube_query)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary roadmap-resource-btn"
            >
              YouTube
            </a>
          </div>
        </footer>
      </article>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

export default Roadmap;
