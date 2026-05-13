import { NextIntlClientProvider } from "next-intl";
import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { getAdminLocale } from "@/lib/admin/get-admin-locale";
import { getAdminMessages } from "@/lib/admin/get-admin-messages";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getAdminLocale();
  const messages = getAdminMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthSessionProvider>
        <div className="min-h-dvh bg-canvas text-lg text-ink">
          <AdminLocaleSwitcher current={locale} />
          {children}
        </div>
      </AuthSessionProvider>
    </NextIntlClientProvider>
  );
}
