/**
 * Converte o tipo de certidão/órgão para sua abreviação padronizada.
 * @param {string} orgao - O órgão emissor (Federal, Estadual, Municipal)
 * @returns {string} - A abreviação (RFB, EST, MUN)
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'CND';
};

/**
 * Gera o nome padronizado para o arquivo de download da CND.
 * Padrão: CND_CNPJ_ORGAO_DATA.pdf
 * @param {string} cnpj - CNPJ do cliente
 * @param {string} orgao - Órgão emissor
 * @param {string} dataEmissao - Data de emissão
 * @returns {string} - Nome do arquivo formatado
 */
export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbreviation = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${abbreviation}_${date}.pdf`;
};

/**
 * Estilos para o status da CND
 */
export const getStatusStyle = (status, theme) => {
    if (status === 'Disponível' || status === 'Concluído' || status === 'Sucesso') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    if (status === 'Erro' || status === 'Indisponível') {
        return {
            background: 'hsl(0, 72.2%, 90%)',
            color: 'hsl(0, 70.2%, 30%)',
        };
    }
    return {
        background: 'hsl(35, 92%, 90%)',
        color: 'hsl(35, 92%, 30%)',
    };
};
