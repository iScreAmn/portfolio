"use client";

import adminData from '../../../data/adminData';
import './StatusBadge.css';

const { crm } = adminData;

const StatusBadge = ({ status }) => (
  <span className={`crm-status crm-status--${status}`}>
    {crm.statusLabels[status] || status}
  </span>
);

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
