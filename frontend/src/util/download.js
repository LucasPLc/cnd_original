import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'DESCONHECIDO';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return upperOrgao;
};

export const generateCndFilename = (result) => {
    const cnpj = (result.cliente?.cnpj || result.clienteCnpj || '00000000000000').replace(/[^\d]/g, '');
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor || result.tipoCertidao);
    const data = result.dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cnpj}_${orgao}_${data}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error("Erro ao processar download do PDF:", error);
        showToast.error("Erro ao processar o arquivo para download.");
    }
};

export const handleCndDownload = async (id, resultData, setLoading) => {
    if (setLoading) setLoading(true);
    try {
        let fullData = resultData;

        // Se não tiver o arquivo (provavelmente veio da listagem), busca o DTO completo
        if (!resultData.arquivo) {
            const response = await axios.get(`/api/resultados/${id}`);
            fullData = response.data;
        }

        if (fullData.arquivo) {
            const filename = generateCndFilename(fullData);
            downloadPdfFromBase64(fullData.arquivo, filename);
            showToast.success("Download iniciado com sucesso!");
        } else {
            showToast.error("Arquivo não encontrado para esta certidão.");
        }
    } catch (error) {
        console.error("Erro ao buscar arquivo da CND:", error);
        showToast.error("Erro ao realizar o download da CND.");
    } finally {
        if (setLoading) setLoading(false);
    }
};
