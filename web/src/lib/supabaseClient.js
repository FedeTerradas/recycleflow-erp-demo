// web/src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import mockDb from "./mockDb";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Listeners registrados para cambios de sesión en modo demo
const authListeners = new Set();

function emitAuthStateChange(event, session) {
  authListeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (e) {
      console.warn("[MockSupabase] Error en listener:", e);
    }
  });
}

function getDemoSession() {
  const token = localStorage.getItem("dn_token");
  const email = localStorage.getItem("dn_user") || "admin@gmail.com";
  const name = localStorage.getItem("dn_user_name") || "Administrador Demo";
  const role = localStorage.getItem("dn_role") || "ADMIN";

  if (!token) return null;

  return {
    access_token: token,
    token_type: "bearer",
    user: {
      id: "demo-user-uuid-12345",
      email: email,
      user_metadata: { nombre: name, rol: role },
    },
  };
}

// Cliente Mock cuando no hay Supabase configurado o en Modo Demo
const mockSupabase = {
  auth: {
    async getSession() {
      const session = getDemoSession();
      return { data: { session }, error: null };
    },
    async signInWithPassword({ email, password }) {
      const targetUser = mockDb.data.usuarios.find(
        (u) => u.mail?.toLowerCase() === email?.trim().toLowerCase()
      ) || {
        id_usuario: 1,
        nombre: "Administrador Demo",
        mail: email || "admin@gmail.com",
        rol_nombre: "ADMIN",
      };

      const token = `demo_jwt_token_${Date.now()}`;
      localStorage.setItem("dn_token", token);
      localStorage.setItem("dn_user", targetUser.mail);
      localStorage.setItem("dn_user_name", targetUser.nombre);
      localStorage.setItem("dn_role", targetUser.rol_nombre || "ADMIN");

      const session = getDemoSession();
      emitAuthStateChange("SIGNED_IN", session);

      return {
        data: {
          user: session.user,
          session,
        },
        error: null,
      };
    },
    async signOut() {
      emitAuthStateChange("SIGNED_OUT", null);
      return { error: null };
    },
    onAuthStateChange(callback) {
      authListeners.add(callback);
      // Notificar estado actual inmediatamente
      const session = getDemoSession();
      callback(session ? "INITIAL_SESSION" : "SIGNED_OUT", session);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            },
          },
        },
      };
    },
    async updateUser({ password }) {
      mockDb.addAudit("SEGURIDAD", "PASSWORD", "Contraseña de usuario demo actualizada.");
      return { data: { user: getDemoSession()?.user }, error: null };
    },
    async exchangeCodeForSession(code) {
      const session = getDemoSession();
      return { data: { session }, error: null };
    },
    async verifyOtp(params) {
      const session = getDemoSession();
      return { data: { session }, error: null };
    },
  },
  from(tableName) {
    let selectedData = [];
    if (tableName === "roles") {
      selectedData = [...mockDb.data.roles];
    } else if (tableName === "usuarios") {
      selectedData = [...mockDb.data.usuarios];
    } else {
      selectedData = mockDb.data[tableName] || [];
    }

    let currentAction = "select";
    let updatePayload = null;
    let filterEq = null;

    const builder = {
      select(fields = "*") {
        currentAction = "select";
        return builder;
      },
      update(payload) {
        currentAction = "update";
        updatePayload = payload;
        return builder;
      },
      eq(column, value) {
        filterEq = { column, value };
        if (currentAction === "update" && updatePayload) {
          if (tableName === "usuarios") {
            const usr = mockDb.data.usuarios.find(
              (u) => u[column] === value || u.id_usuario === Number(value)
            );
            if (usr) {
              Object.assign(usr, updatePayload);
              if (updatePayload.id_rol !== undefined) {
                const r = mockDb.data.roles.find((x) => x.id_rol === Number(updatePayload.id_rol));
                usr.rol_nombre = r?.nombre || null;
              }
              mockDb.saveData();
            }
          }
        }
        return builder;
      },
      then(resolve) {
        if (currentAction === "select") {
          return Promise.resolve({ data: selectedData, error: null }).then(resolve);
        }
        return Promise.resolve({ data: selectedData, error: null }).then(resolve);
      },
    };

    return builder;
  },
};

let supaClient;
if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
  try {
    supaClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e) {
    console.warn("⚠️ Inicialización de Supabase falló, usando Mock Supabase:", e);
    supaClient = mockSupabase;
  }
} else {
  supaClient = mockSupabase;
}

export const supa = supaClient;
export default supa;