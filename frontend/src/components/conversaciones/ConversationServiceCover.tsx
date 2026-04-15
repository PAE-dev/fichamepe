"use client";

import Image from "next/image";
import type { ConversationPerspective } from "@/components/conversaciones/conversation-utils";

type ConversationServiceCoverProps = {
  coverUrl: string | null | undefined;
  serviceTitle: string;
  initialsFallback: string;
  perspective?: ConversationPerspective | null;
  size?: "md" | "sm";
};

export function ConversationServiceCover({
  coverUrl,
  serviceTitle,
  initialsFallback,
  perspective = null,
  size = "md",
}: ConversationServiceCoverProps) {
  const box = size === "md" ? "size-14" : "size-10";
  const textSize = size === "md" ? "text-xs" : "text-[10px]";
  const imgSizes = size === "md" ? "56px" : "40px";

  const frame =
    perspective === "buyer"
      ? "border-2 border-primary/50"
      : perspective === "seller"
        ? "border-2 border-accent/50"
        : "border border-border/70";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-primary/[0.07] ${box} ${frame}`}
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={serviceTitle}
          fill
          className="object-cover"
          sizes={imgSizes}
        />
      ) : (
        <span
          className={`flex h-full w-full items-center justify-center font-bold text-primary ${textSize}`}
        >
          {initialsFallback}
        </span>
      )}
    </div>
  );
}
