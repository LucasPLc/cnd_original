import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultadoId, clienteCnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo não encontrado no servidor.");
            return;
        }

        // Padronização do nome do órgão
        let orgaoFormatado = 'OUTRO';
        const orgaoUpper = (orgaoEmissor || '').toUpperCase();

        if (orgaoUpper.includes('FEDERAL') || orgaoUpper.includes('RFB')) {
            orgaoFormatado = 'RFB';
        } else if (orgaoUpper.includes('ESTADUAL') || orgaoUpper.includes('EST')) {
            orgaoFormatado = 'EST';
        } else if (orgaoUpper.includes('MUNICIPAL') || orgaoUpper.includes('MUN')) {
            orgaoFormatado = 'MUN';
        }

        const cnpjLimpo = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
        const dataFormatada = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];

        const fileName = `CND_${cnpjLimpo}_${orgaoFormatado}_${dataFormatada}.pdf`;

        // Converter Base64 para Blob
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
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao baixar o arquivo. Tente novamente mais tarde.");
    }
};
