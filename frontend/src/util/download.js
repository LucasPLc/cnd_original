import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Maps organ or certificate type to its standard abbreviation (RFB, EST, MUN).
 */
export const getOrgaoAbbreviation = (orgao, tipo) => {
    const text = (orgao || tipo || '').toUpperCase();

    if (text.includes('FEDERAL') || text.includes('RFB')) return 'RFB';
    if (text.includes('ESTADUAL') || text.includes('EST')) return 'EST';
    if (text.includes('MUNICIPAL') || text.includes('MUN')) return 'MUN';

    return 'ORG'; // Fallback
};

/**
 * Generates the standardized filename for the CND PDF.
 * Padrão: CND_CNPJ_ORGAO_DATA.pdf
 */
export const generateCndFilename = (cnpj, orgao, tipo, dataEmissao) => {
    const cleanCnpj = (cnpj || '').replace(/[^\d]/g, '');
    const abbrev = getOrgaoAbbreviation(orgao, tipo);
    const date = dataEmissao || new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${abbrev}_${date}.pdf`;
};

/**
 * Triggers a file download in the browser from a Base64 string.
 */
export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
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
 * Fetches the full CND result (including the PDF file) and triggers the download.
 */
export const handleCndDownload = async (resultId, cnpj) => {
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        const filename = generateCndFilename(
            cnpj || data.clienteCnpj, // Fallback to whatever CNPJ we can find
            data.orgaoEmissor,
            data.tipoCertidao,
            data.dataEmissao
        );

        downloadPdfFromBase64(data.arquivo, filename);
        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao buscar arquivo da CND:", error);
        showToast.error("Erro ao realizar download do arquivo.");
    }
};
