import React from 'react';
import { Download } from 'lucide-react';
import theme from '../theme';
import axios from 'axios';

const CndResultadosTable = ({ resultados, loading }) => {
    const styles = {
        tableContainer: {
            background: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            overflow: 'hidden',
            marginTop: theme.spacing.xl,
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
        }
    };

    const handleDownload = async (resultadoId) => {
        try {
            const response = await axios.get(`/api/clientes/resultados/${resultadoId}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cnd.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
        }
    };

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Órgão Emissor</th>
                        <th style={styles.th}>Situação</th>
                        <th style={styles.th}>Data de Emissão</th>
                        <th style={styles.th}>Data de Validade</th>
                        <th style={styles.th}>Status</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando...</td></tr>
                    ) : (
                        resultados.map(resultado => (
                            <tr key={resultado.id}>
                                <td style={styles.td}>{resultado.cliente.nacional ? 'Nacional' : (resultado.cliente.estadual ? 'Estadual' : 'Municipal')}</td>
                                <td style={styles.td}>{resultado.situacao}</td>
                                <td style={styles.td}>{resultado.dataEmissao}</td>
                                <td style={styles.td}>{resultado.dataValidade}</td>
                                <td style={styles.td}>
                                    <span style={{
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        borderRadius: theme.borderRadius.full,
                                        background: resultado.status === 'concluido' ? 'hsl(142.1, 76.2%, 80%)' : 'hsl(0, 72.2%, 80%)',
                                        color: resultado.status === 'concluido' ? 'hsl(142.1, 70.2%, 25%)' : 'hsl(0, 70.2%, 25%)',
                                    }}>
                                        {resultado.status}
                                    </span>
                                </td>
                                <td style={{...styles.td, textAlign: 'right'}}>
                                    <div style={{display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end'}}>
                                            <button onClick={() => handleDownload(resultado.id)} style={styles.actionButton} title={`Baixar PDF`}><Download size={18} /></button>
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

export default CndResultadosTable;
