/**
 * Retorna a abreviação do órgão emissor para o padrão de nome de arquivo.
 * @param {string} orgao Nome do órgão emissor.
 * @returns {string} Abreviação (RFB, EST, MUN ou ORG).
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORG';
    const lowerOrgao = orgao.toLowerCase();
    if (lowerOrgao.includes('federal') || lowerOrgao.includes('receita')) return 'RFB';
    if (lowerOrgao.includes('estadual') || lowerOrgao.includes('fazenda')) return 'EST';
    if (lowerOrgao.includes('municipal') || lowerOrgao.includes('prefeitura')) return 'MUN';
    return 'ORG';
};

/**
 * Retorna o estilo para o badge de status.
 * @param {string} status O status do resultado.
 * @returns {object} Objeto com background e color.
 */
export const getStatusStyle = (status) => {
    if (status === 'Concluído' || status === 'Disponível') {
        return {
            background: 'hsl(142.1, 76.2%, 80%)',
            color: 'hsl(142.1, 70.2%, 25%)',
        };
    }
    return {
        background: 'hsl(35, 92%, 80%)',
        color: 'hsl(35, 92%, 25%)',
    };
};
