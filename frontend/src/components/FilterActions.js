import React from 'react';
import { Plus, Search } from 'lucide-react';
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
            gap: theme.spacing.md,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        inputGroup: {
            position: 'relative',
            flexGrow: 1, // Ocupa o espaço disponível
            minWidth: '250px', // Largura mínima antes de quebrar a linha
        },
        input: {
            width: '100%',
            padding: `12px ${theme.spacing.sm} 12px 40px`, // Padding ajustado para o botão
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
            flexShrink: 0, // Impede que o botão seja espremido
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
                        <span>Cadastrar Novo Cliente</span>
                    </InteractiveButton>
                </div>
            </div>
        </div>
    );
};

export default FilterActions;
