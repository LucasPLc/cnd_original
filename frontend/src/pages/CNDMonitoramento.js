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

    // --- LÓGICA DE DADOS (CRUD) ---
    useEffect(() => {
        // 1. Extrair e configurar o token JWT
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Armazena o token para persistência (recarregar a página não vai te deslogar)
            localStorage.setItem('jwtToken', token);
            // Limpa a URL para que o token não fique exposto
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            // Configura o cabeçalho de autorização para todas as futuras requisições do axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        // 2. Agora, busca os clientes
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/clientes');
            setClients(response.data);
            setFilteredClients(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
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
        }
    };

    const handleUpdate = async (clientId, payload) => {
        try {
            await axios.put(`/api/clientes/${clientId}`, payload);
            fetchClients();
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
        }
    };

    const handleDelete = async () => {
        if (!clientToDelete) return;
        try {
            await axios.delete(`/api/clientes/${clientToDelete.id}`);
            fetchClients();
            setClientToDelete(null); // Fechar o modal de confirmação
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
        }
    };

    // --- FUNÇÕES DE UI (MODALS, FILTROS) ---
    const openModal = (client = null) => {
        setClientToEdit(client);
        setFormModalOpen(true);
    };

    const closeModal = () => {
        setClientToEdit(null);
        setFormModalOpen(false);
    };

    const handleFilterChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = clients.filter(client =>
            client.cnpj.includes(searchTerm)
        );
        setFilteredClients(filtered);
    };

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

            <FilterActions onFilterChange={handleFilterChange} onAddClient={() => openModal()} />

            <StatsCards total={clients.length} filtered={filteredClients.length} selected={0} />

            <ClientsTable
                clients={filteredClients}
                loading={loading}
                onEdit={(client) => openModal(client)}
                onDelete={(client) => setClientToDelete(client)}
            />

            <Modal isOpen={isFormModalOpen} onClose={closeModal} title={clientToEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}>
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
        </div>
    );
};

export default CNDMonitoramento;
