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

export const generateCndFilename = (resultado) => {
    const cnpj = (resultado.clienteCnpj || 'CNPJ').replace(/[^\d]/g, '');
    const orgao = getOrgaoAbbreviation(resultado.orgaoEmissor || resultado.tipoCertidao);
    const data = resultado.dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cnpj}_${orgao}_${data}.pdf`;
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
        showToast.error("Erro ao gerar o arquivo PDF para download.");
    }
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const resultado = response.data;

        if (!resultado.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta consulta.");
            return;
        }

        const filename = generateCndFilename(resultado);
        downloadPdfFromBase64(resultado.arquivo, filename);
        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Falha ao realizar o download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
