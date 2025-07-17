import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #35518a;
  color: white;
  font-weight: bold;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClientForm = ({ clientToEdit, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    periodicidade: 30,
    statusCliente: 'ATIVO',
    nacional: true,
    municipal: true,
    estadual: false,
    fk_empresa: '',
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        cnpj: clientToEdit.cnpj,
        periodicidade: clientToEdit.periodicidade,
        statusCliente: clientToEdit.statusCliente,
        nacional: clientToEdit.nacional,
        municipal: clientToEdit.municipal,
        estadual: clientToEdit.estadual,
        fk_empresa: clientToEdit.empresa.idEmpresa,
      });
    }
  }, [clientToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ...formData,
      empresa: {
        idEmpresa: formData.fk_empresa,
        cnpj: "00.000.000/0000-00", // Mock or fetch real data if needed
        nomeEmpresa: "Empresa Mock" // Mock or fetch real data if needed
      }
    };
    delete payload.fk_empresa;

    try {
      if (clientToEdit) {
        await axios.put(`/api/clientes/${clientToEdit.id}`, payload);
      } else {
        await axios.post('/api/clientes', payload);
      }
      onFormSubmit();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>{clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}</h2>
      <Input name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ (XX.XXX.XXX/XXXX-XX)" required />
      <Input name="periodicidade" type="number" value={formData.periodicidade} onChange={handleChange} placeholder="Periodicidade" required />
      <Input name="statusCliente" value={formData.statusCliente} onChange={handleChange} placeholder="Status" required />
      <Input name="fk_empresa" value={formData.fk_empresa} onChange={handleChange} placeholder="ID da Empresa" required />

      <CheckboxContainer>
        <input type="checkbox" name="nacional" checked={formData.nacional} onChange={handleChange} />
        <label>Nacional</label>
      </CheckboxContainer>
      <CheckboxContainer>
        <input type="checkbox" name="municipal" checked={formData.municipal} onChange={handleChange} />
        <label>Municipal</label>
      </CheckboxContainer>
      <CheckboxContainer>
        <input type="checkbox" name="estadual" checked={formData.estadual} onChange={handleChange} />
        <label>Estadual</label>
      </CheckboxContainer>

      <Button type="submit">{clientToEdit ? 'Salvar Alterações' : 'Cadastrar'}</Button>
    </Form>
  );
};

export default ClientForm;
