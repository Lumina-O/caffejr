"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type SignaturePadHandle = {
  clear: () => void;
  isEmpty: () => boolean;
  getDataUrl: () => string;
};

type SignaturePadProps = {
  height?: number;
  onChange?: (dataUrl: string) => void;
  className?: string;
};

export default forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad({ height = 220, onChange, className = "" }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const isDrawingRef = useRef(false);
    const hasDrawnRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    const setupContext = useCallback((ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#111111";
      ctx.fillStyle = "#111111";
      ctx.lineWidth = 2;
    }, []);

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = wrapper.getBoundingClientRect();

      const previousImage =
        hasDrawnRef.current && canvas.width > 0 && canvas.height > 0
          ? canvas.toDataURL("image/png")
          : null;

      canvas.width = Math.max(rect.width * ratio, 1);
      canvas.height = Math.max(height * ratio, 1);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
      setupContext(ctx);

      if (previousImage) {
        const image = new Image();
        image.onload = () => {
          ctx.drawImage(image, 0, 0, rect.width, height);
        };
        image.src = previousImage;
      }
    }, [height, setupContext]);

    useEffect(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }, [resizeCanvas]);

    const getPoint = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      },
      [],
    );

    const emitChange = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawnRef.current) {
        onChange?.("");
        return;
      }

      onChange?.(canvas.toDataURL("image/png"));
    }, [onChange]);

    const drawDot = useCallback((x: number, y: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }, []);

    const startDrawing = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        isDrawingRef.current = true;
        hasDrawnRef.current = true;

        const point = getPoint(event);
        lastPointRef.current = point;

        drawDot(point.x, point.y);
        emitChange();

        canvas.setPointerCapture(event.pointerId);
      },
      [drawDot, emitChange, getPoint],
    );

    const draw = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawingRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const currentPoint = getPoint(event);
        const lastPoint = lastPointRef.current;

        if (!lastPoint) {
          lastPointRef.current = currentPoint;
          return;
        }

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();

        lastPointRef.current = currentPoint;
        emitChange();
      },
      [emitChange, getPoint],
    );

    const stopDrawing = useCallback(
      (event?: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;

        if (canvas && event) {
          try {
            canvas.releasePointerCapture(event.pointerId);
          } catch {
            // Ignore if pointer capture was not active
          }
        }

        if (canvas && hasDrawnRef.current) {
          emitChange();
        }

        isDrawingRef.current = false;
        lastPointRef.current = null;
      },
      [emitChange],
    );

    const clear = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setupContext(ctx);
      hasDrawnRef.current = false;
      lastPointRef.current = null;
      onChange?.("");
    }, [onChange, setupContext]);

    const isEmpty = useCallback(() => !hasDrawnRef.current, []);
    const getDataUrl = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawnRef.current) return "";
      return canvas.toDataURL("image/png");
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        clear,
        isEmpty,
        getDataUrl,
      }),
      [clear, isEmpty, getDataUrl],
    );

    return (
      <div
        ref={wrapperRef}
        className={`overflow-hidden rounded-[24px] border ${className}`}
        style={{
          borderColor: "var(--color-border-soft)",
          backgroundColor: "#ffffff",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
          className="block w-full touch-none"
        />
      </div>
    );
  },
);