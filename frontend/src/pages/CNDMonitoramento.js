import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/ClientForm';
import InteractiveButton from '../components/ui/InteractiveButton';
import StatsCards from '../components/StatsCards';
import FilterActions from '../components/FilterActions';
import ClientsTable from '../components/ClientsTable';
import theme from '../theme';

const CNDMonitoramento = () => {
    // --- ESTADO CENTRALIZADO ---
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [filters, setFilters] = useState({
        searchTerm: '',
        situacao: '',
        statusProcesso: '',
        dataInicio: '',
        dataFim: '',
    });

    // --- LÓGICA DE DADOS (CRUD) ---
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
        }
        fetchClients();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, clients]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/clientes/resultados'); // Endpoint que traz clientes com seus últimos resultados
            setClients(response.data);
            setFilteredClients(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            setClients([]); // Em caso de erro, usa o mock da tabela
            setFilteredClients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (payload) => {
        try {
            await axios.post('/api/clientes', payload);
            fetchClients();
            closeModal();
        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            alert("Erro ao criar cliente. Verifique o console para mais detalhes.");
        }
    };

    const handleUpdate = async (clientId, payload) => {
        try {
            await axios.put(`/api/clientes/${clientId}`, payload);
            fetchClients();
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            alert("Erro ao atualizar cliente. Verifique o console para mais detalhes.");
        }
    };

    const handleDelete = async () => {
        if (!clientToDelete) return;
        try {
            await axios.delete(`/api/clientes/${clientToDelete.id}`);
            fetchClients();
            alert("Consulta excluída com sucesso.");
            setClientToDelete(null);
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            if (error.response && error.response.status === 400) {
                alert("Não é possível excluir. Existem resultados de consulta vinculados a este cliente.");
            } else {
                alert("Ocorreu um erro ao tentar excluir a consulta.");
            }
        }
    };

    const applyFilters = () => {
        let tempClients = [...clients];

        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            tempClients = tempClients.filter(c =>
                c.cnpj.toLowerCase().includes(term) ||
                c.nomeCliente.toLowerCase().includes(term)
            );
        }
        if (filters.situacao) {
            tempClients = tempClients.filter(c => c.situacaoCertidao === filters.situacao);
        }
        if (filters.statusProcesso) {
            tempClients = tempClients.filter(c => c.statusProcesso === filters.statusProcesso);
        }
        // Lógica de data a ser implementada
        setFilteredClients(tempClients);
    };

    // --- FUNÇÕES DE UI ---
    const openModal = (client = null) => {
        setClientToEdit(client);
        setFormModalOpen(true);
    };

    const closeModal = () => {
        setClientToEdit(null);
        setFormModalOpen(false);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    // --- ESTILOS ---
    const styles = {
        container: { maxWidth: '1280px', margin: '0 auto', padding: theme.spacing.xl },
        header: { textAlign: 'center', marginBottom: theme.spacing.xl },
        headerTitleContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm },
        headerTitle: { fontSize: '2.25rem', fontWeight: 'bold', color: theme.colors.primary },
        headerSubtitle: { fontSize: '1.125rem', color: theme.colors.mutedForeground },
    };

    // --- RENDERIZAÇÃO ---
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerTitleContainer}>
                    <FileText style={{color: theme.colors.primary}} size={32} />
                    <h1 style={styles.headerTitle}>Monitoramento de Certidões (CND)</h1>
                </div>
                <p style={styles.headerSubtitle}>Gerencie e monitore os clientes e suas certidões</p>
            </header>

            <FilterActions onFilterChange={handleFilterChange} onAddClient={() => openModal()} />

            <StatsCards total={clients.length} filtered={filteredClients.length} selected={0} />

            <ClientsTable
                clients={filteredClients}
                loading={loading}
                onEdit={(client) => openModal(client)}
                onDelete={(client) => setClientToDelete(client)}
            />

            <Modal isOpen={isFormModalOpen} onClose={closeModal} title={clientToEdit ? 'Editar Cliente' : 'Cadastrar Nova Consulta'}>
                <ClientForm
                    clientToEdit={clientToEdit}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onClose={closeModal}
                    isOpen={isFormModalOpen}
                />
            </Modal>

            <Modal isOpen={!!clientToDelete} onClose={() => setClientToDelete(null)} title="Confirmar Exclusão">
                <div>
                    <p style={{marginBottom: theme.spacing.lg}}>
                        Tem certeza que deseja excluir a configuração de consulta para o CNPJ <strong>{clientToDelete?.cnpj}</strong>? Esta ação removerá o monitoramento.
                    </p>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md}}>
                        <InteractiveButton onClick={() => setClientToDelete(null)} variant="secondary">Cancelar</InteractiveButton>
                        <InteractiveButton onClick={handleDelete} variant="destructive">Confirmar</InteractiveButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CNDMonitoramento;
