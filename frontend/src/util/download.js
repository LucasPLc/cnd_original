import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Centralized utility to handle CND PDF downloads.
 * Implements lazy loading, filename standardization, and visual feedback.
 */

const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return normalized.substring(0, 3);
};

export const handleCndDownload = async (id, setDownloadingId = null) => {
    if (setDownloadingId) setDownloadingId(id);

    try {
        // Fetch full DTO with Base64 arquivo
        const response = await axios.get(`/api/resultados/${id}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo não encontrado para este resultado.");
            return;
        }

        // Standardized filename: CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
        const cnpj = (data.clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
        const orgao = getOrgaoAbbreviation(data.orgaoEmissor || data.tipoCertidao);
        const date = data.dataEmissao || new Date().toISOString().split('T')[0];
        const filename = `CND_${cnpj}_${orgao}_${date}.pdf`;

        // Trigger download
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.arquivo}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
