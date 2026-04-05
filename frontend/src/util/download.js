import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTRO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return orgao;
};

export const generateCndFilename = (cnpj, orgao, dataProcessamento) => {
    const abbreviatedOrgao = getOrgaoAbbreviation(orgao);
    const date = dataProcessamento ? dataProcessamento.split('T')[0] : new Date().toISOString().split('T')[0];
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
    return `CND_${cleanCnpj}_${abbreviatedOrgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erro ao processar PDF para download:", error);
        showToast.error("Erro ao baixar o arquivo PDF.");
    }
};

export const handleCndDownload = async (resultadoId, cnpj, orgao, dataProcessamento) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const fullResult = response.data;

        if (!fullResult.arquivo) {
            showToast.error("Arquivo não encontrado.");
            return;
        }

        const filename = generateCndFilename(cnpj || fullResult.clienteCnpj, orgao || fullResult.orgaoEmissor, dataProcessamento || fullResult.dataProcessamento);
        downloadPdfFromBase64(fullResult.arquivo, filename);
    } catch (error) {
        console.error("Erro ao buscar detalhes da CND para download:", error);
        showToast.error("Erro ao processar o download da CND.");
    }
};
