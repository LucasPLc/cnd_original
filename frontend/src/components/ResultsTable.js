import React from 'react';
import theme from '../theme';

const ResultsTable = ({ results, loading }) => {
    const styles = {
        tableContainer: {
            background: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            overflow: 'hidden',
            marginTop: theme.spacing.lg,
        },
        table: {
            width: '100%',
            textAlign: 'left',
            borderCollapse: 'collapse',
        },
        th: {
            padding: theme.spacing.md,
            fontWeight: '600',
            color: theme.colors.primary,
            background: `rgba(53, 81, 138, 0.05)`,
        },
        td: {
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`,
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: theme.borderRadius.full,
            background: `rgba(53, 81, 138, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: theme.colors.primary,
            flexShrink: 0,
        },
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Cliente</th>
                        <th style={styles.th}>Situação</th>
                        <th style={styles.th}>Órgão Emissor</th>
                        <th style={styles.th}>Data de Emissão</th>
                        <th style={styles.th}>Data de Validade</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando resultados...</td></tr>
                    ) : (
                        results.map(result => (
                            <tr key={result.id}>
                                <td style={{...styles.td, display: 'flex', alignItems: 'center', gap: theme.spacing.md}}>
                                    <div style={styles.avatar}>
                                        {(result.cliente?.nomeEmpresa || result.cliente?.cnpj).charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{fontWeight: 500}}>{result.cliente?.nomeEmpresa || 'N/A'}</div>
                                        <div style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>{result.cliente?.cnpj}</div>
                                    </div>
                                </td>
                                <td style={styles.td}>{result.situacao || 'N/A'}</td>
                                <td style={styles.td}>{result.orgaoEmissor || 'N/A'}</td>
                                <td style={styles.td}>{formatDate(result.dataEmissao)}</td>
                                <td style={styles.td}>{formatDate(result.dataValidade)}</td>
                                <td style={styles.td}>
                                     <span style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        borderRadius: theme.borderRadius.full,
                                        background: result.status === 'Concluído' ? 'hsl(142.1, 76.2%, 80%)' : 'hsl(35, 92%, 80%)',
                                        color: result.status === 'Concluído' ? 'hsl(142.1, 70.2%, 25%)' : 'hsl(35, 92%, 25%)',
                                    }}>
                                        {result.status || 'Pendente'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
