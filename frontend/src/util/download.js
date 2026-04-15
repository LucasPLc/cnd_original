import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgaoEmissor) => {
    if (!orgaoEmissor) return 'ORGAO';
    const upper = orgaoEmissor.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return 'ORGAO';
};

export const generateCndFilename = (cnpj, orgaoEmissor, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbrev = getOrgaoAbbreviation(orgaoEmissor);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbrev}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64Content, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64Content}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao realizar download do PDF:", error);
        showToast.error("Erro ao processar o arquivo para download.");
    }
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(result.clienteCnpj, result.orgaoEmissor, result.dataEmissao);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
        }
    } catch (error) {
        console.error("Erro ao buscar detalhes da CND:", error);
        showToast.error("Falha ao buscar o arquivo da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
