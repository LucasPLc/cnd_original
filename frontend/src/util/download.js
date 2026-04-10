import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTRO';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return 'OUTRO';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
    const abbr = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbr}_${date}.pdf`;
};

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

export const handleCndDownload = async (id, clientCnpj, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (!result.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        const filename = generateCndFilename(
            result.clienteCnpj || clientCnpj,
            result.orgaoEmissor,
            result.dataEmissao
        );

        downloadPdfFromBase64(result.arquivo, filename);
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao baixar o arquivo PDF.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
