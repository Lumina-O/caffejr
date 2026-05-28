"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        {submitted ? (
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-500">Check your inbox</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
              Email sent
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              If an account exists for <strong>{email}</strong>, you&apos;ll receive a password reset link shortly. It expires in 1 hour.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium text-neutral-900 underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-sm font-medium text-neutral-500">Account recovery</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
                Forgot password?
              </h1>
              <p className="mt-3 text-sm text-neutral-600">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-800"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
              </button>

              <p className="text-center text-sm text-neutral-500">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-neutral-900 underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
