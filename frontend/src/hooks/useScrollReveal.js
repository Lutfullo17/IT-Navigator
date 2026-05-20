import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('visible');
          if (options.once !== false) {
            observer.unobserve(element);
          }
        } else if (options.once === false) {
          element.classList.remove('visible');
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.once, options.threshold, options.rootMargin]);

  return ref;
}
