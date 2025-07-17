import React from 'react';
import styled from 'styled-components';

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.color || '#3d68a6'};
  color: white;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Actions = ({ onEdit, onDelete, onDownload, downloadDisabled }) => {
  return (
    <ActionsContainer>
      <ActionButton onClick={onEdit} color="#f0ad4e">Editar</ActionButton>
      <ActionButton onClick={onDelete} color="#d9534f">Excluir</ActionButton>
      <ActionButton onClick={onDownload} disabled={downloadDisabled}>Download</ActionButton>
    </ActionsContainer>
  );
};

export default Actions;
