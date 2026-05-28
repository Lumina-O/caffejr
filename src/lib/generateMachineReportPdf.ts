import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont, type PDFImage } from "pdf-lib";
import sharp from "sharp";

type EmbeddedPhoto = {
  name: string;
  mimeType: string;
  bytes: Buffer;
};

type MachineIntakePdfData = {
  referenceId?: string;
  customerName: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  machineType: string;
  issueSummary: string;
  maxRepairAmount: number;
  addCleaningService: boolean;
  acceptedTerms: boolean;
  submittedAtFormatted: string;
  timeSpentFormatted: string;
  photoCount: number;
  signatureDataUrl: string;
  photos: EmbeddedPhoto[];
};

function safe(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  return String(value);
}

function wrapText(text: string, maxChars = 90) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxChars) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines;
}

function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

function formatMachineType(value: string) {
  switch (value) {
    case "espresso":
      return "Espresso machine";
    case "bean-to-cup":
      return "Bean to cup";
    case "capsule":
      return "Capsule";
    case "filter":
      return "Filter coffee";
    case "commercial":
      return "Commercial machine";
    default:
      return value || "Not provided";
  }
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid data URL image format.");
  }

  return {
    mimeType: match[1],
    bytes: Buffer.from(match[2], "base64"),
  };
}

async function normalizeImageForPdf(
  pdfDoc: PDFDocument,
  input: { mimeType: string; bytes: Buffer },
): Promise<PDFImage> {
  const mime = input.mimeType.toLowerCase();

  if (mime === "image/png") {
    return pdfDoc.embedPng(input.bytes);
  }

  if (mime === "image/jpeg" || mime === "image/jpg") {
    return pdfDoc.embedJpg(input.bytes);
  }

  const convertedPng = await sharp(input.bytes).png().toBuffer();
  return pdfDoc.embedPng(convertedPng);
}

function addNewPage(pdfDoc: PDFDocument) {
  return pdfDoc.addPage([595.28, 841.89]); // A4
}

