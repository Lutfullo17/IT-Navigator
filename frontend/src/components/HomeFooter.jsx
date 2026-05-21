import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sendContactFeedback } from '../api/feedback';

const FOOTER_LINKS = [
  { to: '/home', labelKey: 'nav.home' },
  { to: '/directions', labelKey: 'nav.directions' },
  { to: '/test', labelKey: 'nav.test' },
  { to: '/tasks', labelKey: 'nav.tasks' },
  { to: '/roadmap', labelKey: 'nav.roadmap' },
  { to: '/progress', labelKey: 'nav.progress' },
];

function HomeFooter() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !telegram.trim() || !message.trim()) {
      setError(t('footer.error.required'));
      return;
    }

    setLoading(true);
    try {
      await sendContactFeedback({
        name: name.trim(),
        telegram: telegram.trim(),
        message: message.trim(),
      });
      setSuccess(true);
      setName('');
      setTelegram('');
      setMessage('');
    } catch (err) {
      const code = err.response?.data?.detail;
      if (code === 'telegram_not_configured') {
        setError(t('footer.error.notConfigured'));
      } else {
        setError(t('footer.error.send'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="home-footer">
      <div className="home-footer-inner">
        <div className="home-footer-about">
          <p className="home-footer-credit">{t('footer.credit')}</p>
          <nav className="home-footer-nav" aria-label={t('footer.sections')}>
            <p className="home-footer-nav-title">{t('footer.sections')}</p>
            <ul>
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{t(link.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="home-footer-contact">
          <h3 className="home-footer-contact-title">{t('footer.questionsTitle')}</h3>
          <p className="home-footer-contact-hint">{t('footer.questionsHint')}</p>

          <form className="home-footer-form" onSubmit={handleSubmit}>
            <label>
              {t('footer.nameLabel')}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('footer.namePlaceholder')}
                disabled={loading}
                maxLength={100}
              />
            </label>
            <label>
              {t('footer.telegramLabel')}
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder={t('footer.telegramPlaceholder')}
                disabled={loading}
                maxLength={64}
              />
            </label>
            <label>
              {t('footer.messageLabel')}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('footer.messagePlaceholder')}
                disabled={loading}
                rows={4}
                maxLength={2000}
              />
            </label>

            {error && <p className="home-footer-error">{error}</p>}
            {success && <p className="home-footer-success">{t('footer.success')}</p>}

            <button type="submit" className="btn-primary home-footer-submit" disabled={loading}>
              {loading ? t('common.submitting') : t('footer.send')}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
