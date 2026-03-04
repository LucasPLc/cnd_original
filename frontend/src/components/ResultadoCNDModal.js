import React, { useState } from 'react';
import axios from 'axios';
import Modal from './ui/Modal';
import theme from '../theme';
import { Download, Loader2 } from 'lucide-react';
import { downloadPdfFromBase64 } from '../util/download';
import { generateCndFilename, getStatusStyle } from '../util/cnd';
import { showToast } from './ui/Toast';

const ResultadoCNDModal = ({ isOpen, cliente, resultados, onClose, loading }) => {
    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownload = async (result) => {
        setDownloadingId(result.id);
        try {
            const response = await axios.get(`/api/resultados/${result.id}`);
            const fullResult = response.data;

            if (fullResult && fullResult.arquivo) {
                const filename = generateCndFilename(
                    cliente?.cnpj,
                    result.orgaoEmissor || result.tipoCertidao,
                    result.dataEmissao
                );
                downloadPdfFromBase64(fullResult.arquivo, filename);
            } else {
                showToast.error("Arquivo PDF não encontrado.");
            }
        } catch (error) {
            console.error("Erro no download do modal:", error);
            showToast.error("Erro ao realizar o download.");
        } finally {
            setDownloadingId(null);
        }
    };

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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.colors.primary,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            fontWeight: 500,
            padding: 0,
            transition: 'opacity 0.2s',
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
                                            {r.status === 'Disponível' ? (
                                                <button
                                                  onClick={() => handleDownload(r)}
                                                  disabled={downloadingId === r.id}
                                                  style={{...styles.downloadButton, opacity: downloadingId === r.id ? 0.6 : 1}}
                                                >
                                                    {downloadingId === r.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Download size={16} />
                                                    )}
                                                    Baixar
                                                </button>
                                            ) : (
                                                'Indisponível'
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
