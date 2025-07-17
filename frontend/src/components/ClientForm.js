import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientForm = ({ clientToEdit, onFormSubmit, onClose }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
        <input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="XX.XXX.XXX/XXXX-XX" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="fk_empresa" className="block text-sm font-medium text-gray-700">ID da Empresa</label>
        <input id="fk_empresa" name="fk_empresa" value={formData.fk_empresa} onChange={handleChange} placeholder="ID da Empresa no sistema SAAM" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="periodicidade" className="block text-sm font-medium text-gray-700">Periodicidade (dias)</label>
        <input id="periodicidade" name="periodicidade" type="number" value={formData.periodicidade} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
      </div>
       <div>
        <label htmlFor="statusCliente" className="block text-sm font-medium text-gray-700">Status</label>
        <input id="statusCliente" name="statusCliente" value={formData.statusCliente} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-gray-700">Escopos</legend>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input id="nacional" name="nacional" type="checkbox" checked={formData.nacional} onChange={handleChange} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
            <label htmlFor="nacional" className="ml-2 block text-sm text-gray-900">Nacional</label>
          </div>
           <div className="flex items-center">
            <input id="municipal" name="municipal" type="checkbox" checked={formData.municipal} onChange={handleChange} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
            <label htmlFor="municipal" className="ml-2 block text-sm text-gray-900">Municipal</label>
          </div>
           <div className="flex items-center">
            <input id="estadual" name="estadual" type="checkbox" checked={formData.estadual} onChange={handleChange} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
            <label htmlFor="estadual" className="ml-2 block text-sm text-gray-900">Estadual</label>
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md shadow-sm hover:bg-brand-primary-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
          {clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
