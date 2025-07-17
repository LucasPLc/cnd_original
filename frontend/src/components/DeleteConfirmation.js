import React from 'react';
import styled from 'styled-components';

const ConfirmationWrapper = styled.div`
  text-align: center;
`;

const Message = styled.p`
  margin-bottom: 2rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-weight: bold;
`;

const ConfirmButton = styled(Button)`
  background-color: #d9534f;
`;

const CancelButton = styled(Button)`
  background-color: #aaa;
`;


const DeleteConfirmation = ({ onConfirm, onCancel, cnpj }) => {
  return (
    <ConfirmationWrapper>
      <h2>Confirmar Exclusão</h2>
      <Message>Tem certeza de que deseja excluir a CND para o CPF/CNPJ {cnpj}?</Message>
      <ButtonWrapper>
        <CancelButton onClick={onCancel}>Cancelar</CancelButton>
        <ConfirmButton onClick={onConfirm}>Confirmar</ConfirmButton>
      </ButtonWrapper>
    </ConfirmationWrapper>
  );
};

export default DeleteConfirmation;
