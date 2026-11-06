"use client";

import { useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';
import adminData from '../../../data/adminData';

const CrmModal = ({ title, onClose, busy, children }) => {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, busy]);

  useEffect(() => {
    cardRef.current?.querySelector('input, textarea, select, button')?.focus();
  }, []);

  return (
    <div
      className="crm-modal"
      ref={overlayRef}
      onMouseDown={(event) => {
        if (event.target === overlayRef.current && !busy) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="crm-modal__card" ref={cardRef}>
        <div className="crm-modal__head">
          <h3 className="crm-modal__title">{title}</h3>
          <button
            type="button"
            className="crm-modal__close"
            onClick={onClose}
            disabled={busy}
            aria-label={adminData.common.cancel}
          >
            <MdClose aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CrmModal;
