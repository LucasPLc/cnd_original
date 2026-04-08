import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return orgao;
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj || (result.cliente?.cnpj) || 'DESCONHECIDO';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor || result.tipoCertidao);
    const data = result.dataEmissao || result.dataProcessamento?.split('T')[0] || new Date().toISOString().split('T')[0];

    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    return `CND_${cleanCnpj}_${orgao}_${data}.pdf`;
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
        showToast.error("Erro ao processar o arquivo PDF para download.");
    }
};

export const handleCndDownload = async (resultId, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(result);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast.error("Arquivo PDF não encontrado para este registro.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
