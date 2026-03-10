import axios from 'axios';
import { showToast } from '../components/ui/Toast';
import { generateCndFilename } from './cnd';

/**
 * Lazy loading for CND PDF download
 * 1. Fetch full DTO from backend (includes Base64)
 * 2. Create a blob and trigger download
 * 3. Handle errors with UI feedback
 */
export const downloadCndPdf = async (resultadoId, cnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo PDF não encontrado.");
            return;
        }

        const filename = generateCndFilename(cnpj, orgaoEmissor, dataEmissao);

        // Convert Base64 to Blob
        const byteCharacters = atob(arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Trigger browser download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Falha ao realizar o download. Tente novamente mais tarde.");
    }
};
