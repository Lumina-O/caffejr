# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run db:seed  # Seed the database (tsx prisma/seed.ts)
```

```bash
npx prisma migrate dev --name <name>   # Run a new migration (uses DATABASE_URL_DIRECT)
npx prisma generate                    # Regenerate Prisma client after schema changes
npx prisma studio                      # Open Prisma Studio UI
```

No test suite is configured.

## Architecture

Caffe Jr. is a Next.js 16 App Router application for a coffee machine service business. It combines a marketing landing page with a customer-facing service intake system and a protected admin dashboard.

### App Structure

**Public**
- `/` — Landing page with multilingual (Danish/English) marketing content and a 3D coffee machine model (Three.js/R3F)
- `/booking` — Service booking form
- `/machine-intake/form` — Machine intake form with photo uploads, signature pad, and PDF report generation
- `/availability` — Business availability status
- `/login` — Staff login (real auth, bcrypt + iron-session)
- `/change-password` — Forced password change on first login
- `/unauthorized` — Shown when auth fails

**Admin** (requires `admin` role minimum unless noted)
- `/admin` — Dashboard with 4 stat cards: total intakes, active intakes, unique customers, active staff
- `/admin/capacity` — Calendar showing active machine intakes spanning days; month/week views; click a day to open a modal popup with intake details and status dropdowns
- `/admin/reports` — Machine intake submissions table, stats, CSV export
- `/admin/reports/[id]` — Intake detail: all fields, price, engineer notes, change log, PDF viewer, delete
- `/admin/log` — Unified activity log (user management actions + intake CRUD) — `admin`+
- `/admin/users` — User management with invite flow, role/status editing, audit log — `super_admin` only

### Key Libraries

- **Tailwind CSS v4** — uses CSS variables for theming; global utility classes like `.section-container`, `.surface-main`, `.surface-card`, `.section-title` are defined in `globals.css`
- **Prisma 7** — ORM; client output at `src/generated/prisma`; singleton at `src/lib/db.ts`
- **Neon (serverless Postgres)** — database host; uses `@prisma/adapter-neon` and `@neondatabase/serverless`
- **iron-session** — encrypted cookie-based sessions (`caffejr_session`); session type at `src/lib/session.ts`
- **bcrypt** — password hashing at 12 rounds
- **Vercel Blob** (`@vercel/blob`) — private store for PDFs and intake photos; token: `CAFFEJR_BLOB_READ_WRITE_TOKEN`
- **Resend** — transactional email for booking confirmations, intake receipts, and user invites
- **pdf-lib + sharp** — PDF report generation from machine intake submissions
- **lucide-react** — icon library used in admin UI
- **clsx + tailwind-merge** — `cn()` utility at `src/lib/utils.ts`
- **class-variance-authority** — variant-based component styling (Badge, Button)
- **@radix-ui/react-slot** — `Slot` primitive used by Button's `asChild`
- **Framer Motion** — page/component animations on public site
- **React Three Fiber / Drei** — 3D coffee machine hero model

### Authentication

Auth is cookie-based using `iron-session` (encrypted, not JWT). Session data is stored in the `caffejr_session` cookie.

- `src/lib/auth.ts` — `getCurrentUser()`, `requireAuth()`, `requireRole()`, `requireAnyRole()`
- `src/lib/session.ts` — `SessionData` type with `userId`, `email`, `name`, `role`, `mustChangePassword`
- `src/middleware.ts` — protects `/admin` routes by checking session cookies

**Role hierarchy** (lowest → highest): `user → staff → admin → super_admin` — defined in `src/lib/permissions.ts`.

**Invite flow**: super_admin invites users by email. System generates a 12-char random temp password, creates the user with `mustChangePassword: true`, sends the password via Resend. On first login, user is redirected to `/change-password` and cannot access admin until they set a new password.

### Database Schema (Prisma)

Key models:
- **Booking** — service booking form submissions; statuses: `pending | confirmed | cancelled | completed`
- **MachineIntake** — machine intake form submissions; statuses: `received | in_progress | completed | rejected`; stores `photoUrls[]`, `pdfUrl`, `price?`, `engineerNotes?`
- **User** — admin users; `mustChangePassword` forces password change on first login
- **AuditLog** — user management actions (create, role_change, status_change) by super_admins
- **IntakeChangeLog** — per-field change history for MachineIntake; actions: `created | updated | deleted`

### File Storage (Vercel Blob)

All intake files are stored in a **private** Vercel Blob store:
- PDFs: `intakes/{referenceId}-machine-intake-{name}.pdf`
- Photos: `intakes/photos/{referenceId}-{index}.{ext}`
- Access requires `Authorization: Bearer {CAFFEJR_BLOB_READ_WRITE_TOKEN}`
- Private blob serving: `GET /api/admin/intakes/[id]/pdf` streams the blob server-side
- PDF regeneration: `POST /api/admin/intakes/[id]/regenerate-pdf` re-downloads photos from blob, regenerates PDF with pdf-lib, re-uploads

### Admin UI Components

Shared components in `src/components/ui/`:
- `badge.tsx` — `Badge` with variants: `default`, `secondary`, `success`, `warning`, `destructive`, `blue`, `outline`
- `button.tsx` — `Button` with variants: `default`, `outline`, `ghost`, `destructive`, `link`; supports `asChild`
- `card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`

### API Routes

**Public**
- `POST /api/booking` — booking form; honeypot + time-trap + rate limiting
- `POST /api/machine-intake` — intake form; uploads photos/PDF to Vercel Blob; logs `created` to IntakeChangeLog
- `GET /api/availability` — business availability status

**Auth**
- `POST /api/auth/login` — bcrypt password check; sets iron-session; redirects to `/change-password` if `mustChangePassword`
- `POST /api/auth/logout` — clears session cookie
- `POST /api/auth/change-password` — updates password hash, clears `mustChangePassword` flag

**Admin — Intakes**
- `GET /api/admin/intakes/export` — CSV export of all MachineIntake records
- `PATCH /api/admin/intakes/[id]` — update status, price, engineerNotes; logs to IntakeChangeLog
- `DELETE /api/admin/intakes/[id]` — deletes blobs + DB record; logs `deleted` to IntakeChangeLog first
- `GET /api/admin/intakes/[id]/pdf` — streams private blob PDF (`?inline=true` for browser viewing)
- `POST /api/admin/intakes/[id]/regenerate-pdf` — regenerates PDF from stored blob photos

**Admin — Tickets/Capacity**
- `GET /api/admin/tickets` — returns `intakes` with `startDate`/`endDate` for calendar spanning (bookings removed)
- Note: booking routes (`PATCH /api/admin/tickets/[id]`) are unused; bookings feature is currently disabled

**Admin — Users**
- `GET /api/admin/users` — list all users (super_admin only)
- `POST /api/admin/users` — invite user: generates temp password, sends via Resend, sets `mustChangePassword: true`
- `PATCH /api/admin/users/[id]` — update role/isActive; writes to AuditLog (super_admin only)

**Admin — Dashboard**
- `GET /api/admin/stats` — real stat counts from DB

### Environment Variables

```
# Email
RESEND_API_KEY
BOOKING_RECEIVER_EMAIL
BOOKING_SENDER_EMAIL
BOOKING_TEST_EMAIL
BOOKING_SENDER_EMAIL_TEST

