/**
 * Canonical public origin for the marketing site, used by sitemap/robots/metadata.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment (e.g. https://www.caffejr.dk) for
 * production. Falls back to the Vercel-provided URL, then localhost in dev.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
