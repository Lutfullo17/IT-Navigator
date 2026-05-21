import { useEffect, useState } from 'react';

const DEFAULTS = {
  charDelay: 40,
  wordDelay: 80,
  phrasePause: 2000,
};

export function useRotatingTypewriter(phrases, options = {}) {
  const { charDelay, wordDelay, phrasePause } = { ...DEFAULTS, ...options };
  const [displayed, setDisplayed] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const phrasesKey = phrases.filter(Boolean).join('\n');

  useEffect(() => {
    const list = phrases.filter(Boolean);
    if (!list.length) {
      setDisplayed('');
      setIsTyping(false);
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    const timers = [];

    const schedule = (fn, ms) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
      return id;
    };

    if (reducedMotion) {
      let idx = 0;
      setDisplayed(list[0]);
      setPhraseIndex(0);
      setIsTyping(false);

      function showNext() {
        if (cancelled) return;
        idx = (idx + 1) % list.length;
        setPhraseIndex(idx);
        setDisplayed(list[idx]);
        schedule(showNext, phrasePause);
      }

      schedule(showNext, phrasePause);

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    function typePhrase(pIdx) {
      if (cancelled) return;

      const phrase = list[pIdx];
      setPhraseIndex(pIdx);
      setDisplayed('');
      setIsTyping(true);

      let i = 0;

      function typeNextChar() {
        if (cancelled) return;

        if (i >= phrase.length) {
          setIsTyping(false);
          schedule(() => typePhrase((pIdx + 1) % list.length), phrasePause);
          return;
        }

        const char = phrase[i];
        i += 1;
        setDisplayed(phrase.slice(0, i));

        const delay = char === ' ' ? charDelay + wordDelay : charDelay;
        schedule(typeNextChar, delay);
      }

      schedule(typeNextChar, 0);
    }

    typePhrase(0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [phrasesKey, charDelay, wordDelay, phrasePause]);

  return { displayed, phraseIndex, isTyping };
}
