"use client";

import { MdDragIndicator, MdExpandMore } from 'react-icons/md';
import ClientCard, { contactHref } from './ClientCard';
import { StatusSelect } from './StatusBadge';
import useDragSort from './useDragSort';
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

const ClientsList = ({
  clients,
  expandedId,
  onToggle,
  onStatusChange,
  onSave,
  onDelete,
  onReorder,
  busyId,
}) => {
  const { draggingId, registerRow, getHandleProps } = useDragSort({
    ids: clients.map((client) => client.id),
    onReorder,
  });

  return (
    <div className={`crm-table ${draggingId ? 'is-dragging' : ''}`} role="table">
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
          <div
            key={client.id}
            ref={registerRow(client.id)}
            className={`crm-table__item ${draggingId === client.id ? 'is-dragging' : ''}`}
            role="rowgroup"
          >
            <div className={`crm-table__row ${expanded ? 'is-expanded' : ''}`} role="row">
              <span
                className="crm-table__cell crm-table__cell--name"
                data-label={crm.columns.name}
                role="cell"
              >
                <button
                  type="button"
                  className="crm-drag"
                  title={crm.dragTitle}
                  aria-label={`${crm.dragTitle}: ${client.name}`}
                  {...getHandleProps(client.id)}
                >
                  <MdDragIndicator aria-hidden />
                </button>

                <button
                  type="button"
                  className="crm-table__name"
                  onClick={() => onToggle(client.id)}
                  aria-expanded={expanded}
                  title={expanded ? crm.detailsClose : crm.detailsOpen}
                >
                  <MdExpandMore className="crm-table__chevron" aria-hidden />
                  {/* Компания второй строкой под именем, а не отдельной
                      колонкой: заполнена она только у ручных клиентов, и седьмая
                      колонка ради них сжала бы таблицу для всех остальных. */}
                  <span className="crm-table__name-text">
                    <span className="crm-table__name-label">{client.name}</span>
                    {client.company && (
                      <span className="crm-table__company">{client.company}</span>
                    )}
                  </span>
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
                <ClientCard client={client} onSave={(patch) => onSave(client, patch)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClientsList;
