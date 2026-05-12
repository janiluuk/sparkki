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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
