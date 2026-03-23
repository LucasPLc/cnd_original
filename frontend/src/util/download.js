export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'ORGAO';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return upper;
};

export const generateCndFilename = (cnpj, orgao, data) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbrevOrgao = getOrgaoAbbreviation(orgao);
    const dateStr = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbrevOrgao}_${dateStr}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
