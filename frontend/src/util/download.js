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

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cnpj || 'UNKNOWN'}_${abbreviatedOrgao}_${dateStr}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error('Erro ao processar download do PDF:', error);
        showToast('Erro ao processar o arquivo PDF para download.', 'error');
    }
};

export const handleCndDownload = async (id, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(result.clienteCnpj, result.orgaoEmissor, result.dataEmissao);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast('Arquivo não disponível para este resultado.', 'error');
        }
    } catch (error) {
        console.error('Erro ao baixar CND:', error);
        showToast('Ocorreu um erro ao tentar baixar o arquivo CND.', 'error');
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
