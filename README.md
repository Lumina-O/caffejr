# Caffe Jr.

A Next.js web application for a coffee machine service business. Combines a marketing landing page with a customer-facing service intake system and a protected admin dashboard.

---

## Features

- **Landing page** — multilingual (Danish/English), 3D coffee machine model (Three.js/R3F)
- **Booking form** — service booking with email notifications via Resend
- **Machine intake wizard** — 7-step form with photo uploads, signature pad, and PDF report generation
- **Admin dashboard** — protected by role-based auth (capacity calendar, reports, user management)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Neon (serverless Postgres) |
| ORM | Prisma 7 |
| Email | Resend |
| PDF | pdf-lib + sharp |
| 3D | React Three Fiber / Drei |
| Animations | Framer Motion |

---

## Getting Started

**Prerequisites:** Node.js 18+, npm, a [Neon](https://neon.tech) database (free tier)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in RESEND_API_KEY, email addresses, and DATABASE_URL

# Apply database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint

npx prisma migrate dev   # Apply pending migrations
npx prisma studio        # Open Prisma database browser
npx prisma generate      # Regenerate Prisma client
```

---

## Environment Variables

Create a `.env.local` file at the project root:

```bash
# Database — Neon (Postgres)
DATABASE_URL=             # Neon connection string (postgresql://...)

# Email — Resend
RESEND_API_KEY=           # Your Resend API key

# Booking emails
BOOKING_RECEIVER_EMAIL=   # Admin email for booking notifications
BOOKING_SENDER_EMAIL=     # From address for production emails
BOOKING_TEST_EMAIL=       # Email address used during development
BOOKING_SENDER_EMAIL_TEST=# From address used in development
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for full setup instructions including database provisioning.

---

## Project Structure

```
src/
├── app/                  # Pages and API routes (Next.js App Router)
│   ├── api/              # booking, machine-intake, auth
│   ├── admin/            # Protected dashboard pages
│   └── machine-intake/   # Intake wizard + confirmation
├── components/           # UI primitives and page sections
├── context/              # React context (language)
├── data/                 # Multilingual site copy (Danish/English)
├── generated/prisma/     # Auto-generated Prisma client (do not edit)
├── lib/                  # Utilities: auth, db, PDF, referenceId
└── types/                # Shared TypeScript types
prisma/
├── schema.prisma         # Database schema (Booking, MachineIntake, User)
└── migrations/           # Migration history
```

---

## Documentation

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — development workflow, branch naming, commit conventions, database setup
- [`MILESTONES.md`](./MILESTONES.md) — planned features and progress tracking
- [`CLAUDE.md`](./CLAUDE.md) — architecture notes for AI-assisted development

---

## License

Proprietary — developed for the Caffe Jr. Coffee Machine Service platform.
