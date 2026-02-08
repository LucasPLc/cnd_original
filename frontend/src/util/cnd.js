export const getOrgaoAbbreviation = (tipoCertidao) => {
    if (!tipoCertidao) return 'OUT';

    const tipo = tipoCertidao.toLowerCase();

    if (tipo.includes('federal')) return 'RFB';
    if (tipo.includes('estadual')) return 'EST';
    if (tipo.includes('municipal')) return 'MUN';

    return 'OUT';
};
