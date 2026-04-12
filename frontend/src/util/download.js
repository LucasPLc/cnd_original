import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
  if (!orgao) return 'ORGAO';
  const upperOrgao = orgao.toUpperCase();
  if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
  if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
  if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
  return upperOrgao;
};

export const generateCndFilename = (cnpj, orgao, dataEmissao) => {
  const cleanCnpj = cnpj ? cnpj.replace(/\D/g, '') : 'CNPJ';
  const abbrevOrgao = getOrgaoAbbreviation(orgao);
  const date = dataEmissao || new Date().toISOString().split('T')[0];
  return `CND_${cleanCnpj}_${abbrevOrgao}_${date}.pdf`;
};

export const downloadPdfFromBase64 = (base64String, filename) => {
  try {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao processar PDF:', error);
    showToast('Erro ao processar o arquivo PDF.', 'error');
  }
};

export const handleCndDownload = async (id, setDownloadingId) => {
  if (setDownloadingId) setDownloadingId(id);
  try {
    const response = await axios.get(`/api/resultados/${id}`);
    const result = response.data;

    if (result.arquivo) {
      const filename = generateCndFilename(
        result.clienteCnpj,
        result.orgaoEmissor || result.tipoCertidao,
        result.dataEmissao
      );
      downloadPdfFromBase64(result.arquivo, filename);
    } else {
      showToast('Arquivo PDF não encontrado.', 'error');
    }
  } catch (error) {
    console.error('Erro ao baixar CND:', error);
    showToast('Erro ao realizar o download da CND.', 'error');
  } finally {
    if (setDownloadingId) setDownloadingId(null);
  }
};
