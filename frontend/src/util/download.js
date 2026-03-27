import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTRO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return 'OUTRO';
};

export const generateCndFilename = (cnpj, orgao, data) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const dateStr = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
    return `CND_${cleanCnpj}_${abbreviatedOrgao}_${dateStr}.pdf`;
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
        showToast.error("Erro ao processar download do PDF.");
    }
};

export const handleCndDownload = async (id, cnpj, orgaoEmissor, dataEmissao, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const { arquivo } = response.data;
        if (arquivo) {
            const filename = generateCndFilename(cnpj, orgaoEmissor, dataEmissao);
            downloadPdfFromBase64(arquivo, filename);
        } else {
            showToast.error("Arquivo PDF não encontrado para este registro.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast.error("Erro ao realizar download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
