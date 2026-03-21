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

export const generateCndFilename = (cnpj, orgao, data) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const formattedCnpj = cnpj.replace(/[^\d]/g, '');
    const datePart = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${formattedCnpj}_${abbreviatedOrgao}_${datePart}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao gerar o arquivo PDF.");
    }
};

export const handleCndDownload = async (id, cnpj, orgao, data) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(cnpj, orgao || result.orgaoEmissor, data || result.dataEmissao);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast.error("Arquivo não encontrado no servidor.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast.error("Erro ao buscar o arquivo para download.");
    }
};
