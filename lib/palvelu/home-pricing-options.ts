import type { ServicePricingTierId } from "@/lib/palvelu/service-pricing-tiers";

export type HomeServicePricingOption = {
  kind: "service";
  tier: ServicePricingTierId;
  nameKey: "tierSpeed" | "tierMemory";
  descKey: "tierSpeedDesc" | "tierMemoryDesc";
  featured: boolean;
  noteKey: "tierSpeedNote" | "tierMemoryNote";
};

export type HomeUsbPricingOption = {
  kind: "usb";
  nameKey: "tierUsb";
  descKey: "tierUsbDesc";
  ctaKey: "tierUsbCta";
};

export type HomePricingOption = HomeServicePricingOption | HomeUsbPricingOption;

/** Homepage package row — no full service; USB stick as DIY option. */
export const HOME_PRICING_OPTIONS: HomePricingOption[] = [
  {
    kind: "service",
    tier: "SSD_BASIC",
    nameKey: "tierSpeed",
    descKey: "tierSpeedDesc",
    featured: true,
    noteKey: "tierSpeedNote",
  },
  {
    kind: "service",
    tier: "SSD_RAM",
    nameKey: "tierMemory",
    descKey: "tierMemoryDesc",
    featured: false,
    noteKey: "tierMemoryNote",
  },
  {
    kind: "usb",
    nameKey: "tierUsb",
    descKey: "tierUsbDesc",
    ctaKey: "tierUsbCta",
  },
];
