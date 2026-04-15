"use client";

import { useCallback, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react/button";
import { Checkbox } from "@heroui/react/checkbox";
import type { SkillFormDraft } from "@/lib/api/my-services.api";
import {
  createSkillService,
  publishSkill,
  updateSkillService,
} from "@/lib/api/my-services.api";
import {
  presignUpload,
  putFileToPresignedUrl,
} from "@/lib/api/user-profile.api";
import { datetimeLocalToIso, promoEndFromNowMs } from "./skill-wizard-promo";
import type { ServicePublic } from "@/types/service.types";
import { SkillBasicStep } from "./SkillBasicStep";
import { SkillDetailsStep } from "./SkillDetailsStep";
import { SkillPreviewStep } from "./SkillPreviewStep";
import { SkillWizardProgress } from "./SkillWizardProgress";
import { SKILL_WIZARD_STEPS } from "./skill-wizard.constants";
import {
  EMPTY_SKILL_FORM_DATA,
  fromServiceToWizardData,
  type SkillWizardErrors,
  type SkillWizardFormData,
  wizardStatusFromDraftToggle,
} from "./skill-wizard.types";
import {
  canPublish,
  validateField,
  validatePromoFields,
  validateStep,
} from "./skill-wizard.validation";

type SkillWizardPageShellProps = {
  mode: "create" | "edit";
  skillId?: string;
  initialService?: ServicePublic | null;
};

function statusBadgeClass(status: string): string {
  if (status === "ACTIVA") return "bg-success/15 text-success";
  if (status === "EN_REVISION") return "bg-primary/15 text-primary";
  if (status === "REQUIERE_CAMBIOS") return "bg-accent-red/15 text-accent-red";
  if (status === "PAUSADA") return "bg-accent/15 text-accent";
  return "bg-muted/20 text-muted";
}

function statusLabel(status: ServicePublic["status"]): string {
  if (status === "ACTIVA") return "Activa";
  if (status === "PAUSADA") return "Pausada";
  if (status === "EN_REVISION") return "En revisión";
  if (status === "REQUIERE_CAMBIOS") return "Requiere cambios";
  return "Borrador";
}

function extractApiErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return "No se pudo guardar la habilidad. Intenta nuevamente.";
  }
  const payload = error.response?.data as
    | { message?: string | string[]; error?: string }
    | undefined;
  if (Array.isArray(payload?.message) && payload.message.length > 0) {
    return payload.message.join(" ");
  }
  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }
  if (typeof payload?.error === "string" && payload.error.trim()) {
    return payload.error;
  }
  return `No se pudo guardar la habilidad (${error.response?.status ?? "sin respuesta"}).`;
}

