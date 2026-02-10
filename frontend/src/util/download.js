import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const downloadCndPdf = async (resultado, cnpj) => {
    if (!resultado || !resultado.id) {
        showToast.error("ID do resultado inválido.");
        return;
    }

    try {
        showToast.info("Iniciando download...");
        const response = await axios.get(`/api/resultados/${resultado.id}`);
        const fullResultado = response.data;

        if (!fullResultado.arquivo) {
            showToast.error("Arquivo não encontrado para este resultado.");
            return;
        }

        const linkSource = `data:application/pdf;base64,${fullResultado.arquivo}`;
        const downloadLink = document.createElement("a");

        // Padronização do nome: CND_{CNPJ}_{ORGAO}_{DATA}.pdf
        const orgao = (fullResultado.orgaoEmissor || 'ORGAO').toUpperCase();
        const data = fullResultado.dataEmissao || new Date().toISOString().split('T')[0];
        const fileName = `CND_${cnpj}_${orgao}_${data}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        showToast.success("Download concluído!");
    } catch (error) {
        console.error("Erro ao baixar PDF:", error);
        showToast.error("Erro ao realizar o download do PDF.");
    }
};
