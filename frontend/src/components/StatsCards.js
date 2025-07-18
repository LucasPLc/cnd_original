import React from 'react';
import styled from 'styled-components';
import { Users, ListFilter, CheckCircle } from 'lucide-react';

const CardsContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const IconWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const CardContent = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const StatsCards = ({ total, filtered, selected }) => {
  const stats = [
    {
      label: 'Total de Clientes',
      value: total,
      icon: <Users size={24} />,
    },
    {
      label: 'Clientes na Visualização',
      value: filtered,
      icon: <ListFilter size={24} />,
    },
    {
      label: 'Selecionados',
      value: selected,
      icon: <CheckCircle size={24} />,
    },
  ];

  return (
    <CardsContainer>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <IconWrapper>{stat.icon}</IconWrapper>
          <CardContent>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </CardsContainer>
  );
};

export default StatsCards;
