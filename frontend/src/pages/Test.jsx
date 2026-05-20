import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLanguage, isLoggedIn } from '../api/auth';
import { startTest, submitAnswers } from '../api/test';

function Test() {
  const [step, setStep] = useState('intro');
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn()) {
    return (
      <div className="test-page test-page--dark">
        <div className="test-intro">
          <h1>Test</h1>
          <p>Test ishlash uchun avval tizimga kiring.</p>
          <Link to="/register" className="btn-primary">Ro&apos;yxatdan o&apos;tish</Link>
        </div>
      </div>
    );
  }

  async function handleStart() {
    setLoading(true);
    setError('');

    try {
      const data = await startTest(getPreferredLanguage(), 15);
      setSession(data);
      setAnswers({});
      setCurrentIndex(0);
      setStep('questions');
    } catch (err) {
      setError(err.response?.data?.detail || 'Testni boshlab bo\'lmadi.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(questionIndex, option) {
    setAnswers({ ...answers, [questionIndex]: option });
  }

  function handleNext() {
    if (!session) return;

    const total = session.questions.length;
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setError('');
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setError('');
    }
  }

  async function handleSubmit() {
    if (!session) return;

    const total = session.questions.length;
    const answersList = Object.entries(answers).map(([index, option]) => ({
      question_index: Number(index),
      selected_option: option,
    }));

    if (answersList.length < total) {
      setError('Barcha savollarga javob bering.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await submitAnswers(session.id, answersList, getPreferredLanguage());
      setResults(data.results);
      setStep('results');
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.detail
        || data?.answers?.[0]
        || 'Javoblarni yuborib bo\'lmadi.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (step === 'intro') {
    return (
      <div className="test-page test-page--dark">
        <div className="test-intro">
          <Link to="/directions" className="back-link">← Yo&apos;nalishlar</Link>
          <h1>Yo&apos;nalish aniqlash testi</h1>
          <p>
            15 ta oddiy savolga javob bering. IT haqida bilishingiz shart emas —
            faqat o&apos;zingiz haqingizda gap ketadi.
          </p>
          <p className="test-note">To&apos;g&apos;ri yoki noto&apos;g&apos;ri javob yo&apos;q. Xohlaganingizni tanlang.</p>

          {error && <p className="auth-error">{error}</p>}

          <button type="button" className="btn-primary test-start-btn" onClick={handleStart} disabled={loading}>
            {loading ? 'Yuklanmoqda...' : 'Testni boshlash'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'questions' && session) {
    const total = session.questions.length;
    const question = session.questions[currentIndex];
    const progress = ((currentIndex + 1) / total) * 100;
    const isLast = currentIndex === total - 1;
    const hasAnswer = answers[currentIndex] !== undefined;

    return (
      <div className="test-page test-page--dark test-page--quiz">
        <div className="test-quiz">
          <div className="test-progress">
            <div className="test-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="test-progress-text">{currentIndex + 1} / {total}</p>

          <h2 className="test-question-title">
            {currentIndex + 1}. {question.text}
          </h2>

          <div className={`test-options-grid test-options-grid--${question.options.length}`}>
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`test-option-card ${answers[currentIndex] === option ? 'selected' : ''}`}
                onClick={() => handleSelect(currentIndex, option)}
              >
                <span className="test-option-radio" aria-hidden="true" />
                <span className="test-option-text">{option}</span>
              </button>
            ))}
          </div>

          {error && <p className="auth-error test-quiz-error">{error}</p>}

          <div className="test-quiz-nav">
            <button
              type="button"
              className="btn-secondary test-nav-btn"
              onClick={handleBack}
              disabled={currentIndex === 0}
            >
              Orqaga
            </button>

            {isLast ? (
              <button
                type="button"
                className="btn-primary test-nav-btn"
                onClick={handleSubmit}
                disabled={loading || !hasAnswer}
              >
                {loading ? 'Tahlil qilinmoqda...' : 'Natijani ko\'rish'}
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary test-nav-btn"
                onClick={handleNext}
                disabled={!hasAnswer}
              >
                Keyingi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="test-page test-page--dark">
        <div className="test-results">
          <h1>Sizga mos yo&apos;nalishlar</h1>
          <p className="test-note">Bu tavsiyalar — sizni cheklamaydi, yo&apos;l ko&apos;rsatadi.</p>

          <div className="results-list">
            {results.map((item) => (
              <div key={item.slug} className="result-card">
                <div className="result-header">
                  <h2>{item.name}</h2>
                  <span className="result-percent">{item.percentage}%</span>
                </div>
                <p>{item.reason}</p>
                <Link to={`/directions/${item.slug}`} className="result-link">
                  Batafsil o&apos;qish →
                </Link>
              </div>
            ))}
          </div>

          <div className="test-result-actions">
            <Link to="/directions" className="btn-secondary">Barcha yo&apos;nalishlar</Link>
            <Link to="/tasks" className="btn-primary">Vazifalarni sinash</Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Test;
