import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTROS';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'OUTROS';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const formattedCnpj = cnpj.replace(/[^\d]/g, '');
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${formattedCnpj}_${abbreviatedOrgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

export const handleCndDownload = async (id, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (result.arquivo) {
            const filename = generateCndFilename(
                result.clienteCnpj || '00000000000000',
                result.orgaoEmissor || 'RFB',
                result.dataEmissao
            );
            downloadPdfFromBase64(result.arquivo, filename);
            showToast.success("Download iniciado com sucesso!");
        } else {
            showToast.error("Arquivo não encontrado para este resultado.");
        }
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
