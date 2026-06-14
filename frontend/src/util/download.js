import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultId, cnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo não encontrado.");
            return;
        }

        // Mapeia o órgão emissor para o código curto
        let orgaoCode = 'RFB';
        const orgao = (orgaoEmissor || '').toLowerCase();

        if (orgao.includes('prefeitura') || orgao.includes('municipal') || orgao.includes('mun')) {
            orgaoCode = 'MUN';
        } else if (orgao.includes('secretaria da fazenda') || orgao.includes('estadual') || orgao.includes('est') || orgao.includes('sefaz')) {
            orgaoCode = 'EST';
        } else if (orgao.includes('receita federal') || orgao.includes('federal') || orgao.includes('rfb')) {
            orgaoCode = 'RFB';
        }

        // Formata a data (YYYY-MM-DD)
        const date = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        const filename = `CND_${cnpj.replace(/[^\d]/g, '')}_${orgaoCode}_${date}.pdf`;

        // Converte Base64 para Blob
        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    }
};
