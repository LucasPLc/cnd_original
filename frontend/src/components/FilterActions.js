import React from 'react';
import { Plus, Upload, FileDown, List, ArrowLeft } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';
import theme from '../theme';

const FilterActions = ({
    onSearchChange,
    onStatusChange,
    searchValue,
    statusValue,
    onAddClient,
    onExportExcel,
    onExportPdf,
    onOpenImportModal,
    onToggleView,
    viewMode,
}) => {
    const styles = {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing.md,
            padding: `${theme.spacing.lg} 0`,
            borderBottom: `1px solid ${theme.colors.border}`,
            marginBottom: theme.spacing.lg,
        },
        input: {
            flexGrow: 1,
            minWidth: '200px',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
        },
    };

    return (
        <div style={styles.container}>
            {viewMode === 'clients' ? (
                <>
                    <input
                        type="text"
                        placeholder="Pesquisar por CNPJ..."
                        value={searchValue}
                        onChange={onSearchChange}
                        style={styles.input}
                    />
                    <select value={statusValue} onChange={onStatusChange} style={styles.input}>
                        <option value="ALL">Todos os Status</option>
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                    </select>
                    <InteractiveButton onClick={onAddClient}><Plus size={16} /> Cadastrar</InteractiveButton>
                    <InteractiveButton onClick={onOpenImportModal} variant="secondary"><Upload size={16} /> Importar do SAAM</InteractiveButton>
                    <InteractiveButton onClick={onExportExcel} variant="secondary"><FileDown size={16} /> Exportar Excel</InteractiveButton>
                    <InteractiveButton onClick={onExportPdf} variant="secondary"><FileDown size={16} /> Exportar PDF</InteractiveButton>
                    <InteractiveButton onClick={() => onToggleView('results')} variant="outline"><List size={16} /> Listar Resultados</InteractiveButton>
                </>
            ) : (
                <InteractiveButton onClick={() => onToggleView('clients')} variant="outline"><ArrowLeft size={16} /> Voltar para Clientes</InteractiveButton>
            )}
        </div>
    );
};

export default FilterActions;