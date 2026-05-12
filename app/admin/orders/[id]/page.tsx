import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import fiMessages from "@/messages/fi.json";
import {
  sendOrderDone,
  updateOrderNotes,
  updateOrderStatus,
} from "../actions";

const a = fiMessages.admin;

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;

type Props = {
  params: { id: string };
  searchParams: { email?: string };
};

function statusLabel(s: string): string {
  const key = `status_${s}` as keyof typeof a;
  return (a[key] as string) ?? s;
}

export default async function AdminOrderDetailPage({ params, searchParams }: Props) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) notFound();

  const emailFlash = searchParams.email;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin/orders" className="text-verso-green underline">
        ← {a.orderBack}
      </Link>
      <h1 className="mt-6 text-3xl font-bold">
        {a.orderDetailTitle} · {order.id.slice(0, 8)}…
      </h1>

      {emailFlash === "sent" ? (
        <p className="mt-4 rounded-lg border border-g/40 bg-g/10 p-4 text-lg text-ink">
          {a.doneSent}
        </p>
      ) : null}
      {emailFlash === "failed" ? (
        <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 p-4 text-lg text-ink">
          {a.doneFailed}
        </p>
      ) : null}

      <dl className="mt-8 grid gap-4 text-lg">
        <div>
          <dt className="font-semibold text-fog">{a.fieldId}</dt>
          <dd className="font-mono text-ink">{order.id}</dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colStatus}</dt>
          <dd>{statusLabel(order.status)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colTier}</dt>
          <dd>{order.tier}</dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colSupport}</dt>
          <dd>{order.supportTier}</dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colDelivery}</dt>
          <dd>{order.deliveryMethod}</dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colComputer}</dt>
          <dd>
            {order.computerMake} {order.computerModel}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colCustomer}</dt>
          <dd>
            {order.customerName} · {order.customerEmail}
            {order.customerPhone ? ` · ${order.customerPhone}` : ""}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colAddress}</dt>
          <dd className="whitespace-pre-wrap">{order.address ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colPrice}</dt>
          <dd>
            {(order.priceEur / 100).toFixed(2)} {a.colEur}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colStripe}</dt>
          <dd className="break-all font-mono text-sm">
            {order.stripeSessionId ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-fog">{a.colNotes}</dt>
          <dd className="whitespace-pre-wrap">{order.notes ?? "—"}</dd>
        </div>
      </dl>

      <section className="mt-10 space-y-6 border-t border-edge pt-8">
        <form action={updateOrderStatus} className="space-y-3">
          <input type="hidden" name="orderId" value={order.id} />
          <label htmlFor="status" className="block font-semibold">
            {a.fieldStatus}
          </label>
          <select
            id="status"
            name="status"
            defaultValue={order.status}
            className="min-h-tap w-full max-w-md rounded-lg border border-em px-4 text-lg"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="min-h-tap rounded-lg bg-verso-green px-5 py-2 font-semibold text-canvas"
          >
            {a.saveStatus}
          </button>
        </form>

        <form action={updateOrderNotes} className="space-y-3">
          <input type="hidden" name="orderId" value={order.id} />
          <label htmlFor="adminNotes" className="block font-semibold">
            {a.adminNotesLabel}
          </label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            rows={5}
            defaultValue={order.adminNotes ?? ""}
            placeholder={a.adminNotesPlaceholder}
            className="w-full rounded-lg border border-em px-4 py-3 text-lg"
          />
          <button
            type="submit"
            className="min-h-tap rounded-lg border border-em px-5 py-2 font-semibold"
          >
            {a.saveNotes}
          </button>
        </form>

        <form action={sendOrderDone}>
          <input type="hidden" name="orderId" value={order.id} />
          <button
            type="submit"
            className="min-h-tap rounded-lg bg-verso-amber px-5 py-2 font-semibold text-ink"
          >
            {a.sendDone}
          </button>
        </form>
      </section>
    </div>
  );
}
