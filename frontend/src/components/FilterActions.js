import React, { useState } from 'react';
import { Plus, Search, SlidersHorizontal, FileDown } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';
import { exportToExcel, exportToPDF } from '../utils/export';
import theme from '../theme';

const FilterActions = ({ onFilterChange, onAddClient, filteredClients }) => {
    const [filters, setFilters] = useState({
        text: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

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
        },
        advancedFilters: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: theme.spacing.md,
            marginTop: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.border}`,
        },
        formControl: {
            display: 'flex',
            flexDirection: 'column',
        },
        label: {
            marginBottom: theme.spacing.xs,
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground,
        },
    };

    return (
        <div style={styles.card}>
            <div style={styles.container}>
                <div style={styles.inputGroup}>
                    <Search size={20} style={styles.searchIcon} />
                    <input
                        type="text"
                        name="text"
                        placeholder="Filtrar por CNPJ ou Nome..."
                        value={filters.text}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.buttonContainer}>
                    <InteractiveButton onClick={() => setShowAdvanced(!showAdvanced)} variant="secondary">
                        <SlidersHorizontal size={20} />
                        <span>Filtros</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={() => exportToExcel(filteredClients)} variant="secondary">
                        <FileDown size={20} />
                        <span>Excel</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={() => exportToPDF(filteredClients)} variant="secondary">
                        <FileDown size={20} />
                        <span>PDF</span>
                    </InteractiveButton>
                    <InteractiveButton onClick={onAddClient}>
                        <Plus size={20} />
                        <span>Cadastrar Cliente</span>
                    </InteractiveButton>
                </div>
            </div>

            {showAdvanced && (
                <div style={styles.advancedFilters}>
                    <div style={styles.formControl}>
                        <label htmlFor="status" style={styles.label}>Status do Processamento</label>
                        <select name="status" id="status" value={filters.status} onChange={handleInputChange} style={styles.input}>
                            <option value="">Todos</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Erro">Erro</option>
                            <option value="Emissor indisponível">Emissor Indisponível</option>
                        </select>
                    </div>
                    <div style={styles.formControl}>
                        <label htmlFor="startDate" style={styles.label}>Data de Início</label>
                        <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div style={styles.formControl}>
                        <label htmlFor="endDate" style={styles.label}>Data de Fim</label>
                        <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleInputChange} style={styles.input} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterActions;
