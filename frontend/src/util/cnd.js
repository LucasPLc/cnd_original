export const getOrgaoAbbreviation = (tipoCertidao) => {
    if (!tipoCertidao) return 'OUT';
    const tipo = tipoCertidao.toUpperCase();
    if (tipo.includes('FEDERAL')) return 'RFB';
    if (tipo.includes('ESTADUAL')) return 'EST';
    if (tipo.includes('MUNICIPAL')) return 'MUN';
    return 'OUT';
};

export const generateCndFilename = (cnpj, tipoCertidao, dataEmissao) => {
    const orgao = getOrgaoAbbreviation(tipoCertidao);
    const data = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    return `CND_${cleanCnpj}_${orgao}_${data}.pdf`;
};

export const getStatusStyle = (status) => {
    if (status === 'Disponível' || status === 'Concluído') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    return {
        background: 'hsl(0, 72.2%, 90%)',
        color: 'hsl(0, 70.2%, 30%)',
    };
};
