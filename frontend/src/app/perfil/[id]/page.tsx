import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BriefcaseBusiness, MapPin, ShieldCheck, Star } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { fetchPublicProfileById } from "@/lib/api/public-profiles.api";
import { fetchServicesByProfileId } from "@/lib/api/services.api";

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profilePromise = fetchPublicProfileById(id);
  const servicesPromise = fetchServicesByProfileId(id).catch(() => []);

  const [profile, services] = await Promise.all([profilePromise, servicesPromise]).catch(() => [
    null,
    [],
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">
        <section className="overflow-hidden rounded-3xl border border-border bg-white">
          <div className="relative h-28 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent sm:h-36">
            <span className="absolute left-5 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-3.5" aria-hidden />
              Perfil verificado por FichaMePe
            </span>
          </div>
          <div className="px-5 pb-6 pt-0 sm:px-7">
            <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-primary/10">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <span
                      className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold text-foreground">{profile.displayName}</h1>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        profile.isAvailable ? "bg-success" : "bg-muted"
                      }`}
                      aria-hidden
                    />
                    {profile.isAvailable ? "Disponible ahora" : "No disponible ahora"}
                    {profile.district ? (
                      <>
                        <span className="text-border">•</span>
                        <MapPin className="size-3.5" aria-hidden />
                        {profile.district}
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
              <Link
                href="/explorar"
                className="inline-flex w-full items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary no-underline transition hover:bg-primary/5 sm:w-auto"
              >
                Explorar más servicios
              </Link>
            </div>

            {profile.bio ? <p className="mt-5 text-sm leading-relaxed text-muted">{profile.bio}</p> : null}

            <div className="mt-5 flex flex-wrap gap-2">
              {(profile.skills ?? []).map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Publicaciones activas</p>
                <p className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
                  <BriefcaseBusiness className="size-4 text-primary" aria-hidden />
                  {services.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Valoración estimada</p>
                <p className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Star className="size-4 text-primary" aria-hidden />
                  4.8
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Perfil</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {profile.hourlyRate ? `Desde S/ ${profile.hourlyRate.toFixed(0)}/h` : "Tarifa por cotización"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground">Publicaciones de este vendedor</h2>
          <p className="mt-1 text-sm text-muted">
            Servicios activos publicados por {profile.displayName}.
          </p>
          {services.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted">
              Este vendedor aún no tiene publicaciones activas.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
