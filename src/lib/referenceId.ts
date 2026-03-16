/**
 * Generates a short, human-readable reference ID.
 * Format: CJ-YYYYMMDD-XXXX  (e.g. CJ-20260316-A3F7)
 */
export function generateReferenceId(): string {
  const date = new Date();
  const datePart = date
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const randomPart = Math.random()
    .toString(36)
    .toUpperCase()
    .slice(2, 6);

  return `CJ-${datePart}-${randomPart}`;
}
