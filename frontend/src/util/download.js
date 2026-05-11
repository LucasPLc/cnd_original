export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORGAO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return 'ORGAO';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao : new Date().toISOString().split('T')[0];
    return `CND_${cnpj || 'UNKNOWN'}_${abbreviatedOrgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        throw error;
    }
};
