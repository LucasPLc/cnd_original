import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/ClientForm';
import InteractiveButton from '../components/ui/InteractiveButton';
import StatsCards from '../components/StatsCards';
import FilterActions from '../components/FilterActions';
import ClientsTable from '../components/ClientsTable';
import Pagination from '../components/ui/Pagination';
import theme from '../theme';

const PAGE_SIZE = 10;

const CNDMonitoramento = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ text: '', status: '', startDate: '', endDate: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [clientsToDelete, setClientsToDelete] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/clientes');
            setClients(response.data);
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
        if (clientsToDelete.length === 0) return;
        try {
            await Promise.all(
                clientsToDelete.map(id => axios.delete(`/api/clientes/${id}`))
            );
            fetchClients();
            setClientsToDelete([]);
            setSelectedClients([]);
        } catch (error) {
            console.error("Erro ao excluir cliente(s):", error);
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

    const filteredClients = useMemo(() => {
        const { text, status, startDate, endDate } = filters;
        const searchTerm = text.toLowerCase();

        return clients.filter(client => {
            const clientDate = client.dataProcessamento ? new Date(client.dataProcessamento) : null;
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && (!clientDate || clientDate < start)) return false;
            if (end && (!clientDate || clientDate > end)) return false;

            const matchesSearch = client.cnpj.toLowerCase().includes(searchTerm) ||
                                  (client.nomeContribuinte && client.nomeContribuinte.toLowerCase().includes(searchTerm));

            const matchesStatus = !status || client.statusProcessamento === status;

            return matchesSearch && matchesStatus;
        });
    }, [clients, filters]);

    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredClients.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredClients, currentPage]);

    const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
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

            <FilterActions onFilterChange={handleFilterChange} onAddClient={() => openModal()} filteredClients={filteredClients} />

            <StatsCards total={clients.length} filtered={filteredClients.length} selected={0} />

            {selectedClients.length > 0 && (
                <div style={{ marginBottom: theme.spacing.md, display: 'flex', justifyContent: 'flex-end' }}>
                    <InteractiveButton onClick={() => setClientsToDelete(selectedClients)} variant="destructive">
                        Excluir Selecionados ({selectedClients.length})
                    </InteractiveButton>
                </div>
            )}

            <ClientsTable
                clients={paginatedClients}
                loading={loading}
                onEdit={(client) => openModal(client)}
                onDelete={(ids) => setClientsToDelete(ids)}
                selectedClients={selectedClients}
                onSelectionChange={setSelectedClients}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
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

            <Modal isOpen={clientsToDelete.length > 0} onClose={() => setClientsToDelete([])} title="Confirmar Exclusão">
                <div>
                    <p style={{marginBottom: theme.spacing.lg}}>
                        {`Tem certeza de que deseja excluir ${clientsToDelete.length} cliente(s)?`}
                    </p>
                    <div style={{display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md}}>
                        <InteractiveButton onClick={() => setClientsToDelete([])} variant="secondary">
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
