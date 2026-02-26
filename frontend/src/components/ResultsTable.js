import React, { useState } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';
import theme from '../theme';
import { showToast } from './ui/Toast';
import { downloadBase64, formatCndFilename } from '../util/download';

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
        downloadBtn: {
            background: 'none',
            border: 'none',
            color: theme.colors.primary,
            cursor: 'pointer',
            padding: theme.spacing.xs,
            borderRadius: theme.borderRadius.sm,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            fontWeight: 500,
            transition: 'all 0.2s',
        },
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const handleDownload = async (result) => {
        setDownloadingId(result.id);
        try {
            const response = await axios.get(`/api/resultados/${result.id}`);
            const fullResult = response.data;

            if (fullResult.arquivo) {
                const filename = formatCndFilename(
                    result.cliente?.cnpj || 'unknown',
                    result.orgaoEmissor || result.tipoCertidao || 'ORGAO',
                    result.dataEmissao || new Date().toISOString()
                );
                downloadBase64(fullResult.arquivo, filename);
                showToast.success("Download iniciado!");
            } else {
                showToast.error("Arquivo PDF não encontrado para esta certidão.");
            }
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
            showToast.error("Erro ao realizar o download do arquivo.");
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
                                        {(result.cliente?.nomeEmpresa || result.cliente?.cnpj || '?').charAt(0)}
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
                                    {result.hasArquivo ? (
                                        <button
                                            style={{
                                                ...styles.downloadBtn,
                                                opacity: downloadingId === result.id ? 0.6 : 1,
                                                pointerEvents: downloadingId === result.id ? 'none' : 'auto',
                                            }}
                                            onClick={() => handleDownload(result)}
                                            title="Baixar PDF"
                                        >
                                            {downloadingId === result.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Download size={18} />
                                            )}
                                            <span style={{fontSize: '0.875rem'}}>PDF</span>
                                        </button>
                                    ) : (
                                        <span style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>Sem arquivo</span>
                                    )}
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
