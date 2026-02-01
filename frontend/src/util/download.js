import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const handleDownloadPdf = async (id, cnpj) => {
    try {
        const response = await axios.get(`/api/resultados/${id}/pdf`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        const safeCnpj = (cnpj || '').replace(/[^\d]/g, '');
        let fileName = `CND_${safeCnpj}.pdf`;

        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch && fileNameMatch.length === 2)
                fileName = fileNameMatch[1];
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erro ao baixar o PDF:", error);
        showToast.error("Erro ao baixar o PDF da certidão.");
    }
};
