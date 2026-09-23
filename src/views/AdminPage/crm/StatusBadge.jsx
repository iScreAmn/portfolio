"use client";

import adminData from '../../../data/adminData';
import './StatusBadge.css';

const { crm } = adminData;

/**
 * Цвет статуса задаётся классом-модификатором, а не инлайном, чтобы палитра
 * жила в Crm.css рядом с остальной вёрсткой.
 */
const StatusBadge = ({ status }) => (
  <span className={`crm-status crm-status--${status}`}>
    {crm.statusLabels[status] || status}
  </span>
);

/**
 * Тот же бейдж, но кликабельный: смена статуса делается прямо из списка и из
 * карточки, отдельного экрана редактирования нет.
 */
export const StatusSelect = ({ status, onChange, disabled }) => (
  <span className={`crm-status crm-status--${status} crm-status--select`}>
    <select
      className="crm-status__select"
      value={status}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      aria-label={crm.statusAria}
    >
      {crm.statusOrder.map((value) => (
        <option key={value} value={value}>
          {crm.statusLabels[value]}
        </option>
      ))}
    </select>
  </span>
);

export default StatusBadge;
