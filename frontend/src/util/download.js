/**
 * Utilitário para realizar o download de um arquivo Base64 como PDF.
 * @param {string} base64Data - Conteúdo do arquivo em Base64
 * @param {string} filename - Nome desejado para o arquivo
 */
export const downloadBase64PDF = (base64Data, filename) => {
    if (!base64Data) {
        throw new Error("Dados do arquivo não fornecidos.");
    }

    try {
        const linkSource = `data:application/pdf;base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        throw error;
    }
};
