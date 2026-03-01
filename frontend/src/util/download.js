import axios from 'axios';

const getOrgaoAbbreviation = (orgao) => {
    if (!orgao) return 'UNKN';
    const upperOrgao = orgao.toUpperCase();
    if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
    if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
    if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
    return 'ORGAO';
};

export const downloadCndPdf = async (resultadoId, cnpj, orgao, data) => {
    try {
        const response = await axios.get(`/api/resultados/${resultadoId}`);
        const { arquivo } = response.data;

        if (!arquivo) {
            throw new Error('Arquivo não encontrado no servidor.');
        }

        const orgaoAbbr = getOrgaoAbbreviation(orgao);
        const formattedDate = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : '00000000000000';

        const filename = `CND_${cleanCnpj}_${orgaoAbbr}_${formattedDate}.pdf`;

        const linkSource = `data:application/pdf;base64,${arquivo}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = filename;
        downloadLink.click();
    } catch (error) {
        console.error('Erro ao baixar PDF:', error);
        throw error;
    }
};
