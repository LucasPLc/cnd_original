import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultadoId, clienteCnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo PDF não disponível para esta consulta.");
            return;
        }

        // Normalização do órgão para o nome do arquivo
        let orgaoNormalizado = 'RFB';
        if (orgaoEmissor) {
            const orgaoUpper = orgaoEmissor.toUpperCase();
            if (orgaoUpper.includes('FEDERAL') || orgaoUpper.includes('RECEITA')) {
                orgaoNormalizado = 'RFB';
            } else if (orgaoUpper.includes('ESTADUAL') || orgaoUpper.includes('SEFAZ')) {
                orgaoNormalizado = 'EST';
            } else if (orgaoUpper.includes('MUNICIPAL') || orgaoUpper.includes('PREFEITURA')) {
                orgaoNormalizado = 'MUN';
            }
        }

        // Formatação da data para YYYY-MM-DD
        let dataFormatada = '0000-00-00';
        if (dataEmissao) {
            const date = new Date(dataEmissao);
            if (!isNaN(date.getTime())) {
                dataFormatada = date.toISOString().split('T')[0];
            } else if (typeof dataEmissao === 'string' && dataEmissao.includes('/')) {
                // Caso a data venha formatada como DD/MM/YYYY
                const [day, month, year] = dataEmissao.split('/');
                dataFormatada = `${year}-${month}-${day}`;
            }
        }

        const cnpjLimpo = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
        const filename = `CND_${cnpjLimpo}_${orgaoNormalizado}_${dataFormatada}.pdf`;

        const linkSource = `data:application/pdf;base64,${arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao realizar download da CND:", error);
        showToast.error("Erro ao buscar o arquivo para download.");
    }
};
