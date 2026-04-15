import { api } from "@/lib/api";

export async function postApplyReferralCode(code: string): Promise<void> {
  await api.post("/users/me/referral", { code: code.trim().toUpperCase() });
}
