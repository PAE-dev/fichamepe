import { api } from "@/lib/api";

export type ServiceReportReason =
  | "fraud"
  | "inappropriate_content"
  | "false_information"
  | "spam"
  | "other";

export type CreateServiceReportPayload = {
  serviceId: string;
  reason: ServiceReportReason;
  details?: string;
};

export async function createServiceReport(payload: CreateServiceReportPayload): Promise<void> {
  await api.post("/service-reports", payload);
}
