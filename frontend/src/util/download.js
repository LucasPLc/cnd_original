import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'UNKNOWN';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return upper;
};

export const generateCndFilename = (result) => {
    const cnpj = result.cliente?.cnpj || result.clienteCnpj || '00000000000000';
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const date = result.dataEmissao || result.dataProcessamento || new Date().toISOString();
    const formattedDate = new Date(date).toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${orgao}_${formattedDate}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao processar o arquivo para download.");
    }
};

export const handleCndDownload = async (resultId, resultSummary, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const fullResult = response.data;

        if (fullResult && fullResult.arquivo) {
            const filename = generateCndFilename({ ...resultSummary, ...fullResult });
            downloadPdfFromBase64(fullResult.arquivo, filename);
            showToast.success("Download iniciado!");
        } else {
            showToast.error("Arquivo não encontrado para este resultado.");
        }
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao buscar arquivo da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
