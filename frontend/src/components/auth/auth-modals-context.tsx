"use client";

import { createContext, useContext } from "react";

export type AuthModalsContextValue = {
  openLogin: () => void;
  openRegister: (opts?: { role?: "client" | "freelancer" }) => void;
  openForgotPassword: () => void;
};

export const AuthModalsContext = createContext<AuthModalsContextValue | null>(
  null,
);

export function useAuthModals(): AuthModalsContextValue {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) {
    throw new Error("useAuthModals debe usarse dentro de AuthModalsProvider");
  }
  return ctx;
}
