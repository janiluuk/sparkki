"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { dispatchBackgroundNavInteraction } from "@/lib/background-nav";

const links = [
  { href: "/", key: "home" as const },
  { href: "/palvelu", key: "service" as const },
  { href: "/itse", key: "diy" as const },
  { href: "/sovellukset", key: "apps" as const },
  { href: "/tuki", key: "support" as const },
  { href: "/info", key: "info" as const },
  { href: "/about", key: "about" as const },
  { href: "/yhteiso", key: "community" as const },
];

function BrandMark({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower === "verso") {
    return (
      <span className="font-display text-2xl font-extrabold tracking-tight">
        <span className="text-g">Ver</span>
        <span className="text-ink">so</span>
      </span>
    );
  }
  return (
    <span className="font-display text-2xl font-extrabold tracking-tight text-g">
      {name}
    </span>
  );
}

export function NavBar({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onNavClick = () => dispatchBackgroundNavInteraction();

  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-[rgba(8,12,10,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-12 sm:py-5">
        <Link
          href="/"
          onClick={onNavClick}
          className="flex min-h-tap items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g"
        >
          <BrandMark name={t("brand")} />
        </Link>
        <nav
          aria-label={t("mainNav")}
          className="flex flex-wrap gap-1 sm:gap-2"
        >
          {links.map(({ href, key }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={key}
                href={href}
                onClick={onNavClick}
                className={`min-h-tap rounded-lg px-3 py-2 text-sm font-normal transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g ${
                  active
                    ? "text-g"
                    : "text-fog hover:bg-g/[0.06] hover:text-ink"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex gap-1 rounded-lg border border-em bg-sunken/80 p-1">
          <Link
            href={pathname}
            locale="fi"
            onClick={onNavClick}
            className={`min-h-tap rounded-md px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g ${
              locale === "fi"
                ? "bg-g text-canvas"
                : "text-fog hover:text-ink"
            }`}
            hrefLang="fi"
          >
            FI
          </Link>
          <Link
            href={pathname}
            locale="en"
            onClick={onNavClick}
            className={`min-h-tap rounded-md px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g ${
              locale === "en"
                ? "bg-g text-canvas"
                : "text-fog hover:text-ink"
            }`}
            hrefLang="en"
          >
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
