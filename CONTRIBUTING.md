# Contributing to Caffe Jr.

This guide covers everything you need to know to contribute to this project — from setting up your environment to writing commits and opening pull requests.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Conventions](#commit-conventions)
- [Pull Requests](#pull-requests)
- [Code Guidelines](#code-guidelines)
- [Environment Variables](#environment-variables)

---

## Getting Started

**Prerequisites:** Node.js 18+, npm

```bash
# Clone the repo
git clone <repo-url>
cd caffejr

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in the required values — see Environment Variables section below

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── page.tsx          # Landing page
│   ├── booking/          # Service booking form
│   ├── machine-intake/   # Machine intake wizard + confirmation
│   ├── availability/     # Business hours page
│   ├── login/            # Staff login
│   ├── admin/            # Protected admin dashboard
│   │   ├── capacity/     # Ticket capacity calendar
│   │   ├── reports/      # Reports overview
│   │   └── users/        # User management
│   └── api/              # API route handlers
│       ├── booking/
│       ├── machine-intake/
│       └── auth/
├── components/
│   ├── ui/               # Reusable UI primitives (Button, Card, Field, etc.)
│   └── sections/         # Landing page section components
├── context/              # React context (LanguageContext)
├── data/                 # Static content (multilingual site copy)
├── lib/                  # Utility functions (auth, PDF generation, availability)
└── types/                # TypeScript type definitions
```

Use the `@/*` path alias for all imports (maps to `./src/*`):

```ts
// Good
import { Button } from "@/components/ui/Button";

// Avoid
import { Button } from "../../components/ui/Button";
```

---

## Development Workflow

1. Pull the latest `main` before starting any work
2. Create a branch from `main` (see [Branch Naming](#branch-naming))
3. Make your changes in small, focused commits
4. Run lint before pushing: `npm run lint`
5. Run a production build to catch type errors: `npm run build`
6. Open a pull request against `main`

---

## Branch Naming

Use the following prefixes depending on the type of work:

| Prefix | When to use |
|--------|-------------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `refactor/` | Code restructuring with no behavior change |
| `chore/` | Dependency updates, config changes, tooling |
| `docs/` | Documentation only changes |

Branch names should be short, lowercase, and hyphen-separated. Reference a milestone or feature area where helpful.

```bash
# Examples
git checkout -b feature/database-schema
git checkout -b fix/pdf-image-compression
git checkout -b refactor/intake-form-split-steps
git checkout -b chore/update-resend-dependency
git checkout -b docs/api-route-comments
```

---

## Commit Conventions

Commits follow a `type/short-description` or `type: short description` format. Write in the **imperative present tense** — describe what the commit *does*, not what you *did*.

### Types

| Type | When to use |
|------|-------------|
| `feature/` | Adds new user-facing functionality |
| `fix/` | Fixes a bug |
| `refactor/` | Internal code change, no behavior change |
| `cleanup/` | Removes dead code, unused imports, console.logs |
| `chore/` | Config, dependencies, tooling |
| `docs/` | Documentation changes |

### Format

```
type/short-description-here
```

Or with a colon separator (both are accepted):

```
type: short description here
```

### Examples

```bash
git commit -m "feature/add-booking-database-persistence"
git commit -m "fix/pdf-signature-not-rendering-on-safari"
git commit -m "refactor/split-intake-form-into-step-components"
git commit -m "cleanup/remove-console-logs-from-api-routes"
git commit -m "chore/update-next-to-16-2"
git commit -m "docs/add-environment-variable-descriptions"
```

### Tips

- Keep the subject line under 72 characters
- One logical change per commit — avoid "fix everything" commits
- If a commit needs more context, add a body:

```bash
git commit -m "fix/intake-form-photo-upload-limit

Enforced 15MB per-file limit on the client side before XHR upload
starts. Previously the limit was only checked server-side, causing
poor UX when large files were silently rejected."
```

---

## Pull Requests

- Target branch is always `main`
- Title should match your branch name / commit style
- Fill in the PR description with:
  - **What** was changed and **why**
  - Any relevant milestone from `MILESTONES.md`
  - Screenshots for UI changes
  - Steps to test locally

### Before opening a PR

```bash
npm run lint     # Must pass with no errors
npm run build    # Must complete without TypeScript errors
```

There is currently no automated test suite. Manual testing of the affected area is expected.

### PR Size

Keep PRs focused. A PR that changes a single page, API route, or feature area is easier to review than one that changes everything at once. If a task is large, break it into sequential PRs.

---

## Code Guidelines

### TypeScript

- All new files must be TypeScript (`.ts` / `.tsx`)
- Avoid `any` — use proper types or `unknown` with a type guard
- Keep types and interfaces in `src/types/` if they are shared, or co-locate them if they are component-specific

### Components

- UI primitives go in `src/components/ui/`
- Page-level section components go in `src/components/sections/`
- Keep components focused — if a component is doing too many things, split it
- Use the existing global CSS classes from `globals.css` for layout: `.section-container`, `.surface-main`, `.surface-card`, `.section-title`

### API Routes

All API routes must follow the existing patterns:

1. **Honeypot + time trap** — include on all public-facing form endpoints
2. **IP-based rate limiting** — applied per route
3. **Input validation** — validate all fields before processing
4. **HTML escaping** — escape all user input before use in emails or documents
5. Return consistent JSON: `{ success: true }` or `{ error: "message" }`

### Styling

- Use **Tailwind CSS v4** utility classes
- Use CSS variable-based theme tokens (defined in `globals.css`) — do not hardcode colors
- Avoid inline `style` attributes unless absolutely necessary (e.g. dynamic values)
- Mobile-first responsive design

### Multilingual Content

- All user-facing copy must support both **Danish (da)** and **English (en)**
- Add translations to `src/data/siteData.ts` — do not hardcode strings in components
- Components receive a `language` prop and index into the translation objects

### No Console Logs

Do not leave `console.log` statements in committed code. Use them locally during development, then remove before committing.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
# Email — Resend
RESEND_API_KEY=           # Your Resend API key

# Booking emails
BOOKING_RECEIVER_EMAIL=   # Admin email that receives booking notifications
BOOKING_SENDER_EMAIL=     # From address for production emails
BOOKING_TEST_EMAIL=       # Email address used during development/testing
BOOKING_SENDER_EMAIL_TEST=# From address used in development
```

Never commit `.env.local` or any file containing real API keys. The `.gitignore` already excludes `.env*.local`.

---

## Questions

If you're unsure about anything, check `CLAUDE.md` for architecture notes and `MILESTONES.md` for planned work. For anything else, open a discussion or ask in the team channel.
