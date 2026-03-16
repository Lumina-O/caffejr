# Caffe Jr. — Project Milestones

## Overview

Caffe Jr. is a Next.js application for a coffee machine service business. The frontend is largely complete (~60%). The primary remaining work is backend integration, database, and production-readiness.

---

## Milestone 1 — Database & Data Persistence ✅

Stack chosen: **Neon (serverless Postgres) + Prisma 7**

### Subtasks

- [x] Choose and provision a database — **Neon (Postgres)**
- [x] Design schema: `Booking`, `MachineIntake`, `User` models in `prisma/schema.prisma`
- [x] Set up ORM — **Prisma 7** with singleton client at `src/lib/db.ts`
- [x] Save booking form submissions to database on API call
- [x] Save machine intake form submissions to database on API call
- [x] Generate and store unique reference/report IDs per submission (`src/lib/referenceId.ts`, format: `CJ-YYYYMMDD-XXXX`)
- [x] Surface submission reference number on `/machine-intake/complete` page
- [ ] **You must do:** Provision a Neon project, copy the `DATABASE_URL`, and add it to `.env.local` — then run `npx prisma migrate dev --name init`

---

## Milestone 2 — Real Authentication & Session Management

Login is currently a mock with hardcoded credentials and insecure cookies.

### Subtasks

- [ ] Store users in database with hashed passwords (bcrypt or argon2)
- [ ] Replace mock `/api/auth/login` with real database lookup
- [ ] Issue secure, signed session tokens (or use a library like NextAuth / Lucia Auth)
- [ ] Validate session token in middleware (not just cookie presence)
- [ ] Implement `/api/auth/logout` to invalidate server-side session
- [ ] Seed initial `super_admin` user via a migration or setup script
- [ ] Add brute-force protection to login (lockout after N failed attempts)
- [ ] Support "remember me" with long-lived vs. short-lived session expiry

---

## Milestone 3 — Admin Dashboard — Real Data

The admin UI is complete but all data (stats, tickets, users, reports) is hardcoded.

### Subtasks

- [ ] `/admin` — connect stat cards to real counts from database
  - [ ] Total bookings (all time and this month)
  - [ ] Open tickets
  - [ ] Registered customers
  - [ ] Active staff (online indicator or last-seen)
- [ ] `/admin/capacity` — load real tickets from database into calendar
  - [ ] API route: `GET /api/admin/tickets?month=YYYY-MM`
  - [ ] Connect sidebar ticket list to selected day's real data
  - [ ] Add ticket status update (open → in progress → closed)
  - [ ] Add filters: by technician, status, machine type
- [ ] `/admin/reports` — replace mock data with database queries
  - [ ] Total bookings, open slots, completed jobs, pending actions
  - [ ] Recent submissions table with pagination
  - [ ] Export report as CSV or PDF download
- [ ] `/admin/users` — implement real user CRUD
  - [ ] Load users from database
  - [ ] Add user: modal form → POST `/api/admin/users`
  - [ ] Edit user: role change, status toggle
  - [ ] Deactivate/delete user (soft delete preferred)
  - [ ] Audit log for role changes

---

## Milestone 4 — Machine Intake — Polish & Production Readiness

The intake form is the most feature-rich part of the app and needs final polish.

### Subtasks

- [ ] Add page numbers to generated PDF
- [ ] Add company logo/branding to PDF header and footer
- [ ] Improve PDF layout: spacing, font sizes, section separators
- [ ] Add unique submission reference number to PDF and confirmation page
- [ ] Split 7-step form into separate step components (currently one large file)
- [ ] Add photo reorder drag-and-drop on upload step
- [ ] Detect and warn on duplicate photo uploads
- [ ] Add cancel/abort button for in-progress XHR file uploads
- [ ] Add loading state to submit button during final form submission
- [ ] Test photo compression and PDF generation with edge case images (HEIC, large PNGs)

---

## Milestone 5 — Booking System

The booking form works end-to-end but needs persistence and UX improvements.

### Subtasks

- [ ] Save bookings to database via `/api/booking`
- [ ] Add booking status: `pending`, `confirmed`, `cancelled`, `completed`
- [ ] Admin: view and manage bookings in a dedicated `/admin/bookings` page
- [ ] Allow admin to confirm/cancel a booking and trigger confirmation email
- [ ] Add date picker with real availability checking (block dates that are fully booked)
- [ ] Customer-facing: show a booking confirmation page with reference number
- [ ] Add machine type options to form (fetch from database or static list)

