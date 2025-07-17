import React from 'react';
import { X } from 'lucide-react';
import theme from '../../theme';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const styles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.lg,
      width: '90%',
      maxWidth: '500px',
      margin: theme.spacing.md,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: theme.colors.primary,
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: theme.colors.mutedForeground,
    },
    content: {
      padding: theme.spacing.lg,
    }
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
