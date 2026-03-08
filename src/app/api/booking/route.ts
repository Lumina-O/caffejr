import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MIN_FORM_FILL_TIME_MS = 4000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      machineType,
      preferredDate,
      message,
      website,
      startedAt,
    } = body ?? {};

    if (
      !name ||
      !email ||
      !phone ||
      !machineType ||
      !preferredDate ||
      !message
    ) {
      return Response.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const bookingReceiver = process.env.BOOKING_RECEIVER_EMAIL;
    const bookingSender = process.env.BOOKING_SENDER_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!bookingReceiver || !bookingSender || !resendApiKey) {
      return Response.json(
        { error: "Email service is not configured correctly." },
        { status: 500 }
      );
    }

    // Anti-spam: honeypot field
    if (typeof website === "string" && website.trim() !== "") {
      return Response.json(
        { error: "Spam detected." },
        { status: 400 }
      );
    }

    // Anti-spam: time trap
    const parsedStartedAt =
      typeof startedAt === "number" ? startedAt : Number(startedAt);

    if (
      !Number.isFinite(parsedStartedAt) ||
      Date.now() - parsedStartedAt < MIN_FORM_FILL_TIME_MS
    ) {
      return Response.json(
        { error: "Form submitted too quickly." },
        { status: 400 }
      );
    }

    // Anti-spam: basic IP rate limit
    const ip = getClientIp(request) ?? "unknown";
    const now = Date.now();
    const existingEntry = rateLimitStore.get(ip);

    if (!existingEntry || now > existingEntry.resetAt) {
      rateLimitStore.set(ip, {
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      });
    } else {
      if (existingEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return Response.json(
          { error: "Too many booking attempts. Please try again later." },
          { status: 429 }
        );
      }

      existingEntry.count += 1;
      rateLimitStore.set(ip, existingEntry);
    }

    const adminEmailResult = await resend.emails.send({
      from: bookingSender,
      to: bookingReceiver,
      replyTo: email,
      subject: `New booking request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Machine Type:</strong> ${escapeHtml(machineType)}</p>
          <p><strong>Preferred Date:</strong> ${escapeHtml(preferredDate)}</p>
          <p><strong>Issue Description:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    if (adminEmailResult.error) {
      console.error("Admin email send error:", adminEmailResult.error);

      return Response.json(
        { error: "Failed to send booking email." },
        { status: 500 }
      );
    }

    const customerEmailResult = await resend.emails.send({
      from: bookingSender,
      to: email,
      subject: "We received your booking request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
          <h2>Booking request received</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for contacting us. We have received your booking request and will get back to you as soon as possible to confirm the appointment.</p>
          <p><strong>Your request details:</strong></p>
          <ul>
            <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
            <li><strong>Machine Type:</strong> ${escapeHtml(machineType)}</li>
            <li><strong>Preferred Date:</strong> ${escapeHtml(preferredDate)}</li>
          </ul>
          <p><strong>Issue Description:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
          <p>Best regards,<br />Caffe Jr.</p>
        </div>
      `,
    });

    if (customerEmailResult.error) {
      console.error("Customer auto-reply send error:", customerEmailResult.error);

      return Response.json(
        {
          success: true,
          warning:
            "Booking received, but confirmation email to customer could not be sent.",
        },
        { status: 200 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Booking route error:", error);

    return Response.json(
      { error: "Something went wrong while sending the booking request." },
      { status: 500 }
    );
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return request.headers.get("x-real-ip");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// TODO: Replace in-memory rate limiting with Redis or a durable store for production scaling.
// TODO: Add stricter validation for email format and phone numbers.
// TODO: Add optional reCAPTCHA or Cloudflare Turnstile if spam increases.
// TODO: Add branded React Email templates for both admin and customer emails.