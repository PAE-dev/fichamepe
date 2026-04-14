import type { Service } from '../../domain/entities/service.domain';

export type ServiceResponse = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: 'PEN';
  coverImageUrl: string | null;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  profileId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    displayName: string;
    avatarUrl: string | null;
    isAvailable: boolean;
  };
};

export function toServiceResponse(s: Service): ServiceResponse {
  const base: ServiceResponse = {
    id: s.id,
    title: s.title,
    description: s.description,
    price: s.price,
    currency: s.currency,
    coverImageUrl: s.coverImageUrl,
    isActive: s.isActive,
    viewCount: s.viewCount,
    tags: s.tags,
    profileId: s.profileId,
    userId: s.userId,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
  if (s.profileDisplayName !== undefined) {
    base.profile = {
      displayName: s.profileDisplayName,
      avatarUrl: s.profileAvatarUrl ?? null,
      isAvailable: s.profileIsAvailable ?? false,
    };
  }
  return base;
}
