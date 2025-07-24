import React from 'react';
import { Edit, Trash2, Download } from 'lucide-react';
import theme from '../theme';

const ClientsTable = ({ clients, onEdit, onDelete, loading }) => {
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
        actionButton: {
            background: 'transparent',
            border: 'none',
            padding: theme.spacing.xs,
            cursor: 'pointer',
            color: theme.colors.mutedForeground,
            transition: 'color 0.2s',
        },
        tag: {
            padding: '4px 8px',
            borderRadius: theme.borderRadius.full,
            fontWeight: 500,
            fontSize: '0.75rem',
        },
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Concluído':
                return { background: '#e3fcef', color: '#006644' }; // Verde
            case 'Pendente':
            case 'Processando':
                return { background: '#fffae6', color: '#996f00' }; // Amarelo
            case 'Erro na Consulta':
            case 'Site Emissor Indisponível':
            case 'Falha na Extração':
                return { background: '#ffebe6', color: '#bf2600' }; // Vermelho
            case 'Agendado':
                return { background: '#deebff', color: '#0052cc' }; // Azul
            default:
                return { background: '#f0f0f0', color: '#333' };
        }
    };

    const isDateExpired = (dateStr) => {
        if (!dateStr || dateStr === 'N/A') return false;
        const [day, month, year] = dateStr.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        return date < new Date();
    };

    // Mock data for demonstration purposes
    const mockClients = [
        { id: 1, cnpj: '12.345.678/0001-99', nomeCliente: 'Empresa A', orgao: 'RFB', situacaoCertidao: 'Negativa', dataEmissao: '01/07/2024', dataValidade: '30/12/2024', statusProcesso: 'Concluído' },
        { id: 2, cnpj: '98.765.432/0001-11', nomeCliente: 'Empresa B', orgao: 'SEFAZ-SP', situacaoCertidao: 'Positiva com Efeitos de Negativa', dataEmissao: '15/06/2024', dataValidade: '15/07/2024', statusProcesso: 'Pendente' },
        { id: 3, cnpj: '55.555.555/0001-55', nomeCliente: 'Empresa C', orgao: 'Pref. São Paulo', situacaoCertidao: 'Pendente', dataEmissao: 'N/A', dataValidade: 'N/A', statusProcesso: 'Erro na Consulta' },
    ];

    const displayClients = clients.length > 0 ? clients : mockClients;

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Cliente</th>
                        <th style={styles.th}>Órgão</th>
                        <th style={styles.th}>Situação da Certidão</th>
                        <th style={styles.th}>Data de Emissão</th>
                        <th style={styles.th}>Data de Validade</th>
                        <th style={styles.th}>Status do Processo</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="7" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando...</td></tr>
                    ) : (
                        displayClients.map(client => {
                            const isDownloadDisabled = client.statusProcesso !== 'Concluído';
                            const downloadTooltip = isDownloadDisabled ? `Download indisponível: ${client.statusProcesso}` : 'Download PDF';

                            return (
                                <tr key={client.id} className="hover-row">
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 500}}>{client.nomeCliente}</div>
                                        <div style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>{client.cnpj}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.tag, background: '#deebff', color: '#0052cc' }}>{client.orgao}</span>
                                    </td>
                                    <td style={styles.td}>{client.situacaoCertidao}</td>
                                    <td style={styles.td}>{client.dataEmissao}</td>
                                    <td style={{ ...styles.td, color: isDateExpired(client.dataValidade) ? theme.colors.destructive : 'inherit' }}>
                                        {client.dataValidade}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ ...styles.tag, ...getStatusStyle(client.statusProcesso) }}>{client.statusProcesso}</span>
                                    </td>
                                    <td style={{...styles.td, textAlign: 'right'}}>
                                        <div style={{display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end'}}>
                                            <button style={{...styles.actionButton, cursor: isDownloadDisabled ? 'not-allowed' : 'pointer', opacity: isDownloadDisabled ? 0.5 : 1}} title={downloadTooltip} disabled={isDownloadDisabled}>
                                                <Download size={18} />
                                            </button>
                                            <button onClick={() => onEdit(client)} style={styles.actionButton} title={`Editar ${client.cnpj}`}><Edit size={18} /></button>
                                            <button onClick={() => onDelete(client)} style={{...styles.actionButton, color: theme.colors.destructive}} title={`Excluir ${client.cnpj}`}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;
