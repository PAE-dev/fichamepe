import { api } from "@/lib/api";
import type { ServiceReviewPublic, ServiceReviewsListResponse } from "@/types/service-review.types";

export async function fetchServiceReviews(
  serviceId: string,
  params?: { limit?: number; offset?: number },
): Promise<ServiceReviewsListResponse> {
  const sp = new URLSearchParams();
  sp.set("limit", String(params?.limit ?? 20));
  sp.set("offset", String(params?.offset ?? 0));
  const { data } = await api.get<ServiceReviewsListResponse>(
    `/services/${encodeURIComponent(serviceId)}/reviews?${sp.toString()}`,
  );
  return data;
}

export async function fetchMyServiceReview(
  serviceId: string,
): Promise<ServiceReviewPublic | null> {
  const { data } = await api.get<{ review: ServiceReviewPublic | null }>(
    `/services/${encodeURIComponent(serviceId)}/reviews/mine`,
  );
  return data.review;
}

export async function postServiceReview(
  serviceId: string,
  payload: { rating: number; body: string },
): Promise<ServiceReviewPublic> {
  const { data } = await api.post<ServiceReviewPublic>(
    `/services/${encodeURIComponent(serviceId)}/reviews`,
    payload,
  );
  return data;
}
