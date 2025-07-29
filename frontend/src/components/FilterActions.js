import React from 'react';
import { Plus, Search, FileDown, FileUp } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';
import theme from '../theme';

const FilterActions = ({
    onSearchChange,
    onStatusChange,
    onAddClient,
    onExportExcel,
    onExportPdf,
    onOpenImportModal,
    searchValue,
    statusValue
}) => {
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
        },
        inputGroup: {
            display: 'flex',
            gap: theme.spacing.md,
            flexGrow: 1,
            flexWrap: 'wrap',
        },
        searchInputContainer: {
            position: 'relative',
            flexGrow: 1,
            minWidth: '250px',
        },
        input: {
            width: '100%',
            padding: `12px ${theme.spacing.sm} 12px 40px`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            height: '48px',
            boxSizing: 'border-box',
        },
        select: {
            padding: `12px ${theme.spacing.sm}`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            height: '48px',
            minWidth: '180px',
            background: 'white',
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
            marginLeft: 'auto',
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.container}>
                <div style={styles.inputGroup}>
                    <div style={styles.searchInputContainer}>
                        <Search size={20} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Filtrar por CNPJ..."
                            value={searchValue}
                            onChange={onSearchChange}
                            style={styles.input}
                        />
                    </div>
                    <select
                        value={statusValue}
                        onChange={onStatusChange}
                        style={styles.select}
                    >
                        <option value="ALL">Todos os Status</option>
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                    </select>
                </div>

                <div style={styles.buttonContainer}>
                     <InteractiveButton onClick={onOpenImportModal} variant="secondary">
                        <FileUp size={20} />
                        <span>Importar do SAAM</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={onExportExcel} variant="secondary">
                        <FileDown size={20} />
                        <span>Excel</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={onExportPdf} variant="secondary">
                        <FileDown size={20} />
                        <span>PDF</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={onAddClient}>
                        <Plus size={20} />
                        <span>Cadastrar</span>
                    </InteractiveButton>
                </div>
            </div>
        </div>
    );
};

export default FilterActions;
