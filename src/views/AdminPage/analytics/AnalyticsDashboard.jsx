"use client";

import { useState, useEffect, useCallback } from 'react';
import './Analytics.css';
import DailyActivityChart from './DailyActivityChart';
import { getSummary, getDevices } from '../../../lib/analyticsAdmin';

const formatSeconds = (total) => {
  const s = Number(total) || 0;
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m < 60) return rest ? `${m}m ${rest}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
};

/**
 * RPC отдаёт только те дни, в которые были события. Пропуски заполняем нулями,
 * иначе график по времени сжимает паузы и врёт о динамике.
 */
const fillDailyGaps = (daily, from, to) => {
  const byDay = new Map((daily || []).map((d) => [d.day, d]));
  const out = [];

  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);

  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    const hit = byDay.get(key);
    out.push({
      day: key,
      sessions: Number(hit?.sessions) || 0,
      pageviews: Number(hit?.pageviews) || 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
};

const AnalyticsDashboard = ({ period }) => {
  const [summary, setSummary] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, deviceRows] = await Promise.all([
        getSummary(period.from, period.to),
        getDevices(10),
      ]);
      setSummary(summaryData);
      setDevices(deviceRows || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err?.message || 'Не удалось загрузить аналитику');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">Загрузка аналитики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="analytics-error">
          <p>Error: {error}</p>
          <button onClick={fetchAnalytics} className="analytics-retry">
            Try again
          </button>
        </div>
      </div>
    );
  }

  const totals = summary?.totals || {};
  const daily = fillDailyGaps(summary?.daily, period.from, period.to);
  const topPages = summary?.top_pages || [];
  const sources = summary?.sources || [];
  const countries = summary?.countries || [];
  const bounceRate = Math.round((Number(summary?.bounce_rate) || 0) * 100);
  const hasAnyData = (Number(totals.events) || 0) > 0;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2 className="analytics-title">Аналитика использования</h2>
      </div>

      {!hasAnyData && (
        <p className="analytics-empty">
          За выбранный период событий нет. Если трекер только что подключили —
          загляните через несколько минут.
        </p>
      )}

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Просмотры страниц</h3>
          </div>
          <div className="analytics-card__value">
            {(Number(totals.pageviews) || 0).toLocaleString()}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Сессии</h3>
          </div>
          <div className="analytics-card__value">
            {(Number(totals.sessions) || 0).toLocaleString()}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Посетители</h3>
          </div>
          <div className="analytics-card__value">
            {(Number(totals.visitors) || 0).toLocaleString()}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Всего событий</h3>
          </div>
          <div className="analytics-card__value">
            {(Number(totals.events) || 0).toLocaleString()}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Среднее время сессии</h3>
          </div>
          <div className="analytics-card__value">
            {formatSeconds(summary?.avg_session_seconds)}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Показатель отказов</h3>
          </div>
          <div className="analytics-card__value">{bounceRate}%</div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Популярные страницы</h3>
          </div>
          <div className="analytics-card__content">
            {topPages.length > 0 ? (
              <ul className="analytics-list">
                {topPages.map((page, i) => (
                  <li key={`${page.path}-${i}`} className="analytics-list__item">
                    <span className="analytics-list__name">{page.path || '—'}</span>
                    <span className="analytics-list__value">
                      {page.pageviews} просмотров
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="analytics-empty">Нет данных</p>
            )}
          </div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Источники трафика</h3>
          </div>
          <div className="analytics-card__content">
            {sources.length > 0 ? (
              <ul className="analytics-list">
                {sources.map((source, i) => (
                  <li key={`${source.source_type}-${i}`} className="analytics-list__item">
                    <span className="analytics-list__name">
                      <span className="analytics-event-badge">
                        {source.source_type || 'unknown'}
                      </span>
                    </span>
                    <span className="analytics-list__value">
                      {source.sessions} сессий
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="analytics-empty">Нет данных</p>
            )}
          </div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">География</h3>
          </div>
          <div className="analytics-card__content">
            {countries.length > 0 ? (
              <ul className="analytics-list">
                {countries.map((row, i) => (
                  <li key={`${row.country}-${i}`} className="analytics-list__item">
                    <span className="analytics-list__name">{row.country || '—'}</span>
                    <span className="analytics-list__value">{row.sessions} сессий</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="analytics-empty">Нет данных</p>
            )}
          </div>
        </div>

        <div className="analytics-card analytics-card--wide">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Устройства</h3>
          </div>
          <div className="analytics-card__content">
            {devices.length > 0 ? (
              <ul className="analytics-list">
                {devices.map((row, i) => (
                  <li key={`${row.device_type}-${row.browser}-${i}`} className="analytics-list__item">
                    <span className="analytics-list__name">
                      <span className="analytics-event-badge">{row.device_type}</span>
                      <span className="analytics-event-action">{row.os}</span>
                      <span className="analytics-event-label">· {row.browser}</span>
                    </span>
                    <span className="analytics-list__value">{row.sessions} сессий</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="analytics-empty">Нет данных</p>
            )}
          </div>
        </div>

        <div className="analytics-card analytics-card--full">
          <div className="analytics-card__header">
            <h3 className="analytics-card__title">Активность по дням</h3>
          </div>
          <div className="analytics-card__content analytics-card__content--chart">
            {daily.length > 0 ? (
              <DailyActivityChart daily={daily} />
            ) : (
              <p className="analytics-empty">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
