import React, { useState, useEffect } from 'react';
import theme from '../theme';

const ClientForm = ({ clientToEdit, onCreate, onUpdate, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    nomeCliente: '',
    consultas: {
      federal: true,
      estadual: false,
      municipal: false,
    },
    municipio: '',
    periodicidade: 30,
    status: 'ATIVO',
    observacoes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        cnpj: clientToEdit.cnpj || '',
        nomeCliente: clientToEdit.nomeCliente || '',
        consultas: {
          federal: clientToEdit.consultas?.federal || false,
          estadual: clientToEdit.consultas?.estadual || false,
          municipal: clientToEdit.consultas?.municipal || false,
        },
        municipio: clientToEdit.municipio || '',
        periodicidade: clientToEdit.periodicidade || 30,
        status: clientToEdit.status || 'ATIVO',
        observacoes: clientToEdit.observacoes || '',
      });
    } else {
      // Reset form when opening for creation
      setFormData({
        cnpj: '',
        nomeCliente: '',
        consultas: { federal: true, estadual: false, municipal: false },
        municipio: '',
        periodicidade: 30,
        status: 'ATIVO',
        observacoes: '',
      });
    }
    setErrors({}); // Clear errors on open/edit
  }, [clientToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.cnpj) newErrors.cnpj = 'O campo CNPJ é obrigatório.';
    // Regex for CNPJ format
    else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
      newErrors.cnpj = 'Formato de CNPJ inválido.';
    }
    if (!formData.nomeCliente) newErrors.nomeCliente = 'O campo Nome do Cliente é obrigatório.';
    if (!Object.values(formData.consultas).some(v => v)) newErrors.consultas = 'Selecione ao menos um tipo de consulta.';
    if (formData.consultas.municipal && !formData.municipio) newErrors.municipio = 'O campo Município é obrigatório.';
    if (formData.periodicidade <= 0) newErrors.periodicidade = 'A periodicidade deve ser um número positivo.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('consulta-')) {
      const key = name.split('-')[1];
      setFormData(prev => ({ ...prev, consultas: { ...prev.consultas, [key]: checked }}));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...formData };
    if (clientToEdit) {
      onUpdate(clientToEdit.id, payload);
    } else {
      onCreate(payload);
    }
  };

  const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: theme.spacing.lg },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: theme.spacing.xs, },
    input: { display: 'block', width: '100%', padding: `${theme.spacing.sm} ${theme.spacing.sm}`, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, boxShadow: theme.shadows.sm, },
    inputError: { borderColor: theme.colors.destructive },
    errorText: { fontSize: '0.75rem', color: theme.colors.destructive, marginTop: theme.spacing.xs },
    checkboxContainer: { display: 'flex', alignItems: 'center', },
    checkboxLabel: { marginLeft: theme.spacing.sm, fontSize: '0.875rem', color: '#111827', },
    switchContainer: { display: 'flex', alignItems: 'center', gap: theme.spacing.md },
    buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, },
    button: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: '0.875rem', fontWeight: 500, borderRadius: theme.borderRadius.md, border: '1px solid transparent', cursor: 'pointer', },
    buttonSecondary: { color: '#374151', backgroundColor: theme.colors.background, borderColor: theme.colors.border, },
    buttonPrimary: { color: theme.colors.primaryForeground, backgroundColor: theme.colors.primary, }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Row 1 */}
      <div style={{display: 'flex', gap: theme.spacing.lg}}>
        <div style={{flex: 1}}>
          <label htmlFor="cnpj" style={styles.label}>CPF/CNPJ</label>
          <input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="XX.XXX.XXX/XXXX-XX" required style={{...styles.input, ...(errors.cnpj && styles.inputError)}} disabled={!!clientToEdit} />
          {errors.cnpj && <p style={styles.errorText}>{errors.cnpj}</p>}
        </div>
        <div style={{flex: 2}}>
          <label htmlFor="nomeCliente" style={styles.label}>Nome do Cliente</label>
          <input id="nomeCliente" name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} required style={{...styles.input, ...(errors.nomeCliente && styles.inputError)}} />
          {errors.nomeCliente && <p style={styles.errorText}>{errors.nomeCliente}</p>}
        </div>
      </div>

      {/* Row 2 */}
      <fieldset>
        <legend style={styles.label}>Consultas Ativas</legend>
        <div style={{display: 'flex', gap: theme.spacing.lg, marginTop: theme.spacing.xs}}>
          <div style={styles.checkboxContainer}>
            <input id="consulta-federal" name="consulta-federal" type="checkbox" checked={formData.consultas.federal} onChange={handleChange} />
            <label htmlFor="consulta-federal" style={styles.checkboxLabel}>Federal (RFB)</label>
          </div>
          <div style={styles.checkboxContainer}>
            <input id="consulta-estadual" name="consulta-estadual" type="checkbox" checked={formData.consultas.estadual} onChange={handleChange} />
            <label htmlFor="consulta-estadual" style={styles.checkboxLabel}>Estadual</label>
          </div>
          <div style={styles.checkboxContainer}>
            <input id="consulta-municipal" name="consulta-municipal" type="checkbox" checked={formData.consultas.municipal} onChange={handleChange} />
            <label htmlFor="consulta-municipal" style={styles.checkboxLabel}>Municipal</label>
          </div>
        </div>
        {errors.consultas && <p style={styles.errorText}>{errors.consultas}</p>}
      </fieldset>

      {/* Row 3 */}
      <div style={{display: 'flex', gap: theme.spacing.lg}}>
        <div style={{flex: 1}}>
          <label htmlFor="municipio" style={styles.label}>Município</label>
          <input id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} style={{...styles.input, ...(errors.municipio && styles.inputError)}} disabled={!formData.consultas.municipal || !!clientToEdit} />
          {errors.municipio && <p style={styles.errorText}>{errors.municipio}</p>}
        </div>
        <div style={{flex: 1}}>
          <label htmlFor="periodicidade" style={styles.label}>Periodicidade (dias)</label>
          <input id="periodicidade" name="periodicidade" type="number" value={formData.periodicidade} onChange={handleChange} required style={{...styles.input, ...(errors.periodicidade && styles.inputError)}} />
          {errors.periodicidade && <p style={styles.errorText}>{errors.periodicidade}</p>}
        </div>
        <div style={{flex: 1, ...styles.switchContainer}}>
            <label htmlFor="status" style={styles.label}>Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
            </select>
        </div>
      </div>

      {/* Row 4 */}
      <div>
        <label htmlFor="observacoes" style={styles.label}>Observações</label>
        <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} rows="3" style={styles.input}></textarea>
      </div>

      <div style={styles.buttonContainer}>
        <button type="button" onClick={onClose} style={{...styles.button, ...styles.buttonSecondary}}>Cancelar</button>
        <button type="submit" style={{...styles.button, ...styles.buttonPrimary}}>{clientToEdit ? 'Salvar Alterações' : 'Cadastrar'}</button>
      </div>
    </form>
  );
};

export default ClientForm;
