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

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const cleanCnpj = cnpj ? cnpj.replace(/\D/g, '') : 'DESCONHECIDO';
    return `CND_${cleanCnpj}_${abbreviatedOrgao}_${dateStr}.pdf`;
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
        showToast("Erro ao processar o download do arquivo.", "error");
    }
};

export const handleCndDownload = async (id) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(result.clienteCnpj, result.orgaoEmissor, result.dataEmissao);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast("Arquivo não disponível para este registro.", "error");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast("Erro ao buscar o arquivo no servidor.", "error");
    }
};
