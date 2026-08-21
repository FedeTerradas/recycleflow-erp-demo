import { cn } from "../../lib/utils";

export default function HamburgerButton({ onClick, className = "", label = "Menú" }) {
  return (
    <button
      type="button" 
      onClick={onClick} 
      aria-label={label} 
      title={label}
      className={cn(
        "group relative inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 shrink-0",
        "bg-white/90 hover:bg-white border border-[var(--hp-slate-200)] hover:border-[var(--hp-cyan-300)] shadow-xs hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]",
        className
      )}
    >
      <span className="relative flex flex-col items-center justify-center w-3.5 h-3 overflow-hidden">
        <span className="w-full h-[1.5px] bg-[var(--hp-navy-700)] rounded transition-all duration-300 origin-center group-hover:w-3 group-hover:-translate-y-0.5" />
        <span className="w-full h-[1.5px] bg-[var(--hp-navy-700)] rounded transition-all duration-300 mt-0.5 origin-center" />
        <span className="w-full h-[1.5px] bg-[var(--hp-navy-700)] rounded transition-all duration-300 mt-0.5 origin-center group-hover:w-3 group-hover:translate-y-0.5" />
      </span>
    </button>
  );
}
