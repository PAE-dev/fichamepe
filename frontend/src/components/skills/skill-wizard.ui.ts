/** Estilos compartidos para campos del wizard (alto contraste, foco claro). */
export const wizardTextFieldClass =
  "h-12 w-full rounded-xl border-2 border-border bg-surface-elevated px-4 text-[15px] font-medium text-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted placeholder:font-normal focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

/** Input dentro de un contenedor con prefijo (sin doble borde). */
export const wizardTextFieldInnerClass =
  "h-12 min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 py-0 text-[15px] font-medium text-foreground shadow-none outline-none ring-0 ring-offset-0 placeholder:text-muted placeholder:font-normal focus-visible:ring-0";

export const wizardTextAreaClass =
  "min-h-[168px] w-full resize-y rounded-xl border-2 border-border bg-surface-elevated px-4 py-3 text-[15px] leading-relaxed text-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

export const wizardSectionClass =
  "rounded-2xl border-2 border-border bg-surface-elevated/40 p-4 sm:p-5 shadow-sm";
