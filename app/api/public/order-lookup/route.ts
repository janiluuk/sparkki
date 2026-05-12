import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  toPublicServiceOrder,
  toPublicUsbOrder,
} from "@/lib/public-order";

const bodySchema = z.object({
  orderId: z.string().min(8).max(40),
  email: z.string().trim().email().max(320),
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hitBuckets = new Map<string, number[]>();

function rateLimitOk(key: string): boolean {
  const now = Date.now();
  const bucket = (hitBuckets.get(key) ?? []).filter((t) => t > now - WINDOW_MS);
  if (bucket.length >= MAX_PER_WINDOW) return false;
  bucket.push(now);
  hitBuckets.set(key, bucket);
  return true;
}

function clientIp(): string {
  const h = headers();
  const xf = h.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = clientIp();
  if (!rateLimitOk(`order-lookup:${ip}`)) {
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
