import axios from 'axios';
import { showToast } from '../components/ui/Toast';
import { generateCndFilename } from './cnd';

/**
 * Triggers a browser download of a PDF file.
 * @param {string} base64 - The PDF content as a Base64 string.
 * @param {string} filename - The name to save the file as.
 */
export const downloadBase64Pdf = (base64, filename) => {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erro ao converter base64 para PDF:", error);
        showToast.error("Erro ao processar o arquivo PDF.");
    }
};

/**
 * Handles the logic for downloading a CND result.
 * Fetches the full result (including Base64 content) if necessary.
 * @param {object} result - The CND result object (may be partial).
 * @param {string} cnpj - The CNPJ for the filename.
 */
export const handleCndDownload = async (result, cnpj) => {
    if (!result || !result.id) {
        showToast.error("ID do resultado inválido.");
        return;
    }

    const filename = generateCndFilename(
        cnpj || (result.cliente?.cnpj),
        result.tipoCertidao || result.orgaoEmissor,
        result.dataEmissao
    );

    // If base64 content is already present, download it immediately
    if (result.arquivo) {
        downloadBase64Pdf(result.arquivo, filename);
        showToast.success("Download iniciado.");
        return;
    }

    // Otherwise, fetch the full result from the backend
    try {
        const response = await axios.get(`/api/resultados/${result.id}`);
        const fullResult = response.data;
        if (fullResult && fullResult.arquivo) {
            downloadBase64Pdf(fullResult.arquivo, filename);
            showToast.success("Download iniciado.");
        } else {
            showToast.error("Arquivo PDF não encontrado no servidor.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo PDF:", error);
        showToast.error("Erro ao baixar o PDF. Verifique os logs.");
    }
};
