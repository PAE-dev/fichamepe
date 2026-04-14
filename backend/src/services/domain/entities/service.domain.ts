export type ServiceCurrency = 'PEN';

export class Service {
  id: string;
  title: string;
  description: string;
  price: number | null;
  currency: ServiceCurrency;
  coverImageUrl: string | null;
  isActive: boolean;
  viewCount: number;
  tags: string[];
  profileId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  /** Solo en lecturas con join a perfil (feed, detalle). */
  profileDisplayName?: string;
  profileAvatarUrl?: string | null;
  profileIsAvailable?: boolean;
}
