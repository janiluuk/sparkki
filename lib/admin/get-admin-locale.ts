import { cookies } from "next/headers";

export type AdminLocale = "fi" | "en";

export function getAdminLocale(): AdminLocale {
  const v = cookies().get("ADMIN_LOCALE")?.value;
  return v === "en" ? "en" : "fi";
}
