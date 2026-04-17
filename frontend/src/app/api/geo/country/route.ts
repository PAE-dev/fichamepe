import { NextResponse, type NextRequest } from "next/server";
import {
  COUNTRY_COOKIE_NAME,
  detectCountryCodeFromHeaders,
  normalizeCountryCode,
} from "@/lib/country";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const detected = detectCountryCodeFromHeaders(request.headers);
  const fromCookie = normalizeCountryCode(
    request.cookies.get(COUNTRY_COOKIE_NAME)?.value ?? null,
  );
  const countryCode = fromCookie ?? detected ?? null;

  const response = NextResponse.json({ countryCode });
  /** No guardamos país detectado por IP en cookie: el listado por defecto es sin filtro. */
  return response;
}
