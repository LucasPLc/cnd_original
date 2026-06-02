import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (id, resultData, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);

    try {
        let fullData = resultData;

        // Se não tiver o arquivo (Base64), busca o DTO completo
        if (!fullData.arquivo) {
            const response = await axios.get(`/api/resultados/${id}`);
            fullData = response.data;
        }

        if (!fullData.arquivo) {
            showToast.error("Arquivo não encontrado para este resultado.");
            return;
        }

        const cnpj = (fullData.clienteCnpj || fullData.cliente?.cnpj || '00000000000000').replace(/[^\d]/g, '');

        let orgao = 'OUT';
        const orgaoEmissor = (fullData.orgaoEmissor || '').toUpperCase();
        const tipoCertidao = (fullData.tipoCertidao || '').toUpperCase();

        if (orgaoEmissor.includes('RECEITA FEDERAL') || orgaoEmissor.includes('RFB') || tipoCertidao.includes('FEDERAL')) {
            orgao = 'RFB';
        } else if (orgaoEmissor.includes('ESTADUAL') || orgaoEmissor.includes('SECRETARIA DA FAZENDA') || orgaoEmissor.includes('SEFAZ') || tipoCertidao.includes('ESTADUAL')) {
            orgao = 'EST';
        } else if (orgaoEmissor.includes('PREFEITURA') || orgaoEmissor.includes('MUNICIPAL') || tipoCertidao.includes('MUNICIPAL')) {
            orgao = 'MUN';
        }

        const dataEmissao = fullData.dataEmissao || new Date().toISOString().split('T')[0];
        const filename = `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`;

        const linkSource = `data:application/pdf;base64,${fullData.arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();

        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao realizar o download do arquivo.");
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
