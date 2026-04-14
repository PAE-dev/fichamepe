"use client";

import { useEffect, useRef, useState } from "react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { Modal } from "@heroui/react/modal";
import { Button } from "@heroui/react/button";
import { Input } from "@heroui/react/input";
import { TextArea } from "@heroui/react/textarea";
import { CheckCircle2, X } from "lucide-react";

const CATEGORIES = [
  "Tecnología",
  "Diseño",
  "Marketing",
  "Idiomas",
  "Video y Foto",
  "Eventos",
  "Redacción",
  "Música",
  "Otros",
] as const;

type PublishSkillModalProps = {
  state: UseOverlayStateReturn;
};

export function PublishSkillModal({ state }: PublishSkillModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Tecnología");
  const [basePrice, setBasePrice] = useState("");
  const [deliveryEta, setDeliveryEta] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const isConfirmDisabled = !title.trim() || !basePrice.trim();

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Tecnología");
    setBasePrice("");
    setDeliveryEta("");
  };

  const showSuccessToast = () => {
    setShowSuccess(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowSuccess(false);
    }, 2600);
  };

  const handleConfirm = () => {
    if (isConfirmDisabled) return;
    resetForm();
    state.close();
    showSuccessToast();
  };

  return (
    <>
      <Modal state={state}>
        <Modal.Backdrop isDismissable className="bg-[#1A1A2E]/50 backdrop-blur-[2px]">
          <Modal.Container placement="center" size="lg" scroll="inside">
            <Modal.Dialog className="w-full !max-w-[min(calc(100vw-20px),640px)] rounded-2xl border border-border bg-white p-0 shadow-2xl outline-none">
              <Modal.Header className="relative border-b border-border px-5 py-4">
                <Modal.Heading className="text-lg font-bold text-foreground">
                  Publicar habilidad
                </Modal.Heading>
                <Modal.CloseTrigger
                  aria-label="Cerrar modal"
                  className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 hover:text-foreground"
                >
                  <X className="size-5" aria-hidden />
                </Modal.CloseTrigger>
              </Modal.Header>

              <Modal.Body className="space-y-4 px-5 py-5">
                <div className="space-y-1.5">
                  <label htmlFor="skill-title" className="text-sm font-medium text-foreground">
                    Título del servicio
                  </label>
                  <Input
                    id="skill-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ej: Edicion de videos para reels"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="skill-description" className="text-sm font-medium text-foreground">
                    Descripcion breve
                  </label>
                  <TextArea
                    id="skill-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Cuenta brevemente que ofreces y tu estilo de trabajo"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Categoria</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((item) => {
                      const active = item === category;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setCategory(item)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                            active
                              ? "border-primary bg-primary text-white"
                              : "border-border bg-white text-muted hover:border-primary/40 hover:text-primary"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="skill-price" className="text-sm font-medium text-foreground">
                      Precio base (S/)
                    </label>
                    <Input
                      id="skill-price"
                      type="number"
                      min={1}
                      value={basePrice}
                      onChange={(event) => setBasePrice(event.target.value)}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="skill-delivery" className="text-sm font-medium text-foreground">
                      Entrega estimada
                    </label>
                    <Input
                      id="skill-delivery"
                      value={deliveryEta}
                      onChange={(event) => setDeliveryEta(event.target.value)}
                      placeholder="Ej: 3 dias"
                    />
                  </div>
                </div>
              </Modal.Body>

              <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <Button variant="outline" className="rounded-full" onPress={() => state.close()}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="rounded-full bg-primary text-white hover:opacity-95"
                  isDisabled={isConfirmDisabled}
                  onPress={handleConfirm}
                >
                  Confirmar
                </Button>
              </div>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {showSuccess ? (
        <div className="fixed right-4 top-24 z-[70] rounded-xl border border-primary/25 bg-white px-4 py-3 shadow-lg">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="size-4 text-primary" aria-hidden />
            ¡Habilidad publicada!
          </p>
        </div>
      ) : null}
    </>
  );
}

