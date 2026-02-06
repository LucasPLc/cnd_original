import React, { useState } from 'react';
import { Download } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { downloadBase64PDF } from '../util/download';
import { getOrgaoAbbreviation, getStatusStyle } from '../util/cnd';
import theme from '../theme';

const ResultsTable = ({ results, loading }) => {
    const [downloadingId, setDownloadingId] = useState(null);

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
        actionButton: {
            padding: '8px',
            borderRadius: theme.borderRadius.md,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: theme.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
        },
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const handleDownload = async (result) => {
        try {
            setDownloadingId(result.id);
            const response = await axios.get(`/api/resultados/${result.id}`);
            const fullResult = response.data;

            if (!fullResult.arquivo) {
                toast.error('Arquivo não encontrado para esta certidão.');
                return;
            }

            const cnpj = result.cliente?.cnpj?.replace(/\D/g, '') || '00000000000000';
            const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
            const data = result.dataEmissao || new Date().toISOString().split('T')[0];
            const fileName = `CND_${cnpj}_${orgao}_${data}.pdf`;

            downloadBase64PDF(fullResult.arquivo, fileName);
            toast.success('Download iniciado com sucesso!');
        } catch (error) {
            console.error('Erro ao baixar CND:', error);
            toast.error('Erro ao realizar o download da CND. Tente novamente mais tarde.');
        } finally {
            setDownloadingId(null);
        }
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
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="7" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando resultados...</td></tr>
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
                                        ...getStatusStyle(result.status),
                                    }}>
                                        {result.status || 'Pendente'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        style={{
                                            ...styles.actionButton,
                                            opacity: (result.hasArquivo && downloadingId !== result.id) ? 1 : 0.5,
                                            cursor: (result.hasArquivo && downloadingId !== result.id) ? 'pointer' : 'not-allowed',
                                            background: (result.hasArquivo && downloadingId !== result.id) ? 'transparent' : 'rgba(0,0,0,0.05)'
                                        }}
                                        onClick={() => handleDownload(result)}
                                        disabled={!result.hasArquivo || downloadingId === result.id}
                                        title={result.hasArquivo ? "Baixar PDF" : "PDF não disponível"}
                                    >
                                        <Download size={18} />
                                    </button>
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
