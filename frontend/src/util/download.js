import { showToast } from '../components/ui/Toast';

/**
 * Realiza o download de um arquivo PDF a partir de uma string Base64.
 */
export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        if (!base64String) {
            throw new Error("Conteúdo do arquivo não disponível.");
        }

        // Se a string não tiver o prefixo data:application/pdf;base64,, adiciona
        const pdfData = base64String.startsWith('data:')
            ? base64String
            : `data:application/pdf;base64,${base64String}`;

        const link = document.createElement('a');
        link.href = pdfData;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast.success(`Download de ${filename} iniciado.`);
    } catch (error) {
        console.error("Erro ao baixar PDF:", error);
        showToast.error("Não foi possível realizar o download do arquivo.");
    }
};
