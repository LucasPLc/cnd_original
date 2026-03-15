import React, { useState } from 'react';
import theme from '../theme';
import { Download, Loader2 } from 'lucide-react';
import axios from 'axios';
import { showToast } from './ui/Toast';
import { downloadPdfFromBase64, generateCndFilename } from '../util/download';

const ResultsTable = ({ results, loading }) => {
    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownload = async (result) => {
        setDownloadingId(result.id);
        try {
            const response = await axios.get(`/api/resultados/${result.id}`);
            const { arquivo } = response.data;

            if (arquivo) {
                const filename = generateCndFilename(
                    result.cliente?.cnpj,
                    result.orgaoEmissor,
                    result.dataEmissao
                );
                downloadPdfFromBase64(arquivo, filename);
                showToast.success("Download iniciado!");
            } else {
                showToast.error("Arquivo não encontrado para este resultado.");
            }
        } catch (error) {
            console.error("Erro ao baixar CND:", error);
            showToast.error("Erro ao realizar o download do PDF.");
        } finally {
            setDownloadingId(null);
        }
    };

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
                                        background: result.status === 'Concluído' ? 'hsl(142.1, 76.2%, 80%)' : 'hsl(35, 92%, 80%)',
                                        color: result.status === 'Concluído' ? 'hsl(142.1, 70.2%, 25%)' : 'hsl(35, 92%, 25%)',
                                    }}>
                                        {result.status || 'Pendente'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleDownload(result)}
                                        disabled={!result.hasArquivo || downloadingId === result.id}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: result.hasArquivo ? 'pointer' : 'not-allowed',
                                            color: result.hasArquivo ? theme.colors.primary : theme.colors.mutedForeground,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            opacity: result.hasArquivo ? 1 : 0.5,
                                            padding: '4px',
                                            borderRadius: '4px',
                                            transition: 'background 0.2s',
                                        }}
                                        title={result.hasArquivo ? "Baixar PDF" : "Arquivo indisponível"}
                                        onMouseEnter={(e) => result.hasArquivo && (e.currentTarget.style.background = 'rgba(53, 81, 138, 0.1)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                    >
                                        {downloadingId === result.id ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Download size={18} />
                                        )}
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
