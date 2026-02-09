/**
 * Utilitários relacionados a regras de negócio de CND.
 */

/**
 * Retorna a abreviação do órgão emissor conforme solicitado na PEC-4981.
 */
export const getOrganAbbreviation = (orgao, tipo) => {
    const text = (orgao || tipo || '').toUpperCase();

    if (text.includes('FEDERAL') || text.includes('RFB')) return 'RFB';
    if (text.includes('ESTADUAL') || text.includes('SEFAZ') || text.includes('ESTADO')) return 'EST';
    if (text.includes('MUNICIPAL') || text.includes('PREFEITURA') || text.includes('MUNICIPIO')) return 'MUN';

    return 'ORG';
};

/**
 * Formata o nome do arquivo conforme o padrão: CND_CNPJ_ORGAO_DATA.pdf
 */
export const formatCNDFilename = (cnpj, orgao, tipo, data) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbrev = getOrganAbbreviation(orgao, tipo);
    const dateStr = data ? data.split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${abbrev}_${dateStr}.pdf`;
};
