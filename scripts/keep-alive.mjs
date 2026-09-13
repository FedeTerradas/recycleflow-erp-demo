/**
 * Supabase Keep-Alive Script - Recycling Management (Demo Don Nildo)
 *
 * Mantiene activa la base de datos de Supabase realizando una consulta mínima
 * a la tabla 'profiles' vía PostgREST.
 *
 * Uso:
 *   node scripts/keep-alive.mjs
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bxdawszhsyoaobgcfuva.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_IujNdFxTmPcCruq0N3QnpA_Dr5O2T2U';

async function pingSupabase() {
  const cleanUrl = SUPABASE_URL.replace(/\/+$/, '');
  const targetUrl = `${cleanUrl}/rest/v1/profiles?select=id&limit=1`;

  console.log(`[Keep-Alive] 🚀 Iniciando ping a Supabase (Recycling Management)...`);
  console.log(`[Keep-Alive] 🌐 URL: ${cleanUrl}`);
  console.log(`[Keep-Alive] 🕒 Timestamp: ${new Date().toISOString()}`);

  const startTime = Date.now();

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'RecyclingManagement-KeepAlive/1.0',
      },
      signal: AbortSignal.timeout(15000),
    });

    const latency = Date.now() - startTime;

    if (response.ok) {
      console.log(`[Keep-Alive] ✅ Ping exitoso a profiles! (${latency}ms)`);
      console.log(`[Keep-Alive] 🟢 Base de datos activa.`);
      process.exitCode = 0;
    } else {
      console.error(`[Keep-Alive] ❌ Supabase devolvió status ${response.status} (${latency}ms)`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(`[Keep-Alive] ❌ Error de conexión:`, err.message);
    process.exitCode = 1;
  }
}

pingSupabase();
