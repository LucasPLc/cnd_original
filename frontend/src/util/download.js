/**
 * Maps the organ name to its abbreviation as per the requirements.
 * Federal(RFB), Municipal (MUN), Estadual(EST)
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTRO';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'OUTRO';
};

/**
 * Generates the standardized filename: CND_CNPJ_ORGAO_DATA.pdf
 */
export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbrev = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbrev}_${date}.pdf`;
};

/**
 * Triggers a browser download from a Base64 string.
 */
export const downloadPdfFromBase64 = (base64String, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64String}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        throw new Error("Falha ao gerar o arquivo PDF para download.");
    }
};

/**
 * Shared CND download logic to avoid duplication.
 */
export const handleCndDownload = async (resultId, cnpj, setDownloadingId, axios, showToast) => {
    setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const { arquivo, orgaoEmissor, dataEmissao } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo PDF não encontrado no servidor.");
            return;
        }

        const filename = generateCndFilename(cnpj, orgaoEmissor, dataEmissao);
        downloadPdfFromBase64(arquivo, filename);
        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Falha ao realizar download da CND.");
    } finally {
        setDownloadingId(null);
    }
};
