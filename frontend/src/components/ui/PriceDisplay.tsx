export function PriceDisplay({
  price,
  previousPrice,
}: {
  price: number | null | undefined;
  previousPrice?: number | null;
}) {
  if (price == null) {
    return <p className="text-sm font-semibold text-muted">Consultar precio</p>;
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 font-mono">
        {previousPrice != null && previousPrice > price ? (
          <span className="text-xs text-muted line-through">
            S/{previousPrice.toFixed(0)}
          </span>
        ) : null}
        <span className="text-sm font-bold text-foreground">S/{price.toFixed(0)}</span>
      </div>
    </div>
  );
}
