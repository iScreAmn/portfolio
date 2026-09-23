"use client";

import { useEffect, useState } from 'react';
import adminData from '../../../data/adminData';

const { crm } = adminData;

/**
 * Быстрый ответ — обычная ссылка, переписки внутри админки нет.
 * Email уходит в mailto, телефон — в tel; телеграм-ник (@name) ссылкой не
 * становится: набирать его некуда.
 */
export const contactHref = (method, value) => {
  const raw = (value || '').trim();
  if (!raw) return null;
  // Проверяем и форму адреса: телеграм-ник тоже начинается с @, но mailto из
  // него делать нельзя.
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
  if (method === 'Email' || looksLikeEmail) return `mailto:${raw}`;

  // Телефон опознаём по количеству цифр, а не по способу связи: в поле
  // телеграма одинаково часто лежит и номер, и @ник.
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 10 ? `tel:${raw.replace(/[^\d+]/g, '')}` : null;
};

/** Ответы калькулятора приходят произвольным объектом — печатаем как есть. */
const renderPayloadValue = (value) =>
  Array.isArray(value) ? value.join(', ') : String(value ?? '—');

const ClientCard = ({ client, onSaveNote }) => {
  const [note, setNote] = useState(client.note || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  /**
   * Сбрасываем поле только при переключении на другого клиента.
   *
   * Следить ещё и за client.note нельзя: сохранение обновляет запись в
   * родителе, эффект отрабатывал бы сразу после успешного save и стирал
   * «Заметка сохранена» раньше, чем её успевали прочитать.
   */
  useEffect(() => {
    setNote(client.note || '');
    setMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await onSaveNote(note);
      setMessage({ type: 'ok', text: crm.noteSaved });
    } catch (err) {
      setMessage({ type: 'err', text: err?.message || crm.noteFailed });
    } finally {
      setSaving(false);
    }
  };

  const payloadEntries = client.payload ? Object.entries(client.payload) : [];

  return (
    <div className="crm-card">
      <div className="crm-card__col">
        <h4 className="crm-card__label">{crm.messageLabel}</h4>
        <p className="crm-card__message">{client.message || crm.noMessage}</p>

        {payloadEntries.length > 0 && (
          <>
            <h4 className="crm-card__label">{crm.payloadLabel}</h4>
            <ul className="crm-card__payload">
              {payloadEntries.map(([key, value]) => (
                <li key={key}>
                  <span className="crm-card__payload-key">{key}</span>
                  <span>{renderPayloadValue(value)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="crm-card__col">
        <h4 className="crm-card__label">{crm.noteLabel}</h4>
        <p className="crm-card__hint">{crm.noteHint}</p>
        <textarea
          className="crm-card__note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={crm.notePlaceholder}
          rows={5}
        />
        <div className="crm-card__note-row">
          <button
            type="button"
            className="crm-btn crm-btn--primary"
            onClick={save}
            disabled={saving || note === (client.note || '')}
          >
            {saving ? crm.noteSaving : crm.noteSave}
          </button>
          {message && (
            <span className={`crm-card__msg crm-card__msg--${message.type}`}>
              {message.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
