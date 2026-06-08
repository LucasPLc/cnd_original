import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Utility to handle CND PDF downloads with standardized naming and lazy loading.
 * @param {number|string} resultadoId - The ID of the CndResultado.
 * @param {string} clienteCnpj - Fallback CNPJ if not available in DTO.
 */
export const handleCndDownload = async (resultadoId, clienteCnpj = '') => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta consulta.");
            return;
        }

        const cnpj = data.clienteCnpj || clienteCnpj || 'CNPJ_DESCONHECIDO';
        const orgao = abbreviateOrgao(data.orgaoEmissor || data.tipoCertidao);
        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];

        const fileName = `CND_${cnpj.replace(/[^\d]/g, '')}_${orgao}_${dataEmissao}.pdf`;

        // Convert base64 to blob
        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create download link and click it
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao processar o download da certidão.");
    }
};

/**
 * Abbreviates the issuing organ for the filename.
 * @param {string} orgao
 */
const abbreviateOrgao = (orgao) => {
    if (!orgao) return 'ORGAO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RECEITA') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('FAZENDA ESTADUAL') || normalized.includes('SEFAZ')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('PREFEITURA')) return 'MUN';
    return 'ORG';
};
