/**
 * Utilitário para download de arquivos PDF a partir de uma string Base64.
 *
 * @param {string} base64String A string base64 do arquivo.
 * @param {string} fileName O nome do arquivo para download.
 */
export const downloadBase64PDF = (base64String, fileName) => {
    try {
        // Remover prefixo data:application/pdf;base64, se existir
        const base64Content = base64String.includes(',')
            ? base64String.split(',')[1]
            : base64String;

        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Erro ao processar download do PDF:', error);
        throw error;
    }
};
