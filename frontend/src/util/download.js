import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return orgao;
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/\D/g, '') : 'unknown';
    const abbrev = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbrev}_${date}.pdf`;
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

export const handleCndDownload = async (id, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(
                result.clienteCnpj || 'contribuinte',
                result.orgaoEmissor,
                result.dataEmissao
            );
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast('Arquivo não encontrado para esta certidão.', 'error');
        }
    } catch (error) {
        console.error('Erro ao buscar arquivo CND:', error);
        showToast('Erro ao baixar o arquivo. Tente novamente.', 'error');
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
