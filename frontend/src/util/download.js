import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Utilitário para gerenciar o download de PDFs de CND.
 * Centraliza a busca do arquivo (lazy loading), conversão de Base64 para Blob
 * e geração de nome de arquivo padronizado.
 */
export const handleCndDownload = async (resultadoId, resultData = null) => {
    try {
        let fullData = resultData;

        // Se não tiver o conteúdo do arquivo (Base64), busca no backend
        if (!fullData || !fullData.arquivo) {
            const response = await axios.get(`/api/resultados/${resultadoId}`);
            fullData = response.data;
        }

        if (!fullData.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        // Padrão de nome: CND_{CNPJ}_{ORGAO}_{DATE}.pdf
        const cnpj = (fullData.clienteCnpj || fullData.cliente?.cnpj || 'SEM_CNPJ').replace(/[^\d]/g, '');

        let orgao = 'OUTROS';
        const orgaoEmissor = (fullData.orgaoEmissor || '').toUpperCase();
        if (orgaoEmissor.includes('RECEITA FEDERAL') || orgaoEmissor.includes('RFB') || orgaoEmissor.includes('FEDERAL')) {
            orgao = 'RFB';
        } else if (orgaoEmissor.includes('ESTADUAL') || orgaoEmissor.includes('SEFAZ')) {
            orgao = 'EST';
        } else if (orgaoEmissor.includes('MUNICIPAL') || orgaoEmissor.includes('PREFEITURA')) {
            orgao = 'MUN';
        }

        const dataEmissao = fullData.dataEmissao || new Date().toISOString().split('T')[0];
        const fileName = `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`;

        // Converter Base64 para Blob e realizar o download
        const byteCharacters = atob(fullData.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Falha ao baixar o arquivo da certidão.");
    }
};
