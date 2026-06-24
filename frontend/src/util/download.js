import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultadoId, clienteCnpj, orgaoEmissor) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        // Determina a abreviação do órgão
        let orgaoStr = 'RFB';
        if (orgaoEmissor) {
            const lowerOrgao = orgaoEmissor.toLowerCase();
            if (lowerOrgao.includes('municipal')) orgaoStr = 'MUN';
            else if (lowerOrgao.includes('estadual')) orgaoStr = 'EST';
        }

        const dateStr = data.dataEmissao || new Date().toISOString().split('T')[0];
        const cnpjStr = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
        const fileName = `CND_${cnpjStr}_${orgaoStr}_${dateStr}.pdf`;

        // Converte Base64 para Blob
        const byteCharacters = atob(data.arquivo);
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
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao processar o download da certidão.");
    }
};
