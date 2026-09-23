"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { getSummary } from '../../../lib/analyticsAdmin';
import { getClients } from '../../../lib/crmAdmin';
import StatTile from './StatTile';
import ReviewsPanel from './ReviewsPanel';
import StatusBadge from '../crm/StatusBadge';
import { contactHref } from '../crm/ClientCard';
import adminData from '../../../data/adminData';
import './Dashboard.css';

const { common, overview, crm } = adminData;

const PERIOD_DAYS = 7;
const RECENT_LIMIT = 5;

const formatDate = (value) =>
  new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Главная страница админки: сводка за неделю и свежие заявки.
 *
 * Своей логики здесь нет — это те же /api/analytics/summary и /api/leads, что
 * и в разделах, только урезанные до чисел. Графиков и фильтров нет намеренно:
 * за ними человек идёт в «Аналитику».
 */
const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [leads, setLeads] = useState(null);
  const [leadsError, setLeadsError] = useState(null);
  const [loading, setLoading] = useState(true);

  const period = useMemo(() => {
    const to = new Date();
    const from = new Date(Date.now() - PERIOD_DAYS * 24 * 3600 * 1000);
    return { from, to };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setSummaryError(null);
    setLeadsError(null);

    // allSettled, а не all: упавшая аналитика не должна прятать заявки и
    // наоборот — каждая карточка показывает свою ошибку отдельно.
    const [summaryResult, leadsResult] = await Promise.allSettled([
      getSummary(period.from, period.to),
      getClients({ status: 'new', limit: RECENT_LIMIT }),
    ]);

    if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value);
    else setSummaryError(summaryResult.reason?.message || overview.analytics.loadFailed);

    if (leadsResult.status === 'fulfilled') setLeads(leadsResult.value);
    else setLeadsError(leadsResult.reason?.message || overview.leads.loadFailed);

    setLoading(false);
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="dash">
        <p className="dash__placeholder">{overview.loading}</p>
      </div>
    );
  }

  const totals = summary?.totals || {};
  const newCount = leads?.counts?.new ?? 0;
  const recent = leads?.items || [];

  // Опорное значение для полос: наибольший показатель воронки, то есть
  // просмотры. Считаем максимумом, а не totals.pageviews, чтобы полосы не
  // уехали за 100%, если сервер когда-нибудь отдаст иной порядок.
  const metricMax = Math.max(
    ...overview.analytics.metrics.map(({ key }) => Number(totals[key]) || 0),
  );

  return (
    <div className="dash">
      <div className="dash__header">
        <h2 className="dash__title">{overview.title}</h2>
        <p className="dash__subtitle">{overview.subtitle}</p>
      </div>

      <div className="dash__grid">
        {/* Левая колонка: сводка и под ней отзывы, справа — заявки. */}
        <div className="dash__col">
          <section className="dash-card">
            <div className="dash-card__head">
              <h3 className="dash-card__title">
                {overview.analytics.title}
                <span className="dash-card__period">{overview.analytics.periodLabel}</span>
              </h3>
              <Link className="dash-card__link" href="/admin/analytics">
                {overview.analytics.linkLabel}
                <HiArrowNarrowRight aria-hidden />
              </Link>
            </div>

            {summaryError ? (
              <p className="dash-card__error">
                {common.errorPrefix} {summaryError}
              </p>
            ) : (
              <div className="dash-tiles">
                {overview.analytics.metrics.map(({ key, label, icon }) => {
                  const value = Number(totals[key]) || 0;
                  return (
                    <StatTile
                      key={key}
                      icon={icon}
                      label={label}
                      value={value}
                      share={metricMax ? (value / metricMax) * 100 : 0}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <ReviewsPanel />
        </div>

        <section className="dash-card">
          <div className="dash-card__head">
            <h3 className="dash-card__title">{overview.leads.title}</h3>
            <Link className="dash-card__link" href="/admin/crm">
              {overview.leads.linkLabel}
              <HiArrowNarrowRight aria-hidden />
            </Link>
          </div>

          {leadsError ? (
            <p className="dash-card__error">
              {common.errorPrefix} {leadsError}
            </p>
          ) : (
            <>
              <div className="dash-tiles">
                <StatTile
                  icon={overview.leads.icon}
                  label={overview.leads.countHint}
                  value={newCount}
                />
              </div>

              <h4 className="dash-card__subtitle">{overview.leads.recentTitle}</h4>

              {recent.length === 0 ? (
                <p className="dash-card__empty">{overview.leads.empty}</p>
              ) : (
                <ul className="dash-leads">
                  {recent.map((lead) => {
                    const href = contactHref(lead.contactMethod, lead.contactValue);

                    return (
                      <li key={lead.id} className="dash-lead">
                        <div className="dash-lead__main">
                          <span className="dash-lead__name">{lead.name}</span>
                          {href ? (
                            <a className="dash-lead__contact" href={href}>
                              {lead.contactValue}
                            </a>
                          ) : (
                            <span className="dash-lead__contact">{lead.contactValue}</span>
                          )}
                        </div>
                        <div className="dash-lead__meta">
                          <StatusBadge status={lead.status} />
                          <span className="dash-lead__source">
                            {crm.sourceLabels[lead.source] || lead.source}
                          </span>
                          <span className="dash-lead__date">{formatDate(lead.createdAt)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
