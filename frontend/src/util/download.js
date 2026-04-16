import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTROS';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return normalized;
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const formattedCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'DESCONHECIDO';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? dataEmissao : new Date().toISOString().split('T')[0];
    return `CND_${formattedCnpj}_${orgaoAbbr}_${dateStr}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao gerar o arquivo para download.");
    }
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        const filename = generateCndFilename(
            data.clienteCnpj,
            data.orgaoEmissor,
            data.dataEmissao
        );

        downloadPdfFromBase64(data.arquivo, filename);
        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao buscar arquivo CND:", error);
        showToast.error("Falha ao buscar o arquivo para download.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
