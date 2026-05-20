import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDirections } from '../api/directions';
import ScrollReveal from '../components/ScrollReveal';
import { DIRECTION_ICONS } from '../components/Icons';

function Directions() {
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getDirections();
        setDirections(data);
      } catch {
        setError('Yo\'nalishlarni yuklab bo\'lmadi.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="page-loading">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="directions-page">
      <ScrollReveal>
        <header className="page-header">
          <h1>IT yo&apos;nalishlar</h1>
          <p>Har biri oddiy tilda tushuntirilgan — qo&apos;rqmang, o&apos;qib ko&apos;ring.</p>
        </header>
      </ScrollReveal>

      <div className="directions-grid">
        {directions.map((direction, index) => {
          const Icon = DIRECTION_ICONS[direction.slug] || DIRECTION_ICONS.frontend;
          return (
            <ScrollReveal key={direction.id} delay={(index % 4) + 1}>
              <Link to={`/directions/${direction.slug}`} className="direction-card">
                <span className="direction-card-icon">
                  <Icon size={32} />
                </span>
                <h2>{direction.name}</h2>
                <p>{direction.short_description}</p>
                <span className="direction-meta">Qiyinlik: {direction.difficulty}</span>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

export default Directions;
