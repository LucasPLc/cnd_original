import axios from 'axios';

/**
 * Handle CND PDF download with standardized filename generation.
 * @param {Object} resultSummary - The summary object containing basic info (id, cnpj, orgaoEmissor, dataEmissao)
 */
export const handleCndDownload = async (resultSummary) => {
    try {
        // 1. Fetch the full result including the Base64 file content
        const response = await axios.get(`/api/resultados/${resultSummary.id}`);
        const resultFull = response.data;

        if (!resultFull.arquivo) {
            alert('Erro: Arquivo não encontrado no servidor.');
            return;
        }

        // 2. Prepare filename data
        const cnpj = (resultFull.cliente?.cnpj || resultSummary.cliente?.cnpj || '00000000000000').replace(/\D/g, '');

        // Standardize Orgao abbreviation
        let orgao = (resultFull.orgaoEmissor || resultSummary.orgaoEmissor || 'RFB').toUpperCase();
        if (orgao.includes('FEDERAL') || orgao.includes('RECEITA')) orgao = 'RFB';
        else if (orgao.includes('ESTADUAL') || orgao.includes('SEFAZ')) orgao = 'EST';
        else if (orgao.includes('MUNICIPAL') || orgao.includes('PREFEITURA')) orgao = 'MUN';
        else orgao = orgao.substring(0, 3); // Fallback to first 3 chars

        const date = (resultFull.dataEmissao || resultSummary.dataEmissao || new Date().toISOString()).split('T')[0];

        const filename = `CND_${cnpj}_${orgao}_${date}.pdf`;

        // 3. Convert Base64 to Blob and trigger download
        const byteCharacters = atob(resultFull.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Erro ao baixar CND:', error);
        alert('Ocorreu um erro ao tentar baixar a certidão. Por favor, tente novamente.');
    }
};
