"use client";

import { useMemo, useState } from 'react';

/**
 * Столбчатый график активности по дням.
 * Переиспользует стили .hourly-chart__* — раскладка та же, меняются только данные.
 */
export default function DailyActivityChart({ daily = [] }) {
  const [hovered, setHovered] = useState(null);

  const data = useMemo(() => {
    const points = daily.map((item) => ({
      day: item.day,
      pageviews: Number(item.pageviews) || 0,
      sessions: Number(item.sessions) || 0,
    }));
    const maxCount = Math.max(...points.map((p) => p.pageviews), 0);
    const peakDay = maxCount > 0 ? points.find((p) => p.pageviews === maxCount)?.day : null;

    return {
      points: points.map((p) => ({
        ...p,
        normalizedHeight: maxCount > 0 ? (p.pageviews / maxCount) * 100 : 0,
      })),
      maxCount,
      peakDay,
    };
  }, [daily]);

  // На 30 и 90 днях подписи по каждому дню превращаются в кашу — прореживаем.
  const labelStep = Math.max(1, Math.ceil(data.points.length / 12));

  const formatDay = (day) => {
    const [, month, date] = String(day).split('-');
    return `${date}.${month}`;
  };

  return (
    <div className="hourly-chart">
      <div className="hourly-chart__plot" role="img" aria-label="Daily activity bar chart">
        {data.points.map((point, idx) => {
          const isHovered = hovered === point.day;
          const dimmed = hovered !== null && !isHovered;
          const isPeak = data.maxCount > 0 && point.day === data.peakDay;

          return (
            <div
              key={point.day}
              className="hourly-chart__col"
              onMouseEnter={() => setHovered(point.day)}
              onMouseLeave={() => setHovered(null)}
              style={{
                '--height': `${Math.max(point.normalizedHeight, point.pageviews > 0 ? 3 : 1)}%`,
                '--delay': `${idx * 20}ms`,
              }}
            >
              <div
                className={[
                  'hourly-chart__bar',
                  isPeak ? 'hourly-chart__bar--peak' : '',
                  isHovered ? 'hourly-chart__bar--active' : '',
                  dimmed ? 'hourly-chart__bar--dimmed' : '',
                ].join(' ')}
              />

              {isHovered && (
                <div className="hourly-chart__tooltip">
                  {formatDay(point.day)} — {point.pageviews} просмотров, {point.sessions} сессий
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hourly-chart__x-axis">
        {data.points.map((point, idx) => (
          <span key={point.day} className="hourly-chart__x-label">
            {idx % labelStep === 0 ? formatDay(point.day) : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
