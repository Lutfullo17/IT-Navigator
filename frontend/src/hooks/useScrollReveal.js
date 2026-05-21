import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const show = () => element.classList.add('visible');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          if (options.once !== false) {
            observer.unobserve(element);
          }
        } else if (options.once === false) {
          element.classList.remove('visible');
        }
      },
      {
        threshold: options.threshold ?? 0.08,
        rootMargin: options.rootMargin ?? '0px 0px 0px 0px',
      },
    );

    observer.observe(element);

    const fallback = window.setTimeout(show, 800);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [options.once, options.threshold, options.rootMargin]);

  return ref;
}
