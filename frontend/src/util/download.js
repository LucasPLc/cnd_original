import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return 'OUT';
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj || (result.cliente?.cnpj) || '00000000000000';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const data = result.dataEmissao || result.dataProcessamento?.split('T')[0] || new Date().toISOString().split('T')[0];

    // Remove pontuação do CNPJ para o nome do arquivo
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');

    return `CND_${cleanCnpj}_${orgao}_${data}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

export const handleCndDownload = async (resultId, setDownloadingId = () => {}) => {
    setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const fullResult = response.data;

        if (fullResult.arquivo) {
            const filename = generateCndFilename(fullResult);
            downloadPdfFromBase64(fullResult.arquivo, filename);
            showToast.success("Download iniciado com sucesso!");
        } else {
            showToast.error("Arquivo PDF não encontrado para este resultado.");
        }
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Falha ao realizar o download do arquivo.");
    } finally {
        setDownloadingId(null);
    }
};
