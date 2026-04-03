import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORGAO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return orgao;
};

export const generateCndFilename = (cnpj, orgao, dataProcessamento) => {
    const formattedCnpj = cnpj ? cnpj.replace(/\D/g, '') : '00000000000000';
    const orgaoAbbr = getOrgaoAbbreviation(orgao);
    const date = dataProcessamento ? new Date(dataProcessamento).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${formattedCnpj}_${orgaoAbbr}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64Content, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64Content}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error('Erro ao processar download do PDF:', error);
        showToast.error('Erro ao processar download do arquivo.');
    }
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);

    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const data = response.data;

        if (data && data.arquivo) {
            const filename = generateCndFilename(
                data.clienteCnpj,
                data.orgaoEmissor || data.tipoCertidao,
                data.dataProcessamento
            );
            downloadPdfFromBase64(data.arquivo, filename);
        } else {
            showToast.error('Arquivo PDF não disponível para esta consulta.');
        }
    } catch (error) {
        console.error('Erro ao buscar arquivo CND:', error);
        showToast.error('Falha ao buscar o arquivo no servidor.');
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
