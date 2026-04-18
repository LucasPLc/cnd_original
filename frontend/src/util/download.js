import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Abbreviates the organ name based on predefined rules.
 * @param {string} orgao - The full name of the organ.
 * @returns {string} The abbreviation.
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORG';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return orgao.substring(0, 3).toUpperCase();
};

/**
 * Generates a standardized filename for CND downloads.
 * Format: CND_CNPJ_ORGAO_DATA.pdf
 * @param {object} result - The CND result object.
 * @returns {string} The formatted filename.
 */
export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj ? result.clienteCnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const date = result.dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cnpj}_${orgao}_${date}.pdf`;
};

/**
 * Triggers a browser download of a PDF from a base64 string.
 * @param {string} base64Data - The base64 encoded PDF content.
 * @param {string} filename - The desired filename.
 */
export const downloadPdfFromBase64 = (base64Data, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao processar o arquivo para download.");
    }
};

/**
 * Handles the complete lifecycle of fetching and downloading a CND PDF.
 * @param {number|string} resultId - The ID of the CND result.
 * @returns {Promise<void>}
 */
export const handleCndDownload = async (resultId) => {
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const result = response.data;

        if (!result.arquivo) {
            showToast.error("Arquivo não encontrado para este registro.");
            return;
        }

        const filename = generateCndFilename(result);
        downloadPdfFromBase64(result.arquivo, filename);
        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        const message = error.response?.status === 404
            ? "Registro de CND não encontrado."
            : "Erro ao realizar o download da CND.";
        showToast.error(message);
    }
};
