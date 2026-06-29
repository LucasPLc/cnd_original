import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Utility to handle CND PDF download.
 * Fetches the full result by ID, converts Base64 to Blob, and triggers download with standardized filename.
 */
export const handleCndDownload = async (resultId, clienteCnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo não encontrado para este resultado.");
            return;
        }

        // Standardize Organ (Federal -> RFB, Municipal -> MUN, Estadual -> EST)
        const orgaoMap = {
            'Federal': 'RFB',
            'Municipal': 'MUN',
            'Estadual': 'EST'
        };
        const orgaoAbbr = orgaoMap[orgaoEmissor] || orgaoEmissor || 'ORGAO';

        // Format date (YYYY-MM-DD)
        const dateStr = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        // Clean CNPJ (only numbers)
        const cleanCnpj = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');

        const filename = `CND_${cleanCnpj}_${orgaoAbbr}_${dateStr}.pdf`;

        // Convert Base64 to Blob
        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao processar o download do arquivo.");
    }
};
