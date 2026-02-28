export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const normalized = orgao.toLowerCase();
    if (normalized.includes('federal') || normalized.includes('rfb')) return 'RFB';
    if (normalized.includes('estadual') || normalized.includes('est')) return 'EST';
    if (normalized.includes('municipal') || normalized.includes('mun')) return 'MUN';
    return 'OUT';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbrev = getOrgaoAbbreviation(orgao);
    const date = dataEmissao || new Date().toISOString().split('T')[0];
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    return `CND_${cleanCnpj}_${abbrev}_${date}.pdf`;
};

export const getStatusStyle = (status, theme) => {
    const isConcluido = status === 'Concluído' || status === 'Disponível' || status === 'Sucesso';
    return {
        background: isConcluido ? 'hsl(142.1, 76.2%, 90%)' : 'hsl(35, 92%, 90%)',
        color: isConcluido ? 'hsl(142.1, 70.2%, 30%)' : 'hsl(35, 92%, 30%)',
    };
};
