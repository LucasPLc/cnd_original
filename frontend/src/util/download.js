import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'NA';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return upper.substring(0, 3);
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj || (result.cliente?.cnpj) || 'unknown';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const date = result.dataEmissao || result.dataProcessamento || new Date().toISOString();
    const formattedDate = new Date(date).toISOString().split('T')[0];

    return `CND_${cnpj.replace(/[^\d]/g, '')}_${orgao}_${formattedDate}.pdf`;
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
        showToast.error("Erro ao gerar o arquivo PDF para download.");
    }
};

export const handleCndDownload = async (resultId, setLoadingState) => {
    if (setLoadingState) setLoadingState(true);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const result = response.data;

        if (result.arquivo) {
            const filename = generateCndFilename(result);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast.error("Arquivo não encontrado para este resultado.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast.error("Falha ao baixar o arquivo CND.");
    } finally {
        if (setLoadingState) setLoadingState(false);
    }
};
