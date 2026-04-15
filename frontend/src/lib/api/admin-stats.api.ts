import { api } from "@/lib/api";

export type AdminStatsBucket = "day" | "month" | "year";

export type AdminSeriesPoint = { bucket: string; count: number };

export type AdminOverviewStats = {
  usersTotal: number;
  servicesTotal: number;
  onlineNow: number;
  inReview: number;
  newUsers: number;
  newServices: number;
  range: { from: string; to: string; bucket: AdminStatsBucket };
  series: {
    users: AdminSeriesPoint[];
    services: AdminSeriesPoint[];
  };
};

export async function fetchAdminOverview(params?: {
  bucket?: AdminStatsBucket;
  from?: string;
  to?: string;
}): Promise<AdminOverviewStats> {
  const { data } = await api.get<AdminOverviewStats>("/admin/stats/overview", {
    params,
  });
  return data;
}

