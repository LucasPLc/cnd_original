import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InteractiveButton from './ui/InteractiveButton';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.foreground};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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

  &:disabled {
      background-color: ${({ theme }) => theme.colors.muted};
      cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ClientForm = ({ clientToEdit, onCreate, onUpdate, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (clientToEdit) {
        setFormData({
          cnpj: clientToEdit.cnpj || '',
          razaoSocial: clientToEdit.razaoSocial || '',
          email: clientToEdit.email || '',
        });
      } else {
        setFormData({ cnpj: '', razaoSocial: '', email: '' });
      }
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientToEdit) {
      onUpdate(clientToEdit.id, formData);
    } else {
      onCreate(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          type="text"
          id="cnpj"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          required
          disabled={!!clientToEdit} // Desabilita edição de CNPJ
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="razaoSocial">Razão Social</Label>
        <Input
          type="text"
          id="razaoSocial"
          name="razaoSocial"
          value={formData.razaoSocial}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <ButtonContainer>
        <InteractiveButton type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </InteractiveButton>
        <InteractiveButton type="submit">
          {clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </InteractiveButton>
      </ButtonContainer>
    </Form>
  );
};

export default ClientForm;
