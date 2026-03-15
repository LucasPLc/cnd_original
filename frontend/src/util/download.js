/**
 * Utilitário para download de arquivos PDF.
 */

/**
 * Mapeia o órgão emissor para sua abreviação padrão.
 * Federal -> RFB, Estadual -> EST, Municipal -> MUN.
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const normalized = orgao.toLowerCase();
    if (normalized.includes('federal')) return 'RFB';
    if (normalized.includes('estadual')) return 'EST';
    if (normalized.includes('municipal')) return 'MUN';
    return 'OUT';
};

/**
 * Gera o nome do arquivo seguindo o padrão CND_CNPJ_ORGAO_DATA.pdf.
 */
export const generateCndFilename = (cnpj, orgao, data) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const dateStr = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${orgaoAbbr}_${dateStr}.pdf`;
};

/**
 * Realiza o download de um arquivo PDF a partir de uma string Base64.
 */
export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao realizar o download do PDF:", error);
        throw new Error("Falha ao processar o arquivo para download.");
    }
};
