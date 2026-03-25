import React, { useState } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';
import theme from '../theme';
import { showToast } from './ui/Toast';

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
            verticalAlign: 'middle',
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
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            borderRadius: '4px',
            transition: 'background 0.2s',
            opacity: 1,
        },
        downloadBtnDisabled: {
            color: theme.colors.mutedForeground,
            cursor: 'not-allowed',
            opacity: 0.5,
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getOrgaoAbbreviation = (orgao) => {
        if (!orgao) return 'OUTRO';
        const upper = orgao.toUpperCase();
        if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
        if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
        if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
        return 'OUTRO';
    };

    const handleDownload = async (result) => {
        if (!result.hasArquivo) return;

        setDownloadingId(result.id);
        try {
            const response = await axios.get(`/api/resultados/${result.id}`);
            const fullResult = response.data;

            if (fullResult.arquivo) {
                const linkSource = `data:application/pdf;base64,${fullResult.arquivo}`;
                const downloadLink = document.createElement("a");
                const orgao = getOrgaoAbbreviation(fullResult.orgaoEmissor || result.orgaoEmissor);
                const date = fullResult.dataEmissao || result.dataEmissao || new Date().toISOString().split('T')[0];
                const fileName = `CND_${result.cliente?.cnpj}_${orgao}_${date}.pdf`;

                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
                showToast.success("Download iniciado com sucesso!");
            } else {
                showToast.error("Arquivo não encontrado no servidor.");
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
                                    <button
                                        onClick={() => handleDownload(result)}
                                        disabled={!result.hasArquivo || downloadingId === result.id}
                                        style={{
                                            ...styles.downloadBtn,
                                            ...(!result.hasArquivo ? styles.downloadBtnDisabled : {})
                                        }}
                                        title={result.hasArquivo ? "Baixar PDF" : "Arquivo não disponível"}
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
