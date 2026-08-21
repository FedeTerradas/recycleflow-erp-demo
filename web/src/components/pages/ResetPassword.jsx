import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supa from "../../lib/supabaseClient";
import logo from "../../img/logo.svg";

function hashParams() {
  const raw = (window.location.hash || "").replace(/^#/, "");
  return new URLSearchParams(raw);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("checking");
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        // 0) Errores que vuelven en el hash (ej otp_expired)
        const hp = hashParams();
        const errCode = hp.get("error_code");
        const errDesc = hp.get("error_description");
        if (errCode) {
          throw new Error(
            decodeURIComponent(errDesc || "") ||
              `Link inválido (${errCode}).`
          );
        }

        // 1) PKCE flow (code)
        if (code) {
          const { error } = await supa.auth.exchangeCodeForSession(code);
          if (error) throw error;
          window.history.replaceState({}, "", url.pathname);
          setStage("ready");
          return;
        }

        // 2) OTP flow (token_hash/type)
        const tokenHash = url.searchParams.get("token_hash") || url.searchParams.get("token");
        const type = url.searchParams.get("type");
        if (tokenHash && type) {
          const { error } = await supa.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });
          if (error) throw error;
          window.history.replaceState({}, "", url.pathname);
          setStage("ready");
          return;
        }

        // 3) Implicit hash access_token
        const accessToken = hp.get("access_token");
        const refreshToken = hp.get("refresh_token");
        if (accessToken) {
          window.history.replaceState({}, "", url.pathname);
          setStage("ready");
          return;
        }

        // 4) Check direct session
        const { data } = await supa.auth.getSession();
        if (data?.session) {
          setStage("ready");
          return;
        }

        setStage("ready");
      } catch (err) {
        setError(err.message || "Error validando enlace.");
        setStage("error");
      }
    };
    run();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      setError(null);
      await supa.auth.updateUser({ password });
      setStage("done");
      setTimeout(() => navigate("/login?reset=ok"), 1500);
    } catch (err) {
      setError(err.message || "Error al cambiar contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #060d1f 0%, #0b1a38 40%, #102354 100%)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
        <div className="mb-6 select-none flex flex-col items-center">
          <img src={logo} alt="RecycleFlow" className="w-16 h-16 object-contain mb-3" />
          <div className="text-2xl font-extrabold text-[#0b1a38]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Recycle<span className="text-[#22d3ee]">Flow</span>
          </div>
          <p className="mt-1 text-slate-500 text-sm">
            Establecé / restablecé tu contraseña
          </p>
        </div>

        {stage === "checking" ? (
          <p className="text-sm text-slate-500">Validando enlace…</p>
        ) : stage === "done" ? (
          <p className="text-[#06b6d4] text-sm">
            ¡Contraseña actualizada! Redirigiendo al inicio de sesión…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <label className="text-left text-sm text-[#0b1a38] font-medium mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <label className="text-left text-sm text-[#0b1a38] font-medium mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a6e]"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
            />

            <button
              type="submit"
              className="bg-[#0b1a38] text-white font-semibold py-2 rounded-md transition w-full hover:bg-[#1e3a6e]"
            >
              Guardar nueva contraseña
            </button>

            <div className="mt-4 text-right text-sm">
              <Link to="/login" className="text-[#1e3a6e] hover:underline">
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
