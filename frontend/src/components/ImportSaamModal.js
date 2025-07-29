import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from './ui/Toast';
import InteractiveButton from './ui/InteractiveButton';
import theme from '../theme';

const ImportSaamModal = ({ isOpen, onClose, existingClients, onImportSuccess }) => {
    const [saamCompanies, setSaamCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState(new Set());
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSaamCompanies();
            setSelectedCompanies(new Set()); // Reset selection
        }
    }, [isOpen]);

    const fetchSaamCompanies = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/empresas');
            const existingCnpjs = new Set(existingClients.map(c => c.cnpj));
            const availableCompanies = response.data.filter(
                company => !existingCnpjs.has(company.cnpj)
            );
            setSaamCompanies(availableCompanies);
        } catch (error) {
            showToast.error('Erro ao buscar empresas do SAAM.');
            console.error('Erro ao buscar empresas do SAAM:', error);
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
                // Payload corrigido para corresponder à estrutura esperada pelo backend
                const payload = {
                    cnpj: company.cnpj,
                    periodicidade: 30,
                    statusCliente: 'ATIVO',
                    nacional: true,
                    municipal: true,
                    estadual: false,
                    empresa: {
                        idEmpresa: company.id, // Usando o ID da empresa vindo do SAAM
                        cnpj: company.cnpj,
                        nomeEmpresa: company.nome
                    }
                };
                await axios.post('/api/clientes', payload);
                successCount++;
            } catch (error) {
                errorCount++;
                console.error(`Erro ao importar CNPJ ${company.cnpj}:`, error);
            }
        }

        setImporting(false);
        showToast.success(`${successCount} empresa(s) importada(s) com sucesso!`);
        if (errorCount > 0) {
            showToast.error(`${errorCount} empresa(s) falharam ao importar.`);
        }

        onImportSuccess(); // Refresh the main client list
        onClose(); // Close the modal
    };

    const styles = {
        listContainer: {
            maxHeight: '400px',
            overflowY: 'auto',
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
        },
        listItem: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
            gap: theme.spacing.md,
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
                        <div style={{...styles.listItem, fontWeight: 'bold'}}>
                            <input
                                type="checkbox"
                                style={styles.checkbox}
                                checked={selectedCompanies.size === saamCompanies.length}
                                onChange={handleSelectAll}
                            />
                            <span style={{flex: 1}}>Selecionar Todas</span>
                        </div>
                        {saamCompanies.map(company => (
                            <div key={company.cnpj} style={styles.listItem}>
                                <input
                                    type="checkbox"
                                    style={styles.checkbox}
                                    checked={selectedCompanies.has(company.cnpj)}
                                    onChange={() => handleSelectCompany(company.cnpj)}
                                />
                                <span style={{flex: 1}}>{company.nome}</span>
                                <span>{company.cnpj}</span>
                            </div>
                        ))}
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
