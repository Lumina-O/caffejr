// register() runs once at server startup before any requests are handled.
// Next.js skips it during `npm run build`, so CI without secrets won't break.
export async function register() {
  // Guard to nodejs only — instrumentation also runs in the Edge runtime (middleware),
  // but session routes never run there so no need to validate in that context.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const secret = process.env.SESSION_SECRET;
    // iron-session requires a minimum of 32 characters; existence alone isn't enough.
    if (!secret || secret.length < 32) {
      throw new Error(
        `SESSION_SECRET must be set and at least 32 characters long (got ${secret ? secret.length : 0}).`
      );
    }
  }
}
