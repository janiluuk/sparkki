import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import fiMessages from "@/messages/fi.json";

const a = fiMessages.admin;

const STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
];

function isOrderStatus(s: string | undefined): s is OrderStatus {
  return !!s && STATUSES.includes(s as OrderStatus);
}

function statusLabel(s: OrderStatus): string {
  const key = `status_${s}` as keyof typeof a;
  return (a[key] as string) ?? s;
}

type Props = {
  searchParams: { status?: string };
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  await requireAdmin();
  const filter = isOrderStatus(searchParams.status)
    ? { status: searchParams.status }
    : {};

  const orders = await prisma.order.findMany({
    where: filter,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/admin" className="text-verso-green underline">
        ← {a.dashboard}
      </Link>
      <h1 className="mt-6 text-3xl font-bold">{a.orders}</h1>
      <p className="mt-2 text-lg text-gray-700">{a.ordersIntro}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`min-h-tap rounded-full px-4 py-2 font-semibold ${
            !searchParams.status
              ? "bg-verso-green text-white"
              : "bg-white ring-1 ring-gray-300"
          }`}
        >
          {a.filterAll}
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`min-h-tap rounded-full px-4 py-2 font-semibold ${
              searchParams.status === s
                ? "bg-verso-green text-white"
                : "bg-white ring-1 ring-gray-300"
            }`}
          >
            {statusLabel(s)}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-lg text-gray-700">{a.ordersEmpty}</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-lg">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">{a.colDate}</th>
                <th className="px-4 py-3 font-semibold">{a.colCustomer}</th>
                <th className="px-4 py-3 font-semibold">{a.colTier}</th>
                <th className="px-4 py-3 font-semibold">{a.colStatus}</th>
                <th className="px-4 py-3 font-semibold">{a.colPrice}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {o.createdAt.toLocaleString("fi-FI")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-medium text-verso-green underline"
                    >
                      {o.customerName}
                    </Link>
                    <div className="text-sm text-gray-600">{o.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3">{o.tier}</td>
                  <td className="px-4 py-3">{statusLabel(o.status)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {(o.priceEur / 100).toFixed(2)} {a.colEur}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
