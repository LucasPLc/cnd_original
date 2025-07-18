import React from 'react';
import styled from 'styled-components';
import { Plus, Search } from 'lucide-react';
import InteractiveButton from './ui/InteractiveButton';

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  width: 20px;
  height: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 40px; /* Space for the icon */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const FilterActions = ({ onFilterChange, onAddClient }) => {
  return (
    <FilterContainer>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Filtrar por CNPJ..."
          onChange={onFilterChange}
        />
      </SearchWrapper>
      <InteractiveButton onClick={onAddClient}>
        <Plus size={20} />
        Adicionar Cliente
      </InteractiveButton>
    </FilterContainer>
  );
};

export default FilterActions;
