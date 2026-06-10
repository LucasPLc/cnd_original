import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Funções utilitárias para download de arquivos CND
 */

/**
 * Mapeia o órgão emissor para uma sigla padronizada para o nome do arquivo
 * @param {string} orgao
 * @returns {string} RFB, EST, MUN ou o próprio órgão
 */
const getOrgaoSigla = (orgao) => {
    if (!orgao) return 'ORGAO';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return normalized.substring(0, 3);
};

/**
 * Realiza o download do PDF da CND
 * @param {number|string} resultadoId ID do resultado da CND
 */
export const handleCndDownload = async (resultadoId) => {
    try {
        // Busca o DTO completo que contém o Base64 do arquivo
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não disponível para esta certidão.");
            return;
        }

        // Dados para o nome do arquivo
        const cnpj = data.clienteCnpj ? data.clienteCnpj.replace(/[^\d]/g, '') : 'DESCONHECIDO';
        const orgao = getOrgaoSigla(data.orgaoEmissor);
        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];

        // Nome padronizado: CND_{CNPJ}_{ORGAO}_{DATA}.pdf
        const fileName = `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`;

        // Converte Base64 para Blob
        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Cria link temporário e dispara download
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
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Ocorreu um erro ao tentar baixar o arquivo.");
    }
};
