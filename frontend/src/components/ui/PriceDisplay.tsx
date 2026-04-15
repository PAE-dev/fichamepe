export type PriceDisplayVariant = "default" | "card";

export function PriceDisplay({
  price,
  previousPrice,
  variant = "default",
}: {
  price: number | null | undefined;
  previousPrice?: number | null;
  /** `card`: precio grande estilo marketplace (tarjetas / vitrina). */
  variant?: PriceDisplayVariant;
}) {
  if (price == null) {
    return (
      <p
        className={
          variant === "card"
            ? "text-base font-semibold text-muted"
            : "text-sm font-semibold text-muted"
        }
      >
        Consultar precio
      </p>
    );
  }

  const hasStrike = previousPrice != null && previousPrice > price;

  if (variant === "card") {
    return (
      <div className="flex flex-col gap-0.5">
        {hasStrike ? (
          <span className="text-[13px] font-semibold tabular-nums text-muted line-through decoration-2">
            S/ {previousPrice.toFixed(0)}
          </span>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
          <span className="text-xs font-bold uppercase tracking-wide text-primary-dark">S/</span>
          <span className="text-[1.65rem] font-black leading-none tracking-tight text-primary-dark tabular-nums sm:text-[1.85rem]">
            {price.toFixed(0)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 font-mono">
        {hasStrike ? (
          <span className="text-xs text-muted line-through">S/{previousPrice.toFixed(0)}</span>
        ) : null}
        <span className="text-sm font-bold text-foreground">S/{price.toFixed(0)}</span>
      </div>
    </div>
  );
}
