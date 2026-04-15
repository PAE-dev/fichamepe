import { ServiceCard } from "@/components/cards/ServiceCard";
import type { ServicePublic } from "@/types/service.types";

export function ServiceCardLarge({
  service,
  coverPriority,
}: {
  service: ServicePublic;
  coverPriority?: boolean;
}) {
  return <ServiceCard service={service} coverPriority={coverPriority} />;
}
