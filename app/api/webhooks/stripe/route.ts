import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmedEmail, sendUsbConfirmedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new Response(JSON.stringify({ error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response(JSON.stringify({ error: "missing_signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch {
    return new Response(JSON.stringify({ error: "invalid_signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const kind = session.metadata?.kind;

    if (kind === "service" && session.metadata?.orderId) {
      const orderId = session.metadata.orderId;
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (
        order &&
        order.stripeSessionId === session.id &&
        order.status === "PENDING"
      ) {
        const paidCents =
          typeof session.amount_total === "number"
            ? session.amount_total
            : order.priceEur;
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "CONFIRMED",
            priceEur: paidCents,
          },
        });
        await sendOrderConfirmedEmail({
          to: order.customerEmail,
          orderId: order.id,
          customerName: order.customerName,
        });
      }
    }

    if (kind === "usb" && session.metadata?.usbOrderId) {
      const usbId = session.metadata.usbOrderId;
      const usb = await prisma.usbOrder.findUnique({ where: { id: usbId } });
      if (
        usb &&
        usb.stripeSessionId === session.id &&
        usb.status === "pending"
      ) {
        await prisma.usbOrder.update({
          where: { id: usbId },
          data: { status: "paid" },
        });
        await sendUsbConfirmedEmail({
          to: usb.customerEmail,
          orderId: usb.id,
          customerName: usb.customerName,
        });
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
