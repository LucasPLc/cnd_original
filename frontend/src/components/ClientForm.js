import React, { useState, useEffect } from 'react';
import theme from '../theme';
import axios from 'axios';

const ClientForm = ({ clientToEdit, onCreate, onUpdate, onClose, isOpen, error }) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    periodicidade: 30,
    statusCliente: 'ATIVO',
    nacional: true,
    municipal: true,
    estadual: false,
    fk_empresa: '',
    nomeEmpresa: '',
    municipio: '',
    observacoes: '',
  });
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        id: clientToEdit.id,
        cnpj: clientToEdit.cnpj,
        periodicidade: clientToEdit.periodicidade,
        statusCliente: clientToEdit.statusCliente,
        nacional: clientToEdit.nacional,
        municipal: clientToEdit.municipal,
        estadual: clientToEdit.estadual,
        fk_empresa: clientToEdit.empresa?.idEmpresa || '',
        nomeEmpresa: clientToEdit.empresa?.nomeEmpresa || '',
        municipio: clientToEdit.municipio || '',
        observacoes: clientToEdit.observacoes || '',
      });
    } else {
      setFormData({
        cnpj: '',
        periodicidade: 30,
        statusCliente: 'ATIVO',
        nacional: true,
        municipal: true,
        estadual: false,
        fk_empresa: '',
        nomeEmpresa: '',
        municipio: '',
        observacoes: '',
      });
    }
  }, [clientToEdit, isOpen]);

  const handleFkEmpresaChange = async (e) => {
    const idEmpresa = e.target.value;
    setFormData(prev => ({ ...prev, fk_empresa: idEmpresa, nomeEmpresa: '' }));
    if (idEmpresa) {
      setLoadingEmpresa(true);
      try {
        const response = await axios.get(`/api/empresas?saamClientId=${idEmpresa}`);
        const empresa = response.data.find(emp => emp.id === idEmpresa);
        if (empresa) {
          setFormData(prev => ({ ...prev, nomeEmpresa: empresa.nomeFantasia }));
        }
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      } finally {
        setLoadingEmpresa(false);
      }
    }
  };

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
      id: formData.id,
      cnpj: formData.cnpj,
      periodicidade: formData.periodicidade,
      statusCliente: formData.statusCliente,
      nacional: formData.nacional,
      municipal: formData.municipal,
      estadual: formData.estadual,
      municipio: formData.municipio,
      observacoes: formData.observacoes,
      empresa: {
        idEmpresa: formData.fk_empresa,
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
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <div>
        <label htmlFor="statusCliente" style={styles.label}>Status da Consulta</label>
        <select id="statusCliente" name="statusCliente" value={formData.statusCliente} onChange={handleChange} required style={styles.input}>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
        </select>
      </div>
      <div>
        <label htmlFor="cnpj" style={styles.label}>CNPJ</label>
        <input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="XX.XXX.XXX/XXXX-XX" required style={styles.input} disabled={!!clientToEdit} />
      </div>
      <div>
        <label htmlFor="fk_empresa" style={styles.label}>ID da Empresa</label>
        <input id="fk_empresa" name="fk_empresa" value={formData.fk_empresa} onChange={handleFkEmpresaChange} placeholder="ID da Empresa no sistema SAAM" required style={styles.input} disabled={!!clientToEdit} />
      </div>
      <div>
        <label htmlFor="nomeEmpresa" style={styles.label}>Nome da Empresa</label>
        <input id="nomeEmpresa" name="nomeEmpresa" value={formData.nomeEmpresa} readOnly style={{...styles.input, backgroundColor: '#f3f4f6'}} />
        {loadingEmpresa && <p>Buscando...</p>}
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
        {formData.municipal && (
            <div>
                <label htmlFor="municipio" style={styles.label}>Município</label>
                <input id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} placeholder="Município" required style={styles.input} disabled={!!clientToEdit} />
            </div>
        )}
      <div>
        <label htmlFor="periodicidade" style={styles.label}>Periodicidade (dias)</label>
        <input id="periodicidade" name="periodicidade" type="number" value={formData.periodicidade} onChange={handleChange} required style={styles.input} />
      </div>
      <div>
        <label htmlFor="observacoes" style={styles.label}>Observações</label>
        <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} style={styles.input} />
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
