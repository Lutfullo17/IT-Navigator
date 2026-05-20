import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLanguage, isLoggedIn } from '../api/auth';
import { startChat, sendMessage } from '../api/mentor';

function Mentor() {
  const [session, setSession] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn()) return;

    async function init() {
      setLoading(true);
      try {
        const data = await startChat();
        setSession(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Suhbatni boshlab bo\'lmadi.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!isLoggedIn()) {
    return (
      <div className="mentor-page">
        <div className="mentor-intro">
          <h1>AI Mentor</h1>
          <p>Suhbatlashish uchun avval tizimga kiring.</p>
          <Link to="/login" className="btn-primary">Kirish</Link>
        </div>
      </div>
    );
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !session || loading) return;

    const text = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    try {
      const data = await sendMessage(session.id, text, getPreferredLanguage());
      setSession(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Xabar yuborib bo\'lmadi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mentor-page">
      <header className="mentor-header">
        <Link to="/" className="back-link">← Bosh sahifa</Link>
        <h1>AI Mentor</h1>
        <p>Savollaringizni bering — oddiy tilda javob olasiz.</p>
      </header>

      <div className="mentor-chat">
        {loading && !session?.messages?.length && (
          <p className="mentor-loading">Yuklanmoqda...</p>
        )}

        {session?.messages?.length === 0 && !loading && (
          <div className="mentor-welcome">
            <p>Salom! IT yo&apos;nalishlari, o&apos;rganish yoki motivatsiya haqida so&apos;rang.</p>
            <p className="mentor-hint">Masalan: &quot;Python nima?&quot; yoki &quot;Backend qiyinmi?&quot;</p>
          </div>
        )}

        {session?.messages?.map((msg) => (
          <div key={msg.id} className={`mentor-message ${msg.role}`}>
            <span className="mentor-role">{msg.role === 'user' ? 'Siz' : 'Mentor'}</span>
            <p>{msg.content}</p>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSend} className="mentor-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Xabar yozing..."
          disabled={loading || !session}
        />
        <button type="submit" disabled={loading || !session}>
          {loading ? '...' : 'Yuborish'}
        </button>
      </form>
    </div>
  );
}

export default Mentor;
