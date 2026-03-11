export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORGAO';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'ORGAO';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${orgaoAbbr}_${dateStr}.pdf`;
};

export const getStatusStyle = (status) => {
    if (status === 'Disponível' || status === 'Concluído') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    return {
        background: 'hsl(35, 92%, 90%)',
        color: 'hsl(35, 92%, 30%)',
    };
};
