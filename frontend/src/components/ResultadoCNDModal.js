import React, { useState } from 'react';
import Modal from './ui/Modal';
import theme from '../theme';
import { Download, Loader2 } from 'lucide-react';
import axios from 'axios';
import { downloadBase64PDF } from '../util/download';
import { getOrgaoAbbreviation } from '../util/cnd';
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
        downloadLink: {
            color: theme.colors.primary,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            fontWeight: 500,
        }
    };

    const handleDownload = async (resultado) => {
        setDownloadingId(resultado.id);
        try {
            const response = await axios.get(`/api/resultados/${resultado.id}`);
            const fullResultado = response.data;

            if (fullResultado && fullResultado.arquivo) {
                const orgao = getOrgaoAbbreviation(fullResultado.tipoCertidao || fullResultado.orgaoEmissor);
                const dataEmissao = fullResultado.dataEmissao || new Date(fullResultado.dataProcessamento).toISOString().split('T')[0];
                const filename = `CND_${cliente.cnpj.replace(/[^\d]/g, '')}_${orgao}_${dataEmissao}.pdf`;

                downloadBase64PDF(fullResultado.arquivo, filename);
                showToast.success("Download iniciado!");
            } else {
                showToast.error("Arquivo não disponível para este resultado.");
            }
        } catch (error) {
            console.error("Erro ao buscar arquivo:", error);
            showToast.error("Erro ao buscar o arquivo para download.");
        } finally {
            setDownloadingId(null);
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
                                                  style={{
                                                      ...styles.downloadLink,
                                                      background: 'none',
                                                      border: 'none',
                                                      cursor: 'pointer',
                                                      padding: 0,
                                                      opacity: downloadingId === r.id ? 0.7 : 1
                                                  }}
                                                  disabled={downloadingId !== null}
                                                >
                                                    {downloadingId === r.id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Download size={16} />
                                                    )}
                                                    {downloadingId === r.id ? 'Buscando...' : 'Baixar'}
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
