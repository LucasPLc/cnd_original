import React, { useState } from 'react';
import apiClient from '../api';
import { Edit, Trash2, Download } from 'lucide-react';
import theme from '../theme';

const ClientsTable = ({ clients, onEdit, onDelete, loading, selectedClients, onSelectionChange }) => {
    const handleDownload = async (clientId, client) => {
        try {
            const response = await apiClient.get(`/cnd/resultado/${clientId}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const emissionDate = client.dataEmissao ? new Date(client.dataEmissao).toLocaleDateString('pt-BR').replace(/\//g, '-') : 'data';

            link.href = url;
            link.setAttribute('download', `CND_${client.cnpj}_${client.orgaoEmissor}_${emissionDate}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Erro ao baixar o PDF:", error);
            alert("Não foi possível baixar o PDF. Verifique se o arquivo existe.");
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectionChange(clients.map(c => c.id));
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            onSelectionChange([...selectedClients, id]);
        } else {
            onSelectionChange(selectedClients.filter(selectedId => selectedId !== id));
        }
    };

    const styles = {
        tableContainer: {
            background: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            overflow: 'auto',
        },
        table: {
            width: '100%',
            minWidth: '1000px',
            textAlign: 'left',
            borderCollapse: 'collapse',
        },
        th: {
            padding: theme.spacing.md,
            fontWeight: '600',
            color: theme.colors.primary,
            background: `rgba(53, 81, 138, 0.05)`,
            whiteSpace: 'nowrap',
        },
        td: {
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`,
            whiteSpace: 'nowrap',
        },
        actionButton: {
            background: 'transparent',
            border: 'none',
            padding: theme.spacing.xs,
            cursor: 'pointer',
            color: theme.colors.mutedForeground,
            transition: 'color 0.2s',
        },
        buttonDisabled: {
            cursor: 'not-allowed',
            opacity: 0.5,
        },
        statusBadge: (status) => ({
            padding: '4px 10px',
            fontSize: '0.8rem',
            fontWeight: 500,
            borderRadius: theme.borderRadius.full,
            display: 'inline-block',
            ...{
                'Concluído': { background: 'hsl(142.1, 76.2%, 90%)', color: 'hsl(142.1, 70.2%, 25%)' },
                'Erro': { background: 'hsl(0, 72.2%, 90%)', color: 'hsl(0, 70.2%, 25%)' },
                'Emissor indisponível': { background: 'hsl(48, 92%, 90%)', color: 'hsl(48, 90%, 25%)' },
            }[status]
        }),
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{...styles.th, width: '1%'}}>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedClients.length > 0 && selectedClients.length === clients.length}
                            />
                        </th>
                        <th style={styles.th} title="Nome do Contribuinte e CNPJ">Contribuinte</th>
                        <th style={styles.th} title="Órgão que emitiu a certidão">Órgão Emissor</th>
                        <th style={styles.th} title="Situação da certidão (ex: Regular)">Situação</th>
                        <th style={styles.th} title="Status do robô de consulta">Status Processamento</th>
                        <th style={styles.th} title="Data de emissão da CND">Emissão</th>
                        <th style={styles.th} title="Data de validade da CND">Validade</th>
                        <th style={styles.th} title="Data da última consulta realizada">Últ. Processamento</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="9" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando...</td></tr>
                    ) : (
                        clients.map(client => (
                            <tr key={client.id} className="hover-row" style={selectedClients.includes(client.id) ? {backgroundColor: 'rgba(53, 81, 138, 0.05)'} : {}}>
                                <td style={styles.td}>
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.includes(client.id)}
                                        onChange={(e) => handleSelectOne(e, client.id)}
                                    />
                                </td>
                                <td style={styles.td}>
                                    <div style={{fontWeight: 500}}>{client.nomeContribuinte || 'Nome não disponível'}</div>
                                    <div style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>{client.cnpj}</div>
                                </td>
                                <td style={styles.td}>{client.orgaoEmissor || 'N/A'}</td>
                                <td style={styles.td}>{client.situacaoCertidao || 'N/A'}</td>
                                <td style={styles.td}>
                                    {client.statusProcessamento &&
                                        <span style={styles.statusBadge(client.statusProcessamento)}>
                                            {client.statusProcessamento}
                                        </span>
                                    }
                                </td>
                                <td style={styles.td}>{formatDate(client.dataEmissao)}</td>
                                <td style={styles.td}>{formatDate(client.dataValidade)}</td>
                                <td style={styles.td}>{formatDate(client.dataProcessamento)}</td>
                                <td style={{...styles.td, textAlign: 'right'}}>
                                    <div style={{display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end'}}>
                                        <button
                                            onClick={() => handleDownload(client.id, client)}
                                            style={{...styles.actionButton, ...(!client.pdfDisponivel && styles.buttonDisabled)}}
                                            title={client.pdfDisponivel ? "Baixar PDF da certidão" : "PDF não disponível"}
                                            disabled={!client.pdfDisponivel}
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button onClick={() => onEdit(client)} style={styles.actionButton} title={`Editar cliente ${client.cnpj}`}><Edit size={18} /></button>
                                        <button onClick={() => onDelete([client.id])} style={{...styles.actionButton, color: theme.colors.destructive}} title={`Excluir cliente ${client.cnpj}`}><Trash2 size={18} /></button>
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
