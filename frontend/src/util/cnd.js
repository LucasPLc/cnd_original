/**
 * Converte o tipo de órgão para sua abreviação padrão.
 * Federal -> RFB, Estadual -> EST, Municipal -> MUN.
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTRO';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB') || upper.includes('NACIONAL')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return 'OUTRO';
};

/**
 * Gera o nome padrão para o arquivo de download da CND.
 * Padrão: CND_CNPJ_ORGAO_DATA.pdf
 */
export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${orgaoAbbr}_${dateStr}.pdf`;
};

/**
 * Retorna o estilo CSS para o status da certidão.
 */
export const getStatusStyle = (status) => {
    if (status === 'Concluído' || status === 'Disponível') {
        return {
            background: 'hsl(142.1, 76.2%, 90%)',
            color: 'hsl(142.1, 70.2%, 25%)',
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
        color: 'hsl(35, 92%, 25%)',
    };
};