---

## Milestone 6 — Email System

Emails are sent via Resend and currently work, but templates are basic and the setup is not environment-aware.

### Subtasks

- [ ] Replace in-memory IP rate limiting with Redis-backed rate limiter (Upstash or similar)
- [ ] Switch email templates to React Email for maintainable, styled HTML emails
- [ ] Build email templates:
  - [ ] Booking confirmation (customer)
  - [ ] Booking notification (admin)
  - [ ] Machine intake confirmation (customer + PDF attachment)
  - [ ] Machine intake notification (admin)
  - [ ] Booking status change (confirmed / cancelled)
- [ ] Add `NODE_ENV`-based routing: send to test address in dev, real address in prod
- [ ] Add Resend webhook support to track email delivery/bounces (optional)

---

## Milestone 7 — Spam Prevention & Security Hardening

Current protection (honeypot + time trap) is minimal and rate limiting is in-memory only.

### Subtasks

- [ ] Replace in-memory rate limiting with Redis (supports multi-instance deployment)
- [ ] Add Cloudflare Turnstile or hCaptcha to booking and intake forms
- [ ] Add stricter email and phone validation (format + disposable email detection)
- [ ] Audit all API routes for missing input validation
- [ ] Add Content Security Policy headers
- [ ] Ensure all user-facing inputs are HTML-escaped before storage and rendering
- [ ] Add rate limiting to auth endpoints (separate from form endpoints)

---

## Milestone 8 — Multilingual Completeness (Danish / English)

Language switching works for the landing page but is incomplete across the site.

### Subtasks

- [ ] Translate `/availability` page content to Danish
- [ ] Translate `/booking` form labels, placeholders, and error messages
- [ ] Translate machine intake form (all 7 steps) — labels, descriptions, errors
- [ ] Translate admin pages (optional — internal tool)
- [ ] Add browser language auto-detection on first visit
- [ ] Ensure `lang` attribute on `<html>` updates with selected language

---

## Milestone 9 — Landing Page — Final Polish

The landing page is 95% done. These are the remaining finishing touches.

### Subtasks

- [ ] Replace placeholder testimonials with real customer quotes
- [ ] Finalize brand copy in both Danish and English
- [ ] Add real team/company photos to relevant sections (if applicable)
- [ ] Add reduced-motion support (`prefers-reduced-motion`) for Framer Motion animations
- [ ] Fix 3D coffee machine model auto-centering in viewer
- [ ] Improve mobile navigation menu open/close animations
- [ ] Add meta tags, Open Graph, and Twitter card for SEO and link previews
- [ ] Add favicon and web manifest

---

## Milestone 10 — Infrastructure & Deployment

Production readiness, CI/CD, and hosting configuration.

### Subtasks

- [ ] Set up production environment variables (Vercel / hosting)
- [ ] Configure custom domain and SSL
- [ ] Set up database connection pooling for serverless environment (e.g. PgBouncer / Neon pooler)
- [ ] Add error monitoring (e.g. Sentry)
- [ ] Add basic analytics (e.g. Plausible, Vercel Analytics)
- [ ] Set up GitHub Actions CI: lint + build check on every PR
- [ ] Add a `CONTRIBUTING.md` or deployment runbook for the team
- [ ] Load test booking and intake API routes before launch

---

## Status Summary

| Milestone | Area | Status |
|-----------|------|--------|
| 1 — Database & Persistence | Backend | **Done** (needs Neon provisioning) |
| 2 — Real Authentication | Backend | Not started |
| 3 — Admin Dashboard Real Data | Full-stack | Not started |
| 4 — Machine Intake Polish | Frontend / PDF | In progress |
| 5 — Booking System | Full-stack | Partially done |
| 6 — Email System | Backend | Partially done |
| 7 — Spam Prevention & Security | Backend | Partially done |
| 8 — Multilingual Completeness | Frontend | Partially done |
| 9 — Landing Page Final Polish | Frontend | Nearly done |
| 10 — Infrastructure & Deployment | DevOps | Not started |
