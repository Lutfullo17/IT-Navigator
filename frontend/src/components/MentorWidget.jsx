import { useEffect, useRef, useState } from 'react';
import { getPreferredLanguage } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { startChat, sendMessage } from '../api/mentor';
import { useTypewriter } from '../hooks/useTypewriter';
import { IconClose, IconSend, IconSpark } from './Icons';

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
  const [open, setOpen] = useState(false);
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
        .catch(() => setError('Suhbatni boshlab bo\'lmadi.'))
        .finally(() => setLoading(false));
    }
  }, [open, loggedIn, session]);

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
      setError('Xabar yuborib bo\'lmadi.');
      setSession(session);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={`mentor-fab ${open ? 'mentor-fab--hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="AI Mentor"
      >
        <IconSpark size={26} />
      </button>

      {open && (
        <div className="mentor-panel">
          <header className="mentor-panel-header">
            <div>
              <strong>AI Mentor</strong>
              <span>Savollaringizga javob beraman</span>
            </div>
            <button type="button" className="mentor-panel-close" onClick={() => setOpen(false)} aria-label="Yopish">
              <IconClose size={20} />
            </button>
          </header>

          <div className="mentor-panel-messages">
            {loading && !session?.messages?.length && (
              <p className="mentor-panel-loading">Yuklanmoqda...</p>
            )}

            {session?.messages?.length === 0 && !loading && (
              <div className="mentor-panel-welcome">
                <p>Salom! IT yo&apos;nalishlari haqida oddiy tilda so&apos;rang.</p>
                <p>Masalan: &quot;Qaysi yo&apos;nalish osonroq?&quot;</p>
              </div>
            )}

            {session?.messages?.map((msg) => (
              <div key={msg.id} className={`mentor-panel-msg mentor-panel-msg--${msg.role}`}>
                <span className="mentor-panel-role">{msg.role === 'user' ? 'Siz' : 'AI'}</span>
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
              placeholder="Xabar yozing..."
              disabled={loading || !session}
            />
            <button type="submit" disabled={loading || !session || !input.trim()} aria-label="Yuborish">
              <IconSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default MentorWidget;
