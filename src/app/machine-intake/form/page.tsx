"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FormMessage from "@/components/ui/FormMessage/FormMessage";
import type { SignaturePadHandle } from "@/components/ui/SignaturePad/SignaturePad";

import StepCustomerDetails from "./steps/StepCustomerDetails";
import StepMachineDetails from "./steps/StepMachineDetails";
import StepIssueDetails from "./steps/StepIssueDetails";
import StepPhotos from "./steps/StepPhotos";
import StepServicePreferences from "./steps/StepServicePreferences";
import StepTermsSignature from "./steps/StepTermsSignature";
import StepReview from "./steps/StepReview";

type MachineIntakeFormData = {
  customerName: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  machineType: string;
  issueCategories: string[];
  issueSummary: string;
  maxRepairAmount: string;
  addCleaningService: boolean;
  acceptedTerms: boolean;
  website: string;
};

const initialFormData: MachineIntakeFormData = {
  customerName: "",
  email: "",
  phone: "",
  brand: "",
  model: "",
  machineType: "",
  issueCategories: [],
  issueSummary: "",
  maxRepairAmount: "1500",
  addCleaningService: false,
  acceptedTerms: false,
  website: "",
};

const STEPS = [
  { id: 0, eyebrow: "Step 1", title: "Customer Details", description: "Let us know who we should contact about the repair." },
  { id: 1, eyebrow: "Step 2", title: "Machine Details", description: "Tell us about the coffee machine you are bringing in." },
  { id: 2, eyebrow: "Step 3", title: "Issue Details", description: "Choose the issue category and add extra details if needed." },
  { id: 3, eyebrow: "Step 4", title: "Photos", description: "Add photos from your phone, desktop, drag and drop, or camera to help us identify the issue faster." },
  { id: 4, eyebrow: "Step 5", title: "Service Preferences", description: "Share how you would like the service to be handled." },
  { id: 5, eyebrow: "Step 6", title: "Terms & Signature", description: "Review the conditions and sign directly on the screen." },
  { id: 6, eyebrow: "Step 7", title: "Review & Submit", description: "Check everything once more before sending it to us." },
] as const;

type SubmitResult = {
  ok: boolean;
  status: number;
  data: { message?: string; referenceId?: string };
};

function submitMachineIntakeWithProgress(
  body: FormData,
  onProgress?: (progress: number) => void,
): { promise: Promise<SubmitResult>; abort: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<SubmitResult>((resolve, reject) => {
    xhr.open("POST", "/api/machine-intake");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      let parsed: { message?: string; referenceId?: string } = {};
      try {
        parsed = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        parsed = { message: "Could not parse server response." };
      }
      resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data: parsed });
    };

    xhr.onerror = () => reject(new Error("Network error while submitting the intake form."));
    xhr.onabort = () => reject(new DOMException("Upload cancelled.", "AbortError"));

    xhr.send(body);
  });

  return { promise, abort: () => xhr.abort() };
}

