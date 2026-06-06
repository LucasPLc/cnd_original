import axios from 'axios';
import { toast } from 'react-toastify';

export const handleCndDownload = async (id) => {
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const data = response.data;

        if (!data.arquivo) {
            toast.error('Arquivo não disponível para download.');
            return;
        }

        const byteCharacters = atob(data.arquivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Padronização do nome do arquivo: CND_{CNPJ}_{ORGAO}_{YYYY-MM-DD}.pdf
        const cnpj = data.clienteCnpj ? data.clienteCnpj.replace(/\D/g, '') : 'DESCONHECIDO';
        const orgao = (data.orgaoEmissor || 'RFB').substring(0, 3).toUpperCase();
        const dataEmissao = data.dataEmissao || new Date().toISOString().split('T')[0];

        link.setAttribute('download', `CND_${cnpj}_${orgao}_${dataEmissao}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Erro ao baixar CND:', error);
        toast.error('Erro ao realizar o download da CND.');
    }
};
