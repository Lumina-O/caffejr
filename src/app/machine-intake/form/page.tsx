"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Field from "@/components/ui/Field/Field";
import TextInput from "@/components/ui/TextInput/TextInput";
import CheckboxCard from "@/components/ui/CheckboxCard/CheckboxCard";
import InfoBox from "@/components/ui/InfoBox/InfoBox";
import FormMessage from "@/components/ui/FormMessage/FormMessage";
import SignaturePad, {
  type SignaturePadHandle,
} from "@/components/ui/SignaturePad/SignaturePad";
import ImageUploadField from "@/components/ui/ImageUploadField/ImageUploadField";

type MachineIntakeFormData = {
  customerName: string;
  email: string;
  phone: string;

  brand: string;
  model: string;
  machineType: string;
  serialNumber: string;
  machineAge: string;

  issueSummary: string;
  issueStarted: string;
  powerStatus: string;
  leakingWater: boolean;
  errorCode: string;

  preferredDropoffDate: string;
  quoteBeforeRepair: boolean;
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
  serialNumber: "",
  machineAge: "",

  issueSummary: "",
  issueStarted: "",
  powerStatus: "",
  leakingWater: false,
  errorCode: "",

  preferredDropoffDate: "",
  quoteBeforeRepair: false,
  maxRepairAmount: "1000",
  addCleaningService: false,

  acceptedTerms: false,

  website: "",
};

const STEPS = [
  {
    id: 0,
    eyebrow: "Step 1",
    title: "Customer Details",
    description: "Let us know who we should contact about the repair.",
  },
  {
    id: 1,
    eyebrow: "Step 2",
    title: "Machine Details",
    description: "Tell us about the coffee machine you are bringing in.",
  },
  {
    id: 2,
    eyebrow: "Step 3",
    title: "Issue Details",
    description: "Describe what is happening so we can prepare in advance.",
  },
  {
    id: 3,
    eyebrow: "Step 4",
    title: "Photos",
    description:
      "Add photos from your phone, desktop, drag and drop, or camera to help us identify the issue faster.",
  },
  {
    id: 4,
    eyebrow: "Step 5",
    title: "Service Preferences",
    description: "Share how you would like the service to be handled.",
  },
  {
    id: 5,
    eyebrow: "Step 6",
    title: "Terms & Signature",
    description: "Review the conditions and sign directly on the screen.",
  },
  {
    id: 6,
    eyebrow: "Step 7",
    title: "Review & Submit",
    description: "Check everything once more before sending it to us.",
  },
] as const;

const TERMS_TEXT = `Prisoverslag for tjek og tilbud på indleveret udstyr koster 400 kr. uden undtagelse, også hvis service fravælges. Vi foretager fejlsøgning og udarbejder et estimat, før service påbegyndes, hvis prisen overstiger det maksimale beløb, I har valgt. Ved udfyldelse af denne formular samt indlevering af udstyr accepteres dette gebyr samt udskiftning af reservedele, som vi vurderer er nødvendige for reparationen.`;

function submitMachineIntakeWithProgress(
  body: FormData,
  onProgress?: (progress: number) => void,
): Promise<{ ok: boolean; status: number; data: { message?: string } }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/machine-intake");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress?.(progress);
    };

    xhr.onload = () => {
      let parsed: { message?: string } = {};

      try {
        parsed = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        parsed = { message: "Could not parse server response." };
      }

      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        data: parsed,
      });
    };

    xhr.onerror = () => {
      reject(new Error("Network error while submitting the intake form."));
    };

    xhr.send(body);
  });
}

