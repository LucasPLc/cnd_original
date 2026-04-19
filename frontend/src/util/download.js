import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgaoEmissor) => {
    if (!orgaoEmissor) return 'CND';
    const orgao = orgaoEmissor.toUpperCase();
    if (orgao.includes('FEDERAL') || orgao.includes('RFB')) return 'RFB';
    if (orgao.includes('ESTADUAL') || orgao.includes('EST')) return 'EST';
    if (orgao.includes('MUNICIPAL') || orgao.includes('MUN')) return 'MUN';
    return orgao.substring(0, 3);
};

export const generateCndFilename = (cnpj, orgaoEmissor, dataEmissao) => {
    const cnpjClean = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
    const orgao = getOrgaoAbbreviation(orgaoEmissor);
    const data = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cnpjClean}_${orgao}_${data}.pdf`;
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
        showToast.error("Erro ao processar o arquivo PDF.");
    }
};

export const handleCndDownload = async (id, cnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo PDF não encontrado.");
            return;
        }

        const filename = generateCndFilename(cnpj, orgaoEmissor, dataEmissao);
        downloadPdfFromBase64(arquivo, filename);
        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao buscar o arquivo para download.");
    }
};
