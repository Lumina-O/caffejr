# Caffe Jr. — Project Milestones

## Overview

Caffe Jr. is a Next.js application for a coffee machine service business. The frontend is largely complete. The primary remaining work is intake form polish, email templates, spam prevention, and production deployment.

---

## Milestone 1 — Database & Data Persistence ✅ Done

Stack chosen: **Neon (serverless Postgres) + Prisma 7**

### Subtasks

- [x] Choose and provision a database — **Neon (Postgres)**
- [x] Design schema: `Booking`, `MachineIntake`, `User` models in `prisma/schema.prisma`
- [x] Set up ORM — **Prisma 7** with singleton client at `src/lib/db.ts`
- [x] Save booking form submissions to database on API call
- [x] Save machine intake form submissions to database on API call
- [x] Generate and store unique reference/report IDs per submission (`src/lib/referenceId.ts`, format: `CJ-YYYYMMDD-XXXX`)
- [x] Surface submission reference number on `/machine-intake/complete` page

---

## Milestone 2 — Real Authentication & Session Management ✅ Done

Stack chosen: **iron-session** (encrypted cookie sessions) + **bcrypt** (password hashing)

### Subtasks

- [x] Store users in database with hashed passwords — **bcrypt** (12 rounds)
- [x] Replace mock `/api/auth/login` with real Neon/Prisma database lookup
- [x] Issue secure encrypted session cookies — **iron-session** (`caffejr_session` cookie)
- [x] Validate session token in middleware (checks `caffejr_session` cookie)
- [x] Implement `/api/auth/logout` using `session.destroy()`
- [x] Seed initial `super_admin` user via `npm run db:seed` (`prisma/seed.ts`)
- [x] Support "remember me" — 8hr session vs 30-day session
- [x] Add brute-force protection — 5 attempts then 15-minute lockout, tracked in database (works across serverless instances)

---

## Milestone 3 — Admin Dashboard — Real Data ✅ Done

All admin pages are wired to real database data. Several features beyond the original scope were also added.

### Subtasks

- [x] `/admin` — 4 stat cards with real counts: total intakes, active intakes, unique customers, active staff
- [x] `/admin/capacity` — month/week calendar with real machine intakes from database
  - [x] API route: `GET /api/admin/tickets?month=YYYY-MM`
  - [x] Click a day to open a modal popup with intake list and status dropdowns
  - [x] Ticket status update (received → in_progress → completed/rejected)
  - [x] Filters: status, machine type
  - [x] Closed tickets span `createdAt` → `closedAt`; active tickets span to today
- [x] `/admin/reports` — real stat cards, paginated intake table, CSV export
  - [x] Intake table shows: reference, customer, machine, photos, status, submitted date, closed date, PDF download
  - [x] Clickable reference links to intake detail (links disabled for deleted intakes)
- [x] `/admin/reports/[id]` — full intake detail *(added beyond original scope)*
  - [x] All customer/machine/issue fields
  - [x] Opened and closed dates with task duration badge
  - [x] Admin editable fields: price (DKK), engineer notes
  - [x] Delete intake (removes DB record + Vercel Blob files)
  - [x] Change log timeline (all field updates with old → new values)
  - [x] Inline PDF viewer (cross-browser including Safari)
  - [x] PDF regeneration button
- [x] `/admin/log` — unified activity timeline *(added beyond original scope)*
  - [x] User management events (AuditLog)
  - [x] Intake CRUD events (IntakeChangeLog: created, updated, deleted)
  - [x] Filter by type: all / users / intakes
- [x] `/admin/users` — full user management (super_admin only)
  - [x] Load users from database
  - [x] Invite user by email: generates temp password, sends via Resend, forces password change on first login
  - [x] Edit user: role change, active/inactive toggle
  - [x] Audit log for all role/status changes
- [x] Private file storage via **Vercel Blob** *(added beyond original scope)*
  - [x] PDFs stored at `intakes/{referenceId}-machine-intake-{name}.pdf`
  - [x] Photos stored at `intakes/photos/{referenceId}-{index}.{ext}`
  - [x] Server-side streaming proxy for private blob access
- [x] `closedAt` timestamp on `MachineIntake` *(added beyond original scope)*
  - [x] Auto-set when status → `completed` or `rejected`; cleared if status reverts
  - [x] Used for ticket duration tracking and capacity calendar end dates

