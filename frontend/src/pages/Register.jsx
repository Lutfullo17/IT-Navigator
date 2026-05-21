import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useLanguage } from '../context/LanguageContext';
import PhoneInput from '../components/PhoneInput';
import { getApiErrorMessage, isPhoneComplete, toPhonePayload } from '../utils/phone';

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
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

    const phone = toPhonePayload(phoneLocal);
    setLoading(true);

    try {
      await register({ full_name: fullName.trim(), phone });
      navigate('/home');
    } catch (err) {
      setError(getApiErrorMessage(err.response?.data, t('auth.register.error')));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('app.name')}</h1>
        <p className="auth-subtitle">
          {t('auth.register.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('auth.register.nameLabel')}
            <input
              type="text"
              name="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ali Valiyev"
              required
            />
          </label>

          <label>
            {t('auth.register.phoneLabel')}
            <PhoneInput
              value={phoneLocal}
              onChange={setPhoneLocal}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('common.submitting') : t('auth.register.submit')}
          </button>
        </form>

        <p className="auth-link">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login">{t('nav.login')}</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
