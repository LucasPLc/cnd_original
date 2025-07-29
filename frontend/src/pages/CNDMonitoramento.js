import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Importa a função de decodificação
import Modal from '../components/ui/Modal';
import ClientForm from '../components/ClientForm';
import InteractiveButton from '../components/ui/InteractiveButton';
import StatsCards from '../components/StatsCards';
import FilterActions from '../components/FilterActions';
import ClientsTable from '../components/ClientsTable';
import { showToast } from '../components/ui/Toast';
import theme from '../theme';
import ImportSaamModal from '../components/ImportSaamModal';

// --- LIBS DE EXPORTAÇÃO ---
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const CNDMonitoramento = () => {
    // --- ESTADO CENTRALIZADO ---
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [saamClientId, setSaamClientId] = useState(null); // Estado para o ID do cliente SAAM

    // --- ESTADO DOS FILTROS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // --- LÓGICA DE DADOS (CRUD) ---
    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/clientes');
            setClients(response.data);
        } catch (error) {
            showToast.error("Erro ao buscar clientes.");
            console.error("Erro ao buscar clientes:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('jwtToken', token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            try {
                const decodedToken = jwtDecode(storedToken);
                setSaamClientId(decodedToken.clientId); // Decodifica e armazena o clientId
            } catch (error) {
                console.error("Falha ao decodificar o token JWT:", error);
                showToast.error("Token de autenticação inválido.");
            }
        }
        fetchClients();
    }, [fetchClients]);

    // --- LÓGICA DE FILTRAGEM ---
    useEffect(() => {
        const normalizedSearchTerm = searchTerm.replace(/[^\d]/g, '');

        let filtered = clients.filter(client => {
            const normalizedCnpj = client.cnpj.replace(/[^\d]/g, '');
            
            const matchesSearch = normalizedSearchTerm ? normalizedCnpj.includes(normalizedSearchTerm) : true;
            const matchesStatus = statusFilter !== 'ALL' ? client.statusCliente === statusFilter : true;

            return matchesSearch && matchesStatus;
        });

        setFilteredClients(filtered);
    }, [clients, searchTerm, statusFilter]);


    const handleCreate = async (payload) => {
        try {
            await axios.post('/api/clientes', payload);
            showToast.success("Cliente criado com sucesso!");
            fetchClients();
            closeFormModal();
        } catch (error) {
            showToast.error("Erro ao criar cliente.");
            console.error("Erro ao criar cliente:", error);
        }
    };

    const handleUpdate = async (clientId, payload) => {
        try {
            await axios.put(`/api/clientes/${clientId}`, payload);
            showToast.success("Cliente atualizado com sucesso!");
            fetchClients();
            closeFormModal();
        } catch (error) {
            showToast.error("Erro ao atualizar cliente.");
            console.error("Erro ao atualizar cliente:", error);
        }
    };

    const handleDelete = async () => {
        if (!clientToDelete) return;
        try {
            await axios.delete(`/api/clientes/${clientToDelete.id}`);
            showToast.success("Cliente excluído com sucesso!");
            fetchClients();
            setClientToDelete(null);
        } catch (error) {
            showToast.error("Erro ao excluir cliente.");
            console.error("Erro ao excluir cliente:", error);
        }
    };

    // --- LÓGICA DE EXPORTAÇÃO ---
    const handleExportExcel = () => {
        if (filteredClients.length === 0) {
            showToast.warn("Nenhum dado para exportar.");
            return;
        }
        const dataToExport = filteredClients.map(c => ({
            'Razão Social': c.empresa?.nomeEmpresa || 'N/A',
            'CNPJ': c.cnpj,
            'Status': c.statusCliente,
            'Periodicidade': c.periodicidade,
            'Última Verificação': c.dataUltimaVerificacao ? new Date(c.dataUltimaVerificacao).toLocaleString() : 'N/A',
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
        XLSX.writeFile(workbook, "clientes_cnd.xlsx");
        showToast.success("Dados exportados para Excel com sucesso!");
    };

    const handleExportPdf = () => {
        if (filteredClients.length === 0) {
            showToast.warn("Nenhum dado para exportar.");
            return;
        }
        const doc = new jsPDF();
        doc.text("Relatório de Clientes CND", 14, 16);
        doc.autoTable({
            head: [['Razão Social', 'CNPJ', 'Status', 'Periodicidade', 'Última Verificação']],
            body: filteredClients.map(c => [
                c.empresa?.nomeEmpresa || 'N/A',
                c.cnpj,
                c.statusCliente,
                c.periodicidade,
                c.dataUltimaVerificacao ? new Date(c.dataUltimaVerificacao).toLocaleDateString() : 'N/A',
            ]),
            startY: 20,
        });
        doc.save('clientes_cnd.pdf');
        showToast.success("Dados exportados para PDF com sucesso!");
    };


    // --- FUNÇÕES DE UI (MODALS) ---
    const openFormModal = (client = null) => {
        setClientToEdit(client);
        setFormModalOpen(true);
    };

    const closeFormModal = () => {
        setClientToEdit(null);
        setFormModalOpen(false);
    };

    const openImportModal = () => setImportModalOpen(true);
    const closeImportModal = () => setImportModalOpen(false);


    // --- ESTILOS DO LAYOUT ---
    const styles = {
        container: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: theme.spacing.xl,
        },
        header: {
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
        },
        headerTitleContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.sm,
        },
        headerTitle: {
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: theme.colors.primary,
        },
        headerSubtitle: {
            fontSize: '1.125rem',
            color: theme.colors.mutedForeground,
        },
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerTitleContainer}>
                    <FileText style={{color: theme.colors.primary}} size={32} />
                    <h1 style={styles.headerTitle}>
                        Monitoramento de Certidões (CND)
                    </h1>
                </div>
                <p style={styles.headerSubtitle}>
                    Gerencie e monitore os clientes e suas certidões
                </p>
            </header>

            <FilterActions
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onStatusChange={(e) => setStatusFilter(e.target.value)}
                searchValue={searchTerm}
                statusValue={statusFilter}
                onAddClient={() => openFormModal()}
                onExportExcel={handleExportExcel}
                onExportPdf={handleExportPdf}
                onOpenImportModal={openImportModal}
            />

            <StatsCards total={clients.length} filtered={filteredClients.length} selected={0} />

            <ClientsTable
                clients={filteredClients}
                loading={loading}
                onEdit={(client) => openFormModal(client)}
                onDelete={(client) => setClientToDelete(client)}
            />

            <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={clientToEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}>
                <ClientForm
                    clientToEdit={clientToEdit}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onClose={closeFormModal}
                    isOpen={isFormModalOpen}
                />
            </Modal>

            <Modal isOpen={!!clientToDelete} onClose={() => setClientToDelete(null)} title="Confirmar Exclusão">
                <div>
                    <p style={{marginBottom: theme.spacing.lg}}>Tem certeza de que deseja excluir o cliente com CNPJ: {clientToDelete?.cnpj}?</p>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md}}>
                        <InteractiveButton onClick={() => setClientToDelete(null)} variant="secondary">
                            Cancelar
                        </InteractiveButton>
                        <InteractiveButton onClick={handleDelete} variant="destructive">
                            Excluir
                        </InteractiveButton>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isImportModalOpen} onClose={closeImportModal} title="Importar Empresas do SAAM">
                <ImportSaamModal
                    isOpen={isImportModalOpen}
                    onClose={closeImportModal}
                    existingClients={clients}
                    onImportSuccess={fetchClients}
                    saamClientId={saamClientId}
                />
            </Modal>
        </div>
    );
};

export default CNDMonitoramento;
