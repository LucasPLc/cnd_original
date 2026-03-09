/**
 * Handles PDF download from a Base64 string.
 * @param {string} base64 - The Base64 string of the PDF content.
 * @param {string} filename - The name to save the file as.
 */
export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao realizar o download do PDF:", error);
        throw new Error("Falha ao gerar o arquivo para download.");
    }
};
