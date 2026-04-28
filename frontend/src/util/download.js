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
    const cnpj = result.clienteCnpj || result.cliente?.cnpj || 'unknown';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const dataEmissao = result.dataEmissao ? result.dataEmissao : new Date().toISOString().split('T')[0];
    return `CND_${cnpj.replace(/[^\d]/g, '')}_${orgao}_${dataEmissao}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

export const handleCndDownload = async (id, setDownloadingId = () => {}) => {
    try {
        setDownloadingId(id);
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result.arquivo) {
            const filename = generateCndFilename(result);
            downloadPdfFromBase64(result.arquivo, filename);
            showToast.success("Download iniciado com sucesso!");
        } else {
            showToast.error("Arquivo não encontrado para este resultado.");
        }
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download do arquivo.");
    } finally {
        setDownloadingId(null);
    }
};
