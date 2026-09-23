"use client";

import { useState } from 'react';
import CrmModal from '../crm/CrmModal';
import { resizeImage, ImageTooLargeError } from '../../../utils/resizeImage';
import adminData from '../../../data/adminData';

const text = adminData.overview.reviews;

const TEXT_FIELDS = ['name', 'company', 'text'];
const FIELDS = [...TEXT_FIELDS, 'photo', 'logo'];

const toForm = (review) => ({
  name: review.name || '',
  company: review.company || '',
  text: review.text || '',
  photo: review.photo || null,
  logo: review.logo || null,
});

const ImagePicker = ({ id, label, value, round, disabled, onPick, onRemove }) => (
  <div className="review-edit__image">
    <span className="crm-field__label">{label}</span>
    <div className="review-edit__image-row">
      <div className={`review-edit__preview${round ? ' is-round' : ''}`}>
        {value && <img src={value} alt="" />}
      </div>
      <div className="review-edit__image-actions">
        <label htmlFor={id} className={`crm-btn${disabled ? ' is-disabled' : ''}`}>
          {value ? text.replace : text.upload}
        </label>
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="review-edit__file"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) onPick(file);
          }}
        />
        {value && (
          <button type="button" className="crm-btn" onClick={onRemove} disabled={disabled}>
            {text.remove}
          </button>
        )}
      </div>
    </div>
  </div>
);

const ReviewEditModal = ({ review, onClose, onSave }) => {
  const [form, setForm] = useState(() => toForm(review));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saved = toForm(review);
  const changed = FIELDS.filter((key) => form[key] !== saved[key]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const pickImage = async (key, file) => {
    setError(null);
    try {
      update(key, await resizeImage(file, { crop: key === 'photo' }));
    } catch (err) {
      setError(err instanceof ImageTooLargeError ? text.imageTooLarge : text.imageFailed);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(text.nameRequired);
      return;
    }
    if (!form.text.trim()) {
      setError(text.textRequired);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSave(
        Object.fromEntries(
          changed.map((key) => [key, TEXT_FIELDS.includes(key) ? form[key].trim() : form[key]]),
        ),
      );
      onClose();
    } catch (err) {
      setError(err?.message || text.saveFailed);
      setSaving(false);
    }
  };

  return (
    <CrmModal title={text.editTitle} onClose={onClose} busy={saving}>
      <form className="crm-modal__body" onSubmit={submit}>
        <label className="crm-field">
          <span className="crm-field__label">{text.nameLabel}</span>
          <input
            className="crm-input"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder={text.namePlaceholder}
            maxLength={100}
          />
        </label>

        <label className="crm-field">
          <span className="crm-field__label">{text.companyLabel}</span>
          <input
            className="crm-input"
            value={form.company}
            onChange={(event) => update('company', event.target.value)}
            placeholder={text.companyPlaceholder}
            maxLength={120}
          />
        </label>

        <div className="review-edit__images">
          <ImagePicker
            id={`review-${review.id}-photo`}
            label={text.photoLabel}
            value={form.photo}
            round
            disabled={saving}
            onPick={(file) => pickImage('photo', file)}
            onRemove={() => update('photo', null)}
          />
          <ImagePicker
            id={`review-${review.id}-logo`}
            label={text.logoLabel}
            value={form.logo}
            disabled={saving}
            onPick={(file) => pickImage('logo', file)}
            onRemove={() => update('logo', null)}
          />
        </div>

        <label className="crm-field">
          <span className="crm-field__label">{text.textLabel}</span>
          <textarea
            className="crm-input crm-input--area"
            value={form.text}
            onChange={(event) => update('text', event.target.value)}
            rows={5}
            maxLength={1000}
          />
        </label>

        {error && <p className="crm-modal__err">{error}</p>}

        <div className="crm-modal__actions">
          <button type="button" className="crm-btn" onClick={onClose} disabled={saving}>
            {adminData.common.cancel}
          </button>
          <button
            type="submit"
            className="crm-btn crm-btn--primary"
            disabled={saving || changed.length === 0}
          >
            {saving ? text.saving : text.save}
          </button>
        </div>
      </form>
    </CrmModal>
  );
};

export default ReviewEditModal;