function drawPageHeader(
  page: PDFPage,
  title: string,
  subtitle?: string,
  fontBold?: PDFFont,
  fontRegular?: PDFFont,
  logoImage?: PDFImage,
) {
  const { width, height } = page.getSize();

  const logoSize = 36;
  const logoX = width - 50 - logoSize;
  const logoY = height - 50 - logoSize;

  if (logoImage) {
    page.drawImage(logoImage, {
      x: logoX,
      y: logoY,
      width: logoSize,
      height: logoSize,
    });
  }

  page.drawText(title, {
    x: 50,
    y: height - 52,
    size: 18,
    font: fontBold,
    color: rgb(0.15, 0.23, 0.35),
  });

  if (subtitle) {
    page.drawText(subtitle, {
      x: 50,
      y: height - 72,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  page.drawLine({
    start: { x: 50, y: height - 84 },
    end: { x: width - 50, y: height - 84 },
    thickness: 0.75,
    color: rgb(0.82, 0.85, 0.88),
  });
}

function fitImageWithinBox(
  imageWidth: number,
  imageHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  const widthRatio = maxWidth / imageWidth;
  const heightRatio = maxHeight / imageHeight;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: imageWidth * ratio,
    height: imageHeight * ratio,
  };
}

export async function generateMachineIntakePdf(
  data: MachineIntakePdfData,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let logoImage: PDFImage | undefined;
  try {
    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
    const rawLogo = fs.readFileSync(logoPath);
    // Convert to RGBA PNG to ensure pdf-lib can embed it (palette PNGs can fail)
    const rgbaPng = await sharp(rawLogo).ensureAlpha().png().toBuffer();
    logoImage = await pdfDoc.embedPng(rgbaPng);
  } catch {
    // Logo is optional — continue without it if missing or unreadable
  }

  let page = addNewPage(pdfDoc);
  const { width, height } = page.getSize();

  const marginX = 50;
  const contentWidth = width - marginX * 2;
  let y = height - 112;

  const textColor = rgb(0.1, 0.1, 0.1);
  const mutedColor = rgb(0.45, 0.45, 0.45);
  const accentColor = rgb(0.15, 0.23, 0.35);

  drawPageHeader(page, "Machine Intake Report", `caffejr.dk  ·  Ref: ${data.referenceId ?? "—"}`, fontBold, fontRegular, logoImage);

  const drawText = (
    text: string,
    options?: {
      x?: number;
      y?: number;
      size?: number;
      bold?: boolean;
      color?: ReturnType<typeof rgb>;
    },
  ) => {
    page.drawText(text, {
      x: options?.x ?? marginX,
      y: options?.y ?? y,
      size: options?.size ?? 11,
      font: options?.bold ? fontBold : fontRegular,
      color: options?.color ?? textColor,
      maxWidth: contentWidth,
      lineHeight: 14,
    });
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < 70) {
      page = addNewPage(pdfDoc);
      y = height - 112;
      drawPageHeader(page, "Machine Intake Report", `caffejr.dk  ·  Ref: ${data.referenceId ?? "—"}`, fontBold, fontRegular, logoImage);
    }
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(36);

    y -= 4;

    drawText(title, {
      size: 12,
      bold: true,
      color: accentColor,
    });

    y -= 10;

    page.drawLine({
      start: { x: marginX, y },
      end: { x: width - marginX, y },
      thickness: 0.75,
      color: rgb(0.82, 0.85, 0.88),
    });

    y -= 16;
  };

  const drawRow = (label: string, value: string) => {
    ensureSpace(20);

    drawText(label, { bold: true });
    drawText(value, { x: marginX + 170 });
    y -= 20;
  };

  const drawParagraph = (label: string, value: string) => {
    ensureSpace(50);

    drawText(label, { bold: true });
    y -= 18;

    const lines = wrapText(value, 92);

    for (const line of lines) {
      ensureSpace(18);
      drawText(line);
      y -= 16;
    }

    y -= 8;
  };

  drawSectionTitle("Customer Details");
  drawRow("Full name", safe(data.customerName));
  drawRow("Email", safe(data.email));
  drawRow("Phone", safe(data.phone));

  y -= 8;

  drawSectionTitle("Machine Details");
  drawRow("Brand", safe(data.brand));
  drawRow("Model", safe(data.model));
  drawRow("Machine type", formatMachineType(data.machineType));

  y -= 8;

  drawSectionTitle("Issue Details");

  const rawIssueSummary = safe(data.issueSummary);
  const issueParts = rawIssueSummary.match(
    /^Kategori: (.+?)(?:\n\nEkstra detaljer:\n([\s\S]*))?$/,
  );

  if (issueParts) {
    drawParagraph("Kategori", issueParts[1]);
    if (issueParts[2]?.trim()) {
      drawParagraph("Ekstra detaljer", issueParts[2].trim());
    }
  } else {
    drawParagraph("Issue summary", rawIssueSummary);
  }

  drawSectionTitle("Service Preferences");
  drawRow("Max amount before contact", `${safe(data.maxRepairAmount)} kr`);
  drawRow("Cleaning service (+600 kr)", formatBoolean(data.addCleaningService));

  y -= 8;

  drawSectionTitle("Submission Meta");
  drawRow("Created date", safe(data.submittedAtFormatted));
  drawRow("Accepted terms", formatBoolean(data.acceptedTerms));
  drawRow("Uploaded photos", safe(data.photoCount));
  drawRow("Time spent on form", safe(data.timeSpentFormatted));

  y -= 12;

  drawSectionTitle("Customer Signature");

  const signatureInput = parseDataUrl(data.signatureDataUrl);
  const signatureImage = await normalizeImageForPdf(pdfDoc, signatureInput);
  const signatureSize = fitImageWithinBox(
    signatureImage.width,
    signatureImage.height,
    contentWidth,
    180,
  );

  ensureSpace(signatureSize.height + 30);

  page.drawRectangle({
    x: marginX,
    y: y - signatureSize.height - 10,
    width: signatureSize.width + 20,
    height: signatureSize.height + 20,
    borderColor: rgb(0.85, 0.87, 0.9),
    borderWidth: 1,
    color: rgb(0.98, 0.99, 1),
  });

  page.drawImage(signatureImage, {
    x: marginX + 10,
    y: y - signatureSize.height,
    width: signatureSize.width,
    height: signatureSize.height,
  });

  y -= signatureSize.height + 30;

  if (data.photos.length > 0) {
    for (let i = 0; i < data.photos.length; i += 1) {
      const photo = data.photos[i];
      const photoImage = await normalizeImageForPdf(pdfDoc, {
        mimeType: photo.mimeType,
        bytes: photo.bytes,
      });

      page = addNewPage(pdfDoc);
      drawPageHeader(pdfDoc.getPages()[pdfDoc.getPageCount() - 1], `Machine Photo ${i + 1}`, photo.name || `Uploaded image ${i + 1}`, fontBold, fontRegular, logoImage);

      const currentPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
      const pageSize = currentPage.getSize();

      const maxImageWidth = pageSize.width - 80;
      const maxImageHeight = pageSize.height - 180;

      const photoSize = fitImageWithinBox(
        photoImage.width,
        photoImage.height,
        maxImageWidth,
        maxImageHeight,
      );

      const imageX = (pageSize.width - photoSize.width) / 2;
      const imageY = (pageSize.height - photoSize.height) / 2 - 20;

      currentPage.drawRectangle({
        x: imageX - 10,
        y: imageY - 10,
        width: photoSize.width + 20,
        height: photoSize.height + 20,
        borderColor: rgb(0.85, 0.87, 0.9),
        borderWidth: 1,
        color: rgb(0.99, 0.99, 1),
      });

      currentPage.drawImage(photoImage, {
        x: imageX,
        y: imageY,
        width: photoSize.width,
        height: photoSize.height,
      });

      currentPage.drawText(`Photo ${i + 1} of ${data.photos.length}`, {
        x: 50,
        y: 50,
        size: 10,
        font: fontRegular,
        color: mutedColor,
      });
    }
  }

  // Add "Page X of Y" footer to every page
  const totalPages = pdfDoc.getPageCount();
  for (let i = 0; i < totalPages; i++) {
    const p = pdfDoc.getPages()[i];
    const { width: pw } = p.getSize();
    const pageLabel = `Page ${i + 1} of ${totalPages}`;
    const labelWidth = fontRegular.widthOfTextAtSize(pageLabel, 9);
    p.drawText(pageLabel, {
      x: pw - marginX - labelWidth,
      y: 28,
      size: 9,
      font: fontRegular,
      color: rgb(0.55, 0.55, 0.55),
    });

    p.drawLine({
      start: { x: marginX, y: 42 },
      end: { x: pw - marginX, y: 42 },
      thickness: 0.5,
      color: rgb(0.88, 0.89, 0.91),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/* TODO:
- Add company logo and branded header/footer
- Add a unique report ID and show it on every page
- Add page numbers to the full PDF
- Optionally place multiple photos on one page for smaller uploads
*/