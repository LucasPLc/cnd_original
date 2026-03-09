export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORGAO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL')) return 'RFB';
    if (normalized.includes('ESTADUAL')) return 'EST';
    if (normalized.includes('MUNICIPAL')) return 'MUN';
    return orgao.substring(0, 3).toUpperCase();
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${orgaoAbbr}_${date}.pdf`;
};

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
