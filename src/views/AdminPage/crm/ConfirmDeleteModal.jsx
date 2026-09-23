"use client";

import { useState } from 'react';
import CrmModal from './CrmModal';
import adminData from '../../../data/adminData';

const { crm } = adminData;
const text = crm.deleteModal;

/**
 * Удаление в один клик из списка запрещено намеренно: подтверждение здесь —
 * единственная точка, где реально уходит DELETE.
 */
const ConfirmDeleteModal = ({ client, onClose, onConfirm }) => {
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err?.message || text.failed);
      setDeleting(false);
    }
  };

  return (
    <CrmModal title={text.title} onClose={onClose} busy={deleting}>
      <div className="crm-modal__body">
        <p className="crm-modal__hint">{text.text(client.name)}</p>

        {error && <p className="crm-modal__err">{error}</p>}

        <div className="crm-modal__actions">
          <button type="button" className="crm-btn" onClick={onClose} disabled={deleting}>
            {adminData.common.cancel}
          </button>
          <button
            type="button"
            className="crm-btn crm-btn--danger"
            onClick={confirm}
            disabled={deleting}
          >
            {deleting ? text.deleting : text.confirm}
          </button>
        </div>
      </div>
    </CrmModal>
  );
};

export default ConfirmDeleteModal;
