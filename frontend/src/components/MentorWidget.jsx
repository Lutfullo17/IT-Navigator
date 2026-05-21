import { useEffect, useRef, useState } from 'react';
import { getPreferredLanguage } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { startChat, sendMessage } from '../api/mentor';
import { useTypewriter } from '../hooks/useTypewriter';
import { IconClose, IconSend } from './Icons';

const HINT_DISMISSED_KEY = 'mentor-fab-hint-dismissed';

function TypingMessage({ content, animate, onDone }) {
  const typed = useTypewriter(content, 16, animate);

  useEffect(() => {
    if (animate && typed.length === content.length && content) {
      onDone?.();
    }
  }, [animate, typed, content, onDone]);

  return (
    <p>
      {typed}
      {animate && typed.length < content.length ? <span className="mentor-cursor">|</span> : null}
    </p>
  );
}

function MentorWidget() {
  const { loggedIn } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(
    () => localStorage.getItem(HINT_DISMISSED_KEY) === '1',
  );
  const [session, setSession] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [typingId, setTypingId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && loggedIn && !session) {
      setLoading(true);
      startChat()
        .then(setSession)
        .catch(() => setError(t('mentor.error.start')))
        .finally(() => setLoading(false));
    }
  }, [open, loggedIn, session, t]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, session?.messages, typingId]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!loggedIn) return null;

  function dismissHint() {
    setHintDismissed(true);
    localStorage.setItem(HINT_DISMISSED_KEY, '1');
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !session || loading) return;

    const text = input.trim();
    setInput('');
    setLoading(true);
    setError('');

    const optimistic = {
      ...session,
      messages: [
        ...(session.messages || []),
        { id: `tmp-${Date.now()}`, role: 'user', content: text },
      ],
    };
    setSession(optimistic);

    try {
      const data = await sendMessage(session.id, text, getPreferredLanguage());
      setSession(data);
      const lastAssistant = [...(data.messages || [])].reverse().find((m) => m.role === 'assistant');
      if (lastAssistant) {
        setTypingId(lastAssistant.id);
      }
    } catch {
      setError(t('mentor.error.send'));
      setSession(session);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`mentor-fab-wrap ${open ? 'mentor-fab-wrap--hidden' : ''}`}>
        {!hintDismissed && (
          <div className="mentor-fab-hint" role="status">
            <p>{t('mentor.fabHint')}</p>
            <button
              type="button"
              className="mentor-fab-hint-close"
              onClick={dismissHint}
              aria-label={t('nav.close')}
            >
              <IconClose size={14} />
            </button>
          </div>
        )}
        <button
          type="button"
          className="mentor-fab"
          onClick={() => setOpen(true)}
          aria-label={t('mentor.fabLabel')}
        >
          <span className="mentor-fab-label">{t('mentor.fabLabel')}</span>
        </button>
      </div>

      {open && (
        <div className="mentor-panel">
          <header className="mentor-panel-header">
            <div>
              <strong>{t('mentor.title')}</strong>
              <span>{t('mentor.panelSubtitle')}</span>
            </div>
            <button type="button" className="mentor-panel-close" onClick={() => setOpen(false)} aria-label={t('nav.close')}>
              <IconClose size={20} />
            </button>
          </header>

          <div className="mentor-panel-messages">
            {loading && !session?.messages?.length && (
              <p className="mentor-panel-loading">{t('common.loading')}</p>
            )}

            {session?.messages?.length === 0 && !loading && (
              <div className="mentor-panel-welcome">
                <p>{t('mentor.welcome')}</p>
                <p>{t('mentor.welcomeExample')}</p>
              </div>
            )}

            {session?.messages?.map((msg) => (
              <div key={msg.id} className={`mentor-panel-msg mentor-panel-msg--${msg.role}`}>
                <span className="mentor-panel-role">
                  {msg.role === 'user' ? t('mentor.roleUser') : t('mentor.roleAssistant')}
                </span>
                {msg.role === 'assistant' && msg.id === typingId ? (
                  <TypingMessage
                    content={msg.content}
                    animate
                    onDone={() => setTypingId(null)}
                  />
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {error && <p className="auth-error mentor-panel-error">{error}</p>}

          <form onSubmit={handleSend} className="mentor-panel-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('mentor.inputPlaceholder')}
              disabled={loading || !session}
            />
            <button type="submit" disabled={loading || !session || !input.trim()} aria-label={t('mentor.send')}>
              <IconSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default MentorWidget;
