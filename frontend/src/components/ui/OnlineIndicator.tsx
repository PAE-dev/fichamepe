import { Circle } from "lucide-react";

export function OnlineIndicator({
  isOnline,
  responseTimeHours,
}: {
  isOnline: boolean;
  responseTimeHours?: number;
}) {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-muted">
      <Circle
        className={`size-2.5 ${isOnline ? "fill-success text-success" : "fill-muted/40 text-muted/40"}`}
        aria-hidden
      />
      <span>{isOnline ? "Activo ahora" : "No conectado"}</span>
      {responseTimeHours ? <span>· responde en ~{responseTimeHours}h</span> : null}
    </div>
  );
}
