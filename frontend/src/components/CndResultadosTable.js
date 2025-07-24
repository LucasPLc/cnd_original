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

    const handleDownload = async (resultadoId, cliente, dataEmissao) => {
        try {
            const response = await axios.get(`/api/clientes/resultados/${resultadoId}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const orgao = cliente.nacional ? 'Nacional' : (cliente.estadual ? 'Estadual' : 'Municipal');
            link.setAttribute('download', `CND_${cliente.cnpj}_${orgao}_${dataEmissao}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Erro ao baixar PDF:", error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Concluído':
                return { background: '#e3fcef', color: '#006400' };
            case 'Pendente':
            case 'Processando':
                return { background: '#fffae6', color: '#b8860b' };
            case 'Erro na Consulta':
            case 'Site Emissor Indisponível':
            case 'Falha na Extração':
                return { background: '#ffebe6', color: '#dc143c' };
            case 'Agendado':
                return { background: '#deebff', color: '#0000cd' };
            default:
                return { background: 'hsl(210, 40%, 96.1%)', color: 'hsl(215.4, 16.3%, 46.9%)' };
        }
    };

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th} title="Órgão emissor da certidão">Órgão Emissor</th>
                        <th style={styles.th} title="Situação da certidão">Situação</th>
                        <th style={styles.th} title="Data de emissão da certidão">Data de Emissão</th>
                        <th style={styles.th} title="Data de validade da certidão">Data de Validade</th>
                        <th style={styles.th} title="Status do processamento da consulta">Status</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando...</td></tr>
                    ) : (
                        resultados.length > 0 ? (
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
                                            ...getStatusStyle(resultado.status)
                                        }}>
                                            {resultado.status}
                                        </span>
                                    </td>
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
                                            ...getStatusStyle(resultado.status)
                                        }}>
                                            {resultado.status}
                                        </span>
                                    </td>
                                    <td style={{...styles.td, textAlign: 'right'}}>
                                        <div style={{display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end'}}>
                                                <button
                                                    onClick={() => handleDownload(resultado.id, resultado.cliente, resultado.dataEmissao)}
                                                    style={{...styles.actionButton, ...(resultado.status !== 'Concluído' && { cursor: 'not-allowed', opacity: 0.5 })}}
                                                    title={resultado.status !== 'Concluído' ? `Download indisponível: ${resultado.status}` : 'Baixar PDF'}
                                                    disabled={resultado.status !== 'Concluído'}
                                                >
                                                    <Download size={18} />
                                                </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: theme.spacing.xl}}>Nenhum resultado encontrado.</td></tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CndResultadosTable;
