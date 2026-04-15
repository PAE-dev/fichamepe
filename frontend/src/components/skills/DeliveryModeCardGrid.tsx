"use client";

import { Check } from "lucide-react";
import { DELIVERY_MODES } from "./skill-wizard.constants";

type DeliveryModeCardGridProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
};

/** Misma UX que categorías: tarjetas con iconos Lucide (sin emoticonos). */
export function DeliveryModeCardGrid({ value, onChange, onBlur, error }: DeliveryModeCardGridProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
        {DELIVERY_MODES.map((mode) => {
          const selected = value === mode.id;
          const ModeIcon = mode.Icon;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              onBlur={onBlur}
              className={`relative flex flex-col items-start gap-2 rounded-2xl border-2 p-3.5 text-left transition-[border-color,box-shadow,background-color] sm:p-4 ${
                selected
                  ? "border-primary bg-primary/[0.08] shadow-md shadow-primary/10 ring-1 ring-primary/20"
                  : "border-border bg-surface-elevated/80 hover:border-primary/40 hover:bg-primary/[0.04] hover:shadow-sm"
              }`}
            >
              <span
                className={`flex size-10 items-center justify-center rounded-xl sm:size-11 ${
                  selected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                }`}
                aria-hidden
              >
                <ModeIcon className="size-[22px] sm:size-6" strokeWidth={2} />
              </span>
              <p
                className={`text-left text-xs font-semibold leading-snug sm:text-[13px] ${
                  selected ? "text-primary" : "text-foreground"
                }`}
              >
                {mode.label}
              </p>
              {selected ? (
                <span className="absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                  <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs font-medium text-accent-red">{error}</p> : null}
    </div>
  );
}
