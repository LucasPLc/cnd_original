import axios from 'axios';

export const handleCndDownload = async (resultadoId, toast) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            if (toast) toast.error('Arquivo não encontrado para esta certidão.');
            return;
        }

        const cnpj = data.clienteCnpj ? data.clienteCnpj.replace(/[^\d]/g, '') : 'DESCONHECIDO';
        const orgao = (data.orgaoEmissor || '').toUpperCase();

        let orgaoAbrev = 'OUTRO';
        if (orgao.includes('RECEITA FEDERAL') || orgao.includes('RFB') || orgao.includes('FEDERAL')) {
            orgaoAbrev = 'RFB';
        } else if (orgao.includes('ESTADUAL') || orgao.includes('EST')) {
            orgaoAbrev = 'EST';
        } else if (orgao.includes('MUNICIPAL') || orgao.includes('MUN') || orgao.includes('PREFEITURA')) {
            orgaoAbrev = 'MUN';
        }

        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];
        const filename = `CND_${cnpj}_${orgaoAbrev}_${dataEmissao}.pdf`;

        const byteCharacters = atob(data.arquivo);
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
        link.remove();
        window.URL.revokeObjectURL(url);

        if (toast) toast.success('Download iniciado com sucesso!');
    } catch (error) {
        console.error('Erro ao baixar CND:', error);
        if (toast) toast.error('Erro ao realizar o download da certidão.');
    }
};
