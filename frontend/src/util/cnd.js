import theme from '../theme';

/**
 * Retorna a abreviação do órgão emissor com base no nome completo ou tipo.
 * @param {string} orgao - Nome do órgão ou tipo (Federal, Estadual, Municipal)
 * @returns {string} - RFB, EST ou MUN
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const normalized = orgao.toLowerCase();
    if (normalized.includes('federal') || normalized.includes('receita') || normalized.includes('rfb')) return 'RFB';
    if (normalized.includes('estadual') || normalized.includes('sefaz') || normalized.includes('est')) return 'EST';
    if (normalized.includes('municipal') || normalized.includes('prefeitura') || normalized.includes('mun')) return 'MUN';
    return 'CND';
};

/**
 * Gera o nome padronizado para o arquivo de download.
 * Padrão: CND_CNPJ_ORGAO_DATA.pdf
 * @param {string} cnpj - CNPJ do cliente
 * @param {string} orgao - Órgão emissor
 * @param {string|Date} dataEmissao - Data de emissão
 * @returns {string} - Nome do arquivo
 */
export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbrev = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbrev}_${dateStr}.pdf`;
};

/**
 * Retorna o estilo para o badge de status da CND.
 * @param {string} status - Status da CND
 * @returns {object} - Objeto de estilo { background, color }
 */
export const getStatusStyle = (status) => {
    if (status === 'Concluído' || status === 'Disponível') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    if (status === 'Pendente') {
        return {
            background: 'hsl(35, 92%, 90%)',
            color: 'hsl(35, 92%, 30%)',
        };
    }
    return {
        background: 'hsl(0, 72.2%, 90%)',
        color: 'hsl(0, 70.2%, 30%)',
    };
};
