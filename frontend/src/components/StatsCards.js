import React from 'react';
import { Users, Search, CheckSquare } from 'lucide-react';
import theme from '../theme';

const StatCard = ({ icon, label, value }) => {
    const styles = {
        statCard: {
            background: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
        },
        label: {
            fontSize: '0.875rem',
            color: theme.colors.mutedForeground
        },
        value: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: theme.colors.primary
        },
        icon: {
            color: theme.colors.primary
        }
    };

    return (
        <div style={styles.statCard}>
            {icon}
            <div>
                <p style={styles.label}>{label}</p>
                <p style={styles.value}>{value}</p>
            </div>
        </div>
    );
};

const StatsCards = ({ total, filtered, selected }) => {
    const styles = {
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
        }
    };

    return (
        <div style={styles.grid}>
            <StatCard icon={<Users size={32} style={styles.icon} />} label="Total de Clientes" value={total} />
            <StatCard icon={<Search size={32} style={styles.icon} />} label="Clientes Filtrados" value={filtered} />
            <StatCard icon={<CheckSquare size={32} style={styles.icon} />} label="Selecionados" value={selected} />
        </div>
    );
};

export default StatsCards;
