/**
 * Downloads a file from a Base64 string.
 * @param {string} base64 - The base64 string.
 * @param {string} filename - The filename for the downloaded file.
 * @param {string} contentType - The MIME type of the file.
 */
export const downloadBase64 = (base64, filename, contentType = 'application/pdf') => {
    const linkSource = `data:${contentType};base64,${base64}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

/**
 * Formats the CND filename according to requirements:
 * CND_{CNPJ}_{ORGAO}_{DATA}.pdf
 * @param {string} cnpj - The client's CNPJ.
 * @param {string} orgao - The issuing organ (Federal, Estadual, Municipal).
 * @param {string} data - The emission date (YYYY-MM-DD).
 * @returns {string} The formatted filename.
 */
export const formatCndFilename = (cnpj, orgao, data) => {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    let orgaoAbbr = 'ORGAO';

    if (orgao) {
        const lowerOrgao = orgao.toLowerCase();
        if (lowerOrgao.includes('federal') || lowerOrgao.includes('rfb')) orgaoAbbr = 'RFB';
        else if (lowerOrgao.includes('estadual') || lowerOrgao.includes('est')) orgaoAbbr = 'EST';
        else if (lowerOrgao.includes('municipal') || lowerOrgao.includes('mun')) orgaoAbbr = 'MUN';
    }

    const formattedData = data ? data.split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${orgaoAbbr}_${formattedData}.pdf`;
};
