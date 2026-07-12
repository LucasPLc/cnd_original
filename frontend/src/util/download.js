import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleCndDownload = async (resultadoId, clienteCnpj, orgaoEmissor, dataEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const data = response.data;

        if (!data.arquivo) {
            showToast.error("Arquivo PDF não disponível para esta consulta.");
            return;
        }

        const base64Data = data.arquivo;
        const contentType = 'application/pdf';

        // Padronização do nome: CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
        const formattedCnpj = (clienteCnpj || '00000000000000').replace(/[^\d]/g, '');

        let orgaoTag = 'RFB'; // Federal (Padrão)
        if (orgaoEmissor) {
            const lowerOrgao = orgaoEmissor.toLowerCase();
            if (lowerOrgao.includes('est')) orgaoTag = 'EST';
            else if (lowerOrgao.includes('mun')) orgaoTag = 'MUN';
            else if (lowerOrgao.includes('fed') || lowerOrgao.includes('receita')) orgaoTag = 'RFB';
        }

        // Parsing robusto para dataEmissao (pode vir como 'DD/MM/YYYY' ou ISO)
        let dateTag = new Date().toISOString().split('T')[0];
        if (dataEmissao) {
            if (typeof dataEmissao === 'string' && dataEmissao.includes('/')) {
                const parts = dataEmissao.split('/');
                if (parts.length === 3) {
                    // Assume DD/MM/YYYY
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2];
                    dateTag = `${year}-${month}-${day}`;
                }
            } else {
                try {
                    const parsedDate = new Date(dataEmissao);
                    if (!isNaN(parsedDate)) {
                        dateTag = parsedDate.toISOString().split('T')[0];
                    }
                } catch (e) {
                    console.warn("Falha ao processar data de emissão:", dataEmissao);
                }
            }
        }

        const fileName = `CND_${formattedCnpj}_${orgaoTag}_${dateTag}.pdf`;

        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

        showToast.success("Download iniciado!");
    } catch (error) {
        console.error("Erro ao realizar download:", error);
        showToast.error("Erro ao processar o download do PDF.");
    }
};
