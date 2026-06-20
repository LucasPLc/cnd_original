import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Utility to handle CND PDF download with standardized filename.
 * Pattern: CND_{CNPJ}_{ORGAO}_{DATE}.pdf
 */
export const handleCndDownload = async (resultadoId, clienteCnpj, orgaoEmissor) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo não encontrado para este resultado.");
            return;
        }

        // Standardize Organ abbreviation
        let orgaoAbbr = 'OUTRO';
        const orgaoUpper = (orgaoEmissor || '').toUpperCase();
        if (orgaoUpper.includes('FEDERAL') || orgaoUpper.includes('RFB')) {
            orgaoAbbr = 'RFB';
        } else if (orgaoUpper.includes('ESTADUAL') || orgaoUpper.includes('EST')) {
            orgaoAbbr = 'EST';
        } else if (orgaoUpper.includes('MUNICIPAL') || orgaoUpper.includes('MUN')) {
            orgaoAbbr = 'MUN';
        }

        // Standardize Date
        const dateStr = data.dataEmissao || new Date(data.dataProcessamento).toISOString().split('T')[0];

        // Clean CNPJ (numbers only)
        const cleanCnpj = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');

        const fileName = `CND_${cleanCnpj}_${orgaoAbbr}_${dateStr}.pdf`;

        // Create blob from base64
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
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da certidão.");
    }
};
