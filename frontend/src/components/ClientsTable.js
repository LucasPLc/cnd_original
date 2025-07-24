import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import theme from '../theme';

const ClientsTable = ({ clients, onEdit, onDelete, loading, onClientSelect, selectedClientId }) => {
    const styles = {
        tableContainer: {
            background: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            overflow: 'hidden',
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
        actionButton: {
            background: 'transparent',
            border: 'none',
            padding: theme.spacing.xs,
            cursor: 'pointer',
            color: theme.colors.mutedForeground,
            transition: 'color 0.2s',
        },
        tr: {
            cursor: 'pointer',
        },
        selectedTr: {
            backgroundColor: 'hsl(210, 40%, 98%)',
        }
    };

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Cliente</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Periodicidade</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="4" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando...</td></tr>
                    ) : (
                        clients.map(client => (
                            <tr
                                key={client.id}
                                className="hover-row"
                                style={{
                                    ...styles.tr,
                                    ...(selectedClientId === client.id ? styles.selectedTr : {})
                                }}
                                onClick={() => onClientSelect(client)}
                            >
                                <td style={{...styles.td, display: 'flex', alignItems: 'center', gap: theme.spacing.md}}>
                                    <div style={styles.avatar}>
                                        {client.cnpj.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{fontWeight: 500}}>{`Cliente ${client.cnpj.substring(0, 2)}`}</div>
                                        <div style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>{client.cnpj}</div>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <span style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        borderRadius: theme.borderRadius.full,
                                        background: client.statusCliente === 'ATIVO' ? 'hsl(142.1, 76.2%, 80%)' : 'hsl(0, 72.2%, 80%)',
                                        color: client.statusCliente === 'ATIVO' ? 'hsl(142.1, 70.2%, 25%)' : 'hsl(0, 70.2%, 25%)',
                                    }}>
                                        {client.statusCliente}
                                    </span>
                                </td>
                                <td style={styles.td}>{client.periodicidade} dias</td>
                                <td style={{...styles.td, textAlign: 'right'}}>
                                    <div style={{display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end'}}>
                                            <button onClick={(e) => { e.stopPropagation(); onEdit(client); }} style={styles.actionButton} title={`Editar ${client.cnpj}`}><Edit size={18} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); onDelete(client); }} style={{...styles.actionButton, color: theme.colors.destructive}} title={`Excluir ${client.cnpj}`}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;
