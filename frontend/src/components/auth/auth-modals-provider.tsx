"use client";

import { Suspense, useCallback, useMemo, useState, type ReactNode } from "react";
import { useOverlayState } from "@heroui/react";
import { AuthModalsContext } from "@/components/auth/auth-modals-context";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

export function AuthModalsProvider({ children }: { children: ReactNode }) {
  const loginState = useOverlayState();
  const registerState = useOverlayState();
  const forgotPasswordState = useOverlayState();
  const [registerInitialRole, setRegisterInitialRole] = useState<
    "client" | "freelancer" | null
  >(null);

  const clearRegisterRole = useCallback(() => setRegisterInitialRole(null), []);

  const openLogin = useCallback(() => {
    registerState.close();
    forgotPasswordState.close();
    loginState.open();
  }, [loginState, registerState, forgotPasswordState]);

  const openRegister = useCallback(
    (opts?: { role?: "client" | "freelancer" }) => {
      setRegisterInitialRole(opts?.role ?? null);
      loginState.close();
      forgotPasswordState.close();
      registerState.open();
    },
    [loginState, registerState, forgotPasswordState],
  );

  const openForgotPassword = useCallback(() => {
    loginState.close();
    registerState.close();
    forgotPasswordState.open();
  }, [loginState, registerState, forgotPasswordState]);

  const value = useMemo(
    () => ({ openLogin, openRegister, openForgotPassword }),
    [openLogin, openRegister, openForgotPassword],
  );

  return (
    <AuthModalsContext.Provider value={value}>
      {children}
      <ForgotPasswordModal state={forgotPasswordState} />
      <Suspense fallback={null}>
        <LoginModal state={loginState} />
      </Suspense>
      <RegisterModal
        state={registerState}
        initialRole={registerInitialRole}
        onClosed={clearRegisterRole}
        onSwitchToLogin={openLogin}
      />
    </AuthModalsContext.Provider>
  );
}
