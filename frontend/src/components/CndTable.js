import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #3d68a6;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const CndTable = ({ results = [] }) => {
  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <th>CNPJ Cliente</th>
            <th>Periodicidade</th>
            <th>Status Cliente</th>
            <th>Escopos</th>
            <th>Data Processamento</th>
            <th>Status Processamento</th>
            <th>Situação Certidão</th>
            <th>Data Emissão</th>
            <th>Data Validade</th>
            <th>Código Controle</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: 'center' }}>Nenhum resultado encontrado.</td>
            </tr>
          ) : (
            results.map((result) => (
              <tr key={result.id}>
                {/* Populate with data */}
              </tr>
            ))
          )}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default CndTable;
