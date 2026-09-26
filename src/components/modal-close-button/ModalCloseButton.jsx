"use client";

import { motion } from "motion/react";
import "./ModalCloseButton.css";

/** Общий крестик для модалок сайта: появляется с поворотом, на hover доворачивается. */
const ModalCloseButton = ({ onClick, label, disabled = false, className = "" }) => (
  <motion.button
    type="button"
    className={`modal-close ${className}`.trim()}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
    animate={{ opacity: 1, rotate: 0, scale: 1 }}
    whileHover={disabled ? undefined : { rotate: 90, scale: 1.08 }}
    whileTap={disabled ? undefined : { scale: 0.9 }}
    transition={{ type: "spring", stiffness: 300, damping: 18 }}
  >
    <span aria-hidden="true">✕</span>
  </motion.button>
);

export default ModalCloseButton;
