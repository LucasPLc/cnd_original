/**
 * Map organ types to their standard abbreviations
 * Federal -> RFB
 * Estadual -> EST
 * Municipal -> MUN
 */
export const getOrgaoAbbreviation = (tipoCertidao) => {
    if (!tipoCertidao) return 'ORGAO';
    const mapping = {
        'Federal': 'RFB',
        'Estadual': 'EST',
        'Municipal': 'MUN'
    };
    return mapping[tipoCertidao] || tipoCertidao.toUpperCase().substring(0, 3);
};

/**
 * Generate filename based on standard: CND_CNPJ_ORGAO_DATA.pdf
 */
export const generateCndFilename = (cnpj, orgaoEmissor, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgao = getOrgaoAbbreviation(orgaoEmissor);
    const date = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${orgao}_${date}.pdf`;
};

/**
 * Common status styling for CND results
 */
export const getStatusStyle = (status) => {
    if (status === 'Concluído' || status === 'Disponível') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    if (status === 'Pendente' || status === 'Processando') {
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
