import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return orgao;
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj?.replace(/[^\d]/g, '') || '00000000000000';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const dataEmissao = result.dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao baixar PDF:", error);
        showToast.error("Erro ao gerar o arquivo para download.");
    }
};

export const handleCndDownload = async (id, setDownloadingId = () => {}) => {
    setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result && result.arquivo) {
            const filename = generateCndFilename(result);
            downloadPdfFromBase64(result.arquivo, filename);
        } else {
            showToast.error("Arquivo PDF não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao buscar o arquivo no servidor.");
    } finally {
        setDownloadingId(null);
    }
};
