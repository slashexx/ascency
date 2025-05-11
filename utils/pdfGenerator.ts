import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Add type augmentation for jspdf-autotable
import { UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const generatePDF = (content: string, name: string): jsPDF => {
  const pdf = new jsPDF();
  pdf.setFont('helvetica');
  // Add title
  pdf.setFontSize(20);
  pdf.text(name, 20, 20);
  // Add timestamp
  pdf.setFontSize(10);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

  // Convert markdown table to array for jspdf-autotable
  const rows = content
    .split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#'))
    .map(line => line.split('|').map(cell => cell.trim()));

  // Remove empty cells and markdown table formatting
  const cleanRows = rows
    .filter(row => row.length > 1)
    .map(row => row.filter(cell => cell !== '' && !cell.match(/^[-:]+$/)));

  // Helper to detect and style links
  function parseCell(cell: string) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    let result: any[] = [];
    while ((match = linkRegex.exec(cell)) !== null) {
      if (match.index > lastIndex) {
        result.push(cell.substring(lastIndex, match.index));
      }
      result.push({ text: match[1], link: match[2] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < cell.length) {
      result.push(cell.substring(lastIndex));
    }
    // Always return a string for compatibility with autoTable
    return result.length ? result.map(part => typeof part === 'string' ? part : part.text).join('') : cell;
  }

  if (cleanRows.length > 0) {
    pdf.autoTable({
      startY: 40,
      head: [cleanRows[0]],
      body: cleanRows.slice(1).map(row => row.map(cell => parseCell(cell))),
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
        valign: 'middle',
        textColor: [33, 37, 41],
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [30, 41, 59], // deep blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 12,
        cellPadding: { top: 8, right: 6, bottom: 8, left: 6 },
        lineColor: [30, 41, 59],
        lineWidth: 1,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      didParseCell: function (data) {
        const cell = data.cell.raw;
        if (typeof cell !== 'string') {
          (data.cell as any).rawParts = null;
          return;
        }
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        let lastIndex = 0;
        let result: any[] = [];
        while ((match = linkRegex.exec(cell)) !== null) {
          if (match.index > lastIndex) {
            result.push(cell.substring(lastIndex, match.index));
          }
          result.push({ text: match[1], link: match[2] });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < cell.length) {
          result.push(cell.substring(lastIndex));
        }
        if (result.length) {
          (data.cell as any).rawParts = result;
        } else {
          (data.cell as any).rawParts = null;
        }
      },
      didDrawCell: function (data) {
        // Make links clickable (best effort)
        const rawParts = (data.cell as any).rawParts;
        if (rawParts && Array.isArray(rawParts)) {
          let x = data.cell.x + 2;
          let y = data.cell.y + data.cell.height / 2 + 2;
          let offset = 0;
          rawParts.forEach((part: any) => {
            if (typeof part === 'string') {
              offset += pdf.getTextWidth(part);
            } else if (part.link) {
              pdf.setTextColor(30, 64, 175);
              pdf.textWithLink(part.text, x + offset, y, { url: part.link });
              pdf.setTextColor(33, 37, 41);
              offset += pdf.getTextWidth(part.text);

            }
          });
        }
      },
    });
  }

  return pdf;
};
