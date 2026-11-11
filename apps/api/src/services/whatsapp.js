import { normalizePhone } from '../lib/utils.js';

// POST {URL_BASE}/message/sendText/{INSTANCIA} — header apikey
export async function sendWhatsApp(number, text) {
  const { WHATSAPP_URL_BASE: base, WHATSAPP_INSTANCE: inst, WHATSAPP_API_KEY: key } = process.env;
  const to = normalizePhone(number);
  if (!base || !inst || !key) {
    console.log(`[WhatsApp DEV] -> ${to}: ${text}`);
    return true;
  }
  const res = await fetch(`${base}/message/sendText/${inst}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key },
    body: JSON.stringify({ number: to, text }),
  });
  if (!res.ok) throw new Error(`WhatsApp API respondeu ${res.status}`);
  return true;
}
