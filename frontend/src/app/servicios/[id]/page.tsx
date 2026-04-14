import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchServiceById } from "@/lib/api/services.api";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServicioDetailPage({ params }: PageProps) {
  const { id } = await params;

  let service;
  try {
    service = await fetchServiceById(id);
  } catch {
    notFound();
  }

  const profile = service.profile;
  const priceLabel =
    service.price != null
      ? `S/ ${Number(service.price).toFixed(0)}`
      : "Consultar precio";

  return (
    <div className="flex min-h-full flex-col bg-white text-[#1A1A2E]">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <p className="text-sm text-[#6B7280]">
          {profile?.displayName ?? "Freelancer"}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{service.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
          {service.description}
        </p>
        <p className="mt-6 text-xl font-bold text-[#1A1A2E]">{priceLabel}</p>
        {service.tags.length > 0 ? (
          <p className="mt-4 text-sm text-[#6B7280]">
            {service.tags.join(" · ")}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/explorar"
            className="inline-flex rounded-full border border-[#6C63FF] px-5 py-2.5 text-sm font-semibold text-[#6C63FF] no-underline transition-colors hover:bg-[#6C63FF]/5"
          >
            Seguir explorando
          </Link>
          {profile ? (
            <Link
              href={`/explorar?search=${encodeURIComponent(profile.displayName)}`}
              className="inline-flex rounded-full bg-[#6C63FF] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-95"
            >
              Ver más de este perfil
            </Link>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
