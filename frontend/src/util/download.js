import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Maps the certificate type to the standardized organ abbreviation.
 * @param {string} tipoCertidao
 * @returns {string}
 */
const getOrganAbbreviation = (tipoCertidao) => {
    if (!tipoCertidao) return 'UNKN';
    const type = tipoCertidao.toLowerCase();
    if (type.includes('federal')) return 'RFB';
    if (type.includes('estadual')) return 'EST';
    if (type.includes('municipal')) return 'MUN';
    return 'OUTRO';
};

/**
 * Handles CND PDF download with standardized filename.
 * Standard: CND_{CNPJ}_{ORGAO}_{DATE}.pdf
 *
 * @param {number|string} resultadoId
 * @param {string} cnpj
 */
export const handleCndDownload = async (resultadoId, cnpj) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não encontrado para esta certidão.");
            return;
        }

        const organ = getOrganAbbreviation(data.tipoCertidao || data.orgaoEmissor);
        const date = data.dataEmissao || new Date().toISOString().split('T')[0];
        const filename = `CND_${cnpj.replace(/[^\d]/g, '')}_${organ}_${date}.pdf`;

        const linkSource = `data:application/pdf;base64,${data.arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao processar o download da certidão.");
    }
};
