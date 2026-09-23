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

/** Поля, которые карточка умеет править, — в том же виде, в каком их ждёт PATCH. */
const toForm = (client) => ({
  name: client.name || '',
  company: client.company || '',
  contactValue: client.contactValue || '',
  message: client.message || '',
  note: client.note || '',
});

/**
 * Раскрытая строка списка: правит контакт, компанию, задачу и заметку одной
 * формой. Статус сюда намеренно не вынесен — он меняется бейджем прямо в
 * строке, не раскрывая карточку.
 */
const ClientCard = ({ client, onSave }) => {
  const [form, setForm] = useState(() => toForm(client));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  /**
   * Сбрасываем форму только при переключении на другого клиента.
   *
   * Следить за самими полями нельзя: сохранение обновляет запись в родителе,
   * эффект отработал бы сразу после успешного save и стёр «Изменения
   * сохранены» раньше, чем их успевали прочитать.
   */
  useEffect(() => {
    setForm(toForm(client));
    setMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saved = toForm(client);
  const dirty = Object.keys(saved).some((key) => form[key] !== saved[key]);

  const submit = async () => {
    if (!form.name.trim()) {
      setMessage({ type: 'err', text: crm.nameRequired });
      return;
    }
    if (!form.contactValue.trim()) {
      setMessage({ type: 'err', text: crm.contactRequired });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await onSave(form);
      setMessage({ type: 'ok', text: crm.cardSaved });
    } catch (err) {
      setMessage({ type: 'err', text: err?.message || crm.cardFailed });
    } finally {
      setSaving(false);
    }
  };

  const payloadEntries = client.payload ? Object.entries(client.payload) : [];

  return (
    <div className="crm-card">
      <div className="crm-card__col">
        <h4 className="crm-card__label">{crm.editTitle}</h4>

        <label className="crm-card__field">
          <span className="crm-card__field-label">{crm.nameLabel}</span>
          <input
            className="crm-card__input"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder={crm.namePlaceholder}
          />
        </label>

        <label className="crm-card__field">
          <span className="crm-card__field-label">{crm.contactLabel}</span>
          <input
            className="crm-card__input"
            value={form.contactValue}
            onChange={(event) => update('contactValue', event.target.value)}
            placeholder={crm.contactPlaceholder}
          />
        </label>

        <label className="crm-card__field">
          <span className="crm-card__field-label">{crm.companyLabel}</span>
          <input
            className="crm-card__input"
            value={form.company}
            onChange={(event) => update('company', event.target.value)}
            placeholder={crm.companyPlaceholder}
          />
        </label>

        <label className="crm-card__field">
          <span className="crm-card__field-label">{crm.messageLabel}</span>
          <textarea
            className="crm-card__input crm-card__input--area"
            value={form.message}
            onChange={(event) => update('message', event.target.value)}
            placeholder={crm.messagePlaceholder}
            rows={4}
          />
        </label>

        {/* Ответы калькулятора пришли с сайта и не правятся: это снимок того,
            что человек выбрал в форме. */}
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
          className="crm-card__input crm-card__note"
          value={form.note}
          onChange={(event) => update('note', event.target.value)}
          placeholder={crm.notePlaceholder}
          rows={6}
        />

        <div className="crm-card__actions">
          <button
            type="button"
            className="crm-btn crm-btn--primary"
            onClick={submit}
            disabled={saving || !dirty}
          >
            {saving ? crm.cardSaving : crm.cardSave}
          </button>

          {dirty && !saving && (
            <button
              type="button"
              className="crm-btn"
              onClick={() => {
                setForm(toForm(client));
                setMessage(null);
              }}
            >
              {crm.cardReset}
            </button>
          )}

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
