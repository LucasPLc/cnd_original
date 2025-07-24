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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: theme.spacing.md,
            alignItems: 'center',
        },
        inputGroup: {
            position: 'relative',
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
            justifyContent: 'flex-end',
        },
        '@media (max-width: 768px)': {
            container: {
                gridTemplateColumns: '1fr',
            },
            buttonContainer: {
                justifyContent: 'center',
            }
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.container}>
                <div style={styles.inputGroup}>
                    <Search size={20} style={styles.searchIcon} />
                    <input
                        type="text"
                        name="cnpj"
                        placeholder="Filtrar por CNPJ..."
                        onChange={onFilterChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Filtrar por Nome..."
                        onChange={onFilterChange}
                        style={{...styles.input, paddingLeft: theme.spacing.sm}}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <select name="situacao" onChange={onFilterChange} style={styles.input}>
                        <option value="">Situação da Certidão</option>
                        <option value="Negativa">Negativa</option>
                        <option value="Positiva com Efeitos de Negativa">Positiva com Efeitos de Negativa</option>
                        <option value="Regular">Regular</option>
                    </select>
                </div>
                <div style={styles.inputGroup}>
                    <select name="status" onChange={onFilterChange} style={styles.input}>
                        <option value="">Status do Processamento</option>
                        <option value="concluido">Concluído</option>
                        <option value="pendente">Pendente</option>
                        <option value="erro">Erro</option>
                    </select>
                </div>
                <div style={{...styles.inputGroup, gridColumn: 'span 2'}}>
                    <input type="date" name="dataInicio" onChange={onFilterChange} style={styles.input} />
                    <input type="date" name="dataFim" onChange={onFilterChange} style={styles.input} />
                </div>
                <div style={{...styles.buttonContainer, gridColumn: 'span 2'}}>
                    <InteractiveButton onClick={onAddClient}>
                        <Plus size={20} />
                        <span>Cadastrar Consulta</span>
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
