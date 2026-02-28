export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
        return true;
    } catch (error) {
        console.error("Erro ao realizar download do PDF:", error);
        return false;
    }
};
