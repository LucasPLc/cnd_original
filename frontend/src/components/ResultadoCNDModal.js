import React, { useState } from 'react';
import Modal from './ui/Modal';
import theme from '../theme';
import { Download, Loader2 } from 'lucide-react';
import { generateCndFilename, downloadPdfFromBase64 } from '../util/download';
import { showToast } from './ui/Toast';

const ResultadoCNDModal = ({ isOpen, cliente, resultados, onClose, loading }) => {
    const [downloadingId, setDownloadingId] = useState(null);

    if (!cliente) return null;

    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: theme.spacing.lg,
        },
        th: {
            padding: theme.spacing.md,
            textAlign: 'left',
            fontWeight: '600',
            color: theme.colors.primary,
            background: `rgba(53, 81, 138, 0.05)`,
            borderBottom: `2px solid ${theme.colors.border}`,
        },
        td: {
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`,
            verticalAlign: 'middle',
        },
        badge: {
            padding: '4px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: theme.borderRadius.full,
            display: 'inline-block',
        },
        downloadButton: {
            color: theme.colors.primary,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            fontWeight: 500,
            padding: '4px 8px',
            borderRadius: theme.borderRadius.md,
            transition: 'background 0.2s',
        },
        disabledButton: {
            color: theme.colors.mutedForeground,
            cursor: 'not-allowed',
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'Disponível' || status === 'Concluído') {
            return {
                background: 'hsl(142.1, 76.2%, 90%)',
                color: 'hsl(142.1, 70.2%, 30%)',
            };
        }
        return {
            background: 'hsl(0, 72.2%, 90%)',
            color: 'hsl(0, 70.2%, 30%)',
        };
    };

    const handleDownload = async (r) => {
        if (!r.hasArquivo) return;

        setDownloadingId(r.id);
        try {
            // Se já temos o arquivo no objeto r, usamos ele.
            // Caso contrário (para ser resiliente), buscamos.
            let arquivo = r.arquivo;
            let orgaoEmissor = r.orgaoEmissor;
            let dataEmissao = r.dataEmissao;
            let clienteCnpj = r.clienteCnpj || cliente.cnpj;

            if (!arquivo) {
                const response = await fetch(`/api/resultados/${r.id}`);
                if (!response.ok) throw new Error('Falha ao buscar arquivo');
                const data = await response.json();
                arquivo = data.arquivo;
                orgaoEmissor = data.orgaoEmissor;
                dataEmissao = data.dataEmissao;
                clienteCnpj = data.clienteCnpj;
            }

            if (arquivo) {
                const filename = generateCndFilename(clienteCnpj, orgaoEmissor, dataEmissao);
                downloadPdfFromBase64(arquivo, filename);
                showToast.success('Download concluído com sucesso');
            } else {
                showToast.error('Arquivo não encontrado para este registro');
            }
        } catch (error) {
            console.error('Erro ao baixar CND:', error);
            showToast.error('Erro ao realizar o download da CND');
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <Modal isOpen={isOpen} title={`Resultados da CND para: ${cliente.cnpj}`} onClose={onClose}>
            {loading ? (
                <p style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando resultados...</p>
            ) : (
                <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Data Processamento</th>
                                <th style={styles.th}>Situação</th>
                                <th style={styles.th}>Validade</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Arquivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.length > 0 ? (
                                resultados.map(r => (
                                    <tr key={r.id}>
                                        <td style={styles.td}>{new Date(r.dataProcessamento).toLocaleString()}</td>
                                        <td style={styles.td}>{r.situacao || '-'}</td>
                                        <td style={styles.td}>{r.dataValidade ? new Date(r.dataValidade).toLocaleDateString() : '-'}</td>
                                        <td style={styles.td}>
                                            <span style={{...styles.badge, ...getStatusStyle(r.status)}}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {r.hasArquivo ? (
                                                <button
                                                  onClick={() => handleDownload(r)}
                                                  disabled={downloadingId === r.id}
                                                  style={styles.downloadButton}
                                                >
                                                    {downloadingId === r.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Download size={16} />
                                                    )}
                                                    Baixar
                                                </button>
                                            ) : (
                                                <span style={styles.disabledButton}>Indisponível</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: theme.spacing.xl}}>Nenhum resultado encontrado para este cliente.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </Modal>
    );
};

export default ResultadoCNDModal;