# Database
DATABASE_URL                  # Neon pooled connection (runtime)
DATABASE_URL_DIRECT           # Neon direct connection (migrations only — remove -pooler from hostname)

# Storage
CAFFEJR_BLOB_READ_WRITE_TOKEN # Vercel Blob private store token

# Auth
SESSION_SECRET                # iron-session encryption secret (min 32 chars)

# Google Reviews (Testimonials section)
GOOGLE_PLACES_API_KEY         # Places API (New) key with billing enabled
GOOGLE_PLACE_ID               # Place ID for the Caffe Jr. business listing
```

If `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` are unset (or the API call fails), the Testimonials section falls back to the static placeholder cards in `siteData.ts`.

### Path Alias

`@/*` maps to `./src/*` — use this for all imports.

### Known Gotchas

- **Prisma migrations on Neon**: always use `DATABASE_URL_DIRECT` (direct connection, no `-pooler`). The pooled URL causes advisory lock timeouts. Configured in `prisma.config.ts`.
- **Prisma client after migration**: always run `npx prisma generate` after `migrate dev`, then restart the dev server (clear `.next/dev` if Turbopack caches the old client).
- **Vercel Blob**: the store is **private** — never use `access: "public"`. Serving files requires a server-side proxy route with the Bearer token.
- **PDF iframe CSP**: PDFs render in an iframe using client-side blob URLs (`fetch` → `URL.createObjectURL`). CSP needs both `frame-src blob:` and `connect-src blob:` (Three.js ImageBitmapLoader also needs `connect-src blob:`).
- **Three.js textures (Turbopack)**: GLTFLoader creates blob URLs for embedded textures; it uses `ImageBitmapLoader` (fetch-based) in modern browsers — requires `connect-src blob:` in CSP or textures fail silently.

---

## Changelog

### 2026-06-13 — Real testimonials + map link (full-launch content)

- **Google reviews**: Testimonials section now fetches real reviews from the Google Places API (New) via `GET /api/reviews?lang=da|en` (`src/lib/googleReviews.ts`); up to 5 reviews, hour-cached, localized text. Falls back to static `siteData.ts` cards when `GOOGLE_PLACES_API_KEY`/`GOOGLE_PLACE_ID` are unset or the call fails. `Testimonials.tsx` is now a client component that swaps placeholders for real reviews after fetch.
- **Contact map**: added "Åbn i Google Maps" link (overlay on the embed + in the failure fallback) opening the real address in a new tab. Added `https://www.google.com` to CSP `frame-src` so the Maps embed iframe isn't blocked ("This content is blocked").

### 2026-03-18 — Booking removal, capacity modal, sidebar icons, dashboard fixes

- **Booking feature disabled**: customer does not use booking currently; removed booking stats from dashboard, removed bookings from capacity calendar and `/admin/log` filter tabs
- **Capacity modal**: replaced always-visible right sidebar panel with a click-triggered modal popup; day card click opens a full-screen overlay with intake list, status dropdowns, and links; Escape key and click-outside-to-close supported
- **Admin sidebar**: replaced all emoji icons with lucide-react icons (`LayoutDashboard`, `CalendarDays`, `FileText`, `Activity`, `Users`); active nav state uses `usePathname` — active = `bg-neutral-900 text-white`
- **Dashboard stats fixed**: "Unique customers" now counts distinct emails from `MachineIntake` (not User table); removed booking-related stats; 4 cards total
- **`/admin/log` simplified**: removed bookings filter tab; shows only user management (AuditLog) and intake changes (IntakeChangeLog)

### 2026-03-18 — Activity Log, shadcn UI base, Intake changelog

- **`/admin/log`** — Unified activity timeline: user management (AuditLog), intake CRUD (IntakeChangeLog), new bookings; filterable by type; uses lucide icons and Badge component
- **IntakeChangeLog extended**: added `action` (`created | updated | deleted`), `referenceId`, `actorEmail` fields
- **CREATED logging**: `POST /api/machine-intake` now writes a `created` log entry after intake is saved
- **DELETED logging**: `DELETE /api/admin/intakes/[id]` writes a `deleted` log entry before removing the record
- **shadcn UI base**: installed `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`; created `Badge`, `Button`, `Card` components in `src/components/ui/`
- **CSP fix**: added `connect-src blob:` to allow Three.js `ImageBitmapLoader` to fetch texture blob URLs (fixes `THREE.GLTFLoader: Couldn't load texture` errors)

### 2026-03-17 — 7-feature batch + admin foundations

- **Real authentication**: replaced mock auth with iron-session + bcrypt + Prisma/Neon; login sets encrypted session cookie
- **Invite flow**: super_admin invites users by email; system generates temp password; user forced to change on first login via `/change-password`
- **`/admin/users`**: full CRUD, role/status editing, audit log (super_admin only); removed public "Create account" link from login page
- **`/admin/reports`**: real stat cards, intake submissions table with pagination, CSV export, clickable detail links
- **`/admin/reports/[id]`**: full intake detail, PDF viewer (client blob URL), regenerate PDF button, price field, engineer notes, delete with confirmation, change log timeline
- **`/admin/capacity`**: calendar with month/week views showing both bookings and machine intakes; intakes span from `createdAt` to today while active; type/status/machine-type filters; per-item status dropdowns
- **`/admin/log`**: initial version
- **Vercel Blob**: migrated PDF and photo storage to private Vercel Blob; server-side streaming proxy for private file access
- **IntakeChangeLog**: new model tracking per-field changes to intakes (status, price, engineerNotes)
- **Schema additions**: `MachineIntake` got `price`, `engineerNotes`, `pdfUrl`, `photoUrls`, `signatureDataUrl`; `User` got `mustChangePassword`; added `AuditLog`, `IntakeChangeLog` models

### Earlier — Milestones 1 & 2

- **Milestone 1**: Prisma schema, Neon database, all form submissions persisted (Booking, MachineIntake)
- **Milestone 2**: Real authentication with bcrypt + iron-session; role-based access control; admin middleware; session management
