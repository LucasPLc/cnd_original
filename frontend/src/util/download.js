import axios from 'axios';
import { showToast } from '../components/ui/Toast';

export const getOrgaoAbbreviation = (orgao) => {
  if (!orgao) return 'ORGAO';
  const upperOrgao = orgao.toUpperCase();
  if (upperOrgao.includes('FEDERAL') || upperOrgao.includes('RFB')) return 'RFB';
  if (upperOrgao.includes('ESTADUAL') || upperOrgao.includes('EST')) return 'EST';
  if (upperOrgao.includes('MUNICIPAL') || upperOrgao.includes('MUN')) return 'MUN';
  return 'ORGAO';
};

export const generateCndFilename = (result) => {
  const cnpj = (result.clienteCnpj || result.cliente?.cnpj || '00000000000000').replace(/[^\d]/g, '');
  const orgao = getOrgaoAbbreviation(result.orgaoEmissor);
  const data = result.dataEmissao ? result.dataEmissao : new Date().toISOString().split('T')[0];
  return `CND_${cnpj}_${orgao}_${data}.pdf`;
};

export const downloadPdfFromBase64 = (base64Content, filename) => {
  try {
    const linkSource = `data:application/pdf;base64,${base64Content}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
  } catch (error) {
    console.error("Erro ao realizar o download do PDF:", error);
    showToast.error("Erro ao gerar o arquivo para download.");
  }
};

export const handleCndDownload = async (resultId, setDownloadingId) => {
  if (setDownloadingId) setDownloadingId(resultId);
  try {
    const response = await axios.get(`/api/resultados/${resultId}`);
    const resultData = response.data;

    if (resultData && resultData.arquivo) {
      const filename = generateCndFilename(resultData);
      downloadPdfFromBase64(resultData.arquivo, filename);
    } else {
      showToast.error("Arquivo não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar arquivo para download:", error);
    showToast.error("Erro ao buscar o arquivo da CND.");
  } finally {
    if (setDownloadingId) setDownloadingId(null);
  }
};
