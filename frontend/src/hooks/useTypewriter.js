import { useEffect, useState } from 'react';

export function useTypewriter(text, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      return undefined;
    }

    setDisplayed('');
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return displayed;
}
