import enMessages from "@/messages/en.json";
import fiMessages from "@/messages/fi.json";
import { getAdminLocale } from "./get-admin-locale";

export function getAdminMessages() {
  return getAdminLocale() === "en" ? enMessages : fiMessages;
}
