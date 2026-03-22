import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Maps organ name to its standardized abbreviation (RFB, EST, MUN).
 */
export const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'OUT';
    const normalized = orgao.toUpperCase();
    if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
    if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
    if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
    return 'OUT';
};

/**
 * Triggers a browser download of a PDF file from a base64 string.
 */
export const downloadPdfFromBase64 = (base64, filename) => {
    try {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw new Error('Falha ao processar o arquivo para download.');
    }
};

/**
 * Standardized filename: CND_CNPJ_ORGAO_DATA.pdf
 */
export const generateCndFilename = (result) => {
    const cnpj = result.cliente?.cnpj?.replace(/\D/g, '') || '00000000000000';
    const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
    const date = result.dataEmissao || new Date().toISOString().split('T')[0];
    return `CND_${cnpj}_${orgao}_${date}.pdf`;
};

/**
 * Complete download workflow: fetch full data, generate filename, and download.
 */
export const handleCndDownload = async (id, resultSummary, setLoading) => {
    setLoading(true);
    try {
        const response = await axios.get(`/api/resultados/${id}`);
        const fullResult = response.data;

        if (!fullResult.arquivo) {
            toast.error('Arquivo PDF não encontrado.');
            return;
        }

        const filename = generateCndFilename({
            ...resultSummary,
            orgaoEmissor: fullResult.orgaoEmissor || resultSummary.orgaoEmissor,
            dataEmissao: fullResult.dataEmissao || resultSummary.dataEmissao
        });

        downloadPdfFromBase64(fullResult.arquivo, filename);
        toast.success('Download concluído com sucesso!');
    } catch (error) {
        console.error('Download failed:', error);
        toast.error('Erro ao realizar o download do arquivo.');
    } finally {
        setLoading(false);
    }
};
