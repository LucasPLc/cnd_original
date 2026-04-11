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

export const generateCndFilename = (cnpj, orgao, dataProcessamento) => {
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const date = dataProcessamento ? dataProcessamento.split('T')[0] : new Date().toISOString().split('T')[0];
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
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
        console.error('Erro ao processar download:', error);
        showToast('Erro ao processar o arquivo para download.', 'error');
    }
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const data = response.data;

        if (data.arquivo) {
            const filename = generateCndFilename(data.clienteCnpj, data.orgaoEmissor, data.dataProcessamento);
            downloadPdfFromBase64(data.arquivo, filename);
        } else {
            showToast('Arquivo PDF não encontrado para esta consulta.', 'error');
        }
    } catch (error) {
        console.error('Erro ao buscar CND para download:', error);
        showToast('Erro ao realizar o download da CND. Tente novamente.', 'error');
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
