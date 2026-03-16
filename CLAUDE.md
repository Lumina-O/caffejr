# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

Caffe Jr. is a Next.js App Router application for a coffee machine service business. It combines a marketing landing page with a customer-facing service intake system and a protected admin dashboard.

### App Structure

- `/` — Landing page with multilingual (Danish/English) marketing content and a 3D coffee machine model (Three.js/R3F)
- `/booking` — Service booking form
- `/machine-intake/form` — Machine intake form with photo uploads, signature pad, and PDF report generation
- `/availability` — Business availability status
- `/login` — Staff login
- `/admin/*` — Protected admin dashboard (capacity, users, reports)
- `/unauthorized` — Shown when auth fails

### Key Libraries

- **Tailwind CSS v4** — uses CSS variables for theming; global utility classes like `.section-container`, `.surface-main`, `.surface-card`, `.section-title` are defined in `globals.css`
- **Resend** — transactional email for booking and intake confirmations
- **pdf-lib + sharp** — PDF report generation from machine intake submissions
- **Framer Motion** — page/component animations
- **React Three Fiber / Drei** — 3D hero model

### Authentication

Auth is cookie-based (not JWT). `src/lib/auth.ts` provides `getCurrentUser()`, `requireAuth()`, `requireRole()`. Middleware at `src/middleware.ts` protects `/admin` and `/login` routes by checking `user_role` and `user_email` cookies.

Role hierarchy (lowest → highest): `user → staff → admin → super_admin` — defined in `src/lib/permissions.ts`.

**Note:** The current login is a mock (no real database). The middleware validates cookies but does not verify real session tokens.

### Multilingual Content

Language state is managed via `LanguageContext` (`src/context/`), stored in localStorage. All site copy lives in `src/data/siteData.ts` as typed multilingual objects. Components receive a `language` prop and index into these objects.

### API Routes

All API routes follow a common pattern:
- Honeypot field + time-trap (min 4s fill time) for spam prevention
- In-memory IP-based rate limiting (5 req/hr per IP — not Redis; not suitable for multi-instance prod)
- HTML-escaped user input
- Email sent via Resend to both admin and customer

### PDF Generation

`src/lib/generateMachineReportPdf.ts` builds a PDF from form data, images (JPEG/PNG/WebP normalized via sharp), and a signature image using pdf-lib.

### Environment Variables

```
RESEND_API_KEY
BOOKING_RECEIVER_EMAIL
BOOKING_SENDER_EMAIL
BOOKING_TEST_EMAIL
BOOKING_SENDER_EMAIL_TEST
```

### Path Alias

`@/*` maps to `./src/*` — use this for all imports.
