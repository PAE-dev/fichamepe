"use client";

import { useLayoutEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useFavoritesStore } from "@/stores/favoritesStore";

export function FavoriteButton({ serviceId }: { serviceId: string }) {
  /** Debe leer `favorites` en el selector: si no, Zustand no se suscribe y no repinta al navegar. */
  const isFavoriteFromStore = useFavoritesStore((state) =>
    state.favorites.includes(serviceId),
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [busy, setBusy] = useState(false);
  const [persistReady, setPersistReady] = useState(false);

  useLayoutEffect(() => {
    if (useFavoritesStore.persist.hasHydrated()) {
      setPersistReady(true);
      return;
    }
    const unsub = useFavoritesStore.persist.onFinishHydration(() => {
      setPersistReady(true);
    });
    return unsub;
  }, []);

  /** Hasta rehidratar `persist`, el servidor y el cliente deben coincidir (no favorito). */
  const isFavorite = persistReady ? isFavoriteFromStore : false;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      type="button"
      disabled={busy}
      aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-busy={busy}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setBusy(true);
        void Promise.resolve(toggleFavorite(serviceId)).finally(() => setBusy(false));
      }}
      className={`inline-flex size-8 items-center justify-center rounded-full border ${
        isFavorite
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-white text-muted"
      }`}
    >
      <Heart className={`size-4 ${isFavorite ? "fill-primary" : ""}`} aria-hidden />
    </motion.button>
  );
}