---

## Milestone 4 — Machine Intake — Polish & Production Readiness

The intake form is functional end-to-end. These are the remaining polish items.

### Subtasks

- [ ] Add page numbers to generated PDF
- [ ] Add company logo/branding to PDF header and footer
- [ ] Improve PDF layout: spacing, font sizes, section separators
- [x] Add unique submission reference number to PDF and confirmation page
- [x] Photo upload with automatic compression (quality 0.82) before submission
- [ ] Split 7-step form into separate step components (currently one 1,100-line file)
- [ ] Add photo reorder drag-and-drop on upload step
- [ ] Detect and warn on duplicate photo uploads
- [ ] Add cancel/abort button for in-progress XHR file uploads
- [ ] Test PDF generation with edge case images (HEIC, large PNGs)

---

## Milestone 5 — Booking System ⏸ On Hold

The booking feature has been intentionally disabled — the customer is not using it currently. All booking-related stats and calendar entries have been removed from the admin UI.

### Subtasks (when re-enabled)

- [ ] Re-enable booking form and admin booking views
- [ ] Add date picker with real availability checking (block fully-booked dates)
- [ ] Allow admin to confirm/cancel a booking and trigger confirmation email
- [ ] Customer-facing: show a booking confirmation page with reference number
- [ ] Add machine type options to form (fetch from database or static list)

---

## Milestone 6 — Email System

Resend is integrated for user invites. Intake and booking notification emails are basic and not yet templated.

### Subtasks

- [x] User invite email (temp password sent via Resend on admin invite)
- [ ] Switch email templates to React Email for maintainable, styled HTML emails
- [ ] Build email templates:
  - [ ] Machine intake confirmation (customer + PDF attachment)
  - [ ] Machine intake notification (admin)
  - [ ] Booking confirmation (customer) *(blocked by Milestone 5)*
  - [ ] Booking notification (admin) *(blocked by Milestone 5)*
  - [ ] Booking status change (confirmed / cancelled) *(blocked by Milestone 5)*
- [ ] Add `NODE_ENV`-based routing: send to test address in dev, real address in prod
- [ ] Add Resend webhook support to track email delivery/bounces (optional)

---

## Milestone 7 — Spam Prevention & Security Hardening

Core auth security is solid. Public form protection and rate limiting still need work.

### Subtasks

- [ ] Replace in-memory IP rate limiting with Redis-backed rate limiter (Upstash or similar)
- [ ] Add Cloudflare Turnstile or hCaptcha to booking and intake forms
- [ ] Add stricter email and phone validation (format + disposable email detection)
- [ ] Audit all API routes for missing input validation
- [x] Security headers (CSP, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy) in `next.config.ts`
- [x] All user-facing inputs HTML-escaped before storage and rendering
- [x] Auth rate limiting — brute force lockout (5 attempts, 15-min) tracked in database
- [x] Input length limits on login (email 254 chars, password 72 chars)
- [x] Timing attack prevention on login — dummy bcrypt compare when user not found
- [x] bcrypt DoS prevention — password length capped before hashing

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

The landing page is nearly complete. These are the remaining finishing touches.

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
- [ ] Set up database connection pooling for serverless environment (Neon pooler)
- [ ] Add error monitoring (e.g. Sentry)
- [ ] Add basic analytics (e.g. Plausible, Vercel Analytics)
- [ ] Set up GitHub Actions CI: lint + build check on every PR
- [ ] Load test booking and intake API routes before launch

---

## Status Summary

| Milestone | Area | Status |
|-----------|------|--------|
| 1 — Database & Persistence | Backend | **Done** ✅ |
| 2 — Real Authentication | Backend | **Done** ✅ |
| 3 — Admin Dashboard Real Data | Full-stack | **Done** ✅ |
| 4 — Machine Intake Polish | Frontend / PDF | In progress |
| 5 — Booking System | Full-stack | On hold ⏸ |
| 6 — Email System | Backend | Partially done |
| 7 — Spam Prevention & Security | Backend | Partially done |
| 8 — Multilingual Completeness | Frontend | Not started |
| 9 — Landing Page Final Polish | Frontend | Nearly done |
| 10 — Infrastructure & Deployment | DevOps | Not started |
