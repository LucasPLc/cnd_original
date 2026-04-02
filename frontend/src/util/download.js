import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Maps the organ description to the required abbreviation (RFB, EST, MUN).
 */
export const getOrgaoAbbreviation = (orgaoEmissor) => {
    if (!orgaoEmissor) return 'ORG';
    const upper = orgaoEmissor.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return 'ORG';
};

/**
 * Generates the standardized filename: CND_CNPJ_ORGAO_DATA.pdf
 */
export const generateCndFilename = (cnpj, orgaoEmissor, dataEmissao) => {
    const cleanCnpj = (cnpj || '').replace(/[^\d]/g, '');
    const abbreviation = getOrgaoAbbreviation(orgaoEmissor);
    const date = dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbreviation}_${date}.pdf`;
};

/**
 * Triggers a browser download of a PDF from a Base64 string.
 */
export const downloadPdfFromBase64 = (base64Content, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64Content}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Error during PDF download:", error);
        showToast.error("Erro ao processar o download do arquivo.");
    }
};

/**
 * Complete workflow to download a CND by its result ID.
 * Fetches the full DTO (to get the Base64 'arquivo') and triggers the download.
 */
export const handleCndDownload = async (resultId, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const result = response.data;

        if (!result.arquivo) {
            showToast.error("Arquivo PDF não encontrado.");
            return;
        }

        const filename = generateCndFilename(
            result.clienteCnpj,
            result.orgaoEmissor,
            result.dataEmissao
        );

        downloadPdfFromBase64(result.arquivo, filename);
        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Error fetching CND for download:", error);
        showToast.error("Erro ao buscar o arquivo para download.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
