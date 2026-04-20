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

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : 'DATA_NAO_INFORMADA';
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'CNPJ_NAO_INFORMADO';
    return `CND_${cleanCnpj}_${abbreviatedOrgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error('Erro ao processar download do PDF:', error);
        showToast.error('Erro ao processar arquivo para download.');
    }
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const data = response.data;

        if (data && data.arquivo) {
            const filename = generateCndFilename(data.clienteCnpj, data.orgaoEmissor, data.dataEmissao);
            downloadPdfFromBase64(data.arquivo, filename);
            showToast.success('Download iniciado com sucesso!');
        } else {
            showToast.error('Arquivo PDF não disponível para este registro.');
        }
    } catch (error) {
        console.error('Erro ao buscar arquivo CND:', error);
        showToast.error('Erro ao buscar arquivo para download.');
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
