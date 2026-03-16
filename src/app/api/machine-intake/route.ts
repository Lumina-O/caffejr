import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateMachineIntakePdf } from "@/lib/generateMachineReportPdf";
import { db } from "@/lib/db";
import { generateReferenceId } from "@/lib/referenceId";

export const runtime = "nodejs";

const isTest = true;
const resendApiKey = process.env.RESEND_API_KEY;

const bookingReceiverEmail = isTest
  ? process.env.BOOKING_TEST_EMAIL
  : process.env.BOOKING_RECEIVER_EMAIL;

const bookingSenderEmail = isTest
  ? process.env.BOOKING_SENDER_EMAIL_TEST
  : process.env.BOOKING_SENDER_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ALLOWED_MACHINE_TYPES = [
  "espresso",
  "bean-to-cup",
  "capsule",
  "filter",
  "commercial",
] as const;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);
  if (!value) return null;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
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

function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "0 seconds";

  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }

  return `${minutes} min ${seconds} sec`;
}

function dataUrlToBase64Parts(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    base64: match[2],
  };
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("da-DK", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  }).format(date);
}

function buildPdfFilename(customerName: string) {
  const safeName = customerName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `machine-intake-${safeName || "customer"}.pdf`;
}

export async function POST(request: Request) {
  try {
    if (!resendApiKey || !resend) {
      console.error("Missing RESEND_API_KEY in environment variables.");

      return NextResponse.json(
        { message: "Missing RESEND_API_KEY in environment variables." },
        { status: 500 },
      );
    }

    if (!bookingReceiverEmail) {
      console.error(
        isTest
          ? "Missing BOOKING_TEST_EMAIL in environment variables."
          : "Missing BOOKING_RECEIVER_EMAIL in environment variables.",
      );

      return NextResponse.json(
        {
          message: isTest
            ? "Missing BOOKING_TEST_EMAIL in environment variables."
            : "Missing BOOKING_RECEIVER_EMAIL in environment variables.",
        },
        { status: 500 },
      );
    }

    if (!bookingSenderEmail) {
      console.error(
        isTest
          ? "Missing BOOKING_SENDER_EMAIL_TEST in environment variables."
          : "Missing BOOKING_SENDER_EMAIL in environment variables.",
      );

      return NextResponse.json(
        {
          message: isTest
            ? "Missing BOOKING_SENDER_EMAIL_TEST in environment variables."
            : "Missing BOOKING_SENDER_EMAIL in environment variables.",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();

    const customerName = getString(formData, "customerName");
    const email = getString(formData, "email");
    const phone = getString(formData, "phone");

    const brand = getString(formData, "brand");
    const model = getString(formData, "model");
    const machineType = getString(formData, "machineType");

    const issueSummary = getString(formData, "issueSummary");

    const maxRepairAmount = getNumber(formData, "maxRepairAmount");
    const addCleaningService = getBoolean(formData, "addCleaningService");

    const acceptedTerms = getBoolean(formData, "acceptedTerms");
    const website = getString(formData, "website");
    const signatureDataUrl = getString(formData, "signatureDataUrl");
    const timeSpent = getNumber(formData, "timeSpent") ?? 0;

    const submittedAt = new Date();
    const submittedAtFormatted = formatSubmittedAt(submittedAt);
    const timeSpentFormatted = formatDuration(timeSpent);

    if (website) {
      console.warn("Honeypot field triggered. Submission blocked.");

      return NextResponse.json(
        { message: "Submission blocked." },
        { status: 400 },
      );
    }

    if (!customerName) {
      return NextResponse.json(
        { message: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { message: "Please enter your phone number." },
        { status: 400 },
      );
    }

    if (!brand) {
      return NextResponse.json(
        { message: "Please enter the machine brand." },
        { status: 400 },
      );
    }

    if (!model) {
      return NextResponse.json(
        { message: "Please enter the machine model." },
        { status: 400 },
      );
    }

    if (
      !machineType ||
      !ALLOWED_MACHINE_TYPES.includes(
        machineType as (typeof ALLOWED_MACHINE_TYPES)[number],
      )
    ) {
      return NextResponse.json(
        { message: "Please select a valid machine type." },
        { status: 400 },
      );
    }

    if (!issueSummary) {
      return NextResponse.json(
        { message: "Please describe the problem." },
        { status: 400 },
      );
    }

    if (maxRepairAmount === null || maxRepairAmount < 1500) {
      return NextResponse.json(
        {
          message:
            "The minimum amount before contact must be at least 1500 kr.",
        },
        { status: 400 },
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { message: "Terms and conditions must be accepted." },
        { status: 400 },
      );
    }

    if (!signatureDataUrl) {
      return NextResponse.json(
        { message: "Signature is required." },
        { status: 400 },
      );
    }

    const signatureParts = dataUrlToBase64Parts(signatureDataUrl);
    if (!signatureParts) {
      return NextResponse.json(
        { message: "Invalid signature format." },
        { status: 400 },
      );
    }

    const uploadedFiles = formData.getAll("machinePhotos");
    const photoFiles = uploadedFiles.filter(
      (file): file is File => file instanceof File && file.size > 0,
    );

    for (const file of photoFiles) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            message:
              "Only JPG, PNG, and WEBP images are allowed for machine photos.",
          },
          { status: 400 },
        );
      }

      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          {
            message: "Each uploaded image must be 15 MB or smaller.",
          },
          { status: 400 },
        );
      }
    }

    const referenceId = generateReferenceId();

    await db.machineIntake.create({
      data: {
        referenceId,
        customerName,
        email,
        phone,
        brand,
        model,
        machineType,
        issueSummary,
        maxRepairAmount,
        addCleaningService,
        acceptedTerms,
        photoCount: photoFiles.length,
        timeSpentMs: timeSpent,
      },
    });

    const pdfPhotos = await Promise.all(
      photoFiles.map(async (file, index) => ({
        name: file.name || `machine-photo-${index + 1}`,
        mimeType: file.type,
        bytes: Buffer.from(await file.arrayBuffer()),
      })),
    );

    const reportPdfBuffer = await generateMachineIntakePdf({
      customerName,
      email,
      phone,
      brand,
      model,
      machineType,
      issueSummary,
      maxRepairAmount,
      addCleaningService,
      acceptedTerms,
      submittedAtFormatted,
      timeSpentFormatted,
      photoCount: pdfPhotos.length,
      signatureDataUrl,
      photos: pdfPhotos,
    });

    const pdfFilename = buildPdfFilename(customerName);

    const ownerSubject = `Machine Intake - ${customerName} - ${brand} ${model}`;
    const customerSubject = `Your machine intake receipt - ${brand} ${model}`;

    const safeIssueSummary = escapeHtml(issueSummary).replace(/\n/g, "<br />");

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h1 style="margin-bottom: 8px;">New Machine Intake Submission</h1>
        <p style="margin-top: 0; color: #6b7280;">
          A new machine intake form has been submitted from the website.
        </p>

        <h2>Customer Details</h2>
        <ul>
          <li><strong>Full name:</strong> ${escapeHtml(customerName)}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
        </ul>

        <h2>Machine Details</h2>
        <ul>
          <li><strong>Brand:</strong> ${escapeHtml(brand)}</li>
          <li><strong>Model:</strong> ${escapeHtml(model)}</li>
          <li><strong>Machine type:</strong> ${escapeHtml(formatMachineType(machineType))}</li>
        </ul>

        <h2>Issue Details</h2>
        <p><strong>Issue summary:</strong><br />${safeIssueSummary}</p>

        <h2>Service Preferences</h2>
        <ul>
          <li><strong>Max amount before contact:</strong> ${escapeHtml(String(maxRepairAmount))} kr</li>
          <li><strong>Cleaning service (+600 kr):</strong> ${escapeHtml(formatBoolean(addCleaningService))}</li>
        </ul>

        <h2>Submission Meta</h2>
        <ul>
          <li><strong>Reference:</strong> ${referenceId}</li>
          <li><strong>Created date:</strong> ${escapeHtml(submittedAtFormatted)}</li>
          <li><strong>Accepted terms:</strong> ${escapeHtml(formatBoolean(acceptedTerms))}</li>
          <li><strong>Uploaded photos:</strong> ${pdfPhotos.length}</li>
          <li><strong>Signature included in PDF:</strong> Yes</li>
          <li><strong>Time spent on form:</strong> ${escapeHtml(timeSpentFormatted)}</li>
        </ul>

        <p style="margin-top: 24px; color: #6b7280;">
          The full PDF report is attached to this email.
        </p>
      </div>
    `;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h1 style="margin-bottom: 8px;">We received your machine intake form</h1>
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>
          Thank you for submitting your machine intake form.
          We have attached the full PDF copy of your submission for your records.
        </p>
        <p><strong>Your reference number:</strong> ${referenceId}</p>

        <h2>Quick Summary</h2>
        <ul>
          <li><strong>Brand:</strong> ${escapeHtml(brand)}</li>
          <li><strong>Model:</strong> ${escapeHtml(model)}</li>
          <li><strong>Machine type:</strong> ${escapeHtml(formatMachineType(machineType))}</li>
          <li><strong>Submitted:</strong> ${escapeHtml(submittedAtFormatted)}</li>
        </ul>
      </div>
    `;

    const ownerText = [
      "New Machine Intake Submission",
      "",
      "Customer Details",
      `Full name: ${customerName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "",
      "Machine Details",
      `Brand: ${brand}`,
      `Model: ${model}`,
      `Machine type: ${formatMachineType(machineType)}`,
      "",
      "Issue Details",
      `Issue summary: ${issueSummary}`,
      "",
      "Service Preferences",
      `Max amount before contact: ${maxRepairAmount} kr`,
      `Cleaning service (+600 kr): ${formatBoolean(addCleaningService)}`,
      "",
      "Submission Meta",
      `Created date: ${submittedAtFormatted}`,
      `Accepted terms: ${formatBoolean(acceptedTerms)}`,
      `Uploaded photos: ${pdfPhotos.length}`,
      "Signature included in PDF: Yes",
      `Time spent on form: ${timeSpentFormatted}`,
      "",
      "The full PDF report is attached.",
    ].join("\n");

    const customerText = [
      "We received your machine intake form",
      "",
      `Hi ${customerName},`,
      "",
      "Thank you for submitting your machine intake form.",
      "The full PDF copy of your submission is attached for your records.",
      "",
      `Brand: ${brand}`,
      `Model: ${model}`,
      `Machine type: ${formatMachineType(machineType)}`,
      `Submitted: ${submittedAtFormatted}`,
    ].join("\n");

    const attachments = [
      {
        filename: pdfFilename,
        content: reportPdfBuffer.toString("base64"),
      },
    ];

    const ownerResponse = await resend.emails.send({
      from: bookingSenderEmail,
      to: bookingReceiverEmail,
      replyTo: email,
      subject: ownerSubject,
      html: ownerHtml,
      text: ownerText,
      attachments,
    });

    if (ownerResponse.error) {
      console.error("Owner Resend error:", ownerResponse.error);

      return NextResponse.json(
        { message: "Failed to send the machine intake email to the owner." },
        { status: 500 },
      );
    }

    const customerResponse = await resend.emails.send({
      from: bookingSenderEmail,
      to: email,
      replyTo: bookingReceiverEmail,
      subject: customerSubject,
      html: customerHtml,
      text: customerText,
      attachments,
    });

    if (customerResponse.error) {
      console.error("Customer Resend error:", customerResponse.error);

      return NextResponse.json(
        {
          message:
            "The form was submitted, but the customer confirmation email failed to send.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Machine intake submitted successfully.",
      referenceId,
    });
  } catch (error) {
    console.error("Machine intake POST error:", error);

    return NextResponse.json(
      { message: "Something went wrong while submitting the intake form." },
      { status: 500 },
    );
  }
}

/* TODO:
- Replace `isTest = true` with NODE_ENV or a dedicated env flag like BOOKING_USE_TEST_MODE
- Save each submission to a database so the intake exists even if email delivery fails
- Add total upload size and max photo count protection
- Add unique report IDs and show them in both email and PDF
- Add page numbers and company branding to the PDF
*/