import { ServiceCard } from "@/components/cards/ServiceCard";
import type { ServicePublic } from "@/types/service.types";

export function ServiceCardLarge({ service }: { service: ServicePublic }) {
  return <ServiceCard service={service} />;
}
