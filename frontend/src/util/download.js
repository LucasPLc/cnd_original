import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'OUT';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${orgaoAbbr}_${date}.pdf`;
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
        showToast.error("Erro ao baixar o arquivo PDF.");
    }
};

export const handleCndDownload = async (resultId, cnpj, orgao, dataEmissao, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const resultData = response.data;

        if (resultData && resultData.arquivo) {
            const filename = generateCndFilename(cnpj, orgao || resultData.orgaoEmissor, dataEmissao || resultData.dataEmissao);
            downloadPdfFromBase64(resultData.arquivo, filename);
        } else {
            showToast.error("Arquivo PDF não encontrado para este resultado.");
        }
    } catch (error) {
        console.error("Erro ao buscar resultado para download:", error);
        showToast.error("Erro ao buscar o arquivo para download.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
