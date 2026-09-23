"use client";

import { useMemo, useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import SessionsView from './SessionsView';
import AnalyticsSettings from './AnalyticsSettings';
import adminData from '../../../data/adminData';
import './AnalyticsContainer.css';

const { tabs: TABS, menuIcons: MenuIcons, menuToggleLabel, ranges: RANGES, filters: filterText } =
  adminData;

// Списки соответствуют тому, что проставляет трекер в lib/analytics.js.
const DEVICE_OPTIONS = ['desktop', 'mobile', 'tablet', 'tv', 'bot', 'unknown'];
const SOURCE_OPTIONS = [
  'direct',
  'search',
  'social',
  'referral',
  'internal',
  'campaign',
  'unknown',
];

const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 };

const AnalyticsContainer = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [range, setRange] = useState('7d');
  const [filters, setFilters] = useState({
    country: '',
    device: '',
    browser: '',
    source: '',
  });

  // Пересчитываем границы периода только при смене диапазона, иначе каждый
  // рендер создавал бы новый Date и дёргал перезапрос в дочерних вкладках.
  const period = useMemo(() => {
    const to = new Date();
    const from = new Date(Date.now() - (RANGE_DAYS[range] ?? 7) * 24 * 3600 * 1000);
    return { from, to };
  }, [range]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const hasSegmentFilters =
    filters.country || filters.device || filters.browser || filters.source;

  return (
    <div className="analytics-container-wrapper">
      <div className="analytics-tabs-wrapper">
        <button
          className="analytics-mobile-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={menuToggleLabel}
        >
          {mobileMenuOpen ? <MenuIcons.close /> : <MenuIcons.open />}
          <span className="analytics-mobile-burger__text">
            {TABS.find((tab) => tab.key === activeTab)?.label}
          </span>
        </button>

        <div className={`analytics-tabs ${mobileMenuOpen ? 'analytics-tabs--open' : ''}`}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`analytics-tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => handleTabChange(key)}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab !== 'settings' && (
        <div className="analytics-filter-bar">
          <div className="analytics-filter-bar__range">
            {RANGES.map(({ value, label }) => (
              <button
                key={value}
                className={`analytics-filter-btn ${range === value ? 'active' : ''}`}
                onClick={() => setRange(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Сегменты применимы только к списку сессий: сводка считается
              на сервере за период целиком и по сегментам не разбивается. */}
          {activeTab === 'sessions' && (
            <div className="analytics-filter-bar__segments">
              <input
                className="analytics-filter-bar__input"
                placeholder={filterText.countryPlaceholder}
                value={filters.country}
                onChange={(e) => updateFilter('country', e.target.value)}
              />

              <select
                className="analytics-filter-bar__select"
                value={filters.device}
                onChange={(e) => updateFilter('device', e.target.value)}
              >
                <option value="">{filterText.allDevices}</option>
                {DEVICE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>

              <input
                className="analytics-filter-bar__input"
                placeholder={filterText.browserPlaceholder}
                value={filters.browser}
                onChange={(e) => updateFilter('browser', e.target.value)}
              />

              <select
                className="analytics-filter-bar__select"
                value={filters.source}
                onChange={(e) => updateFilter('source', e.target.value)}
              >
                <option value="">{filterText.allSources}</option>
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              {hasSegmentFilters && (
                <button
                  className="analytics-filter-bar__clear"
                  onClick={() =>
                    setFilters({ country: '', device: '', browser: '', source: '' })
                  }
                >
                  {filterText.clear}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="analytics-content">
        {activeTab === 'overview' && <AnalyticsDashboard period={period} />}
        {activeTab === 'sessions' && (
          <SessionsView period={period} filters={filters} />
        )}
        {activeTab === 'settings' && (
          <AnalyticsSettings user={user} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsContainer;
