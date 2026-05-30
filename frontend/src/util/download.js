import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultadoId, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(resultadoId);
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não encontrado para este resultado.");
            return;
        }

        // Padronização do Órgão
        let orgao = 'OUTROS';
        const orgaoEmissor = (data.orgaoEmissor || '').toUpperCase();
        const tipoCertidao = (data.tipoCertidao || '').toUpperCase();

        if (orgaoEmissor.includes('RECEITA FEDERAL') || tipoCertidao.includes('FEDERAL') || orgaoEmissor.includes('RFB')) {
            orgao = 'RFB';
        } else if (orgaoEmissor.includes('ESTADUAL') || tipoCertidao.includes('ESTADUAL') || orgaoEmissor.includes('SEFAZ')) {
            orgao = 'EST';
        } else if (orgaoEmissor.includes('MUNICIPAL') || tipoCertidao.includes('MUNICIPAL') || orgaoEmissor.includes('PREFEITURA')) {
            orgao = 'MUN';
        }

        // Formatação da Data de Emissão (YYYY-MM-DD)
        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];

        // CNPJ (limpar caracteres não numéricos)
        const cnpj = (data.clienteCnpj || '00000000000000').replace(/\D/g, '');

        // Nome do arquivo: CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
        const fileName = `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`;

        // Trigger download
        const linkSource = `data:application/pdf;base64,${data.arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
