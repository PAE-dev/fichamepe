import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function StaticInfoPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-3xl font-extrabold text-foreground">{title}</h1>
        <p className="mt-3 text-base text-muted">{description}</p>
      </main>
      <Footer />
    </div>
  );
}
