import { useCallback, useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Percent, RefreshCw, Save, Search, DollarSign, Tag } from "lucide-react";
import api from "../lib/apiClient";

const MONEDA_LABEL = { ARS: "$", USD: "U$D" };

/* ─── helpers ─── */
const fmt = (n, moneda = "ARS") => {
  const sym = MONEDA_LABEL[moneda] ?? "$";
  return `${sym} ${Number(n ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function StockPrecios() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Filtros */
  const [buscar, setBuscar] = useState("");
  const [filtrMoneda, setFiltrMoneda] = useState("TODOS");
  const [filtrTipo, setFiltrTipo] = useState("TODOS");

  /* Edición inline */
  const [editados, setEditados] = useState({}); // { id_producto: { precio, moneda } }

  /* Selección para porcentaje */
  const [seleccionados, setSeleccionados] = useState(new Set());
  const [pct, setPct] = useState("");
  const [modoSeleccion, setModoSeleccion] = useState(false);

  /* Panel de porcentaje */
  const [pctPanel, setPctPanel] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api("/api/stock/precios");
      setProductos(data.productos ?? []);
      setEditados({});
      setSeleccionados(new Set());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ─── listado filtrado ─── */
  const tipos = useMemo(() => {
    const t = new Set(productos.map(p => p.tipo).filter(Boolean));
    return ["TODOS", ...Array.from(t).sort()];
  }, [productos]);

  const filtrados = useMemo(() => {
    const txt = buscar.toLowerCase();
    return productos.filter(p => {
      if (txt && !p.referencia.toLowerCase().includes(txt)) return false;
      if (filtrMoneda !== "TODOS" && p.moneda !== filtrMoneda) return false;
      if (filtrTipo !== "TODOS" && p.tipo !== filtrTipo) return false;
      return true;
    });
  }, [productos, buscar, filtrMoneda, filtrTipo]);

  /* ─── edición inline ─── */
  const getPrecio = (p) =>
    editados[p.id_producto]?.precio ?? String(p.precio ?? "");
  const getMoneda = (p) =>
    editados[p.id_producto]?.moneda ?? p.moneda ?? "ARS";

  const setField = (id, field, value) =>
    setEditados(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? {}), [field]: value },
    }));

  const hayEdiciones = Object.keys(editados).length > 0;

  /* ─── selección para porcentaje ─── */
  const toggleSel = (id) => {
    setSeleccionados(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleTodos = () => {
    if (seleccionados.size === filtrados.length) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(filtrados.map(p => p.id_producto)));
    }
  };

  /* ─── aplicar porcentaje localmente (preview) ─── */
  const aplicarPctPreview = () => {
    const pctNum = Number(pct);
    if (isNaN(pctNum) || pct === "") return;
    const factor = 1 + pctNum / 100;
    const idsBase = seleccionados.size > 0 ? seleccionados : new Set(filtrados.map(p => p.id_producto));

    setEditados(prev => {
      const next = { ...prev };
      filtrados.forEach(p => {
        if (!idsBase.has(p.id_producto)) return;
        const precioActual = Number(prev[p.id_producto]?.precio ?? p.precio ?? 0);
        next[p.id_producto] = {
          ...(next[p.id_producto] ?? {}),
          precio: (precioActual * factor).toFixed(2),
          moneda: prev[p.id_producto]?.moneda ?? p.moneda,
        };
      });
      return next;
    });
    setPctPanel(false);
    setPct("");
  };

  /* ─── guardar ─── */
  const guardar = async () => {
    if (!hayEdiciones) return;
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const items = Object.entries(editados).map(([id, vals]) => ({
        id_producto: Number(id),
        precio: Number(vals.precio),
        moneda: vals.moneda,
      }));

      await api("/api/stock/precios/bulk", {
        method: "PATCH",
        body: { modo: "individual", items },
      });

      setSuccess(`✅ ${items.length} precio${items.length !== 1 ? "s" : ""} actualizados correctamente.`);
      await load();
    } catch (e) {
      setError(`❌ ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  /* ─── render ─── */
  return (
    <div className="min-h-[80vh] flex flex-col gap-6 pb-10">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--hp-navy-900)] flex items-center gap-2">
            <Tag className="w-6 h-6 text-[var(--hp-cyan-500)]" />
            Gestión de Precios
          </h1>
          <p className="text-sm text-[var(--hp-slate-500)] mt-1">
            Editá precios unitarios de forma individual o aplicá un ajuste porcentual a todos o a los seleccionados.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--hp-slate-200)] text-[var(--hp-slate-600)] hover:bg-[var(--hp-slate-50)] text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Recargar
          </button>

          <button
            onClick={() => { setPctPanel(v => !v); setModoSeleccion(v => !v); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${
              modoSeleccion
                ? "bg-[var(--hp-cyan-500)] text-white border-[var(--hp-cyan-500)]"
                : "border-[var(--hp-slate-200)] text-[var(--hp-slate-600)] hover:bg-[var(--hp-slate-50)]"
            }`}
          >
            <Percent className="w-4 h-4" /> Ajuste %
          </button>

          <button
            onClick={guardar}
            disabled={!hayEdiciones || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--hp-navy-700)] text-white text-sm font-semibold disabled:opacity-40 hover:bg-[var(--hp-navy-900)] transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Guardando…" : `Guardar${hayEdiciones ? ` (${Object.keys(editados).length})` : ""}`}
          </button>
        </div>
      </div>

      {/* Banner de ajuste por porcentaje */}
      {pctPanel && (
        <div className="bg-[var(--hp-cyan-50)] border border-[var(--hp-cyan-200)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2 text-[var(--hp-navy-800)] font-semibold text-sm">
            <Percent className="w-5 h-5 text-[var(--hp-cyan-500)]" />
            Ajuste porcentual
          </div>
          <p className="text-xs text-[var(--hp-slate-500)] flex-1">
            Ingresá el % de variación (ej: <strong>10</strong> para +10%, <strong>-5</strong> para -5%).
            Si no hay productos seleccionados, se aplica a todos los del listado actual.
          </p>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="number"
                value={pct}
                onChange={e => setPct(e.target.value)}
                placeholder="10"
                className="w-24 pl-3 pr-8 py-2 rounded-lg border border-[var(--hp-slate-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hp-cyan-400)]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--hp-slate-400)] text-xs">%</span>
            </div>
            <button
              onClick={aplicarPctPreview}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--hp-cyan-500)] text-white text-sm font-semibold hover:bg-[var(--hp-cyan-600)] transition-all"
            >
              {Number(pct) >= 0
                ? <TrendingUp className="w-4 h-4" />
                : <TrendingDown className="w-4 h-4" />}
              Previsualizar
            </button>
          </div>
          {seleccionados.size > 0 && (
            <span className="text-xs bg-[var(--hp-navy-100)] text-[var(--hp-navy-700)] px-2 py-1 rounded-full font-medium">
              {seleccionados.size} seleccionado{seleccionados.size !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">{success}</div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--hp-slate-400)]" />
          <input
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--hp-slate-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hp-cyan-400)] bg-white"
          />
        </div>

        <select
          value={filtrMoneda}
          onChange={e => setFiltrMoneda(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--hp-slate-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hp-cyan-400)] bg-white text-[var(--hp-slate-700)]"
        >
          <option value="TODOS">Todas las monedas</option>
          <option value="ARS">ARS ($)</option>
          <option value="USD">USD (U$D)</option>
        </select>

        <select
          value={filtrTipo}
          onChange={e => setFiltrTipo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--hp-slate-200)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--hp-cyan-400)] bg-white text-[var(--hp-slate-700)]"
        >
          {tipos.map(t => <option key={t} value={t}>{t === "TODOS" ? "Todos los tipos" : t}</option>)}
        </select>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-[var(--hp-slate-400)] text-sm gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" /> Cargando productos…
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-[var(--hp-slate-400)] text-sm">
          No hay productos que coincidan con los filtros.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--hp-slate-200)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[var(--hp-slate-50)] text-[var(--hp-navy-800)] text-xs font-semibold uppercase tracking-wide">
                  {modoSeleccion && (
                    <th className="px-4 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={seleccionados.size === filtrados.length && filtrados.length > 0}
                        onChange={toggleTodos}
                        className="accent-[var(--hp-cyan-500)] w-4 h-4 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-center">Tipo</th>
                  <th className="px-4 py-3 text-center">Moneda</th>
                  <th className="px-4 py-3 text-right">Precio actual</th>
                  <th className="px-4 py-3 text-right">Nuevo precio</th>
                  <th className="px-4 py-3 text-center">Variación</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, i) => {
                  const precioOriginal = Number(p.precio ?? 0);
                  const precioEditing = editados[p.id_producto] !== undefined;
                  const precioNuevo = Number(getPrecio(p) ?? precioOriginal);
                  const monedaNueva = getMoneda(p);
                  const delta = precioNuevo - precioOriginal;
                  const deltaPct = precioOriginal > 0 ? (delta / precioOriginal) * 100 : 0;
                  const isSel = seleccionados.has(p.id_producto);

                  return (
                    <tr
                      key={p.id_producto}
                      className={`border-t border-[var(--hp-slate-100)] transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-[var(--hp-slate-50)]/40"
                      } ${precioEditing ? "ring-1 ring-inset ring-[var(--hp-cyan-300)] bg-[var(--hp-cyan-50)]/30" : ""} ${
                        isSel ? "bg-[var(--hp-cyan-50)]/50" : ""
                      } hover:bg-[var(--hp-cyan-50)]/20`}
                    >
                      {modoSeleccion && (
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleSel(p.id_producto)}
                            className="accent-[var(--hp-cyan-500)] w-4 h-4 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 font-medium text-[var(--hp-navy-900)]">
                        {p.referencia}
                        {p.categoria && (
                          <span className="ml-2 text-[10px] text-[var(--hp-slate-400)] bg-[var(--hp-slate-100)] px-1.5 py-0.5 rounded-full">
                            {p.categoria}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-[var(--hp-slate-500)]">{p.tipo ?? "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <select
                          value={monedaNueva}
                          onChange={e => setField(p.id_producto, "moneda", e.target.value)}
                          className="px-2 py-1 rounded border border-[var(--hp-slate-200)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--hp-cyan-400)] bg-white"
                        >
                          <option value="ARS">ARS</option>
                          <option value="USD">USD</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--hp-slate-500)] font-mono text-xs">
                        {fmt(precioOriginal, p.moneda)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[var(--hp-slate-400)] text-xs">{MONEDA_LABEL[monedaNueva] ?? "$"}</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={getPrecio(p)}
                            onChange={e => setField(p.id_producto, "precio", e.target.value)}
                            className="w-28 text-right px-2 py-1 rounded-lg border border-[var(--hp-slate-200)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--hp-cyan-400)] bg-white"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {precioEditing && precioOriginal > 0 ? (
                          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            delta > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : delta < 0
                              ? "bg-red-50 text-red-600"
                              : "bg-[var(--hp-slate-100)] text-[var(--hp-slate-500)]"
                          }`}>
                            {delta > 0 ? <TrendingUp className="w-3 h-3" /> : delta < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                            {delta >= 0 ? "+" : ""}{deltaPct.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-[var(--hp-slate-300)] text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--hp-slate-100)] text-xs text-[var(--hp-slate-400)] flex justify-between items-center">
            <span>{filtrados.length} producto{filtrados.length !== 1 ? "s" : ""} mostrados</span>
            {hayEdiciones && (
              <span className="text-[var(--hp-cyan-600)] font-medium">
                {Object.keys(editados).length} con cambios pendientes
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
