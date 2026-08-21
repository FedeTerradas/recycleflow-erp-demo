// web/src/lib/apiClient.js
import supa from "./supabaseClient";
import { handleMockRequest } from "./mockServer";

export const IS_DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === "true" ||
  !import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_DEMO_MODE !== "false";

/**
 * Normaliza una URL/origen (quita trailing slash y agrega https:// si falta).
 */
function normalizeOrigin(raw) {
  const v = (raw || "").trim();
  if (!v) return "";
  if (v.startsWith("/")) return v.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(v)) return `https://${v}`.replace(/\/+$/, "");
  return v.replace(/\/+$/, "");
}

function buildApiBase() {
  const originRaw = import.meta.env.VITE_API_URL;
  const origin = normalizeOrigin(originRaw) || "http://localhost:4000";
  if (/\/api\/?$/i.test(origin)) return origin.replace(/\/+$/, "");
  return `${origin}/api`;
}

export const API_BASE = buildApiBase();
console.log(`🔧 [API] Modo Demo: ${IS_DEMO_MODE ? "ACTIVADO (Base Local)" : "DESACTIVADO (Backend Real)"}`);

function toJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Normaliza el path.
 */
function normalizePath(path) {
  let p = String(path || "").trim();
  if (!p) return "";
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

/**
 * api(path, opts)
 * - En Demo Mode: atiende directamente con mockServer
 * - En Production Mode: realiza fetch al backend
 */
export async function api(path, opts = {}) {
  const cleanPath = normalizePath(path);

  // Enrutamiento directo al Mock Server en Modo Demo
  if (IS_DEMO_MODE) {
    return handleMockRequest(cleanPath, opts);
  }

  // Modo conectado a backend
  const method = String(opts.method || "GET").toUpperCase();
  const isFormData = opts.body instanceof FormData;

  const {
    data: { session } = {},
  } = await supa.auth.getSession();
  const token = session?.access_token;

  let pathForUrl = cleanPath.replace(/^\/api(?=\/|$)/i, "");
  if (pathForUrl === "/") pathForUrl = "";
  const url = `${API_BASE}${pathForUrl}`;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  let body = opts.body;
  if (!isFormData && body != null && typeof body === "object") {
    body = JSON.stringify(body);
  }

  let resp;
  try {
    resp = await fetch(url, {
      ...opts,
      method,
      headers,
      body,
    });
  } catch (e) {
    console.warn("⚠️ Falló conexión con backend remoto. Redirigiendo a Mock Server...", e.message);
    return handleMockRequest(cleanPath, opts);
  }

  let text = "";
  try {
    text = await resp.text();
  } catch { /* ignore */ }

  const data = text ? toJsonSafe(text) : null;

  if (!resp.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      (text && text.slice(0, 300)) ||
      `HTTP ${resp.status}`;

    throw new Error(`[${method}] ${url} → ${resp.status} ${msg}`);
  }

  return data ?? {};
}

export const apiFetch = api;
export default api;
