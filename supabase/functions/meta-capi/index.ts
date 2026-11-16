// Edge Function: envia eventos do site para a API de Conversões da Meta (server-side).
// Secrets (supabase secrets set): META_ACCESS_TOKEN, META_PIXEL_ID, META_TEST_EVENT_CODE (opcional)
const GRAPH_VERSION = "v21.0";
const ALLOWED_EVENTS = new Set(["Lead", "ViewContent", "Contact", "CompleteRegistration"]);
const ALLOWED_ORIGINS = [
  "https://vanessa-santana-palestra.vercel.app",
];

const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});

async function sha256(value: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();
// Telefone: só dígitos; assume Brasil (55) se vier sem DDI
function normPhone(v: unknown) {
  let d = String(v ?? "").replace(/\D/g, "");
  if (d.length === 10 || d.length === 11) d = "55" + d;
  return d;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = { ...cors(origin), "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers });

  const token = Deno.env.get("META_ACCESS_TOKEN");
  const pixelId = Deno.env.get("META_PIXEL_ID");
  if (!token || !pixelId) return new Response(JSON.stringify({ error: "not_configured" }), { status: 500, headers });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers }); }

  const eventName = String(body.event_name ?? "Lead");
  if (!ALLOWED_EVENTS.has(eventName)) return new Response(JSON.stringify({ error: "event_not_allowed" }), { status: 400, headers });

  const user_data: Record<string, unknown> = {
    client_user_agent: req.headers.get("user-agent") ?? undefined,
    client_ip_address: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || undefined,
    fbp: body.fbp || undefined,
    fbc: body.fbc || undefined,
  };
  if (body.email) user_data.em = [await sha256(norm(body.email))];
  const phone = normPhone(body.whatsapp);
  if (phone) user_data.ph = [await sha256(phone)];
  const first = norm(String(body.nome ?? "").split(/\s+/)[0]);
  if (first) user_data.fn = [await sha256(first)];
  user_data.country = [await sha256("br")];

  const payload: Record<string, unknown> = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id || crypto.randomUUID(), // mesmo id do Pixel => deduplicação
      event_source_url: String(body.page_url ?? origin ?? "").slice(0, 500),
      action_source: "website",
      user_data,
      custom_data: { content_name: "execucao-penal" },
    }],
  };
  const testCode = Deno.env.get("META_TEST_EVENT_CODE");
  if (testCode) payload.test_event_code = testCode;

  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) console.error("meta_capi_error", JSON.stringify(out));
  return new Response(JSON.stringify({ ok: res.ok, meta: out }), { status: res.ok ? 200 : 502, headers });
});
