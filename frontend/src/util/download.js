import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgaoEmissor) => {
    if (!orgaoEmissor) return 'ORG';
    const orgao = orgaoEmissor.toUpperCase();
    if (orgao.includes('FEDERAL') || orgao.includes('RFB')) return 'RFB';
    if (orgao.includes('ESTADUAL') || orgao.includes('EST')) return 'EST';
    if (orgao.includes('MUNICIPAL') || orgao.includes('MUN')) return 'MUN';
    return 'ORG';
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj || 'CNPJ';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const data = result.dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cnpj}_${orgao}_${data}.pdf`;
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
        showToast.error("Erro ao processar o arquivo PDF.");
    }
};

export const handleCndDownload = async (id, cnpj, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;
        if (result && result.arquivo) {
            const filename = generateCndFilename({ ...result, clienteCnpj: cnpj || result.clienteCnpj });
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast.error("Arquivo PDF não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast.error("Erro ao buscar o arquivo da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
