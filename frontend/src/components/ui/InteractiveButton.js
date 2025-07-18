import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
    border: 1px solid ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryVariant};
      border-color: ${({ theme }) => theme.colors.primaryVariant};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.secondaryForeground};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.border};
    }
  `,
  destructive: css`
    background-color: ${({ theme }) => theme.colors.destructive};
    color: ${({ theme }) => theme.colors.destructiveForeground};
    border: 1px solid ${({ theme }) => theme.colors.destructive};

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
};

const InteractiveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.1s ease;
  white-space: nowrap;

  ${({ variant = 'primary' }) => variants[variant]}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export default InteractiveButton;
