
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'UNKNOWN';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return normalized;
};

export const generateCndFilename = (result) => {
    const cnpj = result.clienteCnpj || '00000000000000';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const date = result.dataEmissao ? result.dataEmissao : new Date().toISOString().split('T')[0];

    return `CND_${cnpj.replace(/[^\d]/g, '')}_${orgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, fileName) => {
    try {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao processar download do PDF:', error);
        throw error;
    }
};

export const handleCndDownload = async (resultId, fetchFullResult) => {
    try {
        const fullResult = await fetchFullResult(resultId);
        if (!fullResult || !fullResult.arquivo) {
            throw new Error('Arquivo não encontrado');
        }

        const filename = generateCndFilename(fullResult);
        downloadPdfFromBase64(fullResult.arquivo, filename);
    } catch (error) {
        console.error('Falha no download da CND:', error);
        throw error;
    }
};
