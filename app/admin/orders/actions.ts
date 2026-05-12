"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { sendOrderDoneEmail } from "@/lib/email";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdminSession();
  const orderId = formData.get("orderId");
  const status = formData.get("status");
  if (typeof orderId !== "string" || typeof status !== "string") {
    return;
  }
  const allowed: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "DONE",
    "CANCELLED",
  ];
  if (!allowed.includes(status as OrderStatus)) {
    return;
  }
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as OrderStatus,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateOrderNotes(formData: FormData) {
  await requireAdminSession();
  const orderId = formData.get("orderId");
  const notes = formData.get("adminNotes");
  if (typeof orderId !== "string") return;
  const text = typeof notes === "string" ? notes : "";
  await prisma.order.update({
    where: { id: orderId },
    data: { adminNotes: text },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateDataMigrationNotes(formData: FormData) {
  await requireAdminSession();
  const orderId = formData.get("orderId");
  const notes = formData.get("dataMigrationNotes");
  if (typeof orderId !== "string") return;
  const text = typeof notes === "string" ? notes : "";
  const trimmed = text.trim().slice(0, 4000);
  await prisma.order.update({
    where: { id: orderId },
    data: { dataMigrationNotes: trimmed.length > 0 ? trimmed : null },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function sendOrderDone(formData: FormData) {
  await requireAdminSession();
  const orderId = formData.get("orderId");
  if (typeof orderId !== "string") return;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;
  const result = await sendOrderDoneEmail({
    to: order.customerEmail,
    orderId: order.id,
    customerName: order.customerName,
    locale: order.locale,
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(
    `/admin/orders/${orderId}?email=${result.ok ? "sent" : "failed"}`,
  );
}
