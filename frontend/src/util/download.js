/**
 * Centraliza a lógica de download de PDFs da CND com padronização de nome de arquivo.
 */
export const handleCndDownload = (resultado) => {
    if (!resultado || !resultado.arquivo) {
        console.error("Arquivo CND não disponível para download.");
        return;
    }

    try {
        const byteCharacters = atob(resultado.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Padronização do nome do arquivo: CND_{CNPJ}_{ORGAO}_{DATE}.pdf
        const cnpj = resultado.clienteCnpj?.replace(/[^\d]/g, '') || '00000000000000';

        let orgao = 'RFB';
        const orgaoUpper = (resultado.orgaoEmissor || '').toUpperCase();
        if (orgaoUpper.includes('ESTADUAL') || orgaoUpper.includes('SEFAZ') || orgaoUpper.includes('EST')) {
            orgao = 'EST';
        } else if (orgaoUpper.includes('MUNICIPAL') || orgaoUpper.includes('PREFEITURA') || orgaoUpper.includes('MUN')) {
            orgao = 'MUN';
        }

        const data = resultado.dataEmissao || new Date().toISOString().split('T')[0];
        const filename = `CND_${cnpj}_${orgao}_${data}.pdf`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
    }
};
