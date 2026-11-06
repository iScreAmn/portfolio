"use client";

import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const end = Number(target) || 0;

    if (end === 0 || prefersReducedMotion()) {
      frameRef.current = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(frameRef.current);
    }

    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(end * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
};

export default useCountUp;
