import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const ITEMS = [
  "Un cliente quiere que le cotices edición de video.",
  "Tu servicio de CV fue guardado en favoritos 3 veces hoy.",
  "Quedan 2 cupos en tu oferta relámpago.",
];

export default function NotificacionesPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <h1 className="text-3xl font-extrabold text-foreground">Notificaciones</h1>
        <ul className="mt-5 space-y-3">
          {ITEMS.map((item) => (
            <li key={item} className="rounded-xl border border-border bg-white p-4 text-sm text-foreground">
              {item}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
