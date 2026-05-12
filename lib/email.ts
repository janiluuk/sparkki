import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendOrderConfirmedEmail(params: {
  to: string;
  orderId: string;
  customerName: string;
}): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "resend_not_configured" };
  }
  const from = process.env.RESEND_FROM ?? "Verso <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Tilaus vahvistettu — Verso",
    html: `<p>Hei ${escapeHtml(params.customerName)},</p><p>Tilauksesi <strong>${escapeHtml(params.orderId)}</strong> on vahvistettu ja maksu vastaanotettu.</p>`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendUsbConfirmedEmail(params: {
  to: string;
  orderId: string;
  customerName: string;
}): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "resend_not_configured" };
  }
  const from = process.env.RESEND_FROM ?? "Verso <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "USB-tilaus vahvistettu — Verso",
    html: `<p>Hei ${escapeHtml(params.customerName)},</p><p>Linux-USB-tilauksesi <strong>${escapeHtml(params.orderId)}</strong> on maksettu. Toimitamme tilauksen osoitteeseesi.</p>`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendOrderDoneEmail(params: {
  to: string;
  orderId: string;
  customerName: string;
}): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "resend_not_configured" };
  }
  const from = process.env.RESEND_FROM ?? "Verso <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Palvelu valmis — Verso",
    html: `<p>Hei ${escapeHtml(params.customerName)},</p><p>Tilauksesi <strong>${escapeHtml(params.orderId)}</strong> on merkitty valmiiksi. Kiitos kun käytit Versoa!</p>`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendB2bQuoteRequestEmail(params: {
  notifyTo: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  estimatedUnits: string | null;
  message: string | null;
  locale: "fi" | "en";
}): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "resend_not_configured" };
  }
  const from = process.env.RESEND_FROM ?? "Verso <onboarding@resend.dev>";
  const subject =
    params.locale === "en"
      ? "New B2B quote request — Verso"
      : "Uusi B2B-tarjouspyyntö — Verso";
  const rows = [
    ["Company", params.companyName],
    ["Contact", params.contactName],
    ["Email", params.email],
    ["Phone", params.phone ?? "—"],
    ["Volume / scope", params.estimatedUnits ?? "—"],
    ["Message", params.message ?? "—"],
    ["Locale", params.locale],
  ] as const;
  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><th style="text-align:left;padding:6px 12px 6px 0;vertical-align:top">${escapeHtml(k)}</th><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const { error } = await resend.emails.send({
    from,
    to: params.notifyTo,
    subject,
    html: `<p>${params.locale === "en" ? "Quote request from the website." : "Tarjouspyyntö verkkosivulta."}</p><table style="border-collapse:collapse">${htmlRows}</table>`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
