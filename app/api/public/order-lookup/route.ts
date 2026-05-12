import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  toPublicServiceOrder,
  toPublicUsbOrder,
} from "@/lib/public-order";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const bodySchema = z.object({
  orderId: z.string().min(8).max(40),
  email: z.string().trim().email().max(320),
});

export async function POST(req: Request) {
  const ip = getClientIp();
  if (!checkRateLimit(`order-lookup:${ip}`, { windowMs: 60_000, max: 30 })) {
    return NextResponse.json(
      { ok: false, code: "not_found" } as const,
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_input" } as const, {
      status: 400,
    });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "invalid_input" } as const, {
      status: 400,
    });
  }

  const { orderId, email } = parsed.data;
  const emailNorm = email.toLowerCase();

  const service = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerEmail: { equals: emailNorm, mode: "insensitive" },
    },
  });

  if (service) {
    return NextResponse.json({
      ok: true,
      order: toPublicServiceOrder(service),
    });
  }

  const usb = await prisma.usbOrder.findFirst({
    where: {
      id: orderId,
      customerEmail: { equals: emailNorm, mode: "insensitive" },
    },
  });

  if (usb) {
    return NextResponse.json({
      ok: true,
      order: toPublicUsbOrder(usb),
    });
  }

  return NextResponse.json({ ok: false, code: "not_found" } as const, {
    status: 404,
  });
}
