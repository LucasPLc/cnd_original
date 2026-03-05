import axios from 'axios';
import { showToast } from '../components/ui/Toast';
import { generateCndFilename } from './cnd';

/**
 * Realiza o download de um arquivo PDF da CND a partir do backend.
 * @param {number|string} resultadoId - O ID do resultado na tabela cnd_resultado
 * @param {object} info - Informações para o nome do arquivo {cnpj, orgaoEmissor, dataEmissao}
 */
export const downloadCndPdf = async (resultadoId, info) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo não encontrado para esta certidão.");
            return;
        }

        // Se o arquivo já vier como base64, preparamos o download
        const linkSource = `data:application/pdf;base64,${arquivo}`;
        const downloadLink = document.createElement("a");
        const fileName = generateCndFilename(info.cnpj, info.orgaoEmissor, info.dataEmissao);

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao realizar o download do arquivo.");
    }
};
