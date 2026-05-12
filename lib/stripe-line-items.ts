import type { ServiceTier, SupportTier } from "@prisma/client";
import {
  getStripePriceIdForTier,
  serviceOrderTotalCents,
} from "@/lib/pricing";

export type CheckoutLineItem =
  | { price: string; quantity: number }
  | {
      quantity: number;
      price_data: {
        currency: "eur";
        unit_amount: number;
        product_data: {
          name: string;
          description?: string;
        };
      };
    };

export function buildServiceLineItems(
  tier: Exclude<ServiceTier, "B2B">,
  supportTier: SupportTier,
): CheckoutLineItem[] {
  const priceId = getStripePriceIdForTier(tier);
  if (priceId) {
    return [{ price: priceId, quantity: 1 }];
  }
  const amount = serviceOrderTotalCents(tier, supportTier);
  return [
    {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: amount,
        product_data: {
          name: `Verso — ${tier}`,
          description: "Tietokoneen uusiokäyttöpalvelu",
        },
      },
    },
  ];
}

export function buildUsbLineItems(
  amountCents: number,
  priceId?: string,
): CheckoutLineItem[] {
  if (priceId) {
    return [{ price: priceId, quantity: 1 }];
  }
  return [
    {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: amountCents,
        product_data: {
          name: "Verso — Linux-asennus-USB",
        },
      },
    },
  ];
}
