import axios from 'axios';

/**
 * Maps the orgao string to its abbreviation.
 * @param {string} orgao
 * @returns {string}
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'OUT';
};

/**
 * Generates the standardized filename for the CND PDF.
 * Padrão: CND_CNPJ_ORGAO_DATA.pdf
 * @param {string} cnpj
 * @param {string} orgao
 * @param {string} dataEmissao
 * @returns {string}
 */
export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
    const abbreviation = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbreviation}_${date}.pdf`;
};

/**
 * Triggers the browser download for a PDF file from a Base64 string.
 * @param {string} base64
 * @param {string} filename
 */
export const downloadPdfFromBase64 = (base64, filename) => {
    const linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

/**
 * Fetches the full CndResultadoDTO by ID and triggers the download.
 * @param {number} id
 */
export const handleCndDownload = async (id) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;
        if (result && result.arquivo) {
            const filename = generateCndFilename(result.clienteCnpj, result.orgaoEmissor, result.dataEmissao);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            throw new Error("Arquivo não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        throw error;
    }
};
