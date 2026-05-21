import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useLanguage } from '../context/LanguageContext';
import PhoneInput from '../components/PhoneInput';
import { getApiErrorMessage, isPhoneComplete, toPhonePayload } from '../utils/phone';

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [phoneLocal, setPhoneLocal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isPhoneComplete(phoneLocal)) {
      setError(t('common.phoneIncomplete'));
      return;
    }

    setLoading(true);

    try {
      await login(toPhonePayload(phoneLocal));
      navigate('/home');
    } catch (err) {
      setError(getApiErrorMessage(err.response?.data, t('auth.login.error')));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('auth.login.title')}</h1>
        <p className="auth-subtitle">
          {t('auth.login.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('auth.login.phoneLabel')}
            <PhoneInput
              value={phoneLocal}
              onChange={setPhoneLocal}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.login.submitting') : t('auth.login.submit')}
          </button>
        </form>

        <p className="auth-link">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register">{t('nav.register')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
