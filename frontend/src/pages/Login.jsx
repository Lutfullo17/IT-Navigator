import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import PhoneInput from '../components/PhoneInput';
import { getApiErrorMessage, isPhoneComplete, toPhonePayload } from '../utils/phone';

function Login() {
  const navigate = useNavigate();
  const [phoneLocal, setPhoneLocal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isPhoneComplete(phoneLocal)) {
      setError('Telefon raqamni to\'liq kiriting: +998 90 123 45 67');
      return;
    }

    setLoading(true);

    try {
      await login(toPhonePayload(phoneLocal));
      navigate('/home');
    } catch (err) {
      setError(getApiErrorMessage(err.response?.data, 'Kirishda xatolik. Telefon raqamni tekshiring.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Kirish</h1>
        <p className="auth-subtitle">
          Ro&apos;yxatdan o&apos;tgan telefon raqamingizni kiriting.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Telefon raqam
            <PhoneInput
              value={phoneLocal}
              onChange={setPhoneLocal}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Kirish...' : 'Kirish'}
          </button>
        </form>

        <p className="auth-link">
          Akkauntingiz yo&apos;qmi? <Link to="/register">Ro&apos;yxatdan o&apos;tish</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
