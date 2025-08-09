import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * POST /api/pdf
 *
 * Generates a PDF document from a provided Jedi profile string. The request
 * body should include a `profile` string and optional `name`. It returns
 * the PDF file as a binary stream with appropriate headers set for download.
 */
export async function POST(req: NextRequest) {
  try {
    const { profile, name } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSizeTitle = 24;
    const fontSizeBody = 12;

    // Title text centered at top
    const title = `Jedi Profile: ${name || 'Unknown Jedi'}`;
    const titleWidth = font.widthOfTextAtSize(title, fontSizeTitle);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - 50,
      size: fontSizeTitle,
      font,
      color: rgb(0.95, 0.93, 0.32),
    });

    // Body text with simple wrapping logic
    const lines = profile.split('\n');
    let yPosition = height - 80;
    lines.forEach((line) => {
      // Wrap lines longer than 80 characters
      const segments = line.match(/.{1,80}/g) || [];
      segments.forEach((segment) => {
        page.drawText(segment.trim(), {
          x: 50,
          y: yPosition,
          size: fontSizeBody,
          font,
          color: rgb(1, 1, 1),
        });
        yPosition -= fontSizeBody + 4;
        // If we run off the page, create a new page (simple handling)
        if (yPosition < 50) {
          yPosition = height - 50;
        }
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="jedi_profile.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
