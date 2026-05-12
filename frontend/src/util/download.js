import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Retorna a abreviação do órgão emissor.
 * @param {string} orgao - Nome do órgão (Federal, Estadual, Municipal)
 * @returns {string} - Abreviação (RFB, EST, MUN)
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'CND';
    const upper = orgao.toUpperCase();
    if (upper.includes('FEDERAL') || upper.includes('RFB')) return 'RFB';
    if (upper.includes('ESTADUAL') || upper.includes('EST')) return 'EST';
    if (upper.includes('MUNICIPAL') || upper.includes('MUN')) return 'MUN';
    return 'CND';
};

/**
 * Gera o nome do arquivo seguindo o padrão CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
 */
export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';
    const abbreviation = getOrgaoAbbreviation(orgao);
    const date = dataEmissao ? new Date(dataEmissao).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    return `CND_${cleanCnpj}_${abbreviation}_${date}.pdf`;
};

/**
 * Realiza o download do PDF a partir de uma string base64.
 */
export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao processar o download do arquivo.");
    }
};

/**
 * Busca o resultado completo pelo ID e inicia o download.
 */
export const handleCndDownload = async (resultId, cnpj, orgao, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const fullResult = response.data;

        if (!fullResult.arquivo) {
            showToast.error("Arquivo não encontrado para este resultado.");
            return;
        }

        const filename = generateCndFilename(cnpj, orgao, dataEmissao);
        downloadPdfFromBase64(fullResult.arquivo, filename);
    } catch (error) {
        console.error("Erro ao buscar arquivo para download:", error);
        showToast.error("Erro ao realizar o download. Tente novamente mais tarde.");
    }
};
