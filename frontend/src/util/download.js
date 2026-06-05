export const handleCndDownload = async (id) => {
    try {
        const response = await fetch(`/api/resultados/${id}`);
        if (!response.ok) {
            throw new Error('Falha ao buscar arquivo da certidão');
        }

        const data = await response.json();

        if (!data.arquivo) {
            throw new Error('Arquivo não disponível para este registro');
        }

        // Converte Base64 para Blob
        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Gera o nome do arquivo padronizado
        // Padrão: CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
        const cnpj = (data.clienteCnpj || '00000000000000').replace(/\D/g, '');

        let orgaoAbbr = 'RFB';
        const orgao = (data.tipoCertidao || 'Federal').toLowerCase();
        if (orgao.includes('municipal')) orgaoAbbr = 'MUN';
        else if (orgao.includes('estadual')) orgaoAbbr = 'EST';
        else if (orgao.includes('federal')) orgaoAbbr = 'RFB';

        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];

        const fileName = `CND_${cnpj}_${orgaoAbbr}_${dataEmissao}.pdf`;

        // Trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('Erro no download:', error);
        return { success: false, message: error.message };
    }
};
