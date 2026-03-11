import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resendApiKey = process.env.RESEND_API_KEY;
const bookingReceiverEmail = process.env.BOOKING_TEST_EMAIL;
const bookingSenderEmail =
  process.env.BOOKING_SENDER_EMAIL || "onboarding@resend.dev";

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
      console.error("Missing BOOKING_TEST_EMAIL in environment variables.");

      return NextResponse.json(
        { message: "Missing BOOKING_TEST_EMAIL in environment variables." },
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

    const attachments: Array<{ filename: string; content: string }> = [];

    const signatureParts = dataUrlToBase64Parts(signatureDataUrl);
    if (!signatureParts) {
      return NextResponse.json(
        { message: "Invalid signature format." },
        { status: 400 },
      );
    }

    attachments.push({
      filename: "signature.png",
      content: signatureParts.base64,
    });

    for (let i = 0; i < photoFiles.length; i += 1) {
      const file = photoFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      attachments.push({
        filename: file.name || `machine-photo-${i + 1}.jpg`,
        content: buffer.toString("base64"),
      });
    }

    const safeIssueSummary = escapeHtml(issueSummary).replace(/\n/g, "<br />");
    const emailSubject = `Machine Intake - ${customerName} - ${brand} ${model}`;

    const html = `
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
          <li><strong>Created date:</strong> ${escapeHtml(submittedAtFormatted)}</li>
          <li><strong>Accepted terms:</strong> ${escapeHtml(formatBoolean(acceptedTerms))}</li>
          <li><strong>Uploaded photos:</strong> ${photoFiles.length}</li>
          <li><strong>Signature attached:</strong> Yes</li>
          <li><strong>Time spent on form:</strong> ${escapeHtml(formatDuration(timeSpent))}</li>
        </ul>

        <p style="margin-top: 24px; color: #6b7280;">
          The signature and machine photos are attached to this email.
        </p>
      </div>
    `;

    const text = [
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
      `Uploaded photos: ${photoFiles.length}`,
      "Signature attached: Yes",
      `Time spent on form: ${formatDuration(timeSpent)}`,
    ].join("\n");

    console.log("About to send machine intake email", {
      to: bookingReceiverEmail,
      from: bookingSenderEmail,
      replyTo: email,
      subject: emailSubject,
      submittedAt: submittedAtFormatted,
      photoCount: photoFiles.length,
      attachmentCount: attachments.length,
      attachmentNames: attachments.map((file) => file.filename),
    });

    const response = await resend.emails.send({
      from: bookingSenderEmail,
      to: bookingReceiverEmail,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
      attachments,
    });

    console.log("Resend response:", response);

    const { error } = response;

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { message: "Failed to send the machine intake email." },
        { status: 500 },
      );
    }

    console.log("Machine intake email sent successfully.");

    return NextResponse.json({
      message: "Machine intake submitted successfully.",
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
- Save each submission to a database so the intake exists even if email delivery fails
- Add file count and total upload size limits for extra protection
- Generate a PDF intake summary and attach it alongside the signature/images
- Add optional customer confirmation email after successful submission
*/