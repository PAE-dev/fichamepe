import { api } from "@/lib/api";

export type SubscriptionPlan = "pro";

export type SubscriptionStatus =
  | "active"
  | "pending_payment"
  | "expired"
  | "cancelled";

export type SubscriptionRow = {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  activatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchMySubscription(): Promise<SubscriptionRow | null> {
  const { data } = await api.get<SubscriptionRow | null>("/subscriptions/me");
  return data ?? null;
}

export async function postPendingSubscription(body: {
  plan: SubscriptionPlan;
  amount?: string;
  paymentMethod?: string;
  paymentReference?: string;
}): Promise<SubscriptionRow> {
  const { data } = await api.post<SubscriptionRow>("/subscriptions", body);
  return data;
}
