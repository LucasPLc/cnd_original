import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Normalizes the issuing body name to a standardized abbreviation.
 * @param {string} orgao
 * @returns {string}
 */
const normalizeOrgao = (orgao) => {
    if (!orgao) return 'ORGAO';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return upper.substring(0, 3);
};

/**
 * Standardizes the date to YYYY-MM-DD for filename use.
 * @param {string|Date} date
 * @returns {string}
 */
const formatDateForFilename = (date) => {
    if (!date) return '0000-00-00';
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        // Try parsing DD/MM/YYYY
        if (typeof date === 'string' && date.includes('/')) {
            const parts = date.split('/');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }
        return '0000-00-00';
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Centralized utility to handle CND download.
 * Fetches the full result by ID (lazy loading) and triggers browser download.
 * @param {number|string} resultadoId
 */
export const handleCndDownload = async (resultadoId) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não disponível.");
            return;
        }

        const cnpj = data.clienteCnpj ? data.clienteCnpj.replace(/[^\d]/g, '') : '00000000000000';
        const orgao = normalizeOrgao(data.orgaoEmissor);
        const dataEmissao = formatDateForFilename(data.dataEmissao);

        const fileName = `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`;

        const linkSource = `data:application/pdf;base64,${data.arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Falha ao realizar o download do arquivo.");
    }
};
