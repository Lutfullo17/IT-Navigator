import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import PhoneInput from '../components/PhoneInput';
import { getApiErrorMessage, isPhoneComplete, toPhonePayload } from '../utils/phone';

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
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

    const phone = toPhonePayload(phoneLocal);
    setLoading(true);

    try {
      await register({ full_name: fullName.trim(), phone });
      navigate('/home');
    } catch (err) {
      setError(getApiErrorMessage(err.response?.data, 'Ro\'yxatdan o\'tishda xatolik.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>IT Navigator</h1>
        <p className="auth-subtitle">
          Ism va telefon raqamingizni kiriting — sizga mos IT yo&apos;nalishni topamiz.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Ismingiz
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
            Telefon raqam
            <PhoneInput
              value={phoneLocal}
              onChange={setPhoneLocal}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'Boshlash'}
          </button>
        </form>

        <p className="auth-link">
          Akkauntingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
