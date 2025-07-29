import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from './ui/Toast';
import InteractiveButton from './ui/InteractiveButton';
import theme from '../theme';

const formatCNPJ = (cnpj) => {
    if (!cnpj) return '';
    const cnpjOnlyNumbers = cnpj.replace(/[^\d]/g, '');
    if (cnpjOnlyNumbers.length !== 14) return cnpj; // Retorna o original se não for um CNPJ puro
    return cnpjOnlyNumbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
    );
};

const ImportSaamModal = ({ isOpen, onClose, existingClients, onImportSuccess, saamClientId }) => {
    const [saamCompanies, setSaamCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState(new Set());
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSaamCompanies();
            setSelectedCompanies(new Set());
        }
    }, [isOpen]);

    const fetchSaamCompanies = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/empresas');
            const existingCnpjs = new Set(existingClients.map(c => c.cnpj));
            const availableCompanies = response.data.filter(
                company => company.cnpj && !existingCnpjs.has(formatCNPJ(company.cnpj))
            );
            setSaamCompanies(availableCompanies);
        } catch (error) {
            showToast.error('Erro ao buscar empresas do SAAM. Verifique a conexão com o backend.');
            console.error('Erro ao buscar empresas do SAAM:', error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCompany = (cnpj) => {
        const newSelection = new Set(selectedCompanies);
        if (newSelection.has(cnpj)) {
            newSelection.delete(cnpj);
        } else {
            newSelection.add(cnpj);
        }
        setSelectedCompanies(newSelection);
    };

    const handleSelectAll = () => {
        if (selectedCompanies.size === saamCompanies.length) {
            setSelectedCompanies(new Set());
        } else {
            const allCnpjs = new Set(saamCompanies.map(c => c.cnpj));
            setSelectedCompanies(allCnpjs);
        }
    };

    const handleImport = async () => {
        if (!saamClientId) {
            showToast.error('ID do cliente SAAM não encontrado. Verifique o token de autenticação.');
            return;
        }
        if (selectedCompanies.size === 0) {
            showToast.warn('Nenhuma empresa selecionada para importação.');
            return;
        }

        setImporting(true);
        let successCount = 0;
        let errorCount = 0;

        const companiesToImport = saamCompanies.filter(c => selectedCompanies.has(c.cnpj));

        for (const company of companiesToImport) {
            try {
                const payload = {
                    cnpj: formatCNPJ(company.cnpj), // CNPJ formatado
                    periodicidade: 30,
                    statusCliente: 'ATIVO',
                    nacional: true,
                    municipal: true,
                    estadual: false,
                    empresa: {
                        idEmpresa: saamClientId,
                        cnpj: formatCNPJ(company.cnpj), // CNPJ formatado
                        nomeEmpresa: company.nome
                    }
                };
                await axios.post('/api/clientes', payload);
                successCount++;
            } catch (error) {
                errorCount++;
                const errorMessage = error.response?.data?.message || 'Erro desconhecido';
                showToast.error(`Erro ao importar ${company.cnpj}: ${errorMessage}`);
                console.error(`Erro ao importar CNPJ ${company.cnpj}:`, error);
            }
        }

        setImporting(false);
        if (successCount > 0) {
            showToast.success(`${successCount} empresa(s) importada(s) com sucesso!`);
        }
        if (errorCount > 0) {
            showToast.error(`${errorCount} empresa(s) falharam ao importar.`);
        }

        onImportSuccess();
        onClose();
    };

    const styles = {
        listContainer: {
            maxHeight: '400px',
            overflowY: 'auto',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        th: {
            padding: theme.spacing.md,
            textAlign: 'left',
            fontWeight: '600',
            color: theme.colors.primary,
            background: `rgba(53, 81, 138, 0.05)`,
            borderBottom: `1px solid ${theme.colors.border}`,
        },
        td: {
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
        },
        checkbox: {
            width: '20px',
            height: '20px',
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme.spacing.lg,
        },
    };

    return (
        <div>
            {loading ? (
                <p>Buscando empresas disponíveis no SAAM...</p>
            ) : saamCompanies.length === 0 ? (
                <p>Todas as empresas do SAAM já foram cadastradas.</p>
            ) : (
                <>
                    <div style={styles.listContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{...styles.th, width: '50px'}}>
                                        <input
                                            type="checkbox"
                                            style={styles.checkbox}
                                            checked={saamCompanies.length > 0 && selectedCompanies.size === saamCompanies.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th style={styles.th}>Nome</th>
                                    <th style={styles.th}>IE</th>
                                    <th style={styles.th}>CNPJ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saamCompanies.map(company => (
                                    <tr key={company.cnpj}>
                                        <td style={styles.td}>
                                            <input
                                                type="checkbox"
                                                style={styles.checkbox}
                                                checked={selectedCompanies.has(company.cnpj)}
                                                onChange={() => handleSelectCompany(company.cnpj)}
                                            />
                                        </td>
                                        <td style={styles.td}>{company.nome}</td>
                                        <td style={styles.td}>{company.ie || 'N/A'}</td>
                                        <td style={styles.td}>{formatCNPJ(company.cnpj)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={styles.footer}>
                        <span>{selectedCompanies.size} de {saamCompanies.length} selecionada(s)</span>
                        <InteractiveButton onClick={handleImport} disabled={importing || selectedCompanies.size === 0}>
                            {importing ? 'Importando...' : 'Importar Selecionadas'}
                        </InteractiveButton>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImportSaamModal;