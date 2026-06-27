import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (id, clienteCnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo não disponível para este resultado.");
            return;
        }

        // Sanitização do CNPJ
        const sanitizedCnpj = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');

        // Mapeamento do Órgão
        let orgao = 'OUTRO';
        if (orgaoEmissor) {
            const upperOrgao = orgaoEmissor.toUpperCase();
            if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) orgao = 'RFB';
            else if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) orgao = 'EST';
            else if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) orgao = 'MUN';
        }

        // Formatação da Data
        const date = dataEmissao ? dataEmissao.split('T')[0] : new Date().toISOString().split('T')[0];

        const fileName = `CND_${sanitizedCnpj}_${orgao}_${date}.pdf`;

        // Conversão Base64 para Blob
        const byteCharacters = atob(arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Gatilho de download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Limpeza
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    }
};
