import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLanguage, isLoggedIn } from '../api/auth';
import { useLanguage } from '../context/LanguageContext';
import { startChat, sendMessage } from '../api/mentor';

function Mentor() {
  const { t } = useLanguage();
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
        setError(err.response?.data?.detail || t('mentor.error.start'));
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (!isLoggedIn()) {
    return (
      <div className="mentor-page">
        <div className="mentor-intro">
          <h1>{t('mentor.title')}</h1>
          <p>{t('mentor.loginRequired')}</p>
          <Link to="/login" className="btn-primary">{t('nav.login')}</Link>
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
      setError(err.response?.data?.detail || t('mentor.error.send'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mentor-page">
      <header className="mentor-header">
        <Link to="/" className="back-link">{t('common.backHome')}</Link>
        <h1>{t('mentor.title')}</h1>
        <p>{t('mentor.pageSubtitle')}</p>
      </header>

      <div className="mentor-chat">
        {loading && !session?.messages?.length && (
          <p className="mentor-loading">{t('common.loading')}</p>
        )}

        {session?.messages?.length === 0 && !loading && (
          <div className="mentor-welcome">
            <p>{t('mentor.pageWelcome')}</p>
            <p className="mentor-hint">{t('mentor.pageExample')}</p>
          </div>
        )}

        {session?.messages?.map((msg) => (
          <div key={msg.id} className={`mentor-message ${msg.role}`}>
            <span className="mentor-role">
              {msg.role === 'user' ? t('mentor.roleUser') : t('mentor.roleAssistant')}
            </span>
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
          placeholder={t('mentor.inputPlaceholder')}
          disabled={loading || !session}
        />
        <button type="submit" disabled={loading || !session}>
          {loading ? '...' : t('mentor.send')}
        </button>
      </form>
    </div>
  );
}

export default Mentor;
