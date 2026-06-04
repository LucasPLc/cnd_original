import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultId, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(resultId);
    try {
        const response = await axios.get(`/api/resultados/${resultId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não disponível.");
            return;
        }

        // Padronização do órgão emissor para o nome do arquivo
        let orgaoAbrev = 'OUT';
        const orgao = (data.orgaoEmissor || '').toUpperCase();
        if (orgao.includes('FEDERAL') || orgao.includes('RFB')) {
            orgaoAbrev = 'RFB';
        } else if (orgao.includes('ESTADUAL') || orgao.includes('EST')) {
            orgaoAbrev = 'EST';
        } else if (orgao.includes('MUNICIPAL') || orgao.includes('MUN')) {
            orgaoAbrev = 'MUN';
        }

        const cnpj = (data.clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];
        const fileName = `CND_${cnpj}_${orgaoAbrev}_${dataEmissao}.pdf`;

        const linkSource = `data:application/pdf;base64,${data.arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao realizar download:", error);
        showToast.error("Erro ao processar o download do arquivo.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
