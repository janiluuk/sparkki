import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Staging-only CSP (report-only). Next.js still needs 'unsafe-inline' / 'unsafe-eval'
 * without nonces; third-party checkout/embeds are allowlisted. See docs/operations.md.
 * Set ENABLE_CSP_REPORT_ONLY=true to emit Content-Security-Policy-Report-Only.
 */
function cspReportOnlyHeaderValue() {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://r.stripe.com https://m.stripe.network https://*.stripe.com https://www.youtube.com https://i.ytimg.com https://plausible.io https://discord.com https://discordapp.com https://*.discordapp.com https://calendly.com https://*.calendly.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://www.youtube-nocookie.com https://calendly.com https://*.calendly.com https://discord.com https://discordapp.com https://widgetsent.io",
    "worker-src 'self' blob:",
    "form-action 'self' https://checkout.stripe.com",
  ].join("; ");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  /** DESIGN_SYSTEM.md — public URLs `/meista` match Vire IA while pages stay under existing segments */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:locale/meista/yhteiso",
          destination: "/:locale/yhteiso",
        },
        { source: "/:locale/meista", destination: "/:locale/about" },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/admin/ai-tools",
        destination: "/admin/ai-testing",
        permanent: false,
      },
    ];
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ];
    if (process.env.ENABLE_HSTS === "true") {
      security.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }
    if (process.env.ENABLE_CSP_REPORT_ONLY === "true") {
      security.push({
        key: "Content-Security-Policy-Report-Only",
        value: cspReportOnlyHeaderValue(),
      });
    }
    return [
      {
        source: "/:path*",
        headers: security,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
