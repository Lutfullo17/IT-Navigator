import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRotatingTypewriter } from '../hooks/useRotatingTypewriter';

function HomeHeadline() {
  const { t, language } = useLanguage();

  const phrases = useMemo(
    () => [t('home.headline1'), t('home.headline2'), t('home.headline3')],
    [language, t],
  );

  const { displayed, isTyping } = useRotatingTypewriter(phrases, { phrasePause: 2000 });

  return (
    <blockquote
      className="dashboard-motivation dashboard-motivation--hero dashboard-motivation--float"
      aria-live="polite"
    >
      {displayed}
      {isTyping ? (
        <span className="dashboard-headline-cursor" aria-hidden="true">
          |
        </span>
      ) : null}
    </blockquote>
  );
}

export default HomeHeadline;
