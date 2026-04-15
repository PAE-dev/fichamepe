import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardAdminClient } from "./DashboardAdminClient";
import { FP_REFRESH_COOKIE, FP_ROLE_COOKIE } from "@/lib/auth-cookies";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasRefresh = Boolean(cookieStore.get(FP_REFRESH_COOKIE)?.value);
  const role = cookieStore.get(FP_ROLE_COOKIE)?.value;

  if (!hasRefresh) {
    redirect("/auth/login?from=/dashboard");
  }
  if (role !== "admin") {
    redirect("/");
  }

  return <DashboardAdminClient />;
}
