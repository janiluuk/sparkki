"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { dispatchBackgroundNavInteraction } from "@/lib/site/background-nav";

const NAV = [
  { href: "/tietoa", key: "navHub" },
  { href: "/tietoa/hyodyt", key: "navBenefits" },
  { href: "/tietoa/galleria", key: "navGallery" },
  { href: "/tietoa/linux", key: "navLinux" },
  { href: "/tietoa/vakaus", key: "navStability" },
  { href: "/tietoa/huolia", key: "navConcerns" },
  { href: "/tietoa/sovellukset/windows", key: "navAppsWin" },
  { href: "/tietoa/sovellukset/mac", key: "navAppsMac" },
] as const;

function navItemActive(pathname: string | null, href: string) {
  if (href === "/tietoa") return pathname === "/tietoa";
  return pathname === href || pathname?.startsWith(`${href}/`) === true;
}

function tabClass(active: boolean) {
  return `min-h-tap shrink-0 rounded-t-lg border-b-2 px-4 py-3 text-sm font-normal transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g ${
    active
      ? "border-g text-g"
      : "border-transparent text-fog hover:border-edge hover:text-ink"
  }`;
}

function sidebarLinkClass(active: boolean) {
  return `block min-h-tap rounded-r-lg border-l-2 py-2.5 pl-4 pr-3 text-sm font-semibold leading-snug transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g ${
    active
      ? "border-g bg-g/[0.07] text-g"
      : "border-transparent text-fog hover:border-edge hover:bg-sunken/80 hover:text-ink"
  }`;
}

function HubNavLinks({
  className,
  linkClass,
}: {
  className?: string;
  linkClass: (active: boolean) => string;
}) {
  const pathname = usePathname();
  const t = useTranslations("tietoa");
  const onNavClick = () => dispatchBackgroundNavInteraction();

  return (
    <ul className={className}>
      {NAV.map(({ href, key }) => {
        const active = navItemActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavClick}
              className={linkClass(active)}
              aria-current={active ? "page" : undefined}
            >
              {t(key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function InfoHubLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("tietoa");

  return (
    <div className="flex min-h-[560px] flex-col lg:grid lg:min-h-[min(70vh,720px)] lg:grid-cols-[minmax(200px,220px)_minmax(0,1fr)] lg:gap-0">
      {/* Small / medium: horizontal tabs (thumb-friendly scroll) */}
      <nav
        aria-label={t("sidebarAria")}
        className="flex flex-nowrap gap-1 overflow-x-auto overscroll-x-contain border-b border-edge bg-raised/70 px-4 pt-1 backdrop-blur-lg touch-pan-x [-webkit-overflow-scrolling:touch] sm:px-6 lg:hidden"
      >
        <HubNavLinks
          className="flex min-w-min flex-nowrap gap-1"
          linkClass={(active) => tabClass(active)}
        />
      </nav>

      {/* Large: sticky section sidebar */}
      <aside className="relative hidden border-edge bg-sunken/25 lg:block lg:border-r lg:bg-raised/30">
        <nav
          aria-label={t("sidebarAria")}
          className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-0.5 overflow-y-auto overscroll-y-contain py-6 pl-4 pr-3 md:top-28 md:max-h-[calc(100dvh-8rem)]"
        >
          <HubNavLinks
            className="space-y-0.5"
            linkClass={(active) => sidebarLinkClass(active)}
          />
        </nav>
      </aside>

      <div className="min-w-0 flex-1 px-6 py-8 md:px-9 md:py-8">{children}</div>
    </div>
  );
}
