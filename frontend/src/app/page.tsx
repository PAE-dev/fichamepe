import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { CategoryBar } from "@/components/layout/CategoryBar";
import { HeroSection } from "@/components/hero/HeroSection";
import { FlashDeals } from "@/components/sections/FlashDeals";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { DiscoveryFeed } from "@/components/sections/DiscoveryFeed";
import { NearYouSection } from "@/components/sections/NearYouSection";
import { TopRatedSection } from "@/components/sections/TopRatedSection";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { ComboDeals } from "@/components/sections/ComboDeals";
import { ActivityToast } from "@/components/engagement/ActivityToast";
import { SpinWheel } from "@/components/engagement/SpinWheel";
import { fetchFeedServicesSafe } from "@/lib/api/services.api";
import { HOME_MACRO_CATEGORIES } from "@/lib/constants";

export default async function Home() {
  const feed = await fetchFeedServicesSafe({ limit: 30, orderBy: "random" });
  const services = feed.services;
  const counts = Object.fromEntries(HOME_MACRO_CATEGORIES.map((category) => [category.slug, 0]));

  for (const service of services) {
    const normalized = (service.tags.join(" ") || "").toLowerCase();
    for (const category of HOME_MACRO_CATEGORIES) {
      if (normalized.includes(category.label.toLowerCase().split(" ")[0])) {
        counts[category.slug] += 1;
      }
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <CategoryBar counts={counts} />
      <HeroSection />
      <ActivityToast />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-4 pb-28 pt-5">
        <FlashDeals services={services} />
        <TrendingSection services={services} />
        <DiscoveryFeed services={services} />
        <NearYouSection services={services} />
        <TopRatedSection services={services} />
        <NewArrivals services={services} />
        <ComboDeals services={services} />
        <SpinWheel />
      </main>

      <BottomNav />
      <Footer />
    </div>
  );
}
