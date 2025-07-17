import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import CndTable from './CndTable';
import Modal from './Modal';
import DeleteConfirmation from './DeleteConfirmation';
import ClientForm from './ClientForm';
import Filters from './Filters';
import Pagination from './Pagination';
import { exportToExcel, exportToPdf } from '../utils/export';
import axios from 'axios';

const MonitorContainer = styled.div`
  padding: 2rem;
  background-color: #ffffff;
  margin: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #35518a;
  text-align: center;
  margin-bottom: 2rem;
`;

const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const AddButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #5cb85c;
  color: white;
  font-weight: bold;
`;


const CndMonitor = () => {
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;


  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/clientes');
      // A API de clientes retorna um array de ClienteDTO.
      // Precisamos mapear isso para o formato que a tabela espera.
      const results = response.data.map(cliente => {
        // Como a API principal é de clientes, vamos criar um resultado de CND mockado
        // para cada cliente, já que não temos um endpoint que junte os dados.
        return {
          id: cliente.id, // Usando o ID do cliente como chave única para o resultado mockado
          dataProcessamento: new Date().toISOString(),
          status: 'concluído',
          situacao: 'Não consultado',
          dataEmissao: null,
          dataValidade: null,
          codigoControle: null,
          arquivo: false, // O arquivo só existe se a CND foi baixada
          cliente: cliente, // O objeto completo do cliente
        };
      });
      setAllResults(results);
      setFilteredResults(results);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let results = [...allResults];
    if (filters.cnpj) {
      results = results.filter(r => r.cliente.cnpj.includes(filters.cnpj));
    }
    setFilteredResults(results);
    setCurrentPage(1);
  };

  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredResults]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

  const openFormModal = (client = null) => {
    setClientToEdit(client);
    setFormModalOpen(true);
  };

  const closeFormModal = () => {
    setClientToEdit(null);
    setFormModalOpen(false);
  };

  const handleFormSubmit = () => {
    closeFormModal();
    fetchResults();
  };

  const handleEdit = (result) => {
    openFormModal(result.cliente);
  };

  const openDeleteModal = (result) => {
    setSelectedResult(result);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedResult(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedResult) return;
    try {
      await axios.delete(`/api/clientes/${selectedResult.cliente.id}`);
      fetchResults();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleDownload = (result) => {
    console.log('Download:', result);
  };

  return (
    <MonitorContainer>
      <Title>Monitoramento de CNDs</Title>
      <TopActions>
        <ExportButtons>
          <button onClick={() => exportToExcel(filteredResults, 'cnd_report')}>Exportar Excel</button>
          <button onClick={() => exportToPdf(filteredResults, 'cnd_report')}>Exportar PDF</button>
        </ExportButtons>
        <AddButton onClick={() => openFormModal()}>Novo Cliente</AddButton>
      </TopActions>
      <Filters onFilter={handleFilter} />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <CndTable
            results={paginatedResults}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onDownload={handleDownload}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <DeleteConfirmation
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          cnpj={selectedResult?.cliente?.cnpj}
        />
      </Modal>

      <Modal isOpen={isFormModalOpen} onClose={closeFormModal}>
        <ClientForm clientToEdit={clientToEdit} onFormSubmit={handleFormSubmit} />
      </Modal>

    </MonitorContainer>
  );
};

export default CndMonitor;