export function SkillWizardPageShell({ mode, skillId, initialService }: SkillWizardPageShellProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [coverImageFileToCrop, setCoverImageFileToCrop] = useState<File | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [data, setData] = useState<SkillWizardFormData>(
    initialService ? fromServiceToWizardData(initialService) : EMPTY_SKILL_FORM_DATA,
  );
  const [errors, setErrors] = useState<SkillWizardErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SkillWizardFormData, boolean>>>({});

  const heading = mode === "edit" ? "Editar habilidad" : "Nueva habilidad";
  const currentStatus = initialService?.status;

  const previewService = useMemo<ServicePublic>(() => {
    const priceNum = data.price ? Number(data.price) : null;
    const listNum =
      data.promoEnabled && data.listPrice.trim() ? Number(data.listPrice) : null;
    let previousPrice: number | null = null;
    let flashDealEndsAt: string | null = null;
    if (
      data.promoEnabled &&
      listNum != null &&
      priceNum != null &&
      Number.isFinite(listNum) &&
      Number.isFinite(priceNum) &&
      listNum > priceNum
    ) {
      previousPrice = listNum;
    }
    if (data.promoEnabled && previousPrice != null && data.promoEndsAtLocal.trim()) {
      try {
        const iso = datetimeLocalToIso(data.promoEndsAtLocal.trim());
        const t = new Date(iso).getTime();
        if (Number.isFinite(t) && t > Date.now() + 60_000) {
          flashDealEndsAt = iso;
        }
      } catch {
        /* ignore */
      }
    }
    const nextStatus = wizardStatusFromDraftToggle(data.publishAsDraft);
    return {
      id: initialService?.id ?? "preview",
      title: data.title || "Tu habilidad aquí",
      description: data.description || "Describe qué recibirá el comprador.",
      price: priceNum,
      currency: "PEN",
      coverImageUrl: data.coverImageUrl ?? initialService?.coverImageUrl ?? null,
      status: nextStatus,
      isActive: nextStatus === "ACTIVA",
      viewCount: initialService?.viewCount ?? 0,
      tags: data.tags,
      category: data.category || "other",
      deliveryMode: data.deliveryMode || "digital",
      deliveryTime: data.deliveryTime || "A coordinar",
      revisionsIncluded: data.revisionsIncluded || "0",
      profileId: initialService?.profileId ?? "",
      userId: initialService?.userId ?? "",
      createdAt: initialService?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: initialService?.profile,
      previousPrice,
      badge: initialService?.badge,
      weeklyHires: initialService?.weeklyHires,
      etaHours: initialService?.etaHours,
      distanceKm: initialService?.distanceKm,
      flashDealEndsAt,
      remainingSlots: initialService?.remainingSlots,
      soldRatio: initialService?.soldRatio,
      testimonial: initialService?.testimonial,
    };
  }, [data, initialService]);

  const onPromoToggle = useCallback((enabled: boolean) => {
    setData((prev) => ({
      ...prev,
      promoEnabled: enabled,
      ...(enabled ? {} : { listPrice: "", promoEndsAtLocal: "" }),
    }));
    setErrors((prev) => ({
      ...prev,
      listPrice: undefined,
      promoEndsAtLocal: undefined,
    }));
  }, []);

  const onPromoPreset = useCallback((msFromNow: number) => {
    const { local } = promoEndFromNowMs(msFromNow);
    setData((prev) => ({
      ...prev,
      promoEnabled: true,
      promoEndsAtLocal: local,
    }));
  }, []);

  const onFieldChange = <K extends keyof SkillWizardFormData>(
    field: K,
    value: SkillWizardFormData[K],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, { ...data, [field]: value }) }));
    }
  };

  const handleCoverImagePick = async (file: File) => {
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;

    setCoverImageError(null);
    if (!ALLOWED.includes(file.type)) {
      setCoverImageError(
        "Para la portada usa JPG, PNG o WebP (las fotos HEIC de iPhone a veces no se abren en el navegador).",
      );
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setCoverImageError("La imagen pesa más de 5 MB.");
      return;
    }
    setCoverImageFileToCrop(file);
  };

  const handleCroppedCoverImageUpload = async (file: File) => {
    setCoverImageUploading(true);
    try {
      const safeName =
        file.name.replace(/[^\w.\-]/g, "_").slice(0, 120) || "cover-image.jpg";
      const { uploadUrl, publicUrl, key } = await presignUpload(
        "service_cover",
        safeName,
        file.type,
      );
      await putFileToPresignedUrl(uploadUrl, file, file.type);
      setData((prev) => ({
        ...prev,
        coverImageUrl: publicUrl,
        coverImageKey: key,
        coverImageName: null,
      }));
      if (touched.coverImageUrl) {
        setErrors((prev) => ({ ...prev, coverImageUrl: undefined }));
      }
      setCoverImageFileToCrop(null);
    } catch (error) {
      setCoverImageError(
        error instanceof Error ? error.message : "No se pudo subir la imagen.",
      );
    } finally {
      setCoverImageUploading(false);
    }
  };

  const onFieldBlur = (field: keyof SkillWizardFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, data) }));
  };

  const goBack = () => {
    if (step === 0) return;
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const goNext = () => {
    if (step === 1 && coverImageFileToCrop) {
      setCoverImageError("Primero aplica o cancela el recorte de portada para continuar.");
      return;
    }
    const stepErrors = validateStep(step, data);
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    if (Object.values(stepErrors).some(Boolean)) return;
    setDirection("forward");
    setStep((prev) => Math.min(prev + 1, SKILL_WIZARD_STEPS.length - 1));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!canPublish(data)) {
      const promoE = validatePromoFields(data);
      const merged = {
        ...errors,
        title: validateField("title", data),
        category: validateField("category", data),
        description: validateField("description", data),
        deliveryMode: validateField("deliveryMode", data),
        price: validateField("price", data),
        deliveryTime: validateField("deliveryTime", data),
        listPrice: promoE.listPrice,
        promoEndsAtLocal: promoE.promoEndsAtLocal,
      };
      setErrors(merged);
      return;
    }
    setSaving(true);
    const promoPayload =
      data.promoEnabled && data.listPrice.trim() && data.promoEndsAtLocal.trim()
        ? {
            listPrice: Number(data.listPrice.trim()),
            promoEndsAt: datetimeLocalToIso(data.promoEndsAtLocal.trim()),
          }
        : { listPrice: null as null, promoEndsAt: null as null };
    const payload: SkillFormDraft = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      tags: data.tags,
      deliveryMode: data.deliveryMode,
      price: Number(data.price),
      ...promoPayload,
      deliveryTime: data.deliveryTime,
      revisionsIncluded: data.revisionsIncluded,
      coverImageUrl: data.coverImageUrl,
      status: "BORRADOR",
    };
    try {
      const shouldSendToReview = !data.publishAsDraft;
      if (mode === "edit" && skillId) {
        await updateSkillService(skillId, {
          ...payload,
          status: wizardStatusFromDraftToggle(data.publishAsDraft),
        });
      } else {
        const created = await createSkillService(payload);
        if (shouldSendToReview) {
          await publishSkill(created.id);
        }
      }
      router.push(
        shouldSendToReview
          ? "/cuenta/publicaciones?toast=review-submitted"
          : "/cuenta/publicaciones?toast=draft-saved",
      );
    } catch (error) {
      setSubmitError(extractApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{heading}</h1>
        {mode === "edit" && currentStatus ? (
          <p
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(currentStatus)}`}
          >
            Estado actual: {statusLabel(currentStatus)}
          </p>
        ) : null}
      </header>

      <SkillWizardProgress currentStep={step} />

      <div
        className={`rounded-3xl border-2 border-border bg-white p-4 shadow-md transition-all sm:p-6 md:p-8 ${
          direction === "forward" ? "animate-in slide-in-from-right-3" : "animate-in slide-in-from-left-3"
        }`}
      >
        {step === 0 ? (
          <SkillBasicStep
            data={data}
            errors={errors}
            onFieldChange={onFieldChange}
            onFieldBlur={onFieldBlur}
          />
        ) : null}
        {step === 1 ? (
          <SkillDetailsStep
            data={data}
            errors={errors}
            onFieldChange={onFieldChange}
            onFieldBlur={onFieldBlur}
            onPickCoverImage={handleCoverImagePick}
            onRemoveCoverImage={() => {
              setCoverImageError(null);
              setCoverImageFileToCrop(null);
              setData((prev) => ({
                ...prev,
                coverImageUrl: null,
                coverImageKey: null,
                coverImageName: null,
              }));
            }}
            coverImageError={coverImageError}
            coverImageUploading={coverImageUploading}
            pendingCropFile={coverImageFileToCrop}
            onCancelCrop={() => {
              setCoverImageError(null);
              setCoverImageFileToCrop(null);
            }}
            onConfirmCroppedCover={handleCroppedCoverImageUpload}
            onPromoToggle={onPromoToggle}
            onPromoPreset={onPromoPreset}
          />
        ) : null}
        {step === 2 ? <SkillPreviewStep data={data} previewService={previewService} /> : null}
      </div>

      {step === 2 ? (
        <div className="rounded-2xl border-2 border-border bg-surface-elevated/30 p-4 shadow-sm sm:p-5">
          <Checkbox
            isSelected={data.publishAsDraft}
            onChange={(checked) => onFieldChange("publishAsDraft", checked)}
            className="text-sm text-foreground"
          >
            {mode === "edit"
              ? "Guardar como borrador (no aparece en Explorar hasta que reactives)"
              : "Publicar como borrador"}
          </Checkbox>
          {mode === "edit" ? (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Si lo desmarcas, enviaremos la actualización a revisión antes de publicarse.
            </p>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Al publicar, tu servicio pasará primero por revisión del equipo antes de aparecer en
              Explorar.
            </p>
          )}
        </div>
      ) : null}
      {submitError ? <p className="text-sm font-medium text-accent-red">{submitError}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          className="rounded-full border-border px-6 font-semibold text-foreground"
          isDisabled={step === 0 || saving}
          onPress={goBack}
        >
          Volver
        </Button>
        {step < SKILL_WIZARD_STEPS.length - 1 ? (
          <Button
            variant="primary"
            className="rounded-full bg-primary px-6 font-semibold text-white hover:opacity-95"
            onPress={goNext}
          >
            Continuar
          </Button>
        ) : (
          <Button
            variant="primary"
            className="rounded-full bg-primary px-6 font-semibold text-white hover:opacity-95"
            isDisabled={saving || !canPublish(data)}
            onPress={handleSubmit}
          >
            {data.publishAsDraft
              ? "Guardar borrador"
              : mode === "edit"
                ? "Actualizar publicación"
                : "Publicar habilidad"}
          </Button>
        )}
      </div>
    </div>
  );
}
