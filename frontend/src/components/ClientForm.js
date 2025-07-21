import React, { useState, useEffect } from 'react';
import axios from 'axios';
import theme from '../theme';

const ClientForm = ({ clientToEdit, onCreate, onUpdate, onClose, isOpen }) => {
  const getInitialFormData = () => ({
    cnpj: '',
    nomeContribuinte: '',
    periodicidade: 30,
    statusCliente: 'ATIVO',
    nacional: true,
    municipal: false,
    estadual: false,
    municipio: '',
    orgaoEmissor: '',
    numeroCertidao: '',
    dataEmissao: '',
    dataValidade: '',
    dataUltimaConsulta: '',
    cnae: '',
    observacoes: '',
    fk_empresa: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      if (clientToEdit) {
        setFormData({
          id: clientToEdit.id,
          cnpj: clientToEdit.cnpj || '',
          nomeContribuinte: clientToEdit.nomeContribuinte || '',
          periodicidade: clientToEdit.periodicidade || 30,
          statusCliente: clientToEdit.statusCliente || 'ATIVO',
          nacional: clientToEdit.nacional || false,
          municipal: clientToEdit.municipal || false,
          estadual: clientToEdit.estadual || false,
          municipio: clientToEdit.municipio || '',
          orgaoEmissor: clientToEdit.orgaoEmissor || '',
          numeroCertidao: clientToEdit.numeroCertidao || '',
          dataEmissao: clientToEdit.dataEmissao || '',
          dataValidade: clientToEdit.dataValidade || '',
          dataUltimaConsulta: clientToEdit.dataUltimaConsulta || '',
          cnae: clientToEdit.cnae || '',
          observacoes: clientToEdit.observacoes || '',
          fk_empresa: clientToEdit.empresa?.idEmpresa || '',
        });
      } else {
        setFormData(getInitialFormData());
      }
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clientToEdit && !formData.id) {
        console.error("Tentativa de atualização sem ID de cliente.");
        return;
    }

    const payload = {
      ...formData,
      empresa: {
        idEmpresa: formData.fk_empresa,
        cnpj: "00.000.000/0000-00",
        nomeEmpresa: "Empresa Mock"
      }
    };

    if (clientToEdit) {
      onUpdate(formData.id, payload);
    } else {
      onCreate(payload);
    }
  };

  const isEditing = !!clientToEdit;

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
        color: '#374151',
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
    inputDisabled: {
        backgroundColor: '#f3f4f6', // Cor de fundo para campos desabilitados
        color: '#6b7280',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    checkboxLabel: {
        marginLeft: theme.spacing.sm,
        fontSize: '0.875rem',
        color: '#111827',
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
        color: '#374151',
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
        <input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="XX.XXX.XXX/XXXX-XX" required disabled={isEditing} style={{...styles.input, ...(isEditing && styles.inputDisabled)}} />
      </div>
      <div>
        <label htmlFor="nomeContribuinte" style={styles.label}>Nome do Contribuinte</label>
        <input id="nomeContribuinte" name="nomeContribuinte" value={formData.nomeContribuinte} onChange={handleChange} placeholder="Nome da empresa" required style={styles.input} />
      </div>
      <div>
        <label htmlFor="fk_empresa" style={styles.label}>ID da Empresa (SAAM)</label>
        <input id="fk_empresa" name="fk_empresa" value={formData.fk_empresa} onChange={handleChange} placeholder="ID da Empresa no sistema SAAM" required style={styles.input} />
      </div>
      <div>
        <label htmlFor="periodicidade" style={styles.label}>Periodicidade (dias)</label>
        <input id="periodicidade" name="periodicidade" type="number" value={formData.periodicidade} onChange={handleChange} required style={styles.input} />
      </div>
      <div>
        <label htmlFor="statusCliente" style={styles.label}>Status</label>
        <input id="statusCliente" name="statusCliente" value={formData.statusCliente} onChange={handleChange} required style={styles.input} />
      </div>

      <fieldset>
        <legend style={styles.label}>Escopos da Consulta</legend>
        <div style={{display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.xs}}>
          <div style={styles.checkboxContainer}>
            <input id="nacional" name="nacional" type="checkbox" checked={formData.nacional} onChange={handleChange} />
            <label htmlFor="nacional" style={styles.checkboxLabel}>Nacional</label>
          </div>
          <div style={styles.checkboxContainer}>
            <input id="estadual" name="estadual" type="checkbox" checked={formData.estadual} onChange={handleChange} />
            <label htmlFor="estadual" style={styles.checkboxLabel}>Estadual</label>
          </div>
          <div style={styles.checkboxContainer}>
            <input id="municipal" name="municipal" type="checkbox" checked={formData.municipal} onChange={handleChange} />
            <label htmlFor="municipal" style={styles.checkboxLabel}>Municipal</label>
          </div>
        </div>
      </fieldset>

      {formData.municipal && (
        <div>
          <label htmlFor="municipio" style={styles.label}>Município</label>
          <input id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} placeholder="Nome do Município" required={formData.municipal} disabled={isEditing} style={{...styles.input, ...(isEditing && styles.inputDisabled)}} />
        </div>
      )}

      <div>
        <label htmlFor="orgaoEmissor" style={styles.label}>Órgão Emissor</label>
        <input id="orgaoEmissor" name="orgaoEmissor" value={formData.orgaoEmissor} onChange={handleChange} placeholder="Ex: RFB, SEFAZ-SP" style={styles.input} />
      </div>
      <div>
        <label htmlFor="cnae" style={styles.label}>CNAE (Opcional)</label>
        <input id="cnae" name="cnae" value={formData.cnae} onChange={handleChange} placeholder="Código CNAE" style={styles.input} />
      </div>
      <div>
        <label htmlFor="observacoes" style={styles.label}>Observações (Opcional)</label>
        <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} rows="3" style={styles.input}></textarea>
      </div>

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
