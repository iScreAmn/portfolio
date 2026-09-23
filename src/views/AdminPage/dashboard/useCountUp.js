"use client";

import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Прогоняет число от нуля до целевого за `duration`.
 *
 * Считаем через requestAnimationFrame, а не setInterval: шаг привязан к
 * реальному времени, поэтому анимация не растягивается на медленной вкладке
 * и не съедает кадры на быстрой. При prefers-reduced-motion и на нуле сразу
 * показываем итог — анимировать нечего.
 */
export const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const end = Number(target) || 0;

    if (end === 0 || prefersReducedMotion()) {
      // Ставим итог кадром позже, а не синхронно в теле эффекта: синхронный
      // setState здесь вызвал бы каскадный рендер сразу после монтирования.
      frameRef.current = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(frameRef.current);
    }

    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      // easeOutCubic: быстрый старт и мягкая остановка на итоговом числе.
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
