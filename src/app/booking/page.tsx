"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button/Button";

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  machineType: string;
  preferredDate: string;
  message: string;
  website: string;
  startedAt: number;
};

export default function BookingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    machineType: "",
    preferredDate: "",
    message: "",
    website: "",
    startedAt: Date.now(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitMessage("");

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send booking request.");
      }

      setSubmitMessage("Booking request sent successfully.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        machineType: "",
        preferredDate: "",
        message: "",
        website: "",
        startedAt: Date.now(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="w-full max-w-5xl">
        {/* Back button */}
        <div className="mb-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:scale-[1.03]"
            style={{
              color: "var(--color-accent)",
              backgroundColor: "rgba(58,34,24,0.82)",
              borderColor: "var(--color-border-card)",
              backdropFilter: "blur(8px)",
            }}
          >
            ← Back
          </button>
        </div>

        {/* Card */}
        <div
          className="rounded-[26px] border p-5"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderColor: "var(--color-border-soft)",
            boxShadow: "var(--shadow-main)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{ color: "var(--color-accent)" }}
            >
              Booking
            </p>

            <h1
              className="text-2xl font-black uppercase tracking-tight"
              style={{ color: "var(--color-accent)" }}
            >
              Book Service
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot */}
            <div className="hidden">
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* Compact grid */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Name">
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="formInput"
                />
              </FormField>

              <FormField label="Email">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="formInput"
                />
              </FormField>

              <FormField label="Phone">
                <input
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="formInput"
                />
              </FormField>

              <FormField label="Machine type">
                <select
                  name="machineType"
                  required
                  value={formData.machineType}
                  onChange={handleChange}
                  className="formInput"
                >
                  <option value="">Select</option>
                  <option value="espresso-machine">Espresso</option>
                  <option value="bean-to-cup">Bean to cup</option>
                  <option value="filter-machine">Filter</option>
                  <option value="commercial-machine">Commercial</option>
                  <option value="other">Other</option>
                </select>
              </FormField>

              <FormField label="Preferred date">
                <input
                  name="preferredDate"
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="formInput"
                />
              </FormField>

              <div />
            </div>

            {/* Message */}
            <FormField label="Describe issue">
              <textarea
                name="message"
                rows={3}
                required
                value={formData.message}
                onChange={handleChange}
                className="formInput"
                placeholder="Describe problem briefly"
              />
            </FormField>

            {/* Submit */}
            <div className="flex items-center justify-between pt-1">
              <Button
                text={isSubmitting ? "Sending..." : "Send request"}
                type="submit"
              />

              {submitMessage && (
                <p
                  className="text-xs"
                  style={{ color: "var(--color-accent)" }}
                >
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label
        className="text-xs font-semibold"
        style={{ color: "var(--color-accent)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}