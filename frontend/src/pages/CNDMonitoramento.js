import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FileText } from 'lucide-react';

import Modal from '../components/ui/Modal';
import ClientForm from '../components/ClientForm';
import InteractiveButton from '../components/ui/InteractiveButton';
import StatsCards from '../components/StatsCards';
import FilterActions from '../components/FilterActions';
import ClientsTable from '../components/ClientsTable';

// --- STYLED COMPONENTS ---

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const HeaderTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.75rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.mutedForeground};
  max-width: 600px;
  margin: 0 auto;
`;

const ModalContentWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ConfirmationDialog = styled.div`
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.foreground};
  }

  div {
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;


// --- COMPONENT ---

const CNDMonitoramento = () => {
    // --- STATE ---
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [clientToDelete, setClientToDelete] = useState(null);

    // --- DATA LOGIC ---
    useEffect(() => {
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
            setClientToDelete(null);
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
        }
    };

    // --- UI LOGIC ---
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

    // --- RENDER ---
    return (
        <PageContainer>
            <PageHeader>
                <HeaderTitleContainer>
                    <FileText color={theme.colors.primary} size={36} />
                    <HeaderTitle>Monitoramento de Certidões (CND)</HeaderTitle>
                </HeaderTitleContainer>
                <HeaderSubtitle>
                    Gerencie e monitore os clientes e suas certidões de forma simples e eficiente.
                </HeaderSubtitle>
            </PageHeader>

            <FilterActions onFilterChange={handleFilterChange} onAddClient={() => openModal()} />

            <StatsCards total={clients.length} filtered={filteredClients.length} selected={0} />

            <ClientsTable
                clients={filteredClients}
                loading={loading}
                onEdit={(client) => openModal(client)}
                onDelete={(client) => setClientToDelete(client)}
            />

            <Modal isOpen={isFormModalOpen} onClose={closeModal} title={clientToEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}>
                <ModalContentWrapper>
                    <ClientForm
                        clientToEdit={clientToEdit}
                        onCreate={handleCreate}
                        onUpdate={handleUpdate}
                        onClose={closeModal}
                        isOpen={isFormModalOpen}
                    />
                </ModalContentWrapper>
            </Modal>

            <Modal isOpen={!!clientToDelete} onClose={() => setClientToDelete(null)} title="Confirmar Exclusão">
                 <ModalContentWrapper>
                    <ConfirmationDialog>
                        <p>Tem certeza de que deseja excluir o cliente com CNPJ: <strong>{clientToDelete?.cnpj}</strong>?</p>
                        <div>
                            <InteractiveButton onClick={() => setClientToDelete(null)} variant="secondary">
                                Cancelar
                            </InteractiveButton>
                            <InteractiveButton onClick={handleDelete} variant="destructive">
                                Excluir
                            </InteractiveButton>
                        </div>
                    </ConfirmationDialog>
                </ModalContentWrapper>
            </Modal>
        </PageContainer>
    );
};

export default CNDMonitoramento;
