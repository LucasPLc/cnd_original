import React from 'react';
import { Plus, Search, FileDown } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';
import theme from '../theme';

const FilterActions = ({ onFilterChange, onAddClient }) => {
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
            flexDirection: 'column',
            gap: theme.spacing.lg,
        },
        topRow: {
            display: 'flex',
            gap: theme.spacing.md,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        bottomRow: {
            display: 'flex',
            gap: theme.spacing.md,
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        inputGroup: {
            position: 'relative',
            flexGrow: 1,
            minWidth: '200px',
        },
        input: {
            width: '100%',
            padding: `12px ${theme.spacing.sm} 12px 40px`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
        },
        select: {
            width: '100%',
            padding: `12px ${theme.spacing.sm}`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            background: 'white',
        },
        datePicker: {
            padding: `12px ${theme.spacing.sm}`,
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
                <div style={styles.topRow}>
                    <div style={styles.inputGroup}>
                        <Search size={20} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Filtrar por CNPJ ou Nome..."
                            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                            style={{...styles.input, paddingLeft: '40px'}}
                        />
                    </div>
                    <div style={styles.buttonContainer}>
                        <InteractiveButton onClick={() => alert('Exportar Excel')} variant="secondary">
                            <FileDown size={20} />
                            <span>Exportar Excel</span>
                        </InteractiveButton>
                        <InteractiveButton onClick={() => alert('Exportar PDF')} variant="secondary">
                            <FileDown size={20} />
                            <span>Exportar PDF</span>
                        </InteractiveButton>
                        <InteractiveButton onClick={onAddClient}>
                            <Plus size={20} />
                            <span>Cadastrar Consulta</span>
                        </InteractiveButton>
                    </div>
                </div>
                <div style={styles.bottomRow}>
                    <div style={{...styles.inputGroup, flexGrow: 0.5}}>
                        <select style={styles.select} onChange={(e) => onFilterChange('situacao', e.target.value)}>
                            <option value="">Situação da Certidão</option>
                            <option value="Negativa">Negativa</option>
                            <option value="Positiva com Efeitos de Negativa">Positiva com Efeitos de Negativa</option>
                            <option value="Pendente">Pendente</option>
                        </select>
                    </div>
                    <div style={{...styles.inputGroup, flexGrow: 0.5}}>
                        <select style={styles.select} onChange={(e) => onFilterChange('statusProcesso', e.target.value)}>
                            <option value="">Status do Processo</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Processando">Processando</option>
                            <option value="Erro na Consulta">Erro na Consulta</option>
                        </select>
                    </div>
                    <div style={{...styles.inputGroup, flexGrow: 1, display: 'flex', gap: theme.spacing.sm, alignItems: 'center'}}>
                        <input type="date" style={styles.datePicker} onChange={(e) => onFilterChange('dataInicio', e.target.value)} />
                        <span>-</span>
                        <input type="date" style={styles.datePicker} onChange={(e) => onFilterChange('dataFim', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterActions;
