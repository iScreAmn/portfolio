"use client";

import { useEffect, useState } from 'react';

const DURATION = 900;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Плавно «докручивает» число от 0 до value при монтировании и при смене value.
 * format получает текущее целое значение и возвращает строку для вывода.
 */
const AnimatedNumber = ({ value, format = (n) => n.toLocaleString() }) => {
  const target = Number(value) || 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 0 : DURATION;

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = duration ? Math.min((now - start) / duration, 1) : 1;
      setCurrent(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return format(current);
};

export default AnimatedNumber;
