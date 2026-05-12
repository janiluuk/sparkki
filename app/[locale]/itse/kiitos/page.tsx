import { getTranslations } from "next-intl/server";
import { thankYouFromSession } from "@/lib/checkout-thanks";

type Props = {
  searchParams: { session_id?: string };
};

export default async function ItseKiitosPage({ searchParams }: Props) {
  const t = await getTranslations("itse.thanks");
  const info = await thankYouFromSession(searchParams.session_id);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-16 text-center">
      {info.ok && info.kind === "usb" ? (
        <>
          <h1 className="text-4xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-xl text-gray-900">{t("usbBody")}</p>
          <p className="rounded-xl bg-white p-4 text-lg text-gray-900 shadow ring-1 ring-gray-200">
            {t("orderRef")}: <span className="font-mono">{info.orderId}</span>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-gray-900">{t("genericTitle")}</h1>
          <p className="text-lg text-gray-900">{t("genericBody")}</p>
        </>
      )}
    </div>
  );
}
