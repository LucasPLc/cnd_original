/**
 * Utility functions for CND (Certidão Negativa de Débitos) results.
 */

/**
 * Maps organ types to their standard abbreviations.
 * @param {string} tipoCertidao - The type of certificate (e.g., 'Federal', 'Estadual', 'Municipal').
 * @returns {string} The abbreviation (RFB, EST, MUN) or the original string if no mapping found.
 */
export const getOrgaoAbbreviation = (tipoCertidao) => {
    if (!tipoCertidao) return 'ORGAO';

    const mapping = {
        'Federal': 'RFB',
        'Estadual': 'EST',
        'Municipal': 'MUN'
    };

    return mapping[tipoCertidao] || tipoCertidao.toUpperCase();
};

/**
 * Generates a standardized filename for CND PDF downloads.
 * Pattern: CND_{CNPJ}_{ORGAO}_{DATA}.pdf
 *
 * @param {string} cnpj - The CNPJ of the client.
 * @param {string} tipoCertidao - The type of certificate.
 * @param {string} dataEmissao - The emission date.
 * @returns {string} The standardized filename.
 */
export const generateCndFilename = (cnpj, tipoCertidao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgao = getOrgaoAbbreviation(tipoCertidao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${orgao}_${date}.pdf`;
};
