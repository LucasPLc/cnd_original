import React, { useState, useEffect } from 'react';
import theme from '../theme';

const ClientForm = ({ clientToEdit, onCreate, onUpdate, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    nomeEmpresa: '',
    periodicidade: 30,
    statusCliente: 'ATIVO',
    nacional: true,
    municipal: true,
    estadual: false,
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        id: clientToEdit.id,
        cnpj: clientToEdit.cnpj,
        nomeEmpresa: clientToEdit.empresa?.nomeEmpresa || '',
        periodicidade: clientToEdit.periodicidade,
        statusCliente: clientToEdit.statusCliente,
        nacional: clientToEdit.nacional,
        municipal: clientToEdit.municipal,
        estadual: clientToEdit.estadual,
      });
    } else {
      setFormData({
        cnpj: '',
        nomeEmpresa: '',
        periodicidade: 30,
        statusCliente: 'ATIVO',
        nacional: true,
        municipal: true,
        estadual: false,
      });
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      empresa: {
        cnpj: formData.cnpj, 
        nomeEmpresa: formData.nomeEmpresa,
      }
    };

    if (clientToEdit) {
      onUpdate(formData.id, payload);
    } else {
      onCreate(payload);
    }
  };

  // --- STYLES OBJECT ---
  const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.lg,
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151', // text-gray-700
        marginBottom: theme.spacing.xs,
    },
    input: {
        display: 'block',
        width: '100%',
        padding: `${theme.spacing.sm} ${theme.spacing.sm}`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.sm,
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    checkboxLabel: {
        marginLeft: theme.spacing.sm,
        fontSize: '0.875rem',
        color: '#111827', // text-gray-900
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: theme.spacing.md,
    },
    button: {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        fontSize: '0.875rem',
        fontWeight: 500,
        borderRadius: theme.borderRadius.md,
        border: '1px solid transparent',
        cursor: 'pointer',
    },
    buttonSecondary: {
        color: '#374151', // text-gray-700
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
    },
    buttonPrimary: {
        color: theme.colors.primaryForeground,
        backgroundColor: theme.colors.primary,
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div>
        <label htmlFor="cnpj" style={styles.label}>CNPJ</label>
        <input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="XX.XXX.XXX/XXXX-XX" required style={styles.input} />
      </div>
      <div>
        <label htmlFor="nomeEmpresa" style={styles.label}>Nome da Empresa</label>
        <input id="nomeEmpresa" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} placeholder="Digite o nome da empresa" required style={styles.input} />
      </div>
      <div>
        <label htmlFor="periodicidade" style={styles.label}>Periodicidade (dias)</label>
        <input id="periodicidade" name="periodicidade" type="number" value={formData.periodicidade} onChange={handleChange} required style={styles.input} />
      </div>
       <div>
        <label htmlFor="statusCliente" style={styles.label}>Status</label>
        <select
          id="statusCliente"
          name="statusCliente"
          value={formData.statusCliente}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </div>

      <fieldset>
        <legend style={styles.label}>Escopos</legend>
        <div style={{display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.xs}}>
          <div style={styles.checkboxContainer}>
            <input id="nacional" name="nacional" type="checkbox" checked={formData.nacional} onChange={handleChange} />
            <label htmlFor="nacional" style={styles.checkboxLabel}>Nacional</label>
          </div>
           <div style={styles.checkboxContainer}>
            <input id="municipal" name="municipal" type="checkbox" checked={formData.municipal} onChange={handleChange} />
            <label htmlFor="municipal" style={styles.checkboxLabel}>Municipal</label>
          </div>
           <div style={styles.checkboxContainer}>
            <input id="estadual" name="estadual" type="checkbox" checked={formData.estadual} onChange={handleChange} />
            <label htmlFor="estadual" style={styles.checkboxLabel}>Estadual</label>
          </div>
        </div>
      </fieldset>

      <div style={styles.buttonContainer}>
        <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>
          Cancelar
        </button>
        <button type="submit" style={{...styles.button, ...styles.buttonPrimary}}>
          {clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
