import axios from 'axios';
import { showToast } from '../components/ui/Toast';

const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTRO';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'OUTRO';
};

const generateCndFilename = (result, cnpj) => {
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor || result.tipoCertidao);
    const data = result.dataEmissao ? result.dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
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
        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao gerar arquivo para download.");
    }
};

export const handleCndDownload = async (resultId, cnpj, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const resultDto = response.data;

        if (!resultDto.arquivo) {
            showToast.error("Arquivo não encontrado para este registro.");
            return;
        }

        const filename = generateCndFilename(resultDto, cnpj);
        downloadPdfFromBase64(resultDto.arquivo, filename);
    } catch (error) {
        console.error("Erro ao buscar CND para download:", error);
        showToast.error("Erro ao buscar arquivo no servidor.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
