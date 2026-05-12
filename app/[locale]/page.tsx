import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localePathAlternates } from "@/lib/seo";
import { SpeedBar } from "@/components/home/SpeedBar";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("title"),
    description: t("subtitle"),
    ...localePathAlternates(locale, ""),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      type: "website",
      locale: locale === "fi" ? "fi_FI" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL?.trim();
  const showYoutube = Boolean(youtubeUrl && youtubeUrl !== "#");

  return (
    <div className="mx-auto max-w-[1100px] space-y-20 px-6 py-12 sm:px-12 sm:py-16">
      <section className="verso-hero">
        <div className="verso-hero-inner">
          <p className="verso-eyebrow">{t("eyebrow")}</p>
          <h1 className="font-display text-balance text-4xl font-extrabold tracking-hero text-ink sm:text-5xl md:text-[3.25rem]">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-ink">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/palvelu" className="verso-btn-primary">
              {t("ctaService")}
            </Link>
            <Link href="/itse" className="verso-btn-secondary">
              {t("ctaDiy")}
            </Link>
          </div>
          {showYoutube ? (
            <p className="mt-6 text-center">
              <a
                href={youtubeUrl}
                className="text-lg font-semibold text-verso-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verso-green"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("youtubeCta")}
              </a>
            </p>
          ) : null}
        </div>
      </section>

      <SpeedBar />

      <section aria-labelledby="steps-title">
        <h2
          id="steps-title"
          className="font-display text-3xl font-extrabold tracking-tight text-ink"
        >
          {t("stepsTitle")}
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {(["step1", "step2", "step3"] as const).map((key, i) => (
            <li key={key} className="verso-card-hover p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-verso-green/12 text-xl font-bold text-verso-green ring-1 ring-verso-green/20">
                {i + 1}
              </span>
              <p className="mt-5 text-lg font-medium leading-snug text-ink">
                {t(key)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pricing-title">
        <h2
          id="pricing-title"
          className="font-display text-3xl font-extrabold tracking-tight text-ink"
        >
          {t("pricingTitle")}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {(["tierBasic", "tierRam", "tierFull"] as const).map((key) => (
            <div
              key={key}
              className="verso-card-hover flex flex-col p-7 text-center"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-verso-green/40" />
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                {t(key)}
              </h3>
              <p className="mt-4 text-lg text-fog">—</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title" className="sr-only">
          Benefits
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              "benefitCo2",
              "benefitCost",
              "benefitApps",
              "benefitSupport",
            ] as const
          ).map((key) => (
            <div key={key} className="verso-card p-6 sm:p-7">
              <span className="text-lg text-verso-green/90" aria-hidden>
                ◆
              </span>
              <p className="mt-3 text-lg font-semibold leading-snug text-ink">
                {t(key)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="verso-card border-g bg-g/[0.04] p-8 sm:p-10"
        aria-labelledby="trust-title"
      >
        <h2
          id="trust-title"
          className="font-display text-2xl font-extrabold tracking-tight text-ink"
        >
          {t("trustTitle")}
        </h2>
        <ul className="mt-5 space-y-3 text-lg leading-relaxed text-ink">
          <li className="flex gap-3">
            <span className="text-verso-green" aria-hidden>
              ✓
            </span>
            <span>{t("trustSupport")}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-verso-green" aria-hidden>
              ✓
            </span>
            <span>{t("trustParts")}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-verso-green" aria-hidden>
              ✓
            </span>
            <span>{t("trustDelivery")}</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
