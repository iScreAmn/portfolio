"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import './SessionsView.css';
import { getSessionsList, getSessionEvents } from '../../../lib/analyticsAdmin';
import adminData from '../../../data/adminData';

const { common, sessionsView: text } = adminData;
const BackIcon = text.backIcon;

/** Длительность считаем из границ визита: сервер отдаёт их как ISO-строки. */
const formatDuration = (startedAt, endedAt) => {
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return '—';

  const seconds = Math.round((end - start) / 1000);
  if (seconds < 1) return '<1s';
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const restSec = seconds % 60;
  if (minutes < 60) return restSec ? `${minutes}m ${restSec}s` : `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const restMin = minutes % 60;
  return restMin ? `${hours}h ${restMin}m` : `${hours}h`;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDeviceIcon = (deviceType) => {
  const Icon = text.deviceIcons[deviceType] || text.deviceIcons.desktop;
  return <Icon />;
};

const SOURCE_URL_MAX_LENGTH = 34;

/**
 * В карточке источник целиком не помещается и вылезает за границы — там
 * показываем укороченную версию (путь без домена, обрезанный многоточием),
 * полный URL виден в детальной панели по клику на карточку.
 */
const shortenUrl = (url, maxLength = SOURCE_URL_MAX_LENGTH) => {
  if (!url) return '';
  let display = url;
  try {
    const parsed = new URL(url);
    display = decodeURIComponent(parsed.pathname + parsed.search) || parsed.hostname;
  } catch {
    try {
      display = decodeURIComponent(url);
    } catch {
      display = url;
    }
  }
  return display.length > maxLength ? `${display.slice(0, maxLength - 1)}…` : display;
};

const getSourceLabel = (session, { short = false } = {}) => {
  const base = text.sourceLabels[session?.source_type] || text.sourceLabels.unknown;
  const host = session?.utm_source || session?.referrer;
  if (session?.source_type === 'direct' || !host) return base;
  return `${base}: ${short ? shortenUrl(host) : host}`;
};

const SessionsView = ({ period, filters }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getSessionsList(period.from, period.to, 100);
      setSessions(rows || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError(err?.message || text.loadSessionsFailed);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Сегментация делается на клиенте: список сессий отдаёт максимум 100 строк
  // за период, фильтровать их в браузере дешевле, чем гонять запрос на каждый ввод.
  const visibleSessions = useMemo(() => {
    const country = filters.country.trim().toLowerCase();
    const browser = filters.browser.trim().toLowerCase();

    return sessions.filter((s) => {
      if (country && !String(s.country || '').toLowerCase().includes(country)) return false;
      if (browser && !String(s.browser || '').toLowerCase().includes(browser)) return false;
      if (filters.device && s.device_type !== filters.device) return false;
      if (filters.source && s.source_type !== filters.source) return false;
      return true;
    });
  }, [sessions, filters]);

  const openSession = async (session) => {
    setSelectedSession(session);
    setSessionEvents([]);
    setDetailLoading(true);
    try {
      const rows = await getSessionEvents(session.session_id);
      setSessionEvents(rows || []);
    } catch (err) {
      console.error('Failed to fetch session events:', err);
      setError(err?.message || text.loadEventsFailed);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedSession(null);
    setSessionEvents([]);
  };

  const visitedPages = useMemo(
    () => [...new Set(sessionEvents.map((e) => e.path).filter(Boolean))],
    [sessionEvents]
  );

  if (loading) {
    return (
      <div className="sessions-view">
        <div className="sessions-loading">{text.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sessions-view">
        <div className="sessions-error">
          <p>{common.errorPrefix} {error}</p>
          <button onClick={fetchSessions} className="sessions-retry">
            {common.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-view">
      <div className="sessions-header">
        <h2 className="sessions-title">{text.title}</h2>
      </div>

      <div className="sessions-layout">
        <div className={`sessions-list ${selectedSession ? 'sessions-list--hidden-mobile' : ''}`}>
          <div className="sessions-list-header">
            <span>
              {text.totalLabel} {visibleSessions.length}
              {visibleSessions.length !== sessions.length &&
                ` ${text.ofLabel} ${sessions.length}`}
            </span>
          </div>

          {visibleSessions.length === 0 && (
            <div className="sessions-loading">{text.emptyFiltered}</div>
          )}

          {visibleSessions.map((session) => (
            <div
              key={session.session_id}
              className={`session-card ${
                selectedSession?.session_id === session.session_id ? 'active' : ''
              }`}
              onClick={() => openSession(session)}
            >
              <div className="session-card__header">
                <span className="session-card__device">
                  {getDeviceIcon(session.device_type)} {session.os || text.unknownOs}
                </span>
                <span className="session-card__duration">
                  {formatDuration(session.started_at, session.ended_at)}
                </span>
              </div>
              <div className="session-card__info">
                <div className="session-card__row">
                  <span className="session-card__label">{text.labels.browser}</span>
                  <span className="session-card__value">
                    {session.browser || text.unknownBrowser}
                  </span>
                </div>
                <div className="session-card__row">
                  <span className="session-card__label">{text.labels.location}</span>
                  <span className="session-card__value">
                    {[session.country, session.city].filter(Boolean).join(', ') ||
                      text.notAvailable}
                  </span>
                </div>
                <div className="session-card__row">
                  <span className="session-card__label">{text.labels.source}</span>
                  <span className="session-card__value" title={getSourceLabel(session)}>
                    {getSourceLabel(session, { short: true })}
                  </span>
                </div>
                <div className="session-card__row">
                  <span className="session-card__label">{text.labels.time}</span>
                  <span className="session-card__value">{formatDate(session.started_at)}</span>
                </div>
                <div className="session-card__row">
                  <span className="session-card__label">{text.labels.events}</span>
                  <span className="session-card__value">{session.events}</span>
                </div>
                <div className="session-card__row">
                  <span className="session-card__label">{text.labels.pages}</span>
                  <span className="session-card__value">{session.pageviews}</span>
                </div>
              </div>
              {session.referrer && (
                <div className="session-card__referrer">
                  <span className="session-card__label">{text.labels.referrer}</span>
                  <span className="session-card__referrer-url" title={session.referrer}>
                    {shortenUrl(session.referrer)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`session-detail ${selectedSession ? 'session-detail--visible-mobile' : ''}`}>
          {!selectedSession && (
            <div className="session-detail-empty">
              <p>{text.selectHint}</p>
            </div>
          )}

          {selectedSession && (
            <div className="session-detail-content">
              <div className="session-detail-header">
                <button
                  onClick={handleBackToList}
                  className="session-detail-back-btn"
                  title={text.backTitle}
                >
                  <BackIcon /> {text.backButton}
                </button>
                <h3 className="session-detail-title">{text.detailTitle}</h3>
              </div>

              <div className="session-detail-section">
                <h4 className="session-detail-section-title">{text.sections.generalInfo}</h4>
                <div className="session-detail-grid">
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.device}</span>
                    <span className="session-detail-value">
                      {getDeviceIcon(selectedSession.device_type)} {selectedSession.device_type}
                    </span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.os}</span>
                    <span className="session-detail-value">{selectedSession.os || '—'}</span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.browser}</span>
                    <span className="session-detail-value">{selectedSession.browser || '—'}</span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.country}</span>
                    <span className="session-detail-value">
                      {selectedSession.country || text.notAvailable}
                    </span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.region}</span>
                    <span className="session-detail-value">
                      {selectedSession.region || text.notAvailable}
                    </span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.city}</span>
                    <span className="session-detail-value">
                      {selectedSession.city || text.notAvailable}
                    </span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.entry}</span>
                    <span className="session-detail-value">{selectedSession.entry_path || '—'}</span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.exit}</span>
                    <span className="session-detail-value">{selectedSession.exit_path || '—'}</span>
                  </div>
                  <div className="session-detail-item">
                    <span className="session-detail-label">{text.labels.duration}</span>
                    <span className="session-detail-value">
                      {formatDuration(selectedSession.started_at, selectedSession.ended_at)}
                    </span>
                  </div>
                  <div className="session-detail-item session-detail-item--full">
                    <span className="session-detail-label">{text.labels.trafficSource}</span>
                    <span className="session-detail-value">{getSourceLabel(selectedSession)}</span>
                  </div>
                </div>
                {selectedSession.referrer && (
                  <div className="session-detail-item session-detail-item--full">
                    <span className="session-detail-label">{text.labels.referrerUrl}</span>
                    <a
                      href={selectedSession.referrer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="session-detail-link"
                    >
                      {selectedSession.referrer}
                    </a>
                  </div>
                )}
              </div>

              {detailLoading ? (
                <div className="session-detail-loading">{text.eventsLoading}</div>
              ) : (
                <>
                  <div className="session-detail-section">
                    <h4 className="session-detail-section-title">{text.sections.visitedPages}</h4>
                    {visitedPages.length > 0 ? (
                      <ul className="session-detail-pages">
                        {visitedPages.map((page, idx) => (
                          <li key={idx} className="session-detail-page">{page}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="analytics-empty">{common.noData}</p>
                    )}
                  </div>

                  <div className="session-detail-section">
                    <h4 className="session-detail-section-title">
                      {text.sections.events} ({sessionEvents.length})
                    </h4>
                    <div className="session-detail-events">
                      {sessionEvents.map((event, idx) => (
                        <div key={idx} className="session-event">
                          <div className="session-event__header">
                            <span className="session-event__type">
                              {event.category}:{event.action}
                            </span>
                            <span className="session-event__time">
                              {new Date(event.occurred_at).toLocaleTimeString('ru-RU')}
                            </span>
                          </div>
                          <div className="session-event__url">
                            {event.path}
                            {event.label ? ` — ${event.label}` : ''}
                          </div>
                          {event.params && Object.keys(event.params).length > 0 && (
                            <div className="session-event__data">
                              <pre>{JSON.stringify(event.params, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsView;
