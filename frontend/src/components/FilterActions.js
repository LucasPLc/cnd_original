import React from 'react';
import { Plus, Search, FileDown } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';
import theme from '../theme';

const FilterActions = ({ onFilterChange, onAddClient, onExportExcel, onExportPdf }) => {
    const styles = {
        card: {
            background: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            marginBottom: theme.spacing.xl,
        },
        container: {
            display: 'flex',
            gap: theme.spacing.md,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        inputGroup: {
            position: 'relative',
            flexGrow: 1,
            minWidth: '250px',
        },
        input: {
            width: '100%',
            padding: `12px ${theme.spacing.sm} 12px 40px`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
        },
        searchIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.colors.mutedForeground,
        },
        buttonContainer: {
            display: 'flex',
            gap: theme.spacing.md,
            flexShrink: 0,
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.container}>
                <div style={styles.inputGroup}>
                    <Search size={20} style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Filtrar por CNPJ..."
                        onChange={onFilterChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.buttonContainer}>
                    <InteractiveButton onClick={onAddClient}>
                        <Plus size={20} />
                        <span>Cadastrar</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={onExportExcel} variant="secondary">
                        <FileDown size={20} />
                        <span>Excel</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={onExportPdf} variant="secondary">
                        <FileDown size={20} />
                        <span>PDF</span>
                    </InteractiveButton>
                </div>
            </div>
        </div>
    );
};

export default FilterActions;
