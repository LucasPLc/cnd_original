export const downloadPDF = (base64, cnpj, orgaoEmissor, dataEmissao) => {
    if (!base64) return;

    // Remove metadata if present (e.g., "data:application/pdf;base64,")
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

    // Map organ name to abbreviation
    let orgaoAbbr = 'OUT';
    const orgaoUpper = orgaoEmissor?.toUpperCase() || '';

    if (orgaoUpper.includes('RECEITA FEDERAL')) {
        orgaoAbbr = 'RFB';
    } else if (orgaoUpper.includes('SECRETARIA DA FAZENDA') || orgaoUpper.includes('SEFAZ')) {
        orgaoAbbr = 'EST';
    } else if (orgaoUpper.includes('PREFEITURA') || orgaoUpper.includes('MUNICIPAL')) {
        orgaoAbbr = 'MUN';
    }

    // Format date (YYYY-MM-DD)
    const formattedDate = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];

    // Clean CNPJ (only numbers)
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';

    const filename = `CND_${cleanCnpj}_${orgaoAbbr}_${formattedDate}.pdf`;

    const linkSource = `data:application/pdf;base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
};
