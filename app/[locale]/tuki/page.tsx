import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localePathAlternates } from "@/lib/seo";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "tuki" });
  return {
    title: t("title"),
    description: t("intro"),
    ...localePathAlternates(locale, "/tuki"),
    openGraph: {
      title: t("title"),
      description: t("intro"),
      type: "website",
      locale: locale === "fi" ? "fi_FI" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("intro"),
    },
  };
}

export default async function TukiPage() {
  const t = await getTranslations("tuki");
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <h1 className="text-4xl font-bold text-ink">{t("title")}</h1>
      <p className="text-xl text-ink">{t("intro")}</p>
      <section aria-labelledby="contact-title">
        <h2 id="contact-title" className="text-2xl font-bold text-ink">
          {t("contactTitle")}
        </h2>
        <p className="mt-2 text-lg font-medium text-ink">{t("phone")}</p>
        <p className="mt-1 text-2xl font-semibold text-verso-green">
          {t("phoneValue")}
        </p>
        <p className="mt-4 text-lg font-medium text-ink">{t("email")}</p>
        <p className="mt-1 text-lg text-ink">{t("emailValue")}</p>
        <p className="mt-2 text-lg text-ink">{t("hours")}</p>
      </section>
    </div>
  );
}
