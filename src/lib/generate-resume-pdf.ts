/**
 * Dynamically compiles Markdown or plain-text resume content into a crisp,
 * selectable, multi-page A4 vector PDF directly in the browser using jsPDF.
 */
export async function generateResumePdf(
  content: string,
  fullName = 'Olehi Davis'
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  const marginTop = 52;
  const marginBottom = 48;
  const maxWidth = pageWidth - marginX * 2;
  let y = marginTop;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage();
      y = marginTop;
    }
  };

  const stripMarkdownInline = (text: string): string => {
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  };

  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Blank line -> vertical spacing
    if (!trimmed) {
      y += 7;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      ensureSpace(14);
      doc.setDrawColor(212, 212, 216);
      doc.setLineWidth(0.75);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 14;
      continue;
    }

    // H1 -> Document Title / Name
    if (trimmed.startsWith('# ')) {
      const text = stripMarkdownInline(trimmed.slice(2));
      ensureSpace(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      const wrapped = doc.splitTextToSize(text, maxWidth);
      doc.text(wrapped, marginX, y);
      y += wrapped.length * 24 + 4;
      continue;
    }

    // H2 -> Major Section Heading
    if (trimmed.startsWith('## ')) {
      const text = stripMarkdownInline(trimmed.slice(3)).toUpperCase();
      ensureSpace(28);
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(text, marginX, y);
      y += 5;
      doc.setDrawColor(161, 161, 170);
      doc.setLineWidth(0.6);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 14;
      continue;
    }

    // H3 -> Role / Institution Subheading
    if (trimmed.startsWith('### ')) {
      const text = stripMarkdownInline(trimmed.slice(4));
      ensureSpace(22);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(24, 24, 27);
      const wrapped = doc.splitTextToSize(text, maxWidth);
      doc.text(wrapped, marginX, y);
      y += wrapped.length * 14 + 3;
      continue;
    }

    // Bullet points (- or *)
    if (/^[-*•]\s+/.test(trimmed)) {
      const bulletContent = trimmed.replace(/^[-*•]\s+/, '');
      const boldLeadMatch = bulletContent.match(/^\*\*([^*]+)\*\*\s*(.*)$/);

      const bulletIndent = 12;
      const textX = marginX + bulletIndent;
      const textWidth = maxWidth - bulletIndent;

      doc.setFontSize(9.5);
      doc.setTextColor(63, 63, 70);

      if (boldLeadMatch) {
        const cleanFull = stripMarkdownInline(bulletContent);
        const wrapped = doc.splitTextToSize(cleanFull, textWidth);
        ensureSpace(wrapped.length * 13.5 + 3);

        doc.setFont('helvetica', 'bold');
        doc.text('•', marginX + 2, y);

        // Render first line with bold lead label, then normal remainder
        const leadLabel = boldLeadMatch[1];
        const rest = stripMarkdownInline(boldLeadMatch[2]);
        const fullCombined = `${leadLabel} ${rest}`.trim();
        const combinedWrapped = doc.splitTextToSize(fullCombined, textWidth);

        doc.setFont('helvetica', 'normal');
        combinedWrapped.forEach((lineStr: string, lineIdx: number) => {
          if (lineIdx === 0 && lineStr.startsWith(leadLabel)) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(24, 24, 27);
            doc.text(leadLabel, textX, y);
            const leadWidth = doc.getTextWidth(leadLabel);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(63, 63, 70);
            doc.text(lineStr.slice(leadLabel.length), textX + leadWidth, y);
          } else {
            doc.text(lineStr, textX, y);
          }
          y += 13.5;
        });
        y += 2;
      } else {
        const clean = stripMarkdownInline(bulletContent);
        const wrapped = doc.splitTextToSize(clean, textWidth);
        ensureSpace(wrapped.length * 13.5 + 3);
        doc.setFont('helvetica', 'bold');
        doc.text('•', marginX + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(wrapped, textX, y);
        y += wrapped.length * 13.5 + 2;
      }
      continue;
    }

    // Standard Paragraph / Plain Text line
    const clean = stripMarkdownInline(trimmed);
    const isAllBold = trimmed.startsWith('**') && trimmed.endsWith('**');
    doc.setFont('helvetica', isAllBold ? 'bold' : 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(isAllBold ? 24 : 63, isAllBold ? 24 : 63, isAllBold ? 27 : 70);

    const wrapped = doc.splitTextToSize(clean, maxWidth);
    ensureSpace(wrapped.length * 14 + 3);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 14 + 3;
  }

  const safeFileName = `${fullName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Resume'}_CV.pdf`;
  doc.save(safeFileName);
}
