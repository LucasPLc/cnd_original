import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'UNKN';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return normalized.substring(0, 3);
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${orgaoAbbr}_${dateStr}.pdf`;
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
        showToast.error("Erro ao processar o arquivo para download.");
    }
};

export const handleCndDownload = async (id, cnpj, orgao, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        const filename = generateCndFilename(cnpj, orgao, dataEmissao);
        downloadPdfFromBase64(arquivo, filename);
    } catch (error) {
        console.error("Erro ao buscar arquivo da CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    }
};
