import axios from 'axios';
import { showToast } from '../components/ui/Toast';

/**
 * Maps the orgaoEmissor string to its standard abbreviation (RFB, EST, MUN).
 * @param {string} orgao - The issuing organ name.
 * @returns {string} - The standardized abbreviation.
 */
export const getOrgaoAbbreviation = (orgao) => {
  if (!orgao) return 'CND';
  const normalized = orgao.toUpperCase();
  if (normalized.includes('FEDERAL') || normalized.includes('RFB')) return 'RFB';
  if (normalized.includes('ESTADUAL') || normalized.includes('EST')) return 'EST';
  if (normalized.includes('MUNICIPAL') || normalized.includes('MUN')) return 'MUN';
  return 'CND';
};

/**
 * Generates the standardized filename for the CND PDF.
 * Format: CND_CNPJ_ORGAO_DATA.pdf
 * @param {string} cnpj - The client's CNPJ.
 * @param {string} orgao - The issuing organ.
 * @param {string} data - The emission date (YYYY-MM-DD).
 * @returns {string} - The generated filename.
 */
export const generateCndFilename = (cnpj, orgao, data) => {
  const cleanCnpj = cnpj ? cnpj.replace(/[^\d]/g, '') : 'unknown';
  const orgaoAbbr = getOrgaoAbbreviation(orgao);
  const formattedData = data ? data.split('T')[0] : new Date().toISOString().split('T')[0];
  return `CND_${cleanCnpj}_${orgaoAbbr}_${formattedData}.pdf`;
};

/**
 * Triggers a browser download for a PDF file from a Base64 string.
 * @param {string} base64String - The PDF content in Base64.
 * @param {string} filename - The name to save the file as.
 */
export const downloadPdfFromBase64 = (base64String, filename) => {
  try {
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
  } catch (error) {
    console.error('Error downloading PDF:', error);
    showToast.error('Erro ao baixar o arquivo PDF.');
  }
};

/**
 * Fetches the CND result by ID and triggers the download.
 * Useful for when the initial list doesn't include the full Base64 string.
 * @param {number|string} id - The CND result ID.
 * @param {string} cnpj - The client's CNPJ.
 */
export const handleCndDownload = async (id, cnpj) => {
  try {
    const response = await axios.get(`/api/resultados/${id}`);
    const { arquivo, orgaoEmissor, dataEmissao } = response.data;

    if (!arquivo) {
      showToast.error('Arquivo PDF não disponível para esta certidão.');
      return;
    }

    const filename = generateCndFilename(cnpj, orgaoEmissor, dataEmissao);
    downloadPdfFromBase64(arquivo, filename);
    showToast.success('Download iniciado com sucesso!');
  } catch (error) {
    console.error('Error fetching CND for download:', error);
    showToast.error('Erro ao buscar arquivo para download.');
  }
};
