import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

export const exportToExcel = (clients) => {
    const tableData = clients.map(client => ({
        'CNPJ': client.cnpj,
        'Nome do Contribuinte': client.nomeContribuinte,
        'Órgão Emissor': client.orgaoEmissor,
        'Situação da Certidão': client.situacaoCertidao,
        'Status do Processamento': client.statusProcessamento,
        'Data de Emissão': formatDate(client.dataEmissao),
        'Data de Validade': formatDate(client.dataValidade),
        'Data do Processamento': formatDate(client.dataProcessamento),
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    XLSX.writeFile(workbook, 'clientes_cnd.xlsx');
};

export const exportToPDF = (clients) => {
    const doc = new jsPDF();

    doc.text('Relatório de Monitoramento de CNDs', 14, 16);

    const tableColumn = ["CNPJ", "Contribuinte", "Órgão", "Situação", "Status", "Validade"];
    const tableRows = [];

    clients.forEach(client => {
        const clientData = [
            client.cnpj,
            client.nomeContribuinte,
            client.orgaoEmissor,
            client.situacaoCertidao,
            client.statusProcessamento,
            formatDate(client.dataValidade),
        ];
        tableRows.push(clientData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [53, 81, 138] },
    });

    doc.save('relatorio_cnd.pdf');
};
