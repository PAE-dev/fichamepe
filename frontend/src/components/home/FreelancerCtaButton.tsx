"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@heroui/react/button";
import { useAuthModals } from "@/components/auth/auth-modals-context";

export function FreelancerCtaButton() {
  const { openRegister } = useAuthModals();

  return (
    <Button
      size="lg"
      className="h-auto rounded-full bg-[#C8F135] px-8 py-3.5 text-lg font-bold text-[#1A1A2E] hover:opacity-95"
      onPress={() => openRegister({ role: "freelancer" })}
    >
      <span className="inline-flex items-center gap-2">
        Publicar mi servicio
        <ArrowRight className="size-5 shrink-0" aria-hidden />
      </span>
    </Button>
  );
}
