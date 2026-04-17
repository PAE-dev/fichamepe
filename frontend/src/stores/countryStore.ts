"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearCountryCookie,
  normalizeCountryCode,
  readCountryCookieFromDocument,
  writeCountryCookie,
} from "@/lib/country";

type CountrySelectionMode = "manual" | "auto" | null;

type CountryState = {
  countryCode: string | null;
  selectionMode: CountrySelectionMode;
  /** Sin filtro por país: todas las publicaciones. */
  clearToWorldwide: () => void;
  setManualCountry: (code: string) => void;
  setAutoCountry: (code: string) => void;
  hydrateFromCookie: () => void;
};

export const useCountryStore = create<CountryState>()(
  persist(
    (set, get) => ({
      countryCode: null,
      selectionMode: null,
      clearToWorldwide: () => {
        clearCountryCookie();
        set({ countryCode: null, selectionMode: "manual" });
      },
      setManualCountry: (code) => {
        const normalized = normalizeCountryCode(code);
        if (!normalized) {
          return;
        }
        writeCountryCookie(normalized);
        set({ countryCode: normalized, selectionMode: "manual" });
      },
      setAutoCountry: (code) => {
        const normalized = normalizeCountryCode(code);
        if (!normalized) {
          return;
        }
        const state = get();
        if (state.selectionMode === "manual") {
          return;
        }
        writeCountryCookie(normalized);
        set({
          countryCode: normalized,
          selectionMode: state.selectionMode ?? "auto",
        });
      },
      hydrateFromCookie: () => {
        const state = get();
        if (state.countryCode || state.selectionMode === "manual") {
          return;
        }
        const cookieCode = readCountryCookieFromDocument();
        if (!cookieCode) {
          return;
        }
        set({
          countryCode: cookieCode,
          selectionMode: "auto",
        });
      },
    }),
    {
      name: "fichame-country-preference",
      version: 1,
      migrate: (persisted, _version) => {
        if (!persisted || typeof persisted !== "object") {
          return { countryCode: null, selectionMode: null };
        }
        const p = persisted as {
          countryCode?: unknown;
          selectionMode?: unknown;
        };
        const countryCode =
          typeof p.countryCode === "string" || p.countryCode === null
            ? p.countryCode
            : null;
        const sm = p.selectionMode;
        const selectionMode: CountrySelectionMode =
          sm === "manual" || sm === "auto" || sm === null ? sm : null;
        if (selectionMode === "auto") {
          return { countryCode: null, selectionMode: null };
        }
        return { countryCode, selectionMode };
      },
      partialize: (state) => ({
        countryCode: state.countryCode,
        selectionMode: state.selectionMode,
      }),
    },
  ),
);
