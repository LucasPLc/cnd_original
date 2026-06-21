import axios from 'axios';

/**
 * Normaliza o órgão para o formato de nome de arquivo
 */
const normalizeOrgao = (orgao) => {
    if (!orgao) return 'OUT';
    const o = orgao.toUpperCase();
    if (o.includes('FEDERAL') || o.includes('RFB')) return 'RFB';
    if (o.includes('ESTADUAL')) return 'EST';
    if (o.includes('MUNICIPAL')) return 'MUN';
    return o.substring(0, 3);
};

/**
 * Trata o download do PDF da CND
 */
export const handleCndDownload = async (resultId, clienteCnpj, orgao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const { arquivo, dataEmissao } = response.data;

        if (!arquivo) {
            throw new Error('Arquivo não disponível para download');
        }

        // Sanitiza CNPJ (remove caracteres não alfanuméricos)
        const cleanCnpj = (clienteCnpj || '00000000000000').replace(/\D/g, '');
        const normalizedOrgao = normalizeOrgao(orgao);
        const date = dataEmissao ? dataEmissao : new Date().toISOString().split('T')[0];

        const filename = `CND_${cleanCnpj}_${normalizedOrgao}_${date}.pdf`;

        // Converte Base64 para Blob
        const byteCharacters = atob(arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Cria link e dispara download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Limpeza
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao realizar download da CND:', error);
        alert(error.message || 'Erro ao realizar download da CND');
    }
};
