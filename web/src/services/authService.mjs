// web/src/services/authService.mjs
import { supa } from "../lib/supabaseClient";
import api from "../lib/apiClient";

supa.auth.onAuthStateChange((_event, session) => {
  const t = session?.access_token || null;
  if (t) localStorage.setItem("dn_token", t);
  else localStorage.removeItem("dn_token");
});

export async function signIn(email, password) {
  const { data, error } = await supa.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  try {
    const resp = await api("/v1/auth/touch-session", {
      method: "POST",
    });

    const appUser = resp?.usuario || {
      nombre: localStorage.getItem("dn_user_name") || "Administrador Demo",
      rol: localStorage.getItem("dn_role") || "ADMIN",
    };

    if (appUser.rol) localStorage.setItem("dn_role", appUser.rol);
    if (appUser.nombre) localStorage.setItem("dn_user_name", appUser.nombre);

    return {
      user: data.user,
      appUser,
    };
  } catch (e) {
    console.warn("[authService] touch-session fallback:", e.message);
    return {
      user: data.user,
      appUser: {
        nombre: localStorage.getItem("dn_user_name") || "Administrador Demo",
        rol: localStorage.getItem("dn_role") || "ADMIN",
      },
    };
  }
}

export async function signOut() {
  try {
    await api("/v1/auth/logout-audit", { method: "POST" });
  } catch (e) {
    console.warn("[authService] Auditoría de logout:", e.message);
  }

  try {
    await supa.auth.signOut();
  } finally {
    localStorage.removeItem("dn_token");
    localStorage.removeItem("dn_user");
    localStorage.removeItem("dn_refresh");
    localStorage.removeItem("dn_user_name");
    localStorage.removeItem("dn_role");
    localStorage.removeItem("dn_sidebar_reportes");
    localStorage.removeItem("dn_sidebar_security");
    localStorage.removeItem("dn_sidebar_stock");
    localStorage.removeItem("dn_sidebar_ventas");
    sessionStorage.clear();
  }
}
