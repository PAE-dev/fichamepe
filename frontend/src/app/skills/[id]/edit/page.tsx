"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SkillWizardPageShell } from "@/components/skills/SkillWizardPageShell";
import { fetchMyServiceById } from "@/lib/api/my-services.api";
import type { ServicePublic } from "@/types/service.types";

export default function EditSkillPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<ServicePublic | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const found = await fetchMyServiceById(params.id);
        if (!cancelled) setService(found);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-surface-elevated" />
        <div className="mt-4 h-16 animate-pulse rounded-2xl bg-surface-elevated" />
        <div className="mt-4 h-[480px] animate-pulse rounded-3xl bg-surface-elevated" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 text-center sm:px-6">
        <p className="text-lg font-semibold text-foreground">No encontramos la habilidad.</p>
        <p className="mt-1 text-sm text-muted">Verifica que te pertenezca o intenta nuevamente.</p>
      </div>
    );
  }

  return <SkillWizardPageShell mode="edit" skillId={params.id} initialService={service} />;
}
