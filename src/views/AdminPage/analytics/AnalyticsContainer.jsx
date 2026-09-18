"use client";

import { useMemo, useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import SessionsView from './SessionsView';
import AnalyticsSettings from './AnalyticsSettings';
import './AnalyticsContainer.css';
import { MdOutlineAnalytics, MdMenu, MdClose } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

// Значения закрыты check-констрейнтами в БД — списки соответствуют схеме один в один.
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

const AnalyticsContainer = ({ session, onLogout }) => {
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
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <MdClose /> : <MdMenu />}
          <span className="analytics-mobile-burger__text">
            {activeTab === 'overview' && 'Overview'}
            {activeTab === 'sessions' && 'Sessions'}
            {activeTab === 'settings' && 'Settings'}
          </span>
        </button>

        <div className={`analytics-tabs ${mobileMenuOpen ? 'analytics-tabs--open' : ''}`}>
          <button
            className={`analytics-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <MdOutlineAnalytics /> Overview
          </button>
          <button
            className={`analytics-tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => handleTabChange('sessions')}
          >
            <FaUsers /> Users Sessions
          </button>
          <button
            className={`analytics-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <IoMdSettings /> Settings
          </button>
        </div>
      </div>

      {activeTab !== 'settings' && (
        <div className="analytics-filter-bar">
          <div className="analytics-filter-bar__range">
            {[
              { value: '7d', label: '7 days' },
              { value: '30d', label: '30 days' },
              { value: '90d', label: '90 days' },
            ].map(({ value, label }) => (
              <button
                key={value}
                className={`analytics-filter-btn ${range === value ? 'active' : ''}`}
                onClick={() => setRange(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Сегменты применимы только к списку сессий: сводка приходит из RPC,
              который принимает лишь период и на стороне БД не сегментируется. */}
          {activeTab === 'sessions' && (
            <div className="analytics-filter-bar__segments">
              <input
                className="analytics-filter-bar__input"
                placeholder="Country..."
                value={filters.country}
                onChange={(e) => updateFilter('country', e.target.value)}
              />

              <select
                className="analytics-filter-bar__select"
                value={filters.device}
                onChange={(e) => updateFilter('device', e.target.value)}
              >
                <option value="">All devices</option>
                {DEVICE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>

              <input
                className="analytics-filter-bar__input"
                placeholder="Browser..."
                value={filters.browser}
                onChange={(e) => updateFilter('browser', e.target.value)}
              />

              <select
                className="analytics-filter-bar__select"
                value={filters.source}
                onChange={(e) => updateFilter('source', e.target.value)}
              >
                <option value="">All sources</option>
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
                  Clear
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
          <AnalyticsSettings session={session} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsContainer;
