import type { PortableVmHandoff } from "@prisma/client";

/** P2V / portable image add-on before Linux install — EUR cents (see ROADMAP Phase 5). */
export const PORTABLE_VM_ADDON_CENTS = 149_00;

export function isPortableVmHandoff(v: string): v is PortableVmHandoff {
  return v === "CUSTOMER_STORAGE" || v === "SHIPPED_MEDIA";
}

/** Short labels for email, admin, order tracking. */
export const PORTABLE_VM_HANDOFF_LABEL: Record<
  PortableVmHandoff,
  { fi: string; en: string }
> = {
  CUSTOMER_STORAGE: {
    fi: "Asiakkaan USB tai NAS luovutuksessa",
    en: "Customer USB or NAS at handoff",
  },
  SHIPPED_MEDIA: {
    fi: "Sovittu toimitus-/palautusmedia",
    en: "Agreed shipped/return media",
  },
};
