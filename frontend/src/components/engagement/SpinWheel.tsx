"use client";

import { useState } from "react";
import { Gift, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react/button";
import { useEngagementStore } from "@/stores/engagementStore";

const PROMOS = ["FICHAME20", "ALTOQUE15", "LIMA10"] as const;

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelPlayed = useEngagementStore((state) => state.wheelPlayed);
  const unlockPromo = useEngagementStore((state) => state.unlockPromo);
  const setWheelPlayed = useEngagementStore((state) => state.setWheelPlayed);

  const spin = () => {
    if (wheelPlayed || isSpinning) return;
    setIsSpinning(true);
    window.setTimeout(() => {
      const code = PROMOS[Math.floor(Math.random() * PROMOS.length)];
      unlockPromo(code);
      setWheelPlayed();
      setIsSpinning(false);
    }, 1400);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-sm font-semibold text-foreground">
        Gira y gana tu descuento de bienvenida
      </p>
      <motion.div
        animate={{ rotate: isSpinning ? 720 : 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="mx-auto mt-3 flex size-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10"
      >
        <Gift className="size-8 text-primary" aria-hidden />
      </motion.div>
      <Button
        className="mt-3 w-full rounded-full bg-primary font-semibold text-white"
        isDisabled={wheelPlayed || isSpinning}
        onPress={spin}
      >
        <RotateCw className="size-4" aria-hidden />
        {wheelPlayed ? "Ruleta usada" : "Girar ruleta"}
      </Button>
    </div>
  );
}
