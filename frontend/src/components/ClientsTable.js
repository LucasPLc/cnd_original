import React from 'react';
import styled from 'styled-components';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';

const TableWrapper = styled.div`
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary};

  th {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.muted};
    }
  }

  td {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.foreground};
    vertical-align: middle;
  }
`;

const ActionsCell = styled.td`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedForeground};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: 1.125rem;
  }
`;


const ClientsTable = ({ clients, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p>Carregando clientes...</p>;
  }

  if (clients.length === 0) {
    return (
      <TableWrapper>
        <EmptyState>
          <AlertCircle size={48} />
          <p>Nenhum cliente encontrado.</p>
          <span>Tente ajustar seus filtros ou adicione um novo cliente.</span>
        </EmptyState>
      </TableWrapper>
    )
  }

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <tr>
            <th>CNPJ</th>
            <th>Razão Social</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.cnpj}</td>
              <td>{client.razaoSocial}</td>
              <td>{client.status}</td>
              <ActionsCell>
                <InteractiveButton variant="secondary" onClick={() => onEdit(client)}>
                  <Edit size={16} />
                </InteractiveButton>
                <InteractiveButton variant="destructive" onClick={() => onDelete(client)}>
                  <Trash2 size={16} />
                </InteractiveButton>
              </ActionsCell>
            </tr>
          ))}
        </TableBody>
      </StyledTable>
    </TableWrapper>
  );
};

export default ClientsTable;
