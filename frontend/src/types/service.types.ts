export type ServiceProfileSummary = {
  displayName: string;
  avatarUrl: string | null;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  responseTimeHours?: number;
  isVerified?: boolean;
  district?: string | null;
};

export type ServiceBadgeKey =
  | "topRated"
  | "fastResponse"
  | "new"
  | "premium"
  | "bestSeller";

export type ServicePublic = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  previousPrice?: number | null;
  currency: "PEN";
  coverImageUrl: string | null;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  profileId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  profile?: ServiceProfileSummary;
  badge?: ServiceBadgeKey;
  weeklyHires?: number;
  etaHours?: number;
  distanceKm?: number | null;
  flashDealEndsAt?: string | null;
  remainingSlots?: number;
  soldRatio?: number;
  testimonial?: string | null;
};

export type ServicesFeedResponse = {
  services: ServicePublic[];
  total: number;
};
