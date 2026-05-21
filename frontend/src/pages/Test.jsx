import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPreferredLanguage, isLoggedIn } from '../api/auth';
import { useLanguage } from '../context/LanguageContext';
import { startTest, submitAnswers } from '../api/test';

function Test() {
  const { t } = useLanguage();
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
          <h1>{t('test.title')}</h1>
          <p>{t('test.loginRequired')}</p>
          <Link to="/register" className="btn-primary">{t('nav.register')}</Link>
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
      setError(err.response?.data?.detail || t('test.error.start'));
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
      setError(t('test.error.allAnswers'));
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
        || t('test.error.submit')
      );
    } finally {
      setLoading(false);
    }
  }

  if (step === 'intro') {
    return (
      <div className="test-page test-page--dark">
        <div className="test-intro">
          <Link to="/directions" className="back-link">{t('common.backDirections')}</Link>
          <h1>{t('test.intro.title')}</h1>
          <p>{t('test.intro.p1')}</p>
          <p className="test-note">{t('test.intro.note')}</p>

          {error && <p className="auth-error">{error}</p>}

          <button type="button" className="btn-primary test-start-btn" onClick={handleStart} disabled={loading}>
            {loading ? t('common.loading') : t('test.start')}
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
              {t('test.nav.back')}
            </button>

            {isLast ? (
              <button
                type="button"
                className="btn-primary test-nav-btn"
                onClick={handleSubmit}
                disabled={loading || !hasAnswer}
              >
                {loading ? t('test.nav.analyzing') : t('test.nav.results')}
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary test-nav-btn"
                onClick={handleNext}
                disabled={!hasAnswer}
              >
                {t('test.nav.next')}
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
          <h1>{t('test.results.title')}</h1>
          <p className="test-note">{t('test.results.note')}</p>

          <div className="results-list">
            {results.map((item) => (
              <div key={item.slug} className="result-card">
                <div className="result-header">
                  <h2>{item.name}</h2>
                  <span className="result-percent">{item.percentage}%</span>
                </div>
                <p>{item.reason}</p>
                <Link to={`/directions/${item.slug}`} className="result-link">
                  {t('common.readMore')}
                </Link>
              </div>
            ))}
          </div>

          <div className="test-result-actions">
            <Link to="/directions" className="btn-secondary">{t('test.results.allDirections')}</Link>
            <Link to="/tasks" className="btn-primary">{t('test.results.tryTasks')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Test;
