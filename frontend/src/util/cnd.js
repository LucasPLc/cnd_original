/**
 * Maps certificate types to their standard abbreviations.
 * @param {string} tipoCertidao - "Federal", "Estadual", or "Municipal".
 * @returns {string} - "RFB", "EST", "MUN", or "ORGAO" if unknown.
 */
export const getOrgaoAbbreviation = (tipoCertidao) => {
    if (!tipoCertidao) return 'ORGAO';
    const type = tipoCertidao.toLowerCase();
    if (type.includes('federal')) return 'RFB';
    if (type.includes('estadual')) return 'EST';
    if (type.includes('municipal')) return 'MUN';
    return 'ORGAO';
};

/**
 * Generates a standardized filename for CND downloads.
 * Format: CND_CNPJ_ORGAO_DATA.pdf
 * @param {string} cnpj - The client's CNPJ.
 * @param {string} tipoCertidao - The type of certificate.
 * @param {string} dataEmissao - The issue date.
 * @returns {string} - The formatted filename.
 */
export const generateCndFilename = (cnpj, tipoCertidao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgao = getOrgaoAbbreviation(tipoCertidao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${orgao}_${date}.pdf`;
};

/**
 * Returns consistent styling for CND status badges.
 * @param {string} status - The processing status.
 * @returns {object} - CSS styles for background and color.
 */
export const getStatusStyle = (status) => {
    if (status === 'Concluído' || status === 'Disponível') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    if (status === 'Pendente' || status === 'Em processamento') {
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