export default function MachineIntakeFormPage() {
  const router = useRouter();
  const startedAtRef = useRef<number | null>(null);
  const signaturePadRef = useRef<SignaturePadHandle | null>(null);
  const abortRef = useRef<(() => void) | null>(null);

  const [formData, setFormData] = useState<MachineIntakeFormData>(initialFormData);
  const [machinePhotos, setMachinePhotos] = useState<File[]>([]);
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string[]>([]);

  const isLastStep = currentStep === STEPS.length - 1;
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (!isLastStep) {
      setCanSubmit(false);
      return;
    }
    const timer = setTimeout(() => setCanSubmit(true), 500);
    return () => clearTimeout(timer);
  }, [isLastStep]);

  const progressPercentage = useMemo(
    () => ((currentStep + 1) / STEPS.length) * 100,
    [currentStep],
  );

  function markStarted() {
    if (startedAtRef.current === null) {
      startedAtRef.current = performance.now();
    }
  }

  function getLatestSignature() {
    return signaturePadRef.current?.getDataUrl() || signatureDataUrl || "";
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    markStarted();
    const target = e.target;
    const { name, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : value,
    }));
    if (stepError) setStepError("");
    if (message) setMessage("");
  }

  function handleClearSignature() {
    signaturePadRef.current?.clear();
    setSignatureDataUrl("");
    if (stepError) setStepError("");
  }

  function handleCategoryToggle(category: string, selected: boolean) {
    markStarted();
    setFormData((prev) => ({
      ...prev,
      issueCategories: selected
        ? [...prev.issueCategories, category]
        : prev.issueCategories.filter((c) => c !== category),
    }));
    if (stepError) setStepError("");
  }

  function handlePhotosChange(files: File[]) {
    markStarted();
    setMachinePhotos(files);
    if (stepError) setStepError("");
    if (message) setMessage("");
  }

  function handleDuplicatesSkipped(names: string[]) {
    setDuplicateWarning(names);
  }

  function validateStep(step: number) {
    if (step === 0) {
      if (!formData.customerName.trim()) return "Please enter your full name.";
      if (!formData.email.trim()) return "Please enter your email.";
      if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email.";
      if (!formData.phone.trim()) return "Please enter your phone number.";
    }
    if (step === 1) {
      if (!formData.brand.trim()) return "Please enter the machine brand.";
      if (!formData.model.trim()) return "Please enter the machine model.";
      if (!formData.machineType.trim()) return "Please select the machine type.";
    }
    if (step === 2) {
      if (formData.issueCategories.length === 0) return "Please select at least one issue category.";
      if (formData.issueCategories.includes("Andet") && !formData.issueSummary.trim()) {
        return "Please describe the problem when selecting 'Andet'.";
      }
    }
    if (step === 4) {
      if (!formData.maxRepairAmount.trim()) return "Please select the maximum amount before we should contact you.";
      const parsedAmount = Number(formData.maxRepairAmount);
      if (Number.isNaN(parsedAmount)) return "Please select a valid maximum amount.";
      if (parsedAmount < 1500) return "The minimum amount before contact must be at least 1500 kr.";
    }
    if (step === 5) {
      if (!formData.acceptedTerms) return "You need to accept the terms and conditions before continuing.";
      if (!getLatestSignature()) return "Please draw your signature before continuing.";
    }
    return "";
  }

  function handleNextStep() {
    markStarted();
    if (currentStep === 5) {
      setSignatureDataUrl(getLatestSignature());
    }
    const error = validateStep(currentStep);
    if (error) { setStepError(error); return; }
    setStepError("");
    setMessage("");
    setDuplicateWarning([]);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePreviousStep() {
    setStepError("");
    if (message) setMessage("");
    setDuplicateWarning([]);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key !== "Enter") return;
    const tagName = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
    if (tagName === "textarea") return;
    e.preventDefault();
  }

  function handleCancelUpload() {
    abortRef.current?.();
    abortRef.current = null;
    setIsSubmitting(false);
    setUploadProgress(null);
    setMessage("Upload cancelled.");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    markStarted();
    if (!isLastStep) return;

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (!submitter || submitter.name !== "finalSubmit") return;

    const latestSignature = getLatestSignature();
    setSignatureDataUrl(latestSignature);

    for (let i = 0; i < STEPS.length - 1; i += 1) {
      const error = validateStep(i);
      if (error) { setCurrentStep(i); setMessage(error); return; }
    }

    const timeSpent =
      startedAtRef.current === null ? 0 : Math.round(performance.now() - startedAtRef.current);

    if (formData.website.trim() !== "") { setMessage("Submission blocked."); return; }

    setIsSubmitting(true);
    setMessage("");
    setStepError("");
    setUploadProgress(0);

    try {
      const body = new FormData();
      const categoriesText = formData.issueCategories.join(", ");
      const combinedIssueSummary = formData.issueSummary.trim()
        ? `Kategori: ${categoriesText}\n\nEkstra detaljer:\n${formData.issueSummary}`
        : `Kategori: ${categoriesText}`;

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "issueCategories") return;
        if (key === "issueSummary") { body.append("issueSummary", combinedIssueSummary); return; }
        body.append(key, String(value));
      });

      body.append("timeSpent", String(timeSpent));
      body.append("signatureDataUrl", latestSignature);
      machinePhotos.forEach((file) => body.append("machinePhotos", file));

      const { promise, abort } = submitMachineIntakeWithProgress(body, (progress) => {
        setUploadProgress(progress);
      });
      abortRef.current = abort;

      const result = await promise;
      abortRef.current = null;

      if (!result.ok) {
        setMessage(result.data.message || "Something went wrong. Please try again.");
        setUploadProgress(null);
        return;
      }

      setUploadProgress(100);
      setFormData(initialFormData);
      setMachinePhotos([]);
      setSignatureDataUrl("");
      setCurrentStep(0);
      startedAtRef.current = null;
      signaturePadRef.current?.clear();

      router.push(`/machine-intake/complete${result.data.referenceId ? `?ref=${result.data.referenceId}` : ""}`);
    } catch (error) {
      abortRef.current = null;
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Submit error:", error);
      setMessage("Something went wrong. Please try again.");
      setUploadProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="overflow-hidden rounded-[32px] border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderColor: "var(--color-border-soft)",
            boxShadow: "var(--shadow-main)",
          }}
        >
          <div
            className="border-b px-5 py-5 md:px-8 md:py-6"
            style={{ borderColor: "var(--color-border-soft)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/machine-intake"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-80"
                style={{
                  borderColor: "var(--color-border-soft)",
                  backgroundColor: "var(--color-bg-surface)",
                  color: "var(--color-text-main)",
                }}
              >
                ← Back
              </Link>

              <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                {currentStep + 1} / {STEPS.length}
              </p>
            </div>
          </div>

          <div className="px-5 py-8 md:px-8 md:py-10">
            <div className="max-w-3xl">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.28em]"
                style={{ color: "var(--color-accent)" }}
              >
                Service Intake Form
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.24em]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {STEPS[currentStep].eyebrow}
                  </p>
                  <h2
                    className="mt-2 text-2xl font-semibold"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    {STEPS[currentStep].title}
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {STEPS[currentStep].description}
                  </p>
                </div>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--color-bg-surface)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%`, backgroundColor: "var(--color-accent)" }}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              onKeyDown={handleFormKeyDown}
              onFocusCapture={markStarted}
              onPointerDownCapture={markStarted}
              className="mt-8 space-y-5"
            >
              <section
                className="rounded-[24px] border p-5 md:p-6"
                style={{
                  backgroundColor: "var(--color-bg-surface)",
                  borderColor: "var(--color-border-soft)",
                }}
              >
                {currentStep === 0 && (
                  <StepCustomerDetails
                    customerName={formData.customerName}
                    email={formData.email}
                    phone={formData.phone}
                    onChange={handleChange}
                  />
                )}

                {currentStep === 1 && (
                  <StepMachineDetails
                    brand={formData.brand}
                    model={formData.model}
                    machineType={formData.machineType}
                    onChange={handleChange}
                  />
                )}

                {currentStep === 2 && (
                  <StepIssueDetails
                    issueCategories={formData.issueCategories}
                    issueSummary={formData.issueSummary}
                    onCategoryToggle={handleCategoryToggle}
                    onChange={handleChange}
                  />
                )}

                {currentStep === 3 && (
                  <StepPhotos
                    files={machinePhotos}
                    onFilesChange={handlePhotosChange}
                    onDuplicatesSkipped={handleDuplicatesSkipped}
                    isSubmitting={isSubmitting}
                    uploadProgress={uploadProgress}
                  />
                )}

                {currentStep === 4 && (
                  <StepServicePreferences
                    maxRepairAmount={formData.maxRepairAmount}
                    addCleaningService={formData.addCleaningService}
                    onChange={handleChange}
                  />
                )}

                {currentStep === 5 && (
                  <StepTermsSignature
                    acceptedTerms={formData.acceptedTerms}
                    signaturePadRef={signaturePadRef}
                    onChange={handleChange}
                    onSignatureChange={(url) => {
                      setSignatureDataUrl(url);
                      if (stepError) setStepError("");
                      if (message) setMessage("");
                    }}
                    onClearSignature={handleClearSignature}
                  />
                )}

                {currentStep === 6 && (
                  <StepReview
                    customerName={formData.customerName}
                    email={formData.email}
                    phone={formData.phone}
                    brand={formData.brand}
                    model={formData.model}
                    machineType={formData.machineType}
                    issueCategories={formData.issueCategories}
                    issueSummary={formData.issueSummary}
                    maxRepairAmount={formData.maxRepairAmount}
                    addCleaningService={formData.addCleaningService}
                    acceptedTerms={formData.acceptedTerms}
                    signatureDataUrl={signatureDataUrl}
                    machinePhotos={machinePhotos}
                  />
                )}
              </section>

              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {duplicateWarning.length > 0 && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor: "var(--color-border-soft)",
                    backgroundColor: "var(--color-bg-surface)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span className="font-medium" style={{ color: "var(--color-text-main)" }}>
                    Skipped duplicate {duplicateWarning.length === 1 ? "photo" : "photos"}:
                  </span>{" "}
                  {duplicateWarning.join(", ")}
                </div>
              )}

              <FormMessage message={stepError} />
              <FormMessage message={message} />

              {isSubmitting && uploadProgress !== null && (
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--color-border-soft)",
                    backgroundColor: "var(--color-bg-surface)",
                  }}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-main)" }}>
                      Uploading your machine intake
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text-main)" }}>
                        {uploadProgress}%
                      </p>
                      <button
                        type="button"
                        onClick={handleCancelUpload}
                        className="rounded-full border px-3 py-1 text-xs font-semibold transition hover:opacity-80"
                        style={{
                          borderColor: "var(--color-border-soft)",
                          backgroundColor: "var(--color-bg-card)",
                          color: "var(--color-text-main)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--color-bg-card)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%`, backgroundColor: "var(--color-accent)" }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0 || isSubmitting}
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: "var(--color-border-soft)",
                    backgroundColor: "var(--color-bg-surface)",
                    color: "var(--color-text-main)",
                  }}
                >
                  Back
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="inline-flex min-h-[56px] items-center justify-center rounded-full px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-bg-main)",
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    name="finalSubmit"
                    value="true"
                    disabled={isSubmitting || !canSubmit}
                    className="inline-flex min-h-[56px] items-center justify-center rounded-full px-6 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-bg-main)",
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Machine Details"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
