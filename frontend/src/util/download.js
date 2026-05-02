import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return 'OUT';
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj || result.cliente?.cnpj || 'UNKNOWN';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const date = result.dataEmissao ? result.dataEmissao : new Date().toISOString().split('T')[0];

    return `CND_${cnpj.replace(/[^\d]/g, '')}_${orgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

export const handleCndDownload = async (resultId, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const result = response.data;

        if (!result.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        const filename = generateCndFilename(result);
        downloadPdfFromBase64(result.arquivo, filename);
        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
