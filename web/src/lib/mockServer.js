// web/src/lib/mockServer.js
// Router local que intercepta peticiones API y responde con mockDb

import mockDb from "./mockDb";

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

export async function handleMockRequest(cleanPath, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = parseBody(options.body);

  // Split path & query
  const [pathname, queryString] = cleanPath.split("?");
  const queryParams = new URLSearchParams(queryString || "");

  console.log(`📡 [MockServer] ${method} ${pathname}`, { body, query: Object.fromEntries(queryParams.entries()) });

  // Simular pequeña latencia de red imperceptible pero realista (40-100ms)
  await new Promise((resolve) => setTimeout(resolve, 50));

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  if (pathname === "/dashboard/resumen" || pathname === "/api/dashboard/resumen") {
    return mockDb.getDashboardSummary();
  }

  if (pathname === "/dashboard/categoria" || pathname === "/api/dashboard/categoria") {
    return mockDb.getDashboardCategoria();
  }

  // ─── STOCK & INVENTARIO ────────────────────────────────────────────────────
  if (pathname === "/api/stock" || pathname === "/stock") {
    if (method === "GET") {
      return mockDb.getStockList();
    }
  }

  if (pathname === "/api/stock/categorias") {
    return mockDb.data.categorias;
  }

  if (pathname === "/api/stock/tipos") {
    return mockDb.data.tipos_producto;
  }

  if (pathname === "/api/stock/unidades") {
    return [
      { unidad: "u" },
      { unidad: "kg" },
      { unidad: "m" },
      { unidad: "tn" },
    ];
  }

  if (pathname === "/api/stock/materiales") {
    // Solo materiales con unidad distinta de 'u'
    return mockDb.data.productos
      .filter((p) => p.estado && p.id_tipo_producto === 2)
      .map((p) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        precio_unitario: p.precio_unitario,
        unidad_stock: "kg",
      }));
  }

  if (pathname === "/api/stock/precios") {
    if (method === "GET") {
      return {
        productos: mockDb.data.productos.filter((p) => p.estado).map((p) => ({
          id_producto: p.id_producto,
          nombre: p.nombre,
          precio_unitario: p.precio_unitario,
          moneda: p.moneda || "ARS",
          tipo_nombre: p.id_tipo_producto === 2 ? "Material a granel" : "Producto terminado",
        })),
      };
    }
  }

  if (pathname === "/api/stock/precios/bulk" && method === "PUT") {
    return mockDb.updatePreciosBulk(body.precios || []);
  }

  if (pathname === "/api/stock/pesajes") {
    return mockDb.data.pesajes;
  }

  if (pathname === "/api/stock/pesaje" && method === "POST") {
    return mockDb.addPesaje(body);
  }

  if (pathname === "/api/stock/productos" && method === "POST") {
    return mockDb.addProduct(body);
  }

  const matchStockProd = pathname.match(/^\/api\/stock\/productos\/(\d+)$/);
  if (matchStockProd) {
    const id = Number(matchStockProd[1]);
    if (method === "PUT") {
      return mockDb.updateProduct(id, body);
    }
    if (method === "DELETE") {
      return mockDb.deleteProduct(id);
    }
  }

  // ─── PRODUCTOS GENERAL (para selects de ventas/compras) ─────────────────────
  if (pathname === "/v1/productos" || pathname === "/api/v1/productos") {
    return {
      productos: mockDb.data.productos.filter((p) => p.estado).map((p) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio_unitario: p.precio_unitario,
        moneda: p.moneda || "ARS",
        id_tipo_producto: p.id_tipo_producto,
        id_categoria: p.id_categoria,
        id_medida: p.id_medida,
        tipo_nombre: p.id_tipo_producto === 2 ? "Material a granel" : "Producto terminado",
        tipo_producto_nombre: p.id_tipo_producto === 2 ? "Material a granel" : "Producto terminado",
        categoria_nombre: mockDb.data.categorias.find((c) => c.id_categoria === p.id_categoria)?.nombre || "General",
        medida_simbolo: p.id_tipo_producto === 2 ? "kg" : "u",
        medida_nombre: p.id_tipo_producto === 2 ? "Kilogramo" : "Unidad",
        estado: p.estado,
        stock_actual: p.stock_actual,
      })),
    };
  }

  // ─── COMPRAS ───────────────────────────────────────────────────────────────
  if (pathname === "/api/compras" || pathname === "/compras") {
    if (method === "GET") {
      return {
        ok: true,
        compras: mockDb.data.compras,
      };
    }
    if (method === "POST") {
      const nueva = mockDb.addCompra(body);
      return { ok: true, compra: nueva };
    }
  }

  if (pathname === "/api/compras/productos") {
    return {
      ok: true,
      productos: mockDb.data.productos.filter((p) => p.estado).map((p) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio_unitario: p.precio_unitario,
        id_tipo_producto: p.id_tipo_producto,
        id_categoria: p.id_categoria,
        id_medida: p.id_medida,
        tipo_nombre: p.id_tipo_producto === 2 ? "Material a granel" : "Producto terminado",
        categoria_nombre: mockDb.data.categorias.find((c) => c.id_categoria === p.id_categoria)?.nombre || "General",
        medida_simbolo: p.id_tipo_producto === 2 ? "kg" : "u",
        medida_nombre: p.id_tipo_producto === 2 ? "Kilogramo" : "Unidad",
      })),
    };
  }

  if (pathname === "/api/compras/proveedores") {
    return {
      ok: true,
      proveedores: mockDb.data.proveedores,
    };
  }

  const matchCompraAnular = pathname.match(/^\/api\/compras\/(\d+)\/anular$/);
  if (matchCompraAnular) {
    const id = Number(matchCompraAnular[1]);
    const c = mockDb.anularCompra(id);
    return { ok: true, compra: c };
  }

  const matchCompraDetail = pathname.match(/^\/api\/compras\/(\d+)$/);
  if (matchCompraDetail) {
    const id = Number(matchCompraDetail[1]);
    const c = mockDb.data.compras.find((x) => x.id_compra === id);
    if (!c) throw new Error("Compra no encontrada");
    return {
      ok: true,
      compra: c,
      items: c.items || [],
    };
  }

  // ─── VENTAS & REMITOS ──────────────────────────────────────────────────────
  if (pathname === "/api/ventas" || pathname === "/ventas") {
    if (method === "GET") {
      let vts = mockDb.data.ventas;
      const only = queryParams.get("only");
      if (only === "activas") vts = vts.filter((v) => v.estado === "COMPLETADO");
      if (only === "anuladas") vts = vts.filter((v) => v.estado === "ANULADO");
      return vts;
    }
    if (method === "POST") {
      const nueva = mockDb.addVenta(body);
      return { ok: true, id_venta: nueva.id_venta, venta: nueva };
    }
  }

  const matchVentaAnular = pathname.match(/^\/api\/ventas\/(\d+)\/anular$/);
  if (matchVentaAnular) {
    const id = Number(matchVentaAnular[1]);
    const v = mockDb.anularVenta(id);
    return { ok: true, venta: v };
  }

  const matchVentaDetail = pathname.match(/^\/api\/ventas\/(\d+)$/);
  if (matchVentaDetail) {
    const id = Number(matchVentaDetail[1]);
    const v = mockDb.data.ventas.find((x) => x.id_venta === id);
    if (!v) throw new Error("Venta no encontrada");
    return {
      id_venta: v.id_venta,
      total: v.total,
      fecha: v.fecha,
      id_cliente: v.id_cliente,
      observaciones: v.observaciones,
      productos: v.items || [],
    };
  }

  if (pathname === "/api/v1/remitos" || pathname === "/v1/remitos") {
    if (method === "GET") {
      return { ok: true, remitos: mockDb.data.remitos };
    }
    if (method === "POST") {
      const newId = Math.max(0, ...mockDb.data.remitos.map((r) => r.id_remito)) + 1;
      const remito = {
        id_remito: newId,
        id_venta: Number(body.id_venta),
        fecha: body.fecha || new Date().toISOString().slice(0, 10),
        observaciones: body.observaciones || "",
        total: 0,
      };
      const v = mockDb.data.ventas.find((x) => x.id_venta === remito.id_venta);
      if (v) {
        remito.total = v.total;
        remito.obs_venta = v.observaciones;
      }
      mockDb.data.remitos.unshift(remito);
      mockDb.saveData();
      return { ok: true, id_remito: newId, remito };
    }
  }

  const matchRemitoDetail = pathname.match(/^\/(?:api\/)?v1\/remitos\/(\d+)$/);
  if (matchRemitoDetail) {
    const id = Number(matchRemitoDetail[1]);
    const r = mockDb.data.remitos.find((x) => x.id_remito === id);
    if (!r) throw new Error("Remito no encontrado");
    const v = mockDb.data.ventas.find((x) => x.id_venta === r.id_venta);
    return {
      ok: true,
      remito: r,
      productos: v?.items || [],
    };
  }

  // ─── CLIENTES ──────────────────────────────────────────────────────────────
  if (pathname === "/api/v1/clientes" || pathname === "/v1/clientes") {
    if (method === "GET") {
      return { ok: true, clientes: mockDb.data.clientes };
    }
    if (method === "POST") {
      const newId = Math.max(0, ...mockDb.data.clientes.map((c) => c.id_cliente)) + 1;
      const nuevo = { id_cliente: newId, ...body, estado: true };
      mockDb.data.clientes.unshift(nuevo);
      mockDb.addAudit("CLIENTES", "CREAR", `Cliente "${nuevo.razon_social}" registrado.`);
      mockDb.saveData();
      return { ok: true, cliente: nuevo };
    }
  }

  if (pathname === "/api/v1/clientes/search" || pathname === "/v1/clientes/search") {
    return {
      ok: true,
      clientes: mockDb.data.clientes.filter((c) => c.estado),
    };
  }

  const matchCliente = pathname.match(/^\/(?:api\/)?v1\/clientes\/(\d+)$/);
  if (matchCliente) {
    const id = Number(matchCliente[1]);
    const cli = mockDb.data.clientes.find((c) => c.id_cliente === id);
    if (!cli) throw new Error("Cliente no encontrado");

    if (method === "PUT") {
      Object.assign(cli, body);
      mockDb.addAudit("CLIENTES", "MODIFICAR", `Cliente "${cli.razon_social}" actualizado.`);
      mockDb.saveData();
      return { ok: true, cliente: cli };
    }
    if (method === "DELETE") {
      cli.estado = false;
      mockDb.addAudit("CLIENTES", "ELIMINAR", `Cliente "${cli.razon_social}" deshabilitado.`);
      mockDb.saveData();
      return { ok: true };
    }
  }

  // ─── PROVEEDORES ───────────────────────────────────────────────────────────
  if (pathname === "/api/proveedores" || pathname === "/proveedores") {
    if (method === "GET") {
      return { ok: true, proveedores: mockDb.data.proveedores };
    }
    if (method === "POST") {
      const newId = Math.max(0, ...mockDb.data.proveedores.map((p) => p.id_proveedor)) + 1;
      const nuevo = { id_proveedor: newId, ...body };
      mockDb.data.proveedores.unshift(nuevo);
      mockDb.addAudit("PROVEEDORES", "CREAR", `Proveedor "${nuevo.nombre}" creado.`);
      mockDb.saveData();
      return { ok: true, proveedor: nuevo };
    }
  }

  const matchProveedor = pathname.match(/^\/api\/proveedores\/(\d+)$/);
  if (matchProveedor) {
    const id = Number(matchProveedor[1]);
    const prov = mockDb.data.proveedores.find((p) => p.id_proveedor === id);
    if (!prov) throw new Error("Proveedor no encontrado");

    if (method === "PUT") {
      Object.assign(prov, body);
      mockDb.addAudit("PROVEEDORES", "MODIFICAR", `Proveedor "${prov.nombre}" actualizado.`);
      mockDb.saveData();
      return { ok: true, proveedor: prov };
    }
    if (method === "DELETE") {
      mockDb.data.proveedores = mockDb.data.proveedores.filter((p) => p.id_proveedor !== id);
      mockDb.addAudit("PROVEEDORES", "ELIMINAR", `Proveedor eliminado.`);
      mockDb.saveData();
      return { ok: true };
    }
  }

  // ─── LISTAS DE PRECIOS & DÓLAR ─────────────────────────────────────────────
  if (pathname === "/api/v1/precios/listas" || pathname === "/v1/precios/listas") {
    if (method === "GET") {
      return { ok: true, listas: mockDb.data.listas_precios };
    }
    if (method === "POST") {
      const newId = Math.max(0, ...mockDb.data.listas_precios.map((l) => l.id_lista)) + 1;
      const nueva = { id_lista: newId, ...body, estado: true };
      mockDb.data.listas_precios.push(nueva);
      mockDb.saveData();
      return { ok: true, lista: nueva };
    }
  }

  const matchLista = pathname.match(/^\/(?:api\/)?v1\/precios\/listas\/(\d+)$/);
  if (matchLista) {
    const id = Number(matchLista[1]);
    const list = mockDb.data.listas_precios.find((l) => l.id_lista === id);
    if (list && method === "PUT") {
      Object.assign(list, body);
      mockDb.saveData();
      return { ok: true, lista: list };
    }
  }

  if (pathname === "/api/v1/precios/dolar" || pathname === "/v1/precios/dolar") {
    return {
      ok: true,
      dolares: Object.values(mockDb.data.dolar),
    };
  }

  // ─── USUARIOS Y ROLES (SEGURIDAD) ──────────────────────────────────────────
  if (pathname === "/v1/usuarios" || pathname === "/api/v1/usuarios") {
    if (method === "GET") {
      return { usuarios: mockDb.data.usuarios };
    }
    if (method === "POST") {
      const newId = Math.max(0, ...mockDb.data.usuarios.map((u) => u.id_usuario)) + 1;
      const rol = mockDb.data.roles.find((r) => r.id_rol === Number(body.id_rol));
      const nuevo = {
        id_usuario: newId,
        dni: body.dni,
        nombre: body.nombre,
        mail: body.mail,
        id_rol: Number(body.id_rol || 1),
        rol_nombre: rol?.nombre || "OPERADOR",
        estado: "ACTIVO",
        roles: { id_rol: Number(body.id_rol || 1), nombre: rol?.nombre || "OPERADOR" },
      };
      mockDb.data.usuarios.push(nuevo);
      mockDb.addAudit("SEGURIDAD", "CREAR", `Usuario "${nuevo.nombre}" creado.`);
      mockDb.saveData();
      return { ok: true, usuario: nuevo };
    }
  }

  const matchUsuario = pathname.match(/^\/(?:api\/)?v1\/usuarios\/(\d+)$/);
  if (matchUsuario) {
    const id = Number(matchUsuario[1]);
    const usr = mockDb.data.usuarios.find((u) => u.id_usuario === id);
    if (!usr) throw new Error("Usuario no encontrado");

    if (method === "GET") {
      return { usuario: usr };
    }
    if (method === "PUT") {
      Object.assign(usr, body);
      if (body.id_rol) {
        const rol = mockDb.data.roles.find((r) => r.id_rol === Number(body.id_rol));
        usr.rol_nombre = rol?.nombre || usr.rol_nombre;
        usr.roles = { id_rol: Number(body.id_rol), nombre: rol?.nombre || usr.rol_nombre };
      }
      mockDb.addAudit("SEGURIDAD", "MODIFICAR", `Usuario "${usr.nombre}" actualizado.`);
      mockDb.saveData();
      return { ok: true, usuario: usr };
    }
    if (method === "DELETE") {
      mockDb.data.usuarios = mockDb.data.usuarios.filter((u) => u.id_usuario !== id);
      mockDb.addAudit("SEGURIDAD", "ELIMINAR", `Usuario eliminado.`);
      mockDb.saveData();
      return { ok: true };
    }
  }

  if (pathname === "/v1/roles" || pathname === "/api/v1/roles") {
    return { roles: mockDb.data.roles };
  }

  // ─── AUDITORÍA ─────────────────────────────────────────────────────────────
  if (pathname === "/api/auditoria" || pathname === "/auditoria") {
    let eventos = mockDb.data.auditoria;
    const tab = queryParams.get("tab");
    if (tab && tab !== "Todo") {
      eventos = eventos.filter((e) => e.modulo.toLowerCase() === tab.toLowerCase());
    }
    return { eventos };
  }

  // ─── REPORTES ──────────────────────────────────────────────────────────────
  if (pathname === "/api/reportes" || pathname === "/reportes") {
    if (method === "GET") {
      return { reportes: mockDb.data.reportes };
    }
    if (method === "POST") {
      const { tipo, id_producto, fecha_desde, fecha_hasta } = body;
      const prod = mockDb.data.productos.find((p) => p.id_producto === Number(id_producto));

      let cantidadCalculada = 0;
      let totalCalculado = 0;

      if (tipo === "Ventas") {
        mockDb.data.ventas.forEach((v) => {
          (v.items || []).forEach((it) => {
            if (it.id_producto === Number(id_producto)) {
              cantidadCalculada += Number(it.cantidad || 0);
              totalCalculado += Number(it.subtotal || 0);
            }
          });
        });
      } else {
        mockDb.data.compras.forEach((c) => {
          (c.items || []).forEach((it) => {
            if (it.id_producto === Number(id_producto)) {
              cantidadCalculada += Number(it.cantidad || 0);
              totalCalculado += Number(it.subtotal || 0);
            }
          });
        });
      }

      if (cantidadCalculada === 0) {
        cantidadCalculada = 1500;
        totalCalculado = 1500 * (prod?.precio_unitario || 380);
      }

      const unit = prod?.id_tipo_producto === 2 ? "kg" : "u";
      const newRepId = Math.max(0, ...mockDb.data.reportes.map((r) => r.id_reporte)) + 1;
      const nuevoReporte = {
        id_reporte: newRepId,
        codigo: `REP-2026-${String(newRepId).padStart(3, "0")}`,
        tipo,
        producto: prod?.nombre || "Material General",
        fecha_desde: fecha_desde || "2026-08-01",
        fecha_hasta: fecha_hasta || "2026-08-20",
        cantidad_unidad: `${cantidadCalculada.toLocaleString("es-AR")} ${unit}`,
        monto_total: totalCalculado,
        fecha_generacion: new Date().toISOString(),
      };

      mockDb.data.reportes.unshift(nuevoReporte);
      mockDb.addAudit("REPORTES", "GENERAR", `Reporte ${nuevoReporte.codigo} generado para ${nuevoReporte.producto}.`);
      mockDb.saveData();
      return { ok: true, reporte: nuevoReporte };
    }
  }

  if (pathname === "/api/reportes/productos") {
    return {
      productos: mockDb.data.productos.filter((p) => p.estado).map((p) => ({
        id_producto: p.id_producto,
        nombre: p.nombre,
      })),
    };
  }

  // ─── CUENTA Y AUTENTICACIÓN ────────────────────────────────────────────────
  if (pathname === "/v1/account/me" || pathname === "/api/v1/account/me") {
    if (method === "GET") {
      const role = localStorage.getItem("dn_role") || "ADMIN";
      const name = localStorage.getItem("dn_user_name") || "Administrador Demo";
      const mail = localStorage.getItem("dn_user") || "admin@gmail.com";
      return {
        nombre: name,
        dni: "35123456",
        mail: mail,
        rol: role,
      };
    }
    if (method === "PUT") {
      if (body.nombre) localStorage.setItem("dn_user_name", body.nombre);
      return { ok: true, ...body };
    }
  }

  if (pathname === "/v1/auth/touch-session" || pathname === "/api/v1/auth/touch-session") {
    const role = localStorage.getItem("dn_role") || "ADMIN";
    const name = localStorage.getItem("dn_user_name") || "Administrador Demo";
    return {
      ok: true,
      usuario: {
        nombre: name,
        rol: role,
      },
    };
  }

  if (pathname === "/v1/auth/logout-audit" || pathname === "/api/v1/auth/logout-audit") {
    mockDb.addAudit("SEGURIDAD", "LOGOUT", "Cierre de sesión.");
    return { ok: true };
  }

  // ─── Default Fallback ──────────────────────────────────────────────────────
  console.warn(`[MockServer] Endpoint no mapeado explícitamente: ${method} ${pathname}`);
  return { ok: true, data: [] };
}
