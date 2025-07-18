import React from 'react';
import styled from 'styled-components';
import { ShieldCheck } from 'lucide-react';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryForeground};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center; /* Centraliza o conteúdo */
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LogoIcon = styled(ShieldCheck)`
  width: 40px;
  height: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 32px;
    height: 32px;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryForeground}; /* Garante que o h1 no header seja branco */
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoIcon />
        <Title>CND Control</Title>
      </LogoContainer>
    </HeaderContainer>
  );
};

export default Header;
