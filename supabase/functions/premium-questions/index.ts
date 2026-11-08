// Protected question API: no public content, JWT + paid membership checked per request.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const siteOrigin = (Deno.env.get("PUBLIC_SITE_URL") || "https://pilot.petrranda.cz").replace(/\/$/, "");
const allowedOrigins = new Set([siteOrigin]);
const MAX_BODY_BYTES = 1024;
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Vary": "Origin" };
function headers(origin: string | null) {
  const h: Record<string, string> = { ...JSON_HEADERS };
  if (origin && allowedOrigins.has(origin)) h["Access-Control-Allow-Origin"] = origin;
  h["Access-Control-Allow-Headers"] = "authorization, apikey, content-type";
  h["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  return h;
}
function reply(status: number, value: unknown, origin: string | null) {
  return new Response(JSON.stringify(value), { status, headers: headers(origin) });
}
serve(async (req) => {
  const origin = req.headers.get("Origin");
  // Native iOS/Android clients may omit Origin, but still must send a verified JWT.
  if (origin !== null && !allowedOrigins.has(origin)) return reply(403, { error: "Origin not allowed" }, null);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(origin) });
  if (req.method !== "POST") return reply(405, { error: "Method not allowed" }, origin);
  if (!(req.headers.get("Content-Type") || "").toLowerCase().startsWith("application/json")) return reply(415, { error: "JSON required" }, origin);
  const authorization = req.headers.get("Authorization") || "";
  if (!/^Bearer [A-Za-z0-9._~-]+$/.test(authorization)) return reply(401, { error: "Authentication required" }, origin);
  const base = Deno.env.get("SUPABASE_URL");
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!base || !secret) return reply(503, { error: "Service not configured" }, origin);
  const admin = createClient(base, secret, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { user }, error: authErr } = await admin.auth.getUser(authorization.slice(7));
  if (authErr || !user?.id || user.is_anonymous === true) return reply(401, { error: "Invalid session" }, origin);
  const now = new Date().toISOString();
  const { data: membership, error: memberErr } = await admin.from("memberships")
    .select("id").eq("user_id", user.id).eq("status", "active")
    .lte("starts_at", now).gt("ends_at", now).limit(1);
  if (memberErr) return reply(503, { error: "Membership check unavailable" }, origin);
  if (!membership?.length) return reply(403, { error: "Active membership required" }, origin);
  const length = Number(req.headers.get("Content-Length") || "0");
  if (length > MAX_BODY_BYTES) return reply(413, { error: "Request too large" }, origin);
  let input: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return reply(413, { error: "Request too large" }, origin);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw Error("Invalid JSON");
    input = parsed as Record<string, unknown>;
  } catch {
    return reply(400, { error: "Invalid JSON" }, origin);
  }
  const { action, module, id, answer } = input;
  if (typeof module !== "string" || !/^[a-z0-9_-]{1,48}$/.test(module)) return reply(400, { error: "Invalid module" }, origin);
  if (action === "question") {
    const { data, error } = await admin.from("premium_questions")
      .select("id,module_key,question_body,options")
      .eq("module_key", module).order("created_at", { ascending: true }).limit(50);
    if (error) return reply(503, { error: "Content unavailable" }, origin);
    return reply(200, { questions: data || [] }, origin);
  }
  if (action === "answer") {
    if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      || typeof answer !== "string" || answer.length > 500) return reply(400, { error: "Invalid answer" }, origin);
    const { data, error } = await admin.from("premium_questions")
      .select("correct_answer,explanation").eq("id", id).eq("module_key", module).maybeSingle();
    if (error) return reply(503, { error: "Content unavailable" }, origin);
    if (!data) return reply(404, { error: "Question not found" }, origin);
    return reply(200, { correct: answer === data.correct_answer, correctAnswer: data.correct_answer, explanation: data.explanation }, origin);
  }
  return reply(400, { error: "Unsupported action" }, origin);
});
