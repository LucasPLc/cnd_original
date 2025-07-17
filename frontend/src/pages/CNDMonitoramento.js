import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Users, FileText, CheckSquare, Trash2, Edit } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ClientForm from '../components/ClientForm';
import InteractiveButton from '../components/ui/InteractiveButton';
import theme from '../theme';

const CNDMonitoramento = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredClients, setFilteredClients] = useState([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const [clientToDelete, setClientToDelete] = useState(null);

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

    const handleFormSubmit = () => {
        fetchClients();
        closeModal();
    };

    const handleDelete = async (clientId) => {
        if (!clientId) return;
        try {
            await axios.delete(`/api/clientes/${clientId}`);
            fetchClients();
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
        } finally {
            setClientToDelete(null);
        }
    };

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

    // --- STYLES OBJECT ---
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
        card: {
            background: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            marginBottom: theme.spacing.xl,
        },
        filterContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: theme.spacing.md,
            flexWrap: 'wrap', // Adicionado para responsividade
        },
        inputGroup: {
            position: 'relative',
            flex: 1,
        },
        input: {
            width: '100%',
            padding: theme.spacing.sm,
            paddingLeft: '36px', // space for icon
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
        },
        searchIcon: {
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: theme.colors.mutedForeground,
        },
        buttonPrimary: {
            background: theme.colors.primary,
            color: theme.colors.primaryForeground,
            fontWeight: 'bold',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
        },
        statCard: {
            background: theme.colors.background,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
        },
        tableContainer: {
            background: theme.colors.background,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.md,
            overflow: 'hidden',
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
            background: `rgba(53, 81, 138, 0.05)`, // primary/5
        },
        td: {
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`,
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: theme.borderRadius.full,
            background: `rgba(53, 81, 138, 0.1)`, // primary/10
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: theme.colors.primary,
            flexShrink: 0,
        },
        actionButton: {
            background: 'transparent',
            border: 'none',
            padding: theme.spacing.xs,
            cursor: 'pointer',
            color: theme.colors.mutedForeground,
        }
    };

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

            <div style={styles.card}>
                <div style={styles.filterContainer}>
                    <div style={styles.inputGroup}>
                         <Search size={20} style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Filtrar por CNPJ..."
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>
                    <InteractiveButton onClick={() => openModal()}>
                        <Plus size={20} />
                        <span>Cadastrar Novo Cliente</span>
                    </InteractiveButton>
                </div>
            </div>

            <div style={styles.statsGrid}>
               <div style={styles.statCard}>
                    <Users size={32} style={{color: theme.colors.primary}} />
                    <div>
                        <p style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>Total de Clientes</p>
                        <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: theme.colors.primary}}>{clients.length}</p>
                    </div>
                </div>
                 <div style={styles.statCard}>
                    <Search size={32} style={{color: theme.colors.primary}} />
                    <div>
                        <p style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>Clientes Filtrados</p>
                        <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: theme.colors.primary}}>{filteredClients.length}</p>
                    </div>
                </div>
                 <div style={styles.statCard}>
                    <CheckSquare size={32} style={{color: theme.colors.primary}} />
                    <div>
                        <p style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>Selecionados</p>
                        <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: theme.colors.primary}}>0</p>
                    </div>
                </div>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Cliente</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Periodicidade</th>
                            <th style={{...styles.th, textAlign: 'right'}}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{textAlign: 'center', padding: theme.spacing.xl}}>Carregando...</td></tr>
                        ) : (
                            filteredClients.map(client => (
                                <tr key={client.id}>
                                    <td style={{...styles.td, display: 'flex', alignItems: 'center', gap: theme.spacing.md}}>
                                        <div style={styles.avatar}>
                                            {client.cnpj.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{fontWeight: 500}}>{`Cliente ${client.cnpj.substring(0, 2)}`}</div>
                                            <div style={{fontSize: '0.875rem', color: theme.colors.mutedForeground}}>{client.cnpj}</div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            padding: '4px 8px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            borderRadius: theme.borderRadius.full,
                                            background: client.statusCliente === 'ATIVO' ? 'hsl(142.1, 76.2%, 80%)' : 'hsl(0, 72.2%, 80%)',
                                            color: client.statusCliente === 'ATIVO' ? 'hsl(142.1, 70.2%, 25%)' : 'hsl(0, 70.2%, 25%)',
                                        }}>
                                            {client.statusCliente}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{client.periodicidade} dias</td>
                                    <td style={{...styles.td, textAlign: 'right'}}>
                                        <div style={{display: 'flex', gap: theme.spacing.sm, justifyContent: 'flex-end'}}>
                                            <button onClick={() => openModal(client)} style={styles.actionButton}><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(client.id)} style={{...styles.actionButton, color: theme.colors.destructive}}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isFormModalOpen} onClose={closeModal} title={clientToEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}>
                <ClientForm clientToEdit={clientToEdit} onFormSubmit={handleFormSubmit} onClose={closeModal} />
            </Modal>

            {/* O modal de exclusão foi removido pois a exclusão agora é direta */}
        </div>
    );
};

export default CNDMonitoramento;
