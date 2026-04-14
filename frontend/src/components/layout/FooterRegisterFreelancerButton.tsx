"use client";

import { useAuthModals } from "@/components/auth/auth-modals-context";

export function FooterRegisterFreelancerButton({
  className,
}: {
  className: string;
}) {
  const { openRegister } = useAuthModals();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openRegister({ role: "freelancer" })}
    >
      Publicar servicio
    </button>
  );
}
