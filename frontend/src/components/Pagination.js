import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#3d68a6' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 4px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <PaginationContainer>
      <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </PageButton>
      {pages.map(page => (
        <PageButton key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
          {page}
        </PageButton>
      ))}
      <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Próximo
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
