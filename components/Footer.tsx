import { getTranslations } from "next-intl/server";
import { FooterNavLinks } from "@/components/FooterNavLinks";

export async function Footer() {
  const t = await getTranslations("footer");
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_URL?.trim();
  const showYoutube = Boolean(youtubeUrl && youtubeUrl !== "#");
  return (
    <footer className="mt-auto border-t border-edge bg-raised text-ink">
      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:px-12 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-12">
          <div className="max-w-md">
            <p className="mb-2 font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-dust">
              {t("brand")}
            </p>
            <p className="font-display text-xl font-bold leading-snug tracking-tight text-ink">
              {t("tagline")}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <FooterNavLinks
              items={[
                { href: "/tuki", label: t("support") },
                { href: "/about", label: t("about") },
                { href: "/tietosuoja", label: t("privacy") },
                { href: "/tilaus", label: t("orderTracking") },
              ]}
            />
            {showYoutube ? (
              <a
                href={youtubeUrl}
                className="min-h-tap rounded-lg px-1 py-2 text-lg font-normal text-fog underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("youtube")}
              </a>
            ) : null}
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "#"}
              className="min-h-tap rounded-lg px-1 py-2 text-lg font-normal text-fog underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("discord")}
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-edge pt-6 text-center font-mono text-sm text-dust">
          © {new Date().getFullYear()} Verso
        </div>
      </div>
    </footer>
  );
}
