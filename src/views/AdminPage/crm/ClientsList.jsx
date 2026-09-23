"use client";

import { Fragment } from 'react';
import { MdExpandMore } from 'react-icons/md';
import ClientCard, { contactHref } from './ClientCard';
import { StatusSelect } from './StatusBadge';
import adminData from '../../../data/adminData';

const { crm } = adminData;
const DeleteIcon = crm.deleteIcon;

const formatDate = (value) =>
  new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const ContactLink = ({ client }) => {
  const href = contactHref(client.contactMethod, client.contactValue);
  const Icon = crm.contactIcons[client.contactMethod];
  const isMail = href?.startsWith('mailto:');

  const body = (
    <>
      {Icon && <Icon className="crm-contact__icon" aria-hidden />}
      <span className="crm-contact__value">{client.contactValue}</span>
    </>
  );

  // Без mailto/tel остаётся просто текст — например, телеграм-ник.
  if (!href) return <span className="crm-contact">{body}</span>;

  return (
    <a
      className="crm-contact crm-contact--link"
      href={href}
      title={isMail ? crm.mailtoTitle(client.contactValue) : crm.telTitle(client.contactValue)}
    >
      {body}
    </a>
  );
};

/**
 * Таблица на широком экране и карточки на узком — одна и та же разметка,
 * переключается в Crm.css через data-label у ячеек.
 */
const ClientsList = ({ clients, expandedId, onToggle, onStatusChange, onSaveNote, onDelete, busyId }) => (
  <div className="crm-table" role="table">
    <div className="crm-table__head" role="row">
      <span role="columnheader">{crm.columns.name}</span>
      <span role="columnheader">{crm.columns.contact}</span>
      <span role="columnheader">{crm.columns.status}</span>
      <span role="columnheader">{crm.columns.source}</span>
      <span role="columnheader">{crm.columns.created}</span>
      <span role="columnheader">{crm.columns.actions}</span>
    </div>

    {clients.map((client) => {
      const expanded = expandedId === client.id;

      return (
        <Fragment key={client.id}>
          <div className={`crm-table__row ${expanded ? 'is-expanded' : ''}`} role="row">
            <span className="crm-table__cell" data-label={crm.columns.name} role="cell">
              <button
                type="button"
                className="crm-table__name"
                onClick={() => onToggle(client.id)}
                aria-expanded={expanded}
                title={expanded ? crm.detailsClose : crm.detailsOpen}
              >
                <MdExpandMore className="crm-table__chevron" aria-hidden />
                {client.name}
              </button>
            </span>

            <span className="crm-table__cell" data-label={crm.columns.contact} role="cell">
              <ContactLink client={client} />
            </span>

            <span className="crm-table__cell" data-label={crm.columns.status} role="cell">
              <StatusSelect
                status={client.status}
                disabled={busyId === client.id}
                onChange={(status) => onStatusChange(client, status)}
              />
            </span>

            <span className="crm-table__cell" data-label={crm.columns.source} role="cell">
              <span className={`crm-source crm-source--${client.source}`}>
                {crm.sourceLabels[client.source] || client.source}
              </span>
            </span>

            <span className="crm-table__cell" data-label={crm.columns.created} role="cell">
              {formatDate(client.createdAt)}
            </span>

            <span className="crm-table__cell crm-table__cell--actions" role="cell">
              <button
                type="button"
                className="crm-icon-btn crm-icon-btn--danger"
                onClick={() => onDelete(client)}
                title={crm.deleteModal.confirm}
                aria-label={`${crm.deleteModal.confirm}: ${client.name}`}
              >
                <DeleteIcon aria-hidden />
              </button>
            </span>
          </div>

          {expanded && (
            <div className="crm-table__detail" role="row">
              <ClientCard client={client} onSaveNote={(note) => onSaveNote(client, note)} />
            </div>
          )}
        </Fragment>
      );
    })}
  </div>
);

export default ClientsList;
