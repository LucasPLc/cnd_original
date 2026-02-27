export const getOrganAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('PREFEITURA')) return 'MUN';
    return 'OUT';
};

export const getStatusStyle = (status) => {
    if (status === 'Concluído' || status === 'Disponível') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 30%)',
        };
    }
    if (status === 'Erro' || status === 'Falha') {
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
