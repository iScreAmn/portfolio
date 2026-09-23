"use client";

import { useEffect, useState } from 'react';
import useCountUp from './useCountUp';

/**
 * Плитка показателя: иконка, подпись, число и — если передали `share` —
 * полоса доли от наибольшего показателя.
 *
 * Полоса нужна не для красоты: просмотры ≥ сессии ≥ посетители, поэтому их
 * доли складываются в воронку, и провал на одном шаге видно, не сравнивая
 * числа глазами. Новых данных она не вводит — считается из тех же трёх чисел.
 */
const StatTile = ({ icon: Icon, label, value, share }) => {
  const shown = useCountUp(value);
  const [barWidth, setBarWidth] = useState(0);

  // Ширину ставим кадром позже, иначе полоса отрисуется сразу конечной и
  // CSS-переходу нечего будет анимировать.
  useEffect(() => {
    if (share === undefined) return undefined;
    const frame = requestAnimationFrame(() => setBarWidth(share));
    return () => cancelAnimationFrame(frame);
  }, [share]);

  return (
    <div className="dash-tile">
      <div className="dash-tile__head">
        <span className="dash-tile__icon" aria-hidden>
          <Icon />
        </span>
        <span className="dash-tile__label">{label}</span>
      </div>

      {/* Само число — из value, а не из анимации: скринридер не должен
          читать промежуточные значения счётчика. */}
      <span className="dash-tile__value" aria-label={String(value)}>
        <span aria-hidden>{shown.toLocaleString('ru-RU')}</span>
      </span>

      {share !== undefined && (
        <span className="dash-tile__bar" aria-hidden>
          <span className="dash-tile__bar-fill" style={{ width: `${barWidth}%` }} />
        </span>
      )}
    </div>
  );
};

export default StatTile;
