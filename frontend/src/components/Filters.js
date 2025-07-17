import React, { useState } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #35518a;
  color: white;
`;

const Filters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    cnpj: '',
    nomeContribuinte: '',
    situacaoCertidao: '',
    statusProcessamento: '',
    periodoInicio: '',
    periodoFim: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilter(filters);
  };

  return (
    <FilterContainer>
      <Input name="cnpj" value={filters.cnpj} onChange={handleChange} placeholder="CNPJ" />
      <Input name="nomeContribuinte" value={filters.nomeContribuinte} onChange={handleChange} placeholder="Nome do Contribuinte" />
      <Input name="situacaoCertidao" value={filters.situacaoCertidao} onChange={handleChange} placeholder="Situação da Certidão" />
      <Input name="statusProcessamento" value={filters.statusProcessamento} onChange={handleChange} placeholder="Status do Processamento" />
      <Input name="periodoInicio" type="date" value={filters.periodoInicio} onChange={handleChange} />
      <Input name="periodoFim" type="date" value={filters.periodoFim} onChange={handleChange} />
      <Button onClick={handleApply}>Filtrar</Button>
    </FilterContainer>
  );
};

export default Filters;
