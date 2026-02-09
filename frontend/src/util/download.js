import axios from 'axios';

/**
 * Utilitário para baixar PDF de CND a partir do backend.
 * Faz a busca do registro completo (com o Base64) e dispara o download no navegador.
 */
export const downloadPDF = async (resultadoId, filename) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            throw new Error("Arquivo não disponível para download.");
        }

        // Converte Base64 para Blob
        const byteCharacters = atob(arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Cria link temporário para download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || `CND_${resultadoId}.pdf`);
        document.body.appendChild(link);
        link.click();

        // Limpeza
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erro ao baixar PDF:", error);
        throw error;
    }
};
