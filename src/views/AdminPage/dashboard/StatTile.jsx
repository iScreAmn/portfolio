"use client";

import { useEffect, useState } from 'react';
import useCountUp from './useCountUp';

const StatTile = ({ icon: Icon, label, value, share }) => {
  const shown = useCountUp(value);
  const [barWidth, setBarWidth] = useState(0);

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
