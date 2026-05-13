"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PREFIX = "/admin";

function safeAdminPath(pathname: string): string {
  if (
    pathname.startsWith(ADMIN_PREFIX) &&
    !pathname.includes("//") &&
    !pathname.includes("\n") &&
    !pathname.includes("\r")
  ) {
    return pathname;
  }
  return "/admin";
}

export async function setAdminLocale(locale: "fi" | "en", pathname: string) {
  if (locale !== "fi" && locale !== "en") {
    redirect("/admin");
  }
  cookies().set("ADMIN_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
  });
  redirect(safeAdminPath(pathname));
}
