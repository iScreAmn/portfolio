"use client";

import { useCallback, useEffect, useState } from 'react';
import ClientsList from './ClientsList';
import AddClientModal from './AddClientModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { getClients, createClient, updateClient, deleteClient } from '../../../lib/crmAdmin';
import adminData from '../../../data/adminData';
import './Crm.css';

const { common, crm } = adminData;
const AddIcon = crm.addIcon;

/**
 * Список клиентов, фильтр по статусу и три действия над записью: сменить
 * статус, поправить заметку, удалить. Ничего похожего на воронку сделок здесь
 * нет и не планируется — админ один, суммы и ответственные не нужны.
 */
const CrmContainer = () => {
  const [clients, setClients] = useState([]);
  const [counts, setCounts] = useState({});
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  /**
   * Два разных состояния загрузки вместо одного.
   *
   * `loaded` взводится после первого ответа и больше не сбрасывается: при
   * смене фильтра список остаётся на экране и лишь притухает, иначе таблица
   * схлопывалась бы в строчку «Загрузка…» и страница дёргалась на каждый клик
   * по фильтру.
   */
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [expandedId, setExpandedId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getClients({ status: status || undefined });
      setClients(data?.items || []);
      setCounts(data?.counts || {});
      setTotal(Number(data?.total) || 0);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError(err?.message || crm.loadFailed);
    } finally {
      setLoaded(true);
      setRefreshing(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Статус правим на месте, без перезагрузки списка: полный refetch при
   * активном фильтре выдернул бы строку из-под курсора прямо в момент клика.
   * Счётчики при этом разъезжаются, поэтому их поправляем вручную.
   */
  const changeStatus = async (client, next) => {
    if (next === client.status) return;

    setBusyId(client.id);
    try {
      const updated = await updateClient(client.id, { status: next });
      setClients((prev) => prev.map((row) => (row.id === client.id ? updated : row)));
      setCounts((prev) => ({
        ...prev,
        [client.status]: Math.max(0, (prev[client.status] || 0) - 1),
        [next]: (prev[next] || 0) + 1,
      }));
    } catch (err) {
      setError(err?.message || crm.statusUpdateFailed);
    } finally {
      setBusyId(null);
    }
  };

  // Ошибку отдаём наверх: её показывает сама карточка, рядом с полем.
  const saveNote = async (client, note) => {
    const updated = await updateClient(client.id, { note });
    setClients((prev) => prev.map((row) => (row.id === client.id ? updated : row)));
  };

  const removeClient = async (client) => {
    await deleteClient(client.id);
    setClients((prev) => prev.filter((row) => row.id !== client.id));
    setTotal((prev) => Math.max(0, prev - 1));
    setCounts((prev) => ({
      ...prev,
      [client.status]: Math.max(0, (prev[client.status] || 0) - 1),
    }));
    if (expandedId === client.id) setExpandedId(null);
  };

  // Новый клиент приходит со статусом new и может не подойти под фильтр —
  // проще перезагрузить список, чем угадывать, попадает он в выборку или нет.
  const addClient = async (form) => {
    await createClient(form);
    await load();
  };

  // «Все» считаем суммой counts, а не по total: total — размер текущей
  // (отфильтрованной) выборки и при активном фильтре показал бы не то.
  const allCount = crm.statusOrder.reduce((sum, key) => sum + (counts[key] || 0), 0);

  const filters = [
    { value: '', label: crm.filterAll, count: allCount },
    ...crm.statusOrder.map((value) => ({
      value,
      label: crm.statusLabels[value],
      count: counts[value] ?? 0,
    })),
  ];

  return (
    <div className="crm">
      <div className="crm__header">
        <h2 className="crm__title">{crm.title}</h2>
        <button type="button" className="crm-btn crm-btn--primary" onClick={() => setAdding(true)}>
          <AddIcon aria-hidden /> {crm.addButton}
        </button>
      </div>

      <div className="crm__filters">
        {filters.map((filter) => (
          <button
            key={filter.value || 'all'}
            type="button"
            className={`crm-filter ${status === filter.value ? 'is-active' : ''}`}
            // Раскрытая карточка относится к строке, которой под новым
            // фильтром может не быть — закрываем, чтобы не всплыла обратно.
            onClick={() => {
              setStatus(filter.value);
              setExpandedId(null);
            }}
          >
            {filter.label}
            <span className="crm-filter__count">{filter.count}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="crm__error">
          <span>
            {common.errorPrefix} {error}
          </span>
          <button type="button" className="crm-btn" onClick={load}>
            {common.retry}
          </button>
        </div>
      )}

      <div className={`crm__body ${refreshing ? 'is-refreshing' : ''}`}>
        {!loaded ? (
          <p className="crm__placeholder">{crm.loading}</p>
        ) : clients.length === 0 ? (
          <p className="crm__placeholder">{status ? crm.emptyFiltered : crm.empty}</p>
        ) : (
          <>
            <p className="crm__total">
              {crm.totalLabel} {total}
            </p>
            <ClientsList
              clients={clients}
              expandedId={expandedId}
              busyId={busyId}
              onToggle={(id) => setExpandedId((prev) => (prev === id ? null : id))}
              onStatusChange={changeStatus}
              onSaveNote={saveNote}
              onDelete={setPendingDelete}
            />
          </>
        )}
      </div>

      {adding && <AddClientModal onClose={() => setAdding(false)} onCreate={addClient} />}

      {pendingDelete && (
        <ConfirmDeleteModal
          client={pendingDelete}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => removeClient(pendingDelete)}
        />
      )}
    </div>
  );
};

export default CrmContainer;
