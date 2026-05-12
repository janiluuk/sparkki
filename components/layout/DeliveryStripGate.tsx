"use client";

import { usePathname } from "@/i18n/navigation";
import { DeliveryStrip } from "@/components/home/DeliveryStrip";

/** Renders the delivery strip only on the locale home path. */
export function DeliveryStripGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <DeliveryStrip />;
}
