import { api } from "@/lib/api";

export type PublicationSlotPurchaseKind = "single" | "pack3";

export type PublicationSlotPurchaseRow = {
  id: string;
  kind: PublicationSlotPurchaseKind;
  slotsGranted: number;
  amountPen: string;
  status: "pending_payment" | "fulfilled" | "cancelled";
  paymentReference: string | null;
  fulfilledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function postPublicationSlotPurchase(body: {
  kind: PublicationSlotPurchaseKind;
  paymentReference?: string;
}): Promise<PublicationSlotPurchaseRow> {
  const { data } = await api.post<PublicationSlotPurchaseRow>(
    "/publication-slot-purchases",
    body,
  );
  return data;
}

export async function fetchMyPublicationSlotPurchases(): Promise<PublicationSlotPurchaseRow[]> {
  const { data } = await api.get<PublicationSlotPurchaseRow[]>(
    "/publication-slot-purchases/me",
  );
  return data;
}