export default function MachineIntakeFormPage() {
  const startedAtRef = useRef<number | null>(null);
  const signaturePadRef = useRef<SignaturePadHandle | null>(null);

  const [formData, setFormData] =
    useState<MachineIntakeFormData>(initialFormData);
  const [machinePhotos, setMachinePhotos] = useState<File[]>([]);
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const progressPercentage = useMemo(() => {
    return ((currentStep + 1) / STEPS.length) * 100;
  }, [currentStep]);

  function markStarted() {
    if (startedAtRef.current === null) {
      startedAtRef.current = performance.now();
    }
  }

  function getLatestSignature() {
    return signaturePadRef.current?.getDataUrl() || signatureDataUrl || "";
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  function validateStep(step: number) {
    if (step === 0) {
      if (!formData.customerName.trim()) return "Please enter your full name.";
      if (!formData.email.trim()) return "Please enter your email.";
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        return "Please enter a valid email.";
      }
      if (!formData.phone.trim()) return "Please enter your phone number.";
    }

    if (step === 1) {
      if (!formData.brand.trim()) return "Please enter the machine brand.";
      if (!formData.model.trim()) return "Please enter the machine model.";
      if (!formData.machineType.trim()) {
        return "Please select the machine type.";
      }
    }

    if (step === 2) {
      if (!formData.issueSummary.trim()) return "Please describe the problem.";
    }

    if (step === 4) {
      if (!formData.maxRepairAmount.trim()) {
        return "Please enter the maximum amount before we should contact you.";
      }

      const parsedAmount = Number(formData.maxRepairAmount);

      if (Number.isNaN(parsedAmount)) {
        return "Please enter a valid maximum amount.";
      }

      if (parsedAmount < 1000) {
        return "The minimum amount before contact must be at least 1000 kr.";
      }
    }

    if (step === 5) {
      if (!formData.acceptedTerms) {
        return "You need to accept the terms and conditions before continuing.";
      }

      const latestSignature = getLatestSignature();
      if (!latestSignature) {
        return "Please draw your signature before continuing.";
      }
    }

    return "";
  }

  function handleNextStep() {
    markStarted();

    if (currentStep === 5) {
      const latestSignature = getLatestSignature();
      setSignatureDataUrl(latestSignature);
    }

    const error = validateStep(currentStep);
    if (error) {
      setStepError(error);
      return;
    }

    setStepError("");
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePreviousStep() {
    setStepError("");
    if (message) setMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    markStarted();

    const latestSignature = getLatestSignature();
    setSignatureDataUrl(latestSignature);

    for (let i = 0; i < STEPS.length - 1; i += 1) {
      const error = validateStep(i);
      if (error) {
        setCurrentStep(i);
        setMessage(error);
        return;
      }
    }

    const timeSpent =
      startedAtRef.current === null
        ? 0
        : Math.round(performance.now() - startedAtRef.current);

    if (formData.website.trim() !== "") {
      setMessage("Submission blocked.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setStepError("");
    setUploadProgress(0);

    try {
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        body.append(key, String(value));
      });

      body.append("timeSpent", String(timeSpent));
      body.append("signatureDataUrl", latestSignature);

      machinePhotos.forEach((file) => {
        body.append("machinePhotos", file);
      });

      const result = await submitMachineIntakeWithProgress(body, (progress) => {
        setUploadProgress(progress);
      });

      if (!result.ok) {
        setMessage(
          result.data.message || "Something went wrong. Please try again.",
        );
        setUploadProgress(null);
        return;
      }

      setUploadProgress(100);
      setMessage(
        result.data.message || "Machine intake submitted successfully.",
      );
      setFormData(initialFormData);
      setMachinePhotos([]);
      setSignatureDataUrl("");
      setCurrentStep(0);
      startedAtRef.current = null;
      signaturePadRef.current?.clear();

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setUploadProgress(null);
      }, 600);
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Something went wrong. Please try again.");
      setUploadProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLastStep = currentStep === STEPS.length - 1;

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

              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
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
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
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
                  style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: "var(--color-accent)",
                  }}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
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
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full name" required>
                      <TextInput
                        name="customerName"
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field label="Email" required>
                      <TextInput
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field
                      label="Phone number"
                      required
                      className="md:col-span-2"
                    >
                      <TextInput
                        name="phone"
                        placeholder="+45 12 34 56 78"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Brand" required>
                      <TextInput
                        name="brand"
                        placeholder="De'Longhi"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field label="Model" required>
                      <TextInput
                        name="model"
                        placeholder="Magnifica S"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field label="Machine type" required>
                      <div className="relative">
                        <select
                          name="machineType"
                          value={formData.machineType}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-2xl border px-4 py-3 pr-12 text-sm leading-6 outline-none transition focus:ring-2"
                          style={{
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                            borderColor: "var(--color-border-soft)",
                            backgroundColor: "var(--color-bg-card)",
                            color: "var(--color-text-main)",
                          }}
                          required
                        >
                          <option value="">Select machine type</option>
                          <option value="espresso">Espresso machine</option>
                          <option value="bean-to-cup">Bean to cup</option>
                          <option value="capsule">Capsule</option>
                          <option value="filter">Filter coffee</option>
                          <option value="commercial">Commercial machine</option>
                        </select>

                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          ▼
                        </span>
                      </div>
                    </Field>

                    <Field label="Approximate age">
                      <TextInput
                        name="machineAge"
                        placeholder="2 years"
                        value={formData.machineAge}
                        onChange={handleChange}
                      />
                    </Field>

                    <Field label="Serial number" className="md:col-span-2">
                      <TextInput
                        name="serialNumber"
                        placeholder="Optional"
                        value={formData.serialNumber}
                        onChange={handleChange}
                      />
                    </Field>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Describe the problem"
                      required
                      className="md:col-span-2"
                    >
                      <textarea
                        name="issueSummary"
                        placeholder="Example: The machine turns on, makes noise, but stops before brewing and leaks water underneath."
                        value={formData.issueSummary}
                        onChange={handleChange}
                        className="min-h-[140px] w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
                        style={{
                          borderColor: "var(--color-border-soft)",
                          backgroundColor: "var(--color-bg-card)",
                          color: "var(--color-text-main)",
                        }}
                        required
                      />
                    </Field>

                    <Field label="When did the issue start?">
                      <TextInput
                        name="issueStarted"
                        placeholder="Example: 1 week ago"
                        value={formData.issueStarted}
                        onChange={handleChange}
                      />
                    </Field>

                    <Field label="Does the machine turn on?">
                      <div className="relative">
                        <select
                          name="powerStatus"
                          value={formData.powerStatus}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-2xl border px-4 py-3 pr-12 text-sm leading-6 outline-none transition focus:ring-2"
                          style={{
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                            borderColor: "var(--color-border-soft)",
                            backgroundColor: "var(--color-bg-card)",
                            color: "var(--color-text-main)",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>

                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          ▼
                        </span>
                      </div>
                    </Field>

                    <Field label="Error code">
                      <TextInput
                        name="errorCode"
                        placeholder="Optional"
                        value={formData.errorCode}
                        onChange={handleChange}
                      />
                    </Field>

                    <div className="flex items-end">
                      <CheckboxCard
                        name="leakingWater"
                        checked={formData.leakingWater}
                        onChange={handleChange}
                        label="Machine is leaking water"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5">
                    <ImageUploadField
                      label="Upload photos of the machine"
                      files={machinePhotos}
                      onFilesChange={(files) => {
                        markStarted();
                        setMachinePhotos(files);
                        if (stepError) setStepError("");
                        if (message) setMessage("");
                      }}
                      multiple
                      maxFiles={5}
                      maxFileSizeMb={15}
                      maxWidth={1600}
                      maxHeight={1600}
                      compressionQuality={0.82}
                      uploadProgress={isSubmitting ? uploadProgress : null}
                      hint="Upload from your device, drag and drop images, or use your camera. Images are optimized automatically before submission."
                    />

                    <InfoBox>
                      Photos help us identify visible damage, leaking, missing
                      parts, display errors, and overall machine condition
                      before drop-off.
                    </InfoBox>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Preferred drop-off date">
                      <TextInput
                        type="date"
                        name="preferredDropoffDate"
                        value={formData.preferredDropoffDate}
                        onChange={handleChange}
                      />
                    </Field>

                    <Field label="Max amount before we contact you" required>
                      <TextInput
                        type="number"
                        min="1000"
                        step="1"
                        name="maxRepairAmount"
                        placeholder="Minimum 1000"
                        value={formData.maxRepairAmount}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <div className="md:col-span-2">
                      <InfoBox>
                        We will contact you before continuing if the repair
                        exceeds your chosen amount. Minimum threshold is 1000
                        kr.
                      </InfoBox>
                    </div>

                    <div className="flex items-end">
                      <CheckboxCard
                        name="quoteBeforeRepair"
                        checked={formData.quoteBeforeRepair}
                        onChange={handleChange}
                        label="Request quote before repair"
                      />
                    </div>

                    <div className="flex items-end">
                      <CheckboxCard
                        name="addCleaningService"
                        checked={formData.addCleaningService}
                        onChange={handleChange}
                        label="Add coffee machine cleaning service (+450 kr)"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-5">
                    <div
                      className="rounded-2xl border p-4 md:p-5"
                      style={{
                        borderColor: "var(--color-border-soft)",
                        backgroundColor: "var(--color-bg-card)",
                      }}
                    >
                      <h3
                        className="text-base font-semibold"
                        style={{ color: "var(--color-text-main)" }}
                      >
                        Terms and Conditions
                      </h3>

                      <p
                        className="mt-3 text-sm leading-7"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {TERMS_TEXT}
                      </p>
                    </div>

                    <CheckboxCard
                      name="acceptedTerms"
                      checked={formData.acceptedTerms}
                      onChange={handleChange}
                      label="I have read and accept the terms and conditions above."
                    />

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          className="block text-sm font-medium"
                          style={{ color: "var(--color-text-main)" }}
                        >
                          Draw your signature{" "}
                          <span style={{ color: "var(--color-accent)" }}>
                            *
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={handleClearSignature}
                          className="rounded-full border px-4 py-2 text-xs font-semibold transition"
                          style={{
                            borderColor: "var(--color-border-soft)",
                            backgroundColor: "var(--color-bg-surface)",
                            color: "var(--color-text-main)",
                          }}
                        >
                          Clear signature
                        </button>
                      </div>

                      <SignaturePad
                        ref={signaturePadRef}
                        onChange={(nextDataUrl) => {
                          setSignatureDataUrl(nextDataUrl);
                          if (stepError) setStepError("");
                          if (message) setMessage("");
                        }}
                      />

                      <p
                        className="mt-2 text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Use your finger on phone/tablet or your mouse on
                        desktop.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <ReviewGroup title="Customer Details">
                      <ReviewItem
                        label="Full name"
                        value={formData.customerName}
                      />
                      <ReviewItem label="Email" value={formData.email} />
                      <ReviewItem label="Phone" value={formData.phone} />
                    </ReviewGroup>

                    <ReviewGroup title="Machine Details">
                      <ReviewItem label="Brand" value={formData.brand} />
                      <ReviewItem label="Model" value={formData.model} />
                      <ReviewItem
                        label="Machine type"
                        value={formatMachineType(formData.machineType)}
                      />
                      <ReviewItem
                        label="Approximate age"
                        value={formData.machineAge}
                      />
                      <ReviewItem
                        label="Serial number"
                        value={formData.serialNumber}
                      />
                    </ReviewGroup>

                    <ReviewGroup title="Issue Details">
                      <ReviewItem
                        label="Issue summary"
                        value={formData.issueSummary}
                      />
                      <ReviewItem
                        label="Issue started"
                        value={formData.issueStarted}
                      />
                      <ReviewItem
                        label="Power status"
                        value={formatPowerStatus(formData.powerStatus)}
                      />
                      <ReviewItem
                        label="Error code"
                        value={formData.errorCode}
                      />
                      <ReviewItem
                        label="Leaking water"
                        value={formData.leakingWater ? "Yes" : "No"}
                      />
                    </ReviewGroup>

                    <ReviewGroup title="Photos">
                      <ReviewItem
                        label="Uploaded photos"
                        value={
                          machinePhotos.length > 0
                            ? `${machinePhotos.length} file(s) selected`
                            : "No photos uploaded"
                        }
                      />

                      {machinePhotos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                          {machinePhotos.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="rounded-2xl border p-3"
                              style={{
                                borderColor: "var(--color-border-soft)",
                                backgroundColor: "var(--color-bg-surface)",
                              }}
                            >
                              <p
                                className="truncate text-xs font-medium"
                                style={{ color: "var(--color-text-main)" }}
                              >
                                {file.name}
                              </p>
                              <p
                                className="mt-1 text-xs"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </ReviewGroup>

                    <ReviewGroup title="Service Preferences">
                      <ReviewItem
                        label="Preferred drop-off date"
                        value={formData.preferredDropoffDate}
                      />
                      <ReviewItem
                        label="Max amount before contact"
                        value={`${formData.maxRepairAmount || "1000"} kr`}
                      />
                      <ReviewItem
                        label="Contact if above limit"
                        value="Yes - always"
                      />
                      <ReviewItem
                        label="Quote before repair"
                        value={formData.quoteBeforeRepair ? "Yes" : "No"}
                      />
                      <ReviewItem
                        label="Cleaning service (+450 kr)"
                        value={formData.addCleaningService ? "Yes" : "No"}
                      />
                    </ReviewGroup>

                    <ReviewGroup title="Terms & Signature">
                      <ReviewItem
                        label="Accepted terms"
                        value={formData.acceptedTerms ? "Yes" : "No"}
                      />
                      <ReviewItem
                        label="Drawn signature"
                        value={signatureDataUrl ? "Added" : "Missing"}
                      />
                    </ReviewGroup>
                  </div>
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

              <FormMessage message={stepError} />
              <FormMessage message={message} />

              {isSubmitting && uploadProgress !== null ? (
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--color-border-soft)",
                    backgroundColor: "var(--color-bg-surface)",
                  }}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      Uploading your machine intake
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      {uploadProgress}%
                    </p>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--color-bg-card)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${uploadProgress}%`,
                        backgroundColor: "var(--color-accent)",
                      }}
                    />
                  </div>
                </div>
              ) : null}

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
                    disabled={isSubmitting}
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

      {/* TODO: Split each step into its own component, add reusable SelectInput and TextArea components, show small photo thumbnails in the review step, and add abort/cancel upload support for the XHR request. */}
    </main>
  );
}

function ReviewGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border p-4 md:p-5"
      style={{
        borderColor: "var(--color-border-soft)",
        backgroundColor: "var(--color-bg-card)",
      }}
    >
      <h3
        className="text-base font-semibold"
        style={{ color: "var(--color-text-main)" }}
      >
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-4">
      <p
        className="text-sm font-medium"
        style={{ color: "var(--color-text-main)" }}
      >
        {label}
      </p>
      <p
        className="break-words text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        {value?.trim() ? value : "Not provided"}
      </p>
    </div>
  );
}

function formatMachineType(value: string) {
  switch (value) {
    case "espresso":
      return "Espresso machine";
    case "bean-to-cup":
      return "Bean to cup";
    case "capsule":
      return "Capsule";
    case "filter":
      return "Filter coffee";
    case "commercial":
      return "Commercial machine";
    default:
      return value;
  }
}

function formatPowerStatus(value: string) {
  switch (value) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    default:
      return value;
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}