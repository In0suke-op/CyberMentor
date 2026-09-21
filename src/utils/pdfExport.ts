import jsPDF from 'jspdf';
import { StudentNote } from '../types';

/**
 * Export a single StudentNote into a formatted PDF document.
 */
export const exportSingleNoteToPdf = (note: StudentNote) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 22, 'F');

  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CYBERMENTOR AI | STUDENT RESEARCH NOTE', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Exported: ${new Date().toLocaleString()}`, pageWidth - margin, 13, { align: 'right' });

  // Emerald Divider line
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.5);
  doc.line(margin, 22, pageWidth - margin, 22);

  let y = 32;

  // Note Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(note.title, maxLineWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Metadata block (Tags & Date)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const tagsText = note.tags && note.tags.length > 0 ? `Tags: ${note.tags.map((t) => `#${t}`).join(', ')}` : '';
  const dateText = `Last Updated: ${new Date(note.updatedAt).toLocaleString()}`;
  const metaLine = tagsText ? `${tagsText}  |  ${dateText}` : dateText;

  doc.text(metaLine, margin, y);
  y += 6;

  // Horizontal separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Render Note Content Lines
  const lines = note.content.split('\n');

  lines.forEach((line) => {
    // Page overflow check
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      const hLines = doc.splitTextToSize(trimmed.replace(/^#\s+/, ''), maxLineWidth);
      doc.text(hLines, margin, y);
      y += hLines.length * 6 + 3;
    } else if (trimmed.startsWith('## ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      const hLines = doc.splitTextToSize(trimmed.replace(/^##\s+/, ''), maxLineWidth);
      doc.text(hLines, margin, y);
      y += hLines.length * 5 + 2;
    } else if (trimmed.startsWith('### ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      const hLines = doc.splitTextToSize(trimmed.replace(/^###\s+/, ''), maxLineWidth);
      doc.text(hLines, margin, y);
      y += hLines.length * 5 + 2;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const bulletText = `•  ${trimmed.substring(2)}`;
      const wrapped = doc.splitTextToSize(bulletText, maxLineWidth - 4);
      doc.text(wrapped, margin + 4, y);
      y += wrapped.length * 4.5 + 1;
    } else if (trimmed.startsWith('```')) {
      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text('[ CODE BLOCK ]', margin, y);
      y += 5;
    } else if (line === '') {
      y += 4;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      const wrapped = doc.splitTextToSize(line, maxLineWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 4.5 + 1;
    }
  });

  // Footer on all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CyberMentor RAG Memory Vault  |  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const filename = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_note.pdf`;
  doc.save(filename);
};

/**
 * Export all StudentNotes as a single combined PDF Compendium.
 */
export const exportAllNotesToPdf = (notes: StudentNote[]) => {
  if (!notes || notes.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;

  // Cover / Top Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('CYBERMENTOR AI | RESEARCH COMPENDIUM', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(`Exported ${notes.length} Vault Notes  |  ${new Date().toLocaleDateString()}`, margin, 22);

  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.8);
  doc.line(margin, 28, pageWidth - margin, 28);

  let y = 38;

  notes.forEach((note, index) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    // Note Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    const titleText = `${index + 1}. ${note.title}`;
    const tLines = doc.splitTextToSize(titleText, maxLineWidth);
    doc.text(tLines, margin, y);
    y += tLines.length * 6 + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    const dateStr = `Updated: ${new Date(note.updatedAt).toLocaleString()}${
      note.tags.length > 0 ? `  |  Tags: #${note.tags.join(' #')}` : ''
    }`;
    doc.text(dateStr, margin, y);
    y += 5;

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Note Body
    const lines = note.content.split('\n');
    lines.forEach((line) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        const hLines = doc.splitTextToSize(trimmed.replace(/^#\s+/, ''), maxLineWidth);
        doc.text(hLines, margin, y);
        y += hLines.length * 5 + 2;
      } else if (trimmed.startsWith('## ')) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        const hLines = doc.splitTextToSize(trimmed.replace(/^##\s+/, ''), maxLineWidth);
        doc.text(hLines, margin, y);
        y += hLines.length * 5 + 1;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        doc.setFont('courier', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        const bulletText = `•  ${trimmed.substring(2)}`;
        const wrapped = doc.splitTextToSize(bulletText, maxLineWidth - 4);
        doc.text(wrapped, margin + 4, y);
        y += wrapped.length * 4.2 + 1;
      } else if (line === '') {
        y += 3;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        const wrapped = doc.splitTextToSize(line, maxLineWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 4.2 + 1;
      }
    });

    y += 8;
    if (y < pageHeight - 30 && index < notes.length - 1) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }
  });

  // Footer Page Numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CyberMentor Notes Vault Compendium  |  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  doc.save('cybermentor_all_notes_compendium.pdf');
};
