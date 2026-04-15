"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react/button";

type Point = { x: number; y: number };

export type SkillImageCropperProps = {
  file: File;
  isSaving?: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void> | void;
};

const OUTPUT_SIZE = 1200;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function fileBaseName(name: string): string {
  const trimmed = name.trim();
  const dot = trimmed.lastIndexOf(".");
  const base = dot > 0 ? trimmed.slice(0, dot) : trimmed;
  return base || "cover-image";
}

async function normalizeImageForPreview(file: File): Promise<{ url: string; width: number; height: number }> {
  // Intenta respetar EXIF orientation para evitar fotos "giradas".
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    } as ImageBitmapOptions);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      throw new Error("No canvas context");
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.95),
    );
    if (!blob) {
      throw new Error("No se pudo crear blob normalizado");
    }
    return {
      url: URL.createObjectURL(blob),
      width: canvas.width,
      height: canvas.height,
    };
  } catch {
    // Fallback clásico.
    const rawUrl = URL.createObjectURL(file);
    const img = new window.Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("No se pudo leer imagen"));
      img.src = rawUrl;
    });
    return { url: rawUrl, width: img.width, height: img.height };
  }
}

export function SkillImageCropper({ file, isSaving, onCancel, onConfirm }: SkillImageCropperProps) {
  /** URL nueva por montaje (evita Strict Mode + useMemo: mismo string revocado). */
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  const [boxSize, setBoxSize] = useState(360);
  /** Posición absoluta (esquina sup. izq. de la imagen); null = usar centrado por defecto. */
  const [userPosition, setUserPosition] = useState<Point | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cropError, setCropError] = useState<string | null>(null);
  const dragStartRef = useRef<Point | null>(null);
  const positionAtDragStartRef = useRef<Point>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let normalizedUrl: string | null = null;
    void normalizeImageForPreview(file)
      .then(({ url, width, height }) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        normalizedUrl = url;
        setDisplayUrl(url);
        setNaturalSize({ width, height });
        setCropError(null);
        setUserPosition(null);
      })
      .catch(() => {
        if (cancelled) return;
        setNaturalSize(null);
        setDisplayUrl(null);
        setCropError(
          "Este formato no se puede previsualizar aquí. Usa JPG, PNG o WebP (o convierte la foto en la galería).",
        );
      });
    return () => {
      cancelled = true;
      if (normalizedUrl) {
        const toRevoke = normalizedUrl;
        queueMicrotask(() => URL.revokeObjectURL(toRevoke));
      }
    };
  }, [file]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const read = () => {
      const rect = el.getBoundingClientRect();
      const side = Math.round(rect.width);
      // Debe coincidir con el tamaño CSS real del viewport (sin clamp a MIN_BOX: si el layout
      // es más estrecho, forzar un boxSize mayor aplasta la imagen respecto al contenedor).
      queueMicrotask(() => {
        if (side > 0) setBoxSize(side);
      });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = useMemo(() => {
    if (!naturalSize) return 1;
    return Math.max(boxSize / naturalSize.width, boxSize / naturalSize.height);
  }, [naturalSize, boxSize]);

  const renderedSize = useMemo(() => {
    if (!naturalSize) return { width: 0, height: 0 };
    return {
      width: naturalSize.width * scale,
      height: naturalSize.height * scale,
    };
  }, [naturalSize, scale]);

  const bounds = useMemo(() => {
    const minX = boxSize - renderedSize.width;
    const minY = boxSize - renderedSize.height;
    return {
      minX: Number.isFinite(minX) ? minX : 0,
      maxX: 0,
      minY: Number.isFinite(minY) ? minY : 0,
      maxY: 0,
    };
  }, [boxSize, renderedSize.height, renderedSize.width]);

  const defaultPosition = useMemo((): Point => {
    if (!naturalSize) return { x: 0, y: 0 };
    const rw = renderedSize.width;
    const rh = renderedSize.height;
    return {
      x: (boxSize - rw) / 2,
      y: (boxSize - rh) / 2,
    };
  }, [naturalSize, boxSize, renderedSize.height, renderedSize.width]);

  const position = useMemo(() => {
    const base = userPosition ?? defaultPosition;
    return {
      x: clamp(base.x, bounds.minX, bounds.maxX),
      y: clamp(base.y, bounds.minY, bounds.maxY),
    };
  }, [userPosition, defaultPosition, bounds]);

  const beginDrag = useCallback(
    (clientX: number, clientY: number) => {
      dragStartRef.current = { x: clientX, y: clientY };
      positionAtDragStartRef.current = position;
      setDragging(true);
    },
    [position],
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragStartRef.current) return;
      const deltaX = clientX - dragStartRef.current.x;
      const deltaY = clientY - dragStartRef.current.y;
      const next = {
        x: clamp(positionAtDragStartRef.current.x + deltaX, bounds.minX, bounds.maxX),
        y: clamp(positionAtDragStartRef.current.y + deltaY, bounds.minY, bounds.maxY),
      };
      setUserPosition(next);
    },
    [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY],
  );

  const endDrag = useCallback(() => {
    dragStartRef.current = null;
    setDragging(false);
  }, []);

  const handleConfirm = async () => {
    if (!naturalSize || !imageRef.current) {
      setCropError("Selecciona una imagen válida.");
      return;
    }
    setCropError(null);
    const sourceX = clamp(-position.x / scale, 0, naturalSize.width);
    const sourceY = clamp(-position.y / scale, 0, naturalSize.height);
    const sourceSize = Math.min(
      boxSize / scale,
      naturalSize.width - sourceX,
      naturalSize.height - sourceY,
    );
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const context = canvas.getContext("2d");
    if (!context) {
      setCropError("No se pudo preparar el recorte.");
      return;
    }
    context.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    if (!blob) {
      setCropError("No se pudo generar la imagen recortada.");
      return;
    }
    const croppedFile = new File([blob], `${fileBaseName(file.name)}-cover.jpg`, {
      type: "image/jpeg",
    });
    await onConfirm(croppedFile);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="bg-surface-elevated/35 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">Ajusta el encuadre</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              Recorte cuadrado fijo
            </span>
          </div>
          <div
            ref={measureRef}
            className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl border-2 border-primary/35 bg-muted/20 shadow-inner"
            style={{ touchAction: "none" }}
            onMouseDown={(event) => beginDrag(event.clientX, event.clientY)}
            onMouseMove={(event) => moveDrag(event.clientX, event.clientY)}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              if (touch) beginDrag(touch.clientX, touch.clientY);
            }}
            onTouchMove={(event) => {
              const touch = event.touches[0];
              if (touch) moveDrag(touch.clientX, touch.clientY);
            }}
            onTouchEnd={endDrag}
          >
            {displayUrl && naturalSize ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob URL para canvas/recorte
              <img
                ref={imageRef}
                src={displayUrl}
                alt="Recorte de portada"
                draggable={false}
                className="select-none"
                style={{
                  position: "absolute",
                  left: position.x,
                  top: position.y,
                  width: renderedSize.width,
                  height: renderedSize.height,
                  maxWidth: "none",
                  maxHeight: "none",
                  cursor: dragging ? "grabbing" : "grab",
                  userSelect: "none",
                }}
              />
            ) : !cropError ? (
              <div className="flex min-h-[220px] w-full items-center justify-center bg-muted/30">
                <p className="px-3 text-center text-xs font-medium text-muted">Cargando imagen…</p>
              </div>
            ) : null}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-white/70" />
          </div>
        </div>
        <div className="border-t border-border p-4 sm:p-5 lg:border-l lg:border-t-0">
          <p className="text-sm leading-relaxed text-muted">
            Arrastra la foto para decidir qué parte se mostrará en tu portada.
          </p>
          <p className="mt-2 text-xs text-muted">
            Consejo: centra el elemento principal para que se vea bien en todas las tarjetas.
          </p>
          {cropError ? (
            <p className="mt-4 rounded-xl border border-accent-red/25 bg-accent-red/10 px-3 py-2 text-xs font-medium text-accent-red">
              {cropError}
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-2">
            <Button
              variant="primary"
              className="h-11 w-full rounded-full bg-primary font-semibold text-white hover:opacity-95"
              isDisabled={!naturalSize || isSaving}
              onPress={handleConfirm}
            >
              {isSaving ? "Subiendo..." : "Aplicar portada"}
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-border font-semibold text-foreground"
              isDisabled={isSaving}
              onPress={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
