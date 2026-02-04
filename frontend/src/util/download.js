import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const downloadPDF = async (resultadoId, clientCnpj, tipoCertidao, dateEmissao) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            showToast.error("Arquivo não encontrado.");
            return;
        }

        const orgaoAbbreviation = {
            'Federal': 'RFB',
            'Estadual': 'EST',
            'Municipal': 'MUN'
        }[tipoCertidao] || 'CND';

        const formattedDate = dateEmissao ? dateEmissao.split('T')[0] : new Date().toISOString().split('T')[0];
        const fileName = `CND_${clientCnpj.replace(/[^\d]/g, '')}_${orgaoAbbreviation}_${formattedDate}.pdf`;

        const byteCharacters = atob(arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast.success("Download iniciado com sucesso!");
    } catch (error) {
        console.error("Erro ao baixar PDF:", error);
        showToast.error("Erro ao processar o download do PDF.");
    }
};
