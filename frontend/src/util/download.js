import axios from 'axios';

/**
 * Utilitário para centralizar o download de CNDs em PDF.
 * Converte Base64 para Blob e gera o nome de arquivo padronizado.
 */
export const handleCndDownload = async (resultadoId, clienteCnpj) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            throw new Error('Arquivo não disponível para este resultado.');
        }

        // 1. Converter Base64 para Blob
        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // 2. Padronizar nome do arquivo: CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
        const orgaoMap = {
            'Federal': 'RFB',
            'Estadual': 'EST',
            'Municipal': 'MUN'
        };
        const orgaoAbbr = orgaoMap[data.orgaoEmissor] || (data.tipoCertidao ? orgaoMap[data.tipoCertidao] : 'CND');
        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];
        const sanitizedCnpj = (clienteCnpj || '').replace(/\D/g, '') || '00000000000000';
        const fileName = `CND_${sanitizedCnpj}_${orgaoAbbr}_${dataEmissao}.pdf`;

        // 3. Disparar o download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao baixar CND:', error);
        throw error;
    }
};
