"use client";

import { useState } from "react";
import { Briefcase, Clock3, Send, Sparkles, Users } from "lucide-react";
import { Button } from "@heroui/react/button";
import { Input } from "@heroui/react/input";
import { TextArea } from "@heroui/react/textarea";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/auth.store";

type MockRequest = {
  id: string;
  title: string;
  budget: string;
  applicants: number;
  eta: string;
};

const INITIAL_REQUESTS: MockRequest[] = [
  {
    id: "req-1",
    title: "Necesito editor de video para campaña de restaurante",
    budget: "S/300 - S/500",
    applicants: 11,
    eta: "Publicado hace 1h",
  },
  {
    id: "req-2",
    title: "Busco contador para regularizar pagos y RUC",
    budget: "S/250",
    applicants: 7,
    eta: "Publicado hace 3h",
  },
  {
    id: "req-3",
    title: "Solicito fotógrafo para evento de marca en Barranco",
    budget: "S/450",
    applicants: 15,
    eta: "Publicado ayer",
  },
];

export default function SolicitarPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [requests, setRequests] = useState<MockRequest[]>(INITIAL_REQUESTS);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [budget, setBudget] = useState("");

  const createRequest = () => {
    if (!title.trim() || !budget.trim()) return;
    setRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        title: title.trim(),
        budget: budget.trim(),
        applicants: 0,
        eta: "Publicado hace unos segundos",
      },
      ...prev,
    ]);
    setTitle("");
    setDetail("");
    setBudget("");
  };

  return (
    <div className="flex min-h-full flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Solicitudes específicas (mock)
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-foreground">
            Publica lo que necesitas y deja que postulen
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Ideal para chambas bien específicas. Tú pones el brief y el presupuesto,
            freelancers te mandan propuesta.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-2xl border border-border bg-white p-4">
            <h2 className="text-lg font-bold text-foreground">
              Solicitudes abiertas
            </h2>
            <div className="mt-4 space-y-3">
              {requests.map((request) => (
                <article key={request.id} className="rounded-xl border border-border p-3">
                  <h3 className="font-semibold text-foreground">{request.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="size-3.5" aria-hidden />
                      Presupuesto: {request.budget}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" aria-hidden />
                      {request.applicants} postulantes
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3.5" aria-hidden />
                      {request.eta}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 rounded-full border-primary/30 text-primary"
                  >
                    Postular
                  </Button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-4">
            <h2 className="text-lg font-bold text-foreground">Crear solicitud</h2>
            {!isAuthenticated ? (
              <p className="mt-3 rounded-xl bg-accent/10 p-3 text-sm text-foreground">
                Inicia sesión para publicar solicitudes. Por ahora este módulo está
                mockeado.
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted">
                  Título de la solicitud
                </label>
                <Input
                  placeholder="Ej: Necesito editor de reels para campaña"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted">Detalle</label>
                <TextArea
                  placeholder="Describe lo que necesitas, plazos y estilo..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted">Presupuesto</label>
                <Input
                  placeholder="Ej: S/300 - S/500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <Button
                className="w-full rounded-full bg-primary font-semibold text-white"
                onPress={createRequest}
              >
                <Send className="size-4" aria-hidden />
                Publicar solicitud
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
