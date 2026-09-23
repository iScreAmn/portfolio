"use client";

import { useState } from 'react';
import CrmModal from './CrmModal';
import adminData from '../../../data/adminData';

const { crm } = adminData;
const text = crm.addModal;

/** Клиент, заведённый руками: бэкенд запишет его с source = 'manual'. */
const AddClientModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    contactMethod: text.methods[0],
    contactValue: '',
    message: '',
    note: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.contactValue.trim()) {
      setError(text.missingFields);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onCreate({
        ...form,
        name: form.name.trim(),
        company: form.company.trim(),
        contactValue: form.contactValue.trim(),
      });
      onClose();
    } catch (err) {
      setError(err?.message || text.failed);
      setSubmitting(false);
    }
  };

  return (
    <CrmModal title={text.title} onClose={onClose} busy={submitting}>
      <form className="crm-modal__body" onSubmit={submit}>
        <p className="crm-modal__hint">{text.hint}</p>

        <input
          className="crm-input"
          placeholder={text.namePlaceholder}
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
        />

        <input
          className="crm-input"
          placeholder={text.companyPlaceholder}
          value={form.company}
          onChange={(event) => update('company', event.target.value)}
        />

        <label className="crm-field">
          <span className="crm-field__label">{text.methodLabel}</span>
          <select
            className="crm-input"
            value={form.contactMethod}
            onChange={(event) => update('contactMethod', event.target.value)}
          >
            {text.methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <input
          className="crm-input"
          placeholder={text.contactPlaceholder}
          value={form.contactValue}
          onChange={(event) => update('contactValue', event.target.value)}
        />

        <textarea
          className="crm-input crm-input--area"
          placeholder={text.messagePlaceholder}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          rows={3}
        />

        <textarea
          className="crm-input crm-input--area"
          placeholder={text.notePlaceholder}
          value={form.note}
          onChange={(event) => update('note', event.target.value)}
          rows={2}
        />

        {error && <p className="crm-modal__err">{error}</p>}

        <div className="crm-modal__actions">
          <button
            type="button"
            className="crm-btn"
            onClick={onClose}
            disabled={submitting}
          >
            {adminData.common.cancel}
          </button>
          <button type="submit" className="crm-btn crm-btn--primary" disabled={submitting}>
            {submitting ? text.submitting : text.submit}
          </button>
        </div>
      </form>
    </CrmModal>
  );
};

export default AddClientModal;
