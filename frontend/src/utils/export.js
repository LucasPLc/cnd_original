import { utils, writeFile } from 'xlsx';

export const exportToExcel = (data, fileName) => {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Dados');
  writeFile(wb, `${fileName}.xlsx`);
};

// Basic PDF export, can be improved with jsPDF-autotable
import jsPDF from 'jspdf';

export const exportToPdf = (data, fileName) => {
  const doc = new jsPDF();
  doc.text("Relatório de CNDs", 10, 10);
  // This is a very basic implementation.
  // For a table, you would typically use jsPDF-autotable
  doc.text(JSON.stringify(data, null, 2), 10, 20);
  doc.save(`${fileName}.pdf`);
};
