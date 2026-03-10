"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";

type ImageUploadFieldProps = {
  label?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  multiple?: boolean;
  required?: boolean;
  hint?: string;
  maxFiles?: number;
  maxFileSizeMb?: number;
  maxWidth?: number;
  maxHeight?: number;
  compressionQuality?: number;
  uploadProgress?: number | null;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const JPEG_MIME_TYPES = ["image/jpeg", "image/jpg"];

export default function ImageUploadField({
  label = "Upload images",
  files,
  onFilesChange,
  multiple = true,
  required = false,
  hint = "Upload images from your device, drag and drop them, or use your camera.",
  maxFiles = 5,
  maxFileSizeMb = 15,
  maxWidth = 1600,
  maxHeight = 1600,
  compressionQuality = 0.82,
  uploadProgress = null,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number | null>(null);

  const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;
  const maxSelectableFiles = multiple ? maxFiles : 1;

  const previewUrls = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const fileCountText = useMemo(() => {
    if (files.length === 0) return "No images selected";
    if (files.length === 1) return "1 image selected";
    return `${files.length} images selected`;
  }, [files]);

  function resetInputValue() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function openPicker() {
    setErrorMessage("");
    inputRef.current?.click();
  }

  function clearFiles() {
    setErrorMessage("");
    onFilesChange([]);
    resetInputValue();
  }

  function removeFileAtIndex(indexToRemove: number) {
    setErrorMessage("");
    const nextFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(nextFiles);
  }

  function mergeFiles(existingFiles: File[], incomingFiles: File[]) {
    if (!multiple) {
      return incomingFiles.length > 0 ? [incomingFiles[0]] : [];
    }

    const availableSlots = Math.max(0, maxFiles - existingFiles.length);
    return [...existingFiles, ...incomingFiles.slice(0, availableSlots)];
  }

  function isSupportedImageType(file: File) {
    return ALLOWED_IMAGE_TYPES.includes(file.type);
  }

  function updateProcessingProgress(done: number, total: number) {
    if (total <= 0) {
      setProcessingProgress(null);
      return;
    }

    const nextProgress = Math.round((done / total) * 100);
    setProcessingProgress(nextProgress);
  }

  function readFileAsArrayBuffer(file: File) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as ArrayBuffer."));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsArrayBuffer(file);
    });
  }

  function loadImageFromBlob(blob: Blob) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(blob);

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image."));
      };

      image.src = objectUrl;
    });
  }

  function getExifOrientationFromJpegBuffer(arrayBuffer: ArrayBuffer) {
    const view = new DataView(arrayBuffer);

    if (view.byteLength < 2 || view.getUint16(0, false) !== 0xffd8) {
      return 1;
    }

    let offset = 2;

    while (offset < view.byteLength) {
      if (view.getUint8(offset) !== 0xff) {
        break;
      }

      const marker = view.getUint8(offset + 1);
      offset += 2;

      if (marker === 0xe1) {
        const app1Length = view.getUint16(offset, false);
        offset += 2;

        if (view.getUint32(offset, false) !== 0x45786966) {
          break;
        }

        const tiffOffset = offset + 6;
        const littleEndian = view.getUint16(tiffOffset, false) === 0x4949;
        const getUint16 = (o: number) => view.getUint16(o, littleEndian);
        const getUint32 = (o: number) => view.getUint32(o, littleEndian);

        const firstIfdOffset = getUint32(tiffOffset + 4);
        let dirOffset = tiffOffset + firstIfdOffset;
        const entries = getUint16(dirOffset);
        dirOffset += 2;

        for (let i = 0; i < entries; i += 1) {
          const entryOffset = dirOffset + i * 12;
          const tag = getUint16(entryOffset);

          if (tag === 0x0112) {
            return getUint16(entryOffset + 8);
          }
        }

        break;
      } else if (marker === 0xda || marker === 0xd9) {
        break;
      } else {
        const size = view.getUint16(offset, false);
        offset += size;
      }
    }

    return 1;
  }

  function calculateTargetSize(width: number, height: number) {
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio),
    };
  }

  function drawImageWithOrientation(
    image: HTMLImageElement,
    orientation: number,
    canvas: HTMLCanvasElement,
    targetWidth: number,
    targetHeight: number
  ) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context is not available.");
    }

    const swapSides = [5, 6, 7, 8].includes(orientation);

    canvas.width = swapSides ? targetHeight : targetWidth;
    canvas.height = swapSides ? targetWidth : targetHeight;

    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, canvas.width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, canvas.width, canvas.height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, canvas.height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, canvas.height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, canvas.height, canvas.width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, canvas.width);
        break;
      default:
        break;
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  }

  function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  async function processImageFile(file: File, index: number, total: number) {
    const errors: string[] = [];

    if (!isSupportedImageType(file)) {
      errors.push(`${file.name}: unsupported image type. Use JPG, PNG, or WebP.`);
      updateProcessingProgress(index + 1, total);
      return { file: null, errors };
    }

    if (file.size > maxFileSizeBytes) {
      errors.push(`${file.name}: exceeds ${maxFileSizeMb} MB before processing.`);
      updateProcessingProgress(index + 1, total);
      return { file: null, errors };
    }

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const originalBlob = new Blob([arrayBuffer], { type: file.type });
      const image = await loadImageFromBlob(originalBlob);

      const orientation = JPEG_MIME_TYPES.includes(file.type)
        ? getExifOrientationFromJpegBuffer(arrayBuffer)
        : 1;

      const { width: targetWidth, height: targetHeight } = calculateTargetSize(
        image.naturalWidth,
        image.naturalHeight
      );

      const canvas = document.createElement("canvas");
      drawImageWithOrientation(image, orientation, canvas, targetWidth, targetHeight);

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const outputBlob = await canvasToBlob(
        canvas,
        outputType,
        outputType === "image/png" ? undefined : compressionQuality
      );

      if (!outputBlob) {
        errors.push(`${file.name}: failed during image processing.`);
        updateProcessingProgress(index + 1, total);
        return { file: null, errors };
      }

      if (outputBlob.size > maxFileSizeBytes) {
        errors.push(
          `${file.name}: processed file still exceeds ${maxFileSizeMb} MB.`
        );
        updateProcessingProgress(index + 1, total);
        return { file: null, errors };
      }

      const extension = outputType === "image/png" ? "png" : "jpg";
      const safeBaseName = file.name.replace(/\.[^.]+$/, "") || `image-${Date.now()}`;
      const processedFile = new File(
        [outputBlob],
        `${safeBaseName}-optimized.${extension}`,
        {
          type: outputType,
          lastModified: Date.now(),
        }
      );

      updateProcessingProgress(index + 1, total);
      return { file: processedFile, errors };
    } catch (error) {
      console.error("Image processing failed:", error);
      errors.push(`${file.name}: failed to process image.`);
      updateProcessingProgress(index + 1, total);
      return { file: null, errors };
    }
  }

  async function processIncomingFiles(selectedFiles: File[]) {
    setErrorMessage("");

    if (selectedFiles.length === 0) {
      return;
    }

    const availableSlots = multiple ? Math.max(0, maxFiles - files.length) : 1;
    const trimmedFiles = selectedFiles.slice(0, availableSlots);
    const errors: string[] = [];

    if (multiple && selectedFiles.length > trimmedFiles.length) {
      errors.push(`You can upload up to ${maxFiles} images.`);
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    const processedResults: File[] = [];

    for (let index = 0; index < trimmedFiles.length; index += 1) {
      const result = await processImageFile(trimmedFiles[index], index, trimmedFiles.length);

      if (result.file) {
        processedResults.push(result.file);
      }

      if (result.errors.length > 0) {
        errors.push(...result.errors);
      }
    }

    const nextFiles = mergeFiles(files, processedResults);
    onFilesChange(nextFiles);

    setErrorMessage(errors.join(" "));
    setIsProcessing(false);
    setProcessingProgress(null);
    resetInputValue();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files || []);
    void processIncomingFiles(nextFiles);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget === event.target) {
      setIsDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files || []);
    void processIncomingFiles(droppedFiles);
  }

  async function openCamera() {
    setErrorMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Your browser does not support camera access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch (error) {
      console.error("Failed to open camera:", error);
      setErrorMessage(
        "Could not access the camera. Please allow camera permission in your browser."
      );
    }
  }

  async function takePhoto() {
    setErrorMessage("");

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      setErrorMessage("Could not capture the image.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/jpeg", compressionQuality);

    if (!blob) {
      setErrorMessage("Could not create the image file.");
      return;
    }

    const photoFile = new File([blob], `camera-photo-${Date.now()}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    stopCamera();
    await processIncomingFiles([photoFile]);
  }

  const displayedProgress = isProcessing ? processingProgress : uploadProgress;
  const showProgress = displayedProgress !== null && displayedProgress >= 0;

  return (
    <div className="space-y-4">
      <div>
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--color-text-main)" }}
        >
          {label}
          {required ? (
            <span style={{ color: "var(--color-accent)" }}> *</span>
          ) : null}
        </label>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="rounded-[24px] border p-4 transition"
          style={{
            borderColor: isDragging
              ? "var(--color-accent)"
              : "var(--color-border-soft)",
            backgroundColor: "var(--color-bg-card)",
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={openPicker}
              disabled={isProcessing || files.length >= maxSelectableFiles}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg-main)",
              }}
            >
              Upload image
            </button>

            <button
              type="button"
              onClick={openCamera}
              disabled={isProcessing || files.length >= maxSelectableFiles}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-text-main)",
                color: "var(--color-bg-main)",
              }}
            >
              Use camera
            </button>

            <button
              type="button"
              onClick={clearFiles}
              disabled={isProcessing || files.length === 0}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: "var(--color-border-soft)",
                backgroundColor: "var(--color-bg-surface)",
                color: "var(--color-text-main)",
              }}
            >
              Clear images
            </button>
          </div>

          <div
            className="mt-4 rounded-2xl border border-dashed px-4 py-6 text-center"
            style={{
              borderColor: isDragging
                ? "var(--color-accent)"
                : "var(--color-border-soft)",
              backgroundColor: "var(--color-bg-surface)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-main)" }}
            >
              Drag and drop images here
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Or use the buttons above to upload or take a photo
            </p>
          </div>

          <p
            className="mt-3 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {hint}
          </p>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Max {maxSelectableFiles} image{maxSelectableFiles > 1 ? "s" : ""} - up to{" "}
            {maxFileSizeMb} MB each - JPG, PNG, WebP
          </p>

          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Large images are automatically optimized and iPhone JPEG rotation is corrected.
          </p>

          <p
            className="mt-2 text-sm font-medium"
            style={{ color: "var(--color-text-main)" }}
          >
            {fileCountText}
          </p>

          {showProgress ? (
            <div className="mt-4">
              <div
                className="mb-2 flex items-center justify-between text-sm"
                style={{ color: "var(--color-text-main)" }}
              >
                <span>{isProcessing ? "Preparing images" : "Uploading"}</span>
                <span>{displayedProgress}%</span>
              </div>

              <div
                className="h-3 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--color-bg-surface)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${displayedProgress}%`,
                    backgroundColor: "var(--color-accent)",
                  }}
                />
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <p className="mt-3 text-sm" style={{ color: "#b91c1c" }}>
              {errorMessage}
            </p>
          ) : null}

          {cameraOpen ? (
            <div className="mt-4 space-y-3">
              <div
                className="overflow-hidden rounded-2xl border"
                style={{
                  borderColor: "var(--color-border-soft)",
                  backgroundColor: "var(--color-bg-surface)",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-auto max-h-[420px] w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void takePhoto()}
                  disabled={isProcessing}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  Take photo
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  disabled={isProcessing}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: "var(--color-border-soft)",
                    backgroundColor: "var(--color-bg-card)",
                    color: "var(--color-text-main)",
                  }}
                >
                  Cancel camera
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {previewUrls.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {previewUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="overflow-hidden rounded-2xl border"
              style={{
                borderColor: "var(--color-border-soft)",
                backgroundColor: "var(--color-bg-card)",
              }}
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-36 w-full object-cover"
              />

              <div className="space-y-2 px-3 py-2">
                <p
                  className="truncate text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {files[index]?.name || `Image ${index + 1}`}
                </p>

                <button
                  type="button"
                  onClick={() => removeFileAtIndex(index)}
                  disabled={isProcessing}
                  className="inline-flex min-h-[36px] items-center justify-center rounded-full border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: "var(--color-border-soft)",
                    backgroundColor: "var(--color-bg-surface)",
                    color: "var(--color-text-main)",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* TODO: Add duplicate-image detection, optional image reordering, and real backend upload progress wiring from the parent submit flow. */}
    </div>
  );
}