import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { KoneetDetailBreadcrumbs } from "@/components/layout/HubBreadcrumbs";
import { findComputerModelBySlug } from "@/lib/koneet/computer-model-db";
import { localePathAlternates } from "@/lib/site/seo";

type Props = { params: { locale: string; slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await findComputerModelBySlug(params.slug);
  const t = await getTranslations({ locale: params.locale, namespace: "koneet" });
  if (!m) {
    return { title: t("title") };
  }
  return {
    title: `${m.make} ${m.model} — ${t("title")}`,
    description: m.verdict ?? t("metaDescription"),
    ...localePathAlternates(params.locale, `/koneet/${params.slug}`),
  };
}

export default async function KoneetDetailPage({ params }: Props) {
  const t = await getTranslations("koneet");
  const m = await findComputerModelBySlug(params.slug);
  if (!m) notFound();

  const statusKey =
    m.status === "IN_REVIEW"
      ? "statusReview"
      : m.status === "APPROVED"
        ? "statusApproved"
        : m.status === "REJECTED"
          ? "statusRejected"
          : "statusUnchecked";

  const orderPrefill = encodeURIComponent(`${m.make} ${m.model}`.trim());

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12 sm:px-12">
      <KoneetDetailBreadcrumbs make={m.make} model={m.model} />
      <p>
        <Link href="/koneet" className="text-g hover:underline">
          {t("backToList")}
        </Link>
      </p>
      <header>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">
          {m.make} {m.model}
        </h1>
        <p className="mt-2 font-mono text-sm text-dust">{t(statusKey)}</p>
      </header>

      <dl className="space-y-4 text-lg">
        {m.yearFrom != null || m.yearTo != null ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-dust">
              {t("years")}
            </dt>
            <dd className="text-ink">
              {m.yearFrom ?? "?"}–{m.yearTo ?? "?"}
            </dd>
          </div>
        ) : null}
        {m.ssdSlot ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-dust">
              SSD
            </dt>
            <dd className="text-ink">{m.ssdSlot}</dd>
          </div>
        ) : null}
        {m.maxRamGb != null ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-dust">
              RAM
            </dt>
            <dd className="text-ink">{m.maxRamGb} GB</dd>
          </div>
        ) : null}
        {m.verdict ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-dust">
              {t("verdict")}
            </dt>
            <dd className="font-light leading-relaxed text-fog">{m.verdict}</dd>
          </div>
        ) : null}
      </dl>

      <Link
        href={`/tilaa?computer=${orderPrefill}`}
        className="sparkki-btn-primary inline-flex min-h-tap items-center justify-center px-6 py-3"
      >
        {t("orderCta")}
      </Link>
    </div>
  );
}
