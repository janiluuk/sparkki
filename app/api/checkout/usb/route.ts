import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { buildUsbLineItems } from "@/lib/stripe-line-items";
import { USB_ORDER_CENTS, getUsbStripePriceId } from "@/lib/pricing";
import { checkRateLimit, getClientIpFromHeaders } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site-url";

const usbSchema = z.object({
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email().max(320),
  address: z.string().min(1).max(500),
  locale: z.enum(["fi", "en"]),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = usbSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (
    !(await checkRateLimit(`checkout-usb:${getClientIpFromHeaders(req.headers)}`, {
      windowMs: 60_000,
      max: 25,
    }))
  ) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!stripeConfigured() || !getStripe()) {
    return NextResponse.json(
      { error: "stripe_not_configured" },
      { status: 503 },
    );
  }

  const stripe = getStripe()!;
  const baseUrl = getSiteUrl();

  const usb = await prisma.usbOrder.create({
    data: {
      status: "pending",
      customerName: data.customerName.trim(),
      customerEmail: data.customerEmail.trim().toLowerCase(),
      address: data.address.trim(),
      locale: data.locale,
    },
  });

  const lineItems = buildUsbLineItems(USB_ORDER_CENTS, getUsbStripePriceId());

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: usb.customerEmail,
      line_items: lineItems,
      success_url: `${baseUrl}/${data.locale}/itse/kiitos?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${data.locale}/itse`,
      metadata: {
        kind: "usb",
        usbOrderId: usb.id,
      },
    });

    await prisma.usbOrder.update({
      where: { id: usb.id },
      data: { stripeSessionId: session.id },
    });

    if (!session.url) {
      await prisma.usbOrder.delete({ where: { id: usb.id } });
      return NextResponse.json(
        { error: "stripe_no_checkout_url" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url, orderId: usb.id });
  } catch (e) {
    await prisma.usbOrder.delete({ where: { id: usb.id } }).catch(() => {});
    console.error("usb checkout session error", e);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}
