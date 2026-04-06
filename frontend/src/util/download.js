import axios from 'axios';

export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUTROS';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return 'OUTROS';
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
    const abbreviation = getOrgaoAbbreviation(orgao);
    const dateStr = dataEmissao ? dataEmissao.split('T')[0] : 'DATA_NAO_INFORMADA';
    const cleanCnpj = cnpj ? cnpj.replace(/\D/g, '') : 'CNPJ_NAO_INFORMADO';
    return `CND_${cleanCnpj}_${abbreviation}_${dateStr}.pdf`;
};

export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw new Error('Falha ao processar o arquivo PDF.');
    }
};

export const handleCndDownload = async (id, showToast, setDownloadingId) => {
    if (setDownloadingId) setDownloadingId(id);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const result = response.data;

        if (!result.arquivo) {
            showToast('Arquivo não encontrado para esta certidão.', 'error');
            return;
        }

        const filename = generateCndFilename(result.clienteCnpj, result.orgaoEmissor, result.dataEmissao);
        downloadPdfFromBase64(result.arquivo, filename);
        showToast('Download iniciado com sucesso!', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showToast('Erro ao realizar o download da CND.', 'error');
    } finally {
        if (setDownloadingId) setDownloadingId(null);
    }
};
