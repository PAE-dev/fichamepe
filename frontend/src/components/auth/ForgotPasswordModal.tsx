"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UseOverlayStateReturn } from "@heroui/react";
import { Modal } from "@heroui/react/modal";
import { Button } from "@heroui/react/button";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { FieldError } from "@heroui/react/field-error";
import { X } from "lucide-react";
import {
  parseApiErrorMessage,
  postForgotPassword,
  postResetPassword,
} from "@/lib/api/auth.api";

const emailSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm: z.string().min(1, "Confirma la contraseña"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

type Phase = "email" | "password" | "doneEmailOnly";

type ForgotPasswordModalProps = {
  state: UseOverlayStateReturn;
};

export function ForgotPasswordModal({ state }: ForgotPasswordModalProps) {
  const router = useRouter();
  const formId = useId();
  const [phase, setPhase] = useState<Phase>("email");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string>("");

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  useEffect(() => {
    if (!state.isOpen) {
      setPhase("email");
      setResetToken(null);
      setInfoMessage("");
      emailForm.reset({ email: "" });
      passwordForm.reset({ password: "", confirm: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al cerrar el modal
  }, [state.isOpen]);

  const onEmailSubmit = async (data: EmailForm) => {
    try {
      const res = await postForgotPassword(data.email);
      setInfoMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setPhase("password");
        passwordForm.reset({ password: "", confirm: "" });
      } else {
        setPhase("doneEmailOnly");
      }
      emailForm.reset({ email: "" });
    } catch (e: unknown) {
      emailForm.setError("root", {
        message: parseApiErrorMessage(
          e,
          "No pudimos procesar la solicitud. Intenta más tarde.",
        ),
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (!resetToken) return;
    try {
      await postResetPassword(resetToken, data.password);
      state.close();
      router.replace("/");
    } catch (e: unknown) {
      passwordForm.setError("root", {
        message: parseApiErrorMessage(
          e,
          "No pudimos actualizar la contraseña. Solicita un código nuevo.",
        ),
      });
    }
  };

  const goHomeAndClose = () => {
    state.close();
    router.replace("/");
  };

  const pillInputClass =
    "h-12 w-full rounded-full border border-[#E5E7EB] bg-white px-5 text-[15px] text-[#1A1A2E] shadow-none placeholder:text-[#9CA3AF] focus-visible:ring-2 focus-visible:ring-[#6C63FF]/35";

  const heading =
    phase === "password"
      ? "Nueva contraseña"
      : phase === "doneEmailOnly"
        ? "Revisa tu correo"
        : "Recuperar contraseña";

  const subline =
    phase === "password"
      ? "Elige una contraseña segura. Luego podrás iniciar sesión desde el inicio."
      : phase === "doneEmailOnly"
        ? "Si existe una cuenta, te enviamos instrucciones. Cuando quieras, vuelve al inicio e inicia sesión."
        : "Indica el correo de tu cuenta. Si existe, podrás definir una contraseña nueva aquí mismo.";

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable className="bg-[#1A1A2E]/50 backdrop-blur-[3px]">
        <Modal.Container placement="center" size="lg" scroll="inside">
          <Modal.Dialog className="w-full !max-w-[min(calc(100vw-12px),480px)] !p-0 sm:!max-w-[480px] rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl outline-none">
            <Modal.Header className="relative px-5 pb-1 pt-8 text-center sm:px-10 sm:pt-10">
              <button
                type="button"
                aria-label="Cerrar"
                className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1A1A2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]/35 sm:right-4 sm:top-4"
                onClick={() => state.close()}
              >
                <X className="size-5" strokeWidth={2} aria-hidden />
              </button>
              <Modal.Heading className="text-xl font-semibold tracking-tight text-[#1A1A2E] sm:text-2xl">
                {heading}
              </Modal.Heading>
              <p className="mx-auto mt-2 max-w-[min(100%,360px)] text-sm leading-snug text-[#6B7280] sm:text-[15px]">
                {subline}
              </p>
            </Modal.Header>

            <Modal.Body className="px-5 pb-8 pt-3 sm:px-10 sm:pb-10 sm:pt-4">
              {phase === "email" ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                >
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor={`${formId}-email`}
                      className="text-left text-sm font-medium text-[#374151]"
                    >
                      Correo electrónico
                    </Label>
                    <Input
                      id={`${formId}-email`}
                      type="email"
                      autoComplete="email"
                      placeholder="tu@correo.com"
                      className={pillInputClass}
                      {...emailForm.register("email")}
                      aria-invalid={emailForm.formState.errors.email ? true : undefined}
                    />
                    {emailForm.formState.errors.email?.message ? (
                      <FieldError className="text-sm text-red-600">
                        {emailForm.formState.errors.email.message}
                      </FieldError>
                    ) : null}
                  </div>
                  {emailForm.formState.errors.root?.message ? (
                    <p className="text-center text-sm text-red-600" role="alert">
                      {emailForm.formState.errors.root.message}
                    </p>
                  ) : null}
                  <Button
                    type="submit"
                    variant="primary"
                    className="h-12 w-full rounded-full bg-[#6C63FF] text-[15px] font-semibold text-white"
                    isDisabled={emailForm.formState.isSubmitting}
                  >
                    {emailForm.formState.isSubmitting ? "Enviando…" : "Continuar"}
                  </Button>
                </form>
              ) : null}

              {phase === "password" ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                >
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor={`${formId}-pw`}
                      className="text-left text-sm font-medium text-[#374151]"
                    >
                      Nueva contraseña
                    </Label>
                    <Input
                      id={`${formId}-pw`}
                      type="password"
                      autoComplete="new-password"
                      className={pillInputClass}
                      {...passwordForm.register("password")}
                      aria-invalid={passwordForm.formState.errors.password ? true : undefined}
                    />
                    {passwordForm.formState.errors.password?.message ? (
                      <FieldError className="text-sm text-red-600">
                        {passwordForm.formState.errors.password.message}
                      </FieldError>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor={`${formId}-pwc`}
                      className="text-left text-sm font-medium text-[#374151]"
                    >
                      Confirmar contraseña
                    </Label>
                    <Input
                      id={`${formId}-pwc`}
                      type="password"
                      autoComplete="new-password"
                      className={pillInputClass}
                      {...passwordForm.register("confirm")}
                      aria-invalid={passwordForm.formState.errors.confirm ? true : undefined}
                    />
                    {passwordForm.formState.errors.confirm?.message ? (
                      <FieldError className="text-sm text-red-600">
                        {passwordForm.formState.errors.confirm.message}
                      </FieldError>
                    ) : null}
                  </div>
                  {passwordForm.formState.errors.root?.message ? (
                    <p className="text-center text-sm text-red-600" role="alert">
                      {passwordForm.formState.errors.root.message}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full border-[#E5E7EB]"
                      onPress={() => setPhase("email")}
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="h-12 rounded-full bg-[#6C63FF] font-semibold text-white"
                      isDisabled={passwordForm.formState.isSubmitting}
                    >
                      {passwordForm.formState.isSubmitting ? "Guardando…" : "Guardar y volver al inicio"}
                    </Button>
                  </div>
                </form>
              ) : null}

              {phase === "doneEmailOnly" ? (
                <div className="flex flex-col gap-4 text-center">
                  <p className="text-sm leading-relaxed text-[#374151]">{infoMessage}</p>
                  <Button
                    type="button"
                    variant="primary"
                    className="h-12 w-full rounded-full bg-[#6C63FF] font-semibold text-white"
                    onPress={goHomeAndClose}
                  >
                    Volver al inicio
                  </Button>
                </div>
              ) : null}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
