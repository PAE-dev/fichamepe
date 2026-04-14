import { searchProfilesCached } from "@/lib/api/profiles-search.server";
import { FreelancerCard } from "@/components/ui/FreelancerCard";

export async function HomeFeaturedProfiles() {
  let data: Awaited<
    ReturnType<typeof searchProfilesCached>
  >["data"] = [];
  try {
    const res = await searchProfilesCached({ isAvailable: true }, 1, 8);
    data = res.data;
  } catch {
    return (
      <p className="text-center text-sm text-[#6B7280]">
        No pudimos cargar los destacados. Intenta más tarde.
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-center text-sm text-[#6B7280]">
        Aún no hay freelancers destacados. Vuelve pronto.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((p) => (
        <FreelancerCard key={p.id} profile={p} />
      ))}
    </div>
  );
}
