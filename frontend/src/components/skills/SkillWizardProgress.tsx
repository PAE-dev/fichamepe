"use client";

import { SKILL_WIZARD_STEPS } from "./skill-wizard.constants";

type SkillWizardProgressProps = {
  currentStep: number;
};

export function SkillWizardProgress({ currentStep }: SkillWizardProgressProps) {
  return (
    <>
      <div className="hidden items-center gap-3 rounded-2xl border-2 border-border bg-white p-4 shadow-sm sm:flex">
        {SKILL_WIZARD_STEPS.map((label, index) => {
          const done = index < currentStep;
          const active = index === currentStep;
          return (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done || active
                    ? "bg-primary text-white"
                    : "bg-surface-elevated text-muted"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`text-sm font-semibold ${active ? "text-primary" : done ? "text-foreground" : "text-muted"}`}
              >
                {label}
              </p>
              {index < SKILL_WIZARD_STEPS.length - 1 ? (
                <div className="mx-1 h-px flex-1 bg-border" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="rounded-xl border-2 border-border bg-surface-elevated/50 px-3 py-2 text-sm font-semibold text-foreground shadow-sm sm:hidden">
        Paso {currentStep + 1} de {SKILL_WIZARD_STEPS.length}
      </p>
    </>
  );
}
