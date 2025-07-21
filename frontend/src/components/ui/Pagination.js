import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import theme from '../../theme';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginTop: theme.spacing.lg,
            padding: `${theme.spacing.sm} 0`,
        },
        button: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.sm,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            background: theme.colors.background,
            cursor: 'pointer',
        },
        buttonDisabled: {
            cursor: 'not-allowed',
            opacity: 0.6,
        },
        pageInfo: {
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground,
        },
    };

    return (
        <div style={styles.container}>
            <span style={styles.pageInfo}>
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{...styles.button, ...(currentPage <= 1 && styles.buttonDisabled)}}
            >
                <ChevronLeft size={18} />
            </button>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{...styles.button, ...(currentPage >= totalPages && styles.buttonDisabled)}}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
