import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { taskDirectionAction } from '../utils/taskLabels';
import { getDirection } from '../api/directions';

function DirectionDetail() {
  const { slug } = useParams();
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getDirection(slug);
        setDirection(data);
      } catch {
        setError('Yo\'nalish topilmadi.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return <div className="page-loading">Yuklanmoqda...</div>;
  }

  if (error || !direction) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="direction-detail-page">
      <header className="page-header">
        <Link to="/directions" className="back-link">← Yo&apos;nalishlar</Link>
        <h1>{direction.name}</h1>
      </header>

      <section className="detail-section">
        <h2>Nima qiladi?</h2>
        <p>{direction.short_description}</p>
      </section>

      <section className="detail-section">
        <h2>Kimlarga mos?</h2>
        <p>{direction.who_is_it_for}</p>
      </section>

      <section className="detail-grid">
        <div className="detail-box">
          <h3>Qiyinlik</h3>
          <p>{direction.difficulty}</p>
        </div>
        <div className="detail-box">
          <h3>Matematika</h3>
          <p>{direction.math_needed}</p>
        </div>
      </section>

      <section className="detail-section">
        <h2>Nimalarni o&apos;rganadi?</h2>
        <p>{direction.what_you_learn}</p>
      </section>

      <section className="detail-section">
        <h2>Ish bozori</h2>
        <p>{direction.job_market}</p>
      </section>

      <section className="detail-section highlight">
        <h2>Real hayot misoli</h2>
        <p>{direction.real_life_example}</p>
      </section>

      <div className="detail-actions">
        <Link to={`/tasks?direction=${direction.slug}`} className="btn-primary">
          {taskDirectionAction(direction.name)}
        </Link>
        <Link to={`/roadmap?direction=${direction.slug}`} className="btn-secondary">
          O&apos;rganish rejasi
        </Link>
      </div>
    </div>
  );
}

export default DirectionDetail;
