import LoginForm from "../components/pages/LoginForm.jsx";
import logo from "../img/logo.svg";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #060d1f 0%, #0b1a38 40%, #102354 100%)',
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3a6fd4, transparent 65%)' }}
        />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Brand side */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6">
          <img
            src={logo}
            alt="Logo RecycleFlow"
            className="w-[260px] h-[260px] xl:w-[320px] xl:h-[320px] object-contain drop-shadow-2xl animate-pulse"
            style={{ animationDuration: '6s' }}
            loading="eager"
          />
          <div className="text-center">
            <h1
              className="text-5xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Recycle<span style={{ color: '#22d3ee' }}>Flow</span>
            </h1>
            <p className="mt-2 text-lg" style={{ color: '#67e8f9' }}>
              Sistema Integral de Gestión & Reciclaje
            </p>
          </div>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-[520px] mx-auto"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(96,165,250,0.15)',
          }}
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <img src={logo} alt="RecycleFlow" className="w-20 h-20 object-contain" />
          </div>

          <h1
            className="text-2xl md:text-3xl font-bold text-center"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--hp-navy-900, #0b1a38)' }}
          >
            Ingresar al sistema
          </h1>
          <p className="text-slate-500 text-center mt-2 mb-6 text-sm">
            Demo interactiva para portfolio
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
