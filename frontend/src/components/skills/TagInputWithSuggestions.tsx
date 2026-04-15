"use client";

import { useMemo, useState } from "react";
import type { KeyboardEventHandler } from "react";
import { Hash } from "lucide-react";
import { Button } from "@heroui/react/button";
import { Chip } from "@heroui/react/chip";
import { Input } from "@heroui/react/input";
import {
  MAX_TAG_LENGTH,
  MAX_TAGS,
  TAG_SUGGESTIONS_BY_CATEGORY,
} from "./skill-wizard.constants";
import { wizardTextFieldInnerClass } from "./skill-wizard.ui";
import { sanitizeTag } from "./skill-wizard.validation";

type TagInputWithSuggestionsProps = {
  category: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  error?: string;
};

export function TagInputWithSuggestions({
  category,
  tags,
  onChange,
  onBlur,
  error,
}: TagInputWithSuggestionsProps) {
  const [input, setInput] = useState("");
  const suggestions = useMemo(() => TAG_SUGGESTIONS_BY_CATEGORY[category] ?? [], [category]);

  const tryAdd = (raw: string) => {
    const value = sanitizeTag(raw);
    if (!value || tags.includes(value) || tags.length >= MAX_TAGS) {
      return;
    }
    onChange([...tags, value]);
    setInput("");
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      tryAdd(input);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`flex min-h-12 items-stretch rounded-xl border-2 bg-surface-elevated px-3 shadow-sm transition-[border-color,box-shadow] focus-within:ring-2 ${
          error
            ? "border-accent-red focus-within:border-accent-red focus-within:ring-accent-red/20"
            : "border-border focus-within:border-primary focus-within:ring-primary/20"
        }`}
      >
        <span className="flex shrink-0 items-center text-muted" aria-hidden>
          <Hash className="size-5" strokeWidth={2} />
        </span>
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value.slice(0, MAX_TAG_LENGTH))}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder="Escribe y presiona Enter o coma"
          className={wizardTextFieldInnerClass}
        />
      </div>

      {tags.length ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip
              key={tag}
              variant="soft"
              className="cursor-pointer border border-primary/20 bg-primary/10 pl-3 pr-2 font-medium text-primary transition hover:bg-primary hover:text-white"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
            >
              {tag}
              <span className="ml-1 text-xs opacity-80" aria-hidden>
                ×
              </span>
            </Chip>
          ))}
        </div>
      ) : null}

      {suggestions.length ? (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Sugerencias</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tag) => {
              const disabled = tags.includes(tag) || tags.length >= MAX_TAGS;
              return (
                <Chip
                  key={tag}
                  variant="soft"
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-disabled={disabled}
                  className={`border border-border bg-white font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5 ${
                    disabled ? "pointer-events-none cursor-not-allowed opacity-45" : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!disabled) tryAdd(tag);
                  }}
                >
                  + {tag}
                </Chip>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="text-xs font-medium text-muted">
        {tags.length}/{MAX_TAGS} etiquetas
      </p>
      {error ? <p className="text-xs font-medium text-accent-red">{error}</p> : null}
    </div>
  );
}
