import { getOrganAbbreviation } from './cnd';

export const downloadPDF = (base64, filename) => {
    const linkSource = `data:application/pdf;base64,${base64}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};

export const generateCNDFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    const abbreviation = getOrganAbbreviation(orgao);
    const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
    return `CND_${cleanCnpj}_${abbreviation}_${date}.pdf`;
};
