// web/src/components/pages/LoginForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../../services/authService";
import { Sparkles, Shield, ShoppingCart, TrendingUp, Scale } from "lucide-react";

export default function LoginForm() {
  const [mail, setMail] = useState(
    () => localStorage.getItem("dn_mail_recordado") || "admin@gmail.com"
  );
  const [password, setPassword] = useState("admin1234");
  const [rememberMe, setRememberMe] = useState(
    () => Boolean(localStorage.getItem("dn_mail_recordado"))
  );
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginWithCredentials = async (emailToUse, passToUse) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { appUser } = await signIn(emailToUse, passToUse);

      if (appUser?.rol) {
        localStorage.setItem("dn_role", appUser.rol);
      }
      if (appUser?.nombre) {
        localStorage.setItem("dn_user_name", appUser.nombre);
      }

      if (rememberMe) {
        localStorage.setItem("dn_mail_recordado", emailToUse);
      } else {
        localStorage.removeItem("dn_mail_recordado");
      }

      setSuccess("Inicio de sesión exitoso.");
      navigate("/");
    } catch (err) {
      if (err?.status === 403 && err?.message) {
        setError(err.message);
      } else {
        setError("Usuario o contraseña inválidos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLoginWithCredentials(mail, password);
  };

  const handleQuickDemoLogin = async (demoEmail, demoPass) => {
    setMail(demoEmail);
    setPassword(demoPass);
    await handleLoginWithCredentials(demoEmail, demoPass);
  };

  return (
    <div className="w-full flex flex-col">
      {/* ── Demo Quick Login Bar for Portfolio Reviewers ── */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/70 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-cyan-900 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Acceso Rápido para Portfolio / Reviewers</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin("admin@gmail.com", "admin1234")}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-cyan-500 hover:text-cyan-700 hover:shadow-sm transition-all text-left"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">👑 Admin</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin("compras@demo.com", "compras123")}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-cyan-500 hover:text-cyan-700 hover:shadow-sm transition-all text-left"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">🛒 Compras</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin("ventas@demo.com", "ventas123")}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-cyan-500 hover:text-cyan-700 hover:shadow-sm transition-all text-left"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">📈 Ventas</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickDemoLogin("operador@demo.com", "operador123")}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-cyan-500 hover:text-cyan-700 hover:shadow-sm transition-all text-left"
          >
            <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">⚖️ Operario Stock</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-xs font-medium text-slate-400 absolute">o ingresar manualmente</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        {/* USUARIO */}
        <label className="text-left text-sm text-[#0b1a38] font-medium mb-1">
          Usuario
        </label>
        <input
          type="email"
          placeholder="ej: admin@gmail.com"
          autoComplete="email"
          className="w-full px-3 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] text-sm"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />

        {/* CONTRASEÑA */}
        <label className="text-left text-sm text-[#0b1a38] font-medium mb-1">
          Contraseña
        </label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a6e] pr-10 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.7 10.7a3 3 0 104.6 4.6M6.7 6.7C4.9 7.9 3.6 9.9 3 12c1.6 4 5.4 7 9 7 1.5 0 3-.4 4.3-1.1M12 5c3.6 0 7.4 3 9 7-.6 1.5-1.5 2.9-2.7 4"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.04 12.32c2.34-5.44 6.02-8.32 9.96-8.32 3.94 0 7.61 2.88 9.96 8.32-2.35 5.44-6.02 8.32-9.96 8.32-3.94 0-7.61-2.88-9.96-8.32z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <label className="flex items-center gap-1 text-gray-600 cursor-pointer text-xs">
            <input
              type="checkbox"
              className="accent-[#1e3a6e] rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Recordarme
          </label>

          <Link to="/forgot" className="text-xs text-[#1e3a6e] hover:underline">
            Olvidé mi contraseña
          </Link>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>}
        {success && <p className="text-emerald-600 text-sm mb-4 font-medium">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-[#0b1a38] text-white font-semibold py-2.5 rounded-xl transition w-full shadow-md shadow-slate-900/10 ${
            loading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#1e3a6e]"
          }`}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
