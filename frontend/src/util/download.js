import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Normaliza o nome do órgão emissor para o padrão do arquivo.
 */
const normalizeOrgao = (orgao) => {
    if (!orgao) return 'ORGAO';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return upper.substring(0, 3);
};

/**
 * Centraliza a lógica de download de PDFs de CND.
 */
export const handleCndDownload = async (resultadoId, clienteCnpj, orgaoEmissor, dataEmissao) => {
    try {
        showToast.info("Iniciando download do PDF...");

        // Busca o DTO completo que contém o arquivo em Base64
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        // Converte Base64 para Blob
        const byteCharacters = atob(arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Padroniza o nome do arquivo: CND_{CNPJ}_{ORGAO}_{DATA}.pdf
        const cnpjLimpo = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
        const orgaoPadrao = normalizeOrgao(orgaoEmissor);
        const dataPadrao = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const filename = `CND_${cnpjLimpo}_${orgaoPadrao}_${dataPadrao}.pdf`;

        // Trigger do download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast.success("Download concluído!");
    } catch (error) {
        console.error("Erro ao realizar download do CND:", error);
        showToast.error("Falha ao processar o download do arquivo.");
    }
};
