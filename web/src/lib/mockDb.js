// web/src/lib/mockDb.js
// Base de datos simulada y persistente en LocalStorage para el Modo Demo

const STORAGE_KEY = "hp_demo_erp_database_v1";

const INITIAL_DATA = {
  categorias: [
    { id_categoria: 1, nombre: "Cajas" },
    { id_categoria: 2, nombre: "Materiales Reciclables" },
    { id_categoria: 3, nombre: "Accesorios y Cintas" },
    { id_categoria: 4, nombre: "Film y Polietileno" },
  ],
  tipos_producto: [
    { id_tipo_producto: 1, nombre: "Producto terminado", unidad_stock: "u" },
    { id_tipo_producto: 2, nombre: "Material a granel", unidad_stock: "kg" },
    { id_tipo_producto: 3, nombre: "Insumo operativo", unidad_stock: "u" },
  ],
  unidades: [
    { unidad: "u", nombre: "Unidad", simbolo: "u" },
    { unidad: "kg", nombre: "Kilogramo", simbolo: "kg" },
    { unidad: "m", nombre: "Metro", simbolo: "m" },
    { unidad: "tn", nombre: "Tonelada", simbolo: "tn" },
  ],
  productos: [
    {
      id_producto: 1,
      nombre: "Caja Cartón Corrugado 30x30x20",
      descripcion: "Caja estándar para embalaje y logística ligera",
      id_categoria: 1,
      id_tipo_producto: 1,
      id_medida: 1,
      precio_unitario: 380.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 1450,
      alto: 30,
      ancho: 30,
      profundidad: 20,
      notas: "Resistencia estándar 32 ECT",
      ultimo_mov: "2026-08-18",
    },
    {
      id_producto: 2,
      nombre: "Caja Reforzada Doble Triple 50x40x30",
      descripcion: "Caja de alto impacto para exportación y piezas pesadas",
      id_categoria: 1,
      id_tipo_producto: 1,
      id_medida: 1,
      precio_unitario: 750.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 820,
      alto: 50,
      ancho: 40,
      profundidad: 30,
      notas: "Tratamiento antihumedad",
      ultimo_mov: "2026-08-19",
    },
    {
      id_producto: 3,
      nombre: "Fardos de Cartón Prensado (OCC)",
      descripcion: "Cartón corrugado recuperado compactado en fardos industriales",
      id_categoria: 2,
      id_tipo_producto: 2,
      id_medida: 2,
      precio_unitario: 210.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 42500, // 42.5 toneladas
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Fardos de aprox 450kg cada uno",
      ultimo_mov: "2026-08-20",
    },
    {
      id_producto: 4,
      nombre: "Fardos PET Cristal Compactado",
      descripcion: "Botellas PET post-consumo clasificadas y enfardadas",
      id_categoria: 2,
      id_tipo_producto: 2,
      id_medida: 2,
      precio_unitario: 480.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 28400,
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Pureza > 95% cristal",
      ultimo_mov: "2026-08-20",
    },
    {
      id_producto: 5,
      nombre: "Polietileno de Alta Densidad (HDPE) Molido",
      descripcion: "Envases soplados molidos y lavados listos para extrusión",
      id_categoria: 2,
      id_tipo_producto: 2,
      id_medida: 2,
      precio_unitario: 560.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 16200,
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Malla 8mm",
      ultimo_mov: "2026-08-15",
    },
    {
      id_producto: 6,
      nombre: "Film Stretch Virgen 500mm x 5kg",
      descripcion: "Bobinas de film stretch virgen para paletizado manual",
      id_categoria: 4,
      id_tipo_producto: 1,
      id_medida: 1,
      precio_unitario: 5200.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 340,
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Micronaje 20 mic",
      ultimo_mov: "2026-08-17",
    },
    {
      id_producto: 7,
      nombre: "Cinta de Embalar Transparente 48mm x 100m",
      descripcion: "Cinta adhesiva acrílica base solvente alta adherencia",
      id_categoria: 3,
      id_tipo_producto: 3,
      id_medida: 1,
      precio_unitario: 1350.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 980,
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Cajas por 36 unidades",
      ultimo_mov: "2026-08-10",
    },
    {
      id_producto: 8,
      nombre: "Chatarra de Aluminio Prensado",
      descripcion: "Recortes y latas de aluminio prensado en bloques",
      id_categoria: 2,
      id_tipo_producto: 2,
      id_medida: 2,
      precio_unitario: 1250.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 8900,
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Densidad promedio 0.85 tn/m3",
      ultimo_mov: "2026-08-16",
    },
    {
      id_producto: 9,
      nombre: "Papel Blanco Primera Selección",
      descripcion: "Papel de oficina e imprenta clasificado sin tintas pesadas",
      id_categoria: 2,
      id_tipo_producto: 2,
      id_medida: 2,
      precio_unitario: 290.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 12300,
      alto: null,
      ancho: null,
      profundidad: null,
      notas: "Enfardado",
      ultimo_mov: "2026-08-19",
    },
    {
      id_producto: 10,
      nombre: "Esquineros de Cartón Rígido 50x50x3mm",
      descripcion: "Protección perimetral de esquinas para pallets de exportación",
      id_categoria: 3,
      id_tipo_producto: 1,
      id_medida: 1,
      precio_unitario: 210.0,
      moneda: "ARS",
      estado: true,
      stock_actual: 2400,
      alto: 5,
      ancho: 5,
      profundidad: 200,
      notas: "Largo 2 metros",
      ultimo_mov: "2026-08-12",
    },
  ],
  clientes: [
    {
      id_cliente: 1,
      tipo_persona: "JURIDICA",
      tipo_documento: "CUIT",
      numero_documento: "30-71234567-8",
      razon_social: "Distribuidora Andina S.A.",
      nombre_fantasia: "Andina Logistics",
      condicion_iva: "RESPONSABLE_INSCRIPTO",
      email: "compras@andina.com.ar",
      telefono: "11-4567-8901",
      direccion: "Av. Corrientes 4500",
      localidad: "CABA",
      provincia: "Buenos Aires",
      codigo_postal: "1414",
      lista_precios_id: 2,
      tiene_cuenta_cte: true,
      estado: true,
    },
    {
      id_cliente: 2,
      tipo_persona: "JURIDICA",
      tipo_documento: "CUIT",
      numero_documento: "30-71890123-4",
      razon_social: "Packaging & Logística Express S.R.L.",
      nombre_fantasia: "PackExpress",
      condicion_iva: "RESPONSABLE_INSCRIPTO",
      email: "operaciones@packexpress.com",
      telefono: "11-5432-1098",
      direccion: "Ruta 8 Km 54",
      localidad: "Pilar",
      provincia: "Buenos Aires",
      codigo_postal: "1629",
      lista_precios_id: 1,
      tiene_cuenta_cte: false,
      estado: true,
    },
    {
      id_cliente: 3,
      tipo_persona: "JURIDICA",
      tipo_documento: "CUIT",
      numero_documento: "33-65498712-9",
      razon_social: "Embotelladora del Centro S.A.",
      nombre_fantasia: "Aguas del Centro",
      condicion_iva: "RESPONSABLE_INSCRIPTO",
      email: "sustentabilidad@aguasdelcentro.com",
      telefono: "351-489-7600",
      direccion: "Parque Industrial Norte Lote 12",
      localidad: "Córdoba",
      provincia: "Córdoba",
      codigo_postal: "5000",
      lista_precios_id: 3,
      tiene_cuenta_cte: true,
      estado: true,
    },
    {
      id_cliente: 4,
      tipo_persona: "JURIDICA",
      tipo_documento: "CUIT",
      numero_documento: "30-66778899-2",
      razon_social: "Industrias Plásticas del Plata S.A.",
      nombre_fantasia: "PlastiPlata",
      condicion_iva: "RESPONSABLE_INSCRIPTO",
      email: "reciclado@plastiplata.com.ar",
      telefono: "11-4789-3214",
      direccion: "Calle 14 n° 890",
      localidad: "Berazategui",
      provincia: "Buenos Aires",
      codigo_postal: "1884",
      lista_precios_id: 2,
      tiene_cuenta_cte: true,
      estado: true,
    },
  ],
  proveedores: [
    {
      id_proveedor: 1,
      nombre: "Cooperativa de Recicladores Urbanos del Litoral",
      cuit: "30-71555666-3",
      contacto: "11-6677-8899 (Juan Pérez)",
      direccion: "Av. de los Trabajadores 1250, Lanús",
    },
    {
      id_proveedor: 2,
      nombre: "Cartonera & Papelera Industrial Argentina S.A.",
      cuit: "30-61223344-5",
      contacto: "11-4321-7654 (Ventas Corporativas)",
      direccion: "Camino de Cintura 4580, San Justo",
    },
    {
      id_proveedor: 3,
      nombre: "Polímeros & Resinas del Sur S.R.L.",
      cuit: "30-70889911-0",
      contacto: "11-5544-3322 (Ing. Roberto Díaz)",
      direccion: "Av. Hipólito Yrigoyen 8900, Lomas de Zamora",
    },
    {
      id_proveedor: 4,
      nombre: "Insumos y Adhesivos Packaging Directo",
      cuit: "33-54896321-7",
      contacto: "11-4998-1122 (Laura Gómez)",
      direccion: "Parque Industrial Almirante Brown, Burzaco",
    },
  ],
  listas_precios: [
    {
      id_lista: 1,
      nombre: "Lista General Minorista",
      descripcion: "Precios base para compras unitarias y mostrador",
      porcentaje_variacion: 0,
      moneda: "ARS",
      estado: true,
    },
    {
      id_lista: 2,
      nombre: "Lista Mayorista Distribución",
      descripcion: "Descuento del 10% para compras por pallet y fardos",
      porcentaje_variacion: -10,
      moneda: "ARS",
      estado: true,
    },
    {
      id_lista: 3,
      nombre: "Lista Clientes Corporativos / Grandes Cuentas",
      descripcion: "Convenios industriales con 18% de bonificación",
      porcentaje_variacion: -18,
      moneda: "ARS",
      estado: true,
    },
    {
      id_lista: 4,
      nombre: "Tarifa Exportación Dólar",
      descripcion: "Valores directos cotizados en USD",
      porcentaje_variacion: 0,
      moneda: "USD",
      estado: true,
    },
  ],
  dolar: {
    oficial: { compra: 1040, venta: 1070, nombre: "Oficial" },
    blue: { compra: 1260, venta: 1285, nombre: "Blue" },
    mep: { compra: 1210, venta: 1225, nombre: "Bolsa" },
    ccl: { compra: 1235, venta: 1250, nombre: "Contado con liquidación" },
  },
  compras: [
    {
      id_compra: 101,
      id_proveedor: 1,
      proveedor_nombre: "Cooperativa de Recicladores Urbanos del Litoral",
      total: 3150000.0,
      fecha: "2026-08-18",
      observaciones: "Entrega de fardos PET y Cartón OCC en planta",
      estado: "COMPLETADO",
      items: [
        {
          id_producto: 3,
          producto: "Fardos de Cartón Prensado (OCC)",
          medida: "kg",
          cantidad: 10000,
          precio_unitario: 210.0,
          subtotal: 2100000.0,
        },
        {
          id_producto: 4,
          producto: "Fardos PET Cristal Compactado",
          medida: "kg",
          cantidad: 2500,
          precio_unitario: 420.0,
          subtotal: 1050000.0,
        },
      ],
    },
    {
      id_compra: 102,
      id_proveedor: 2,
      proveedor_nombre: "Cartonera & Papelera Industrial Argentina S.A.",
      total: 1980000.0,
      fecha: "2026-08-16",
      observaciones: "Lote de cajas corrugadas troqueladas",
      estado: "COMPLETADO",
      items: [
        {
          id_producto: 1,
          producto: "Caja Cartón Corrugado 30x30x20",
          medida: "u",
          cantidad: 3000,
          precio_unitario: 340.0,
          subtotal: 1020000.0,
        },
        {
          id_producto: 2,
          producto: "Caja Reforzada Doble Triple 50x40x30",
          medida: "u",
          cantidad: 1500,
          precio_unitario: 640.0,
          subtotal: 960000.0,
        },
      ],
    },
    {
      id_compra: 103,
      id_proveedor: 4,
      proveedor_nombre: "Insumos y Adhesivos Packaging Directo",
      total: 890000.0,
      fecha: "2026-08-12",
      observaciones: "Bobinas de film y cintas de embalar",
      estado: "COMPLETADO",
      items: [
        {
          id_producto: 6,
          producto: "Film Stretch Virgen 500mm x 5kg",
          medida: "u",
          cantidad: 100,
          precio_unitario: 4800.0,
          subtotal: 480000.0,
        },
        {
          id_producto: 7,
          producto: "Cinta de Embalar Transparente 48mm x 100m",
          medida: "u",
          cantidad: 350,
          precio_unitario: 1171.43,
          subtotal: 410000.0,
        },
      ],
    },
  ],
  ventas: [
    {
      id_venta: 201,
      id_cliente: 1,
      cliente_nombre: "Distribuidora Andina S.A.",
      fecha: "2026-08-19",
      total: 2850000.0,
      observaciones: "Despacho programado con Remito R-0001-0000234",
      estado: "COMPLETADO",
      items: [
        {
          id_producto: 1,
          producto: "Caja Cartón Corrugado 30x30x20",
          tipo: "Producto terminado",
          tipo_producto: "Producto terminado",
          cantidad: 2500,
          precio_unitario: 380.0,
          precio: 380.0,
          subtotal: 950000.0,
          medida: "u",
        },
        {
          id_producto: 6,
          producto: "Film Stretch Virgen 500mm x 5kg",
          tipo: "Producto terminado",
          tipo_producto: "Producto terminado",
          cantidad: 150,
          precio_unitario: 5200.0,
          precio: 5200.0,
          subtotal: 780000.0,
          medida: "u",
        },
        {
          id_producto: 2,
          producto: "Caja Reforzada Doble Triple 50x40x30",
          tipo: "Producto terminado",
          tipo_producto: "Producto terminado",
          cantidad: 1500,
          precio_unitario: 746.67,
          precio: 746.67,
          subtotal: 1120000.0,
          medida: "u",
        },
      ],
    },
    {
      id_venta: 202,
      id_cliente: 3,
      cliente_nombre: "Embotelladora del Centro S.A.",
      fecha: "2026-08-20",
      total: 5760000.0,
      observaciones: "Despacho a granel fardo PET cristal lote agosto",
      estado: "COMPLETADO",
      items: [
        {
          id_producto: 4,
          producto: "Fardos PET Cristal Compactado",
          tipo: "Material a granel",
          tipo_producto: "Material a granel",
          cantidad: 12000,
          precio_unitario: 480.0,
          precio: 480.0,
          subtotal: 5760000.0,
          medida: "kg",
        },
      ],
    },
    {
      id_venta: 203,
      id_cliente: 2,
      cliente_nombre: "Packaging & Logística Express S.R.L.",
      fecha: "2026-08-15",
      total: 1380000.0,
      observaciones: "Pedido de reposición mensual cajas y cintas",
      estado: "COMPLETADO",
      items: [
        {
          id_producto: 1,
          producto: "Caja Cartón Corrugado 30x30x20",
          tipo: "Producto terminado",
          tipo_producto: "Producto terminado",
          cantidad: 2000,
          precio_unitario: 380.0,
          precio: 380.0,
          subtotal: 760000.0,
          medida: "u",
        },
        {
          id_producto: 7,
          producto: "Cinta de Embalar Transparente 48mm x 100m",
          tipo: "Insumo operativo",
          tipo_producto: "Insumo operativo",
          cantidad: 400,
          precio_unitario: 1350.0,
          precio: 1350.0,
          subtotal: 540000.0,
          medida: "u",
        },
        {
          id_producto: 10,
          producto: "Esquineros de Cartón Rígido 50x50x3mm",
          tipo: "Producto terminado",
          tipo_producto: "Producto terminado",
          cantidad: 380,
          precio_unitario: 210.53,
          precio: 210.53,
          subtotal: 80000.0,
          medida: "u",
        },
      ],
    },
  ],
  remitos: [
    {
      id_remito: 1,
      id_venta: 201,
      fecha: "2026-08-19",
      observaciones: "Remito oficial de entrega transportado por Flota Propia",
      total: 2850000.0,
      obs_venta: "Despacho programado con Remito R-0001-0000234",
    },
    {
      id_remito: 2,
      id_venta: 202,
      fecha: "2026-08-20",
      observaciones: "Pesada en balanza puente N°1 de 12.000 kg",
      total: 5760000.0,
      obs_venta: "Despacho a granel fardo PET cristal lote agosto",
    },
  ],
  pesajes: [
    {
      id_pesaje: 1,
      id_producto: 3,
      material: "Fardos de Cartón Prensado (OCC)",
      patente: "AF-324-KP",
      chofer: "Carlos Benítez",
      peso_bruto: 24500,
      peso_tara: 14500,
      peso_neto: 10000,
      tipo_operacion: "ENTRADA",
      fecha: "2026-08-18 10:30:00",
      observaciones: "Ingreso de batea con cartón prensado limpio",
    },
    {
      id_pesaje: 2,
      id_producto: 4,
      material: "Fardos PET Cristal Compactado",
      patente: "AE-982-LM",
      chofer: "Marcos Medina",
      peso_bruto: 18200,
      peso_tara: 15700,
      peso_neto: 2500,
      tipo_operacion: "ENTRADA",
      fecha: "2026-08-18 14:15:00",
      observaciones: "PET cristal prensado",
    },
    {
      id_pesaje: 3,
      id_producto: 4,
      material: "Fardos PET Cristal Compactado",
      patente: "AG-115-TZ",
      chofer: "Esteban Rivas",
      peso_bruto: 27800,
      peso_tara: 15800,
      peso_neto: 12000,
      tipo_operacion: "SALIDA",
      fecha: "2026-08-20 09:45:00",
      observaciones: "Despacho para Embotelladora del Centro",
    },
  ],
  usuarios: [
    {
      id_usuario: 1,
      dni: "35123456",
      nombre: "Administrador Demo",
      mail: "admin@gmail.com",
      id_rol: 1,
      rol_nombre: "ADMIN",
      estado: "ACTIVO",
      roles: { id_rol: 1, nombre: "ADMIN" },
    },
    {
      id_usuario: 2,
      dni: "38987654",
      nombre: "Operador de Stock & Pesajes",
      mail: "operador@demo.com",
      id_rol: 4,
      rol_nombre: "STOCK",
      estado: "ACTIVO",
      roles: { id_rol: 4, nombre: "STOCK" },
    },
    {
      id_usuario: 3,
      dni: "36456789",
      nombre: "Encargado de Compras",
      mail: "compras@demo.com",
      id_rol: 2,
      rol_nombre: "COMPRAS",
      estado: "ACTIVO",
      roles: { id_rol: 2, nombre: "COMPRAS" },
    },
    {
      id_usuario: 4,
      dni: "39876123",
      nombre: "Ejecutiva de Ventas",
      mail: "ventas@demo.com",
      id_rol: 3,
      rol_nombre: "VENTAS",
      estado: "ACTIVO",
      roles: { id_rol: 3, nombre: "VENTAS" },
    },
  ],
  roles: [
    { id_rol: 1, nombre: "ADMIN", descripcion: "Acceso total al sistema y módulos" },
    { id_rol: 2, nombre: "COMPRAS", descripcion: "Gestión de órdenes de compra y proveedores" },
    { id_rol: 3, nombre: "VENTAS", descripcion: "Gestión de ventas, remitos y clientes" },
    { id_rol: 4, nombre: "STOCK", descripcion: "Control de inventario y módulo de pesajes" },
  ],
  auditoria: [
    {
      id: 1,
      accion: "LOGIN",
      modulo: "Seguridad",
      usuario: "admin@gmail.com",
      detalle: "Inicio de sesión exitoso en entorno Demo",
      fecha: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 2,
      accion: "CREAR",
      modulo: "Ventas",
      usuario: "ventas@demo.com",
      detalle: "Registro de Venta #202 por $5.760.000 (12.000 kg PET)",
      fecha: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 3,
      accion: "PESAJE",
      modulo: "Stock",
      usuario: "operador@demo.com",
      detalle: "Pesaje de salida #3 de 12.000 kg para AF-324-KP",
      fecha: new Date(Date.now() - 3600000 * 7).toISOString(),
    },
    {
      id: 4,
      accion: "CREAR",
      modulo: "Compras",
      usuario: "compras@demo.com",
      detalle: "Orden de compra #101 por $3.150.000 a Cooperativa",
      fecha: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  reportes: [
    {
      id_reporte: 1,
      codigo: "REP-2026-08-001",
      tipo: "Ventas",
      producto: "Fardos PET Cristal Compactado",
      fecha_desde: "2026-08-01",
      fecha_hasta: "2026-08-20",
      cantidad_unidad: "12.000 kg",
      monto_total: 5760000,
      fecha_generacion: "2026-08-20T11:00:00.000Z",
    },
    {
      id_reporte: 2,
      codigo: "REP-2026-08-002",
      tipo: "Compras",
      producto: "Fardos de Cartón Prensado (OCC)",
      fecha_desde: "2026-08-01",
      fecha_hasta: "2026-08-20",
      cantidad_unidad: "10.000 kg",
      monto_total: 2100000,
      fecha_generacion: "2026-08-19T16:30:00.000Z",
    },
  ],
};

// ─── Inicialización y persistencia ───────────────────────────────────────────

class MockDatabase {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn("[MockDB] Error cargando localStorage:", e);
    }
    const clone = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData(clone);
    return clone;
  }

  saveData(d = this.data) {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
      }
    } catch (e) {
      console.error("[MockDB] Error guardando en localStorage:", e);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveData(this.data);
    return this.data;
  }

  // ─── Helpers de Stock y Listado ────────────────────────────────────────────

  getStockList() {
    return this.data.productos
      .filter((p) => p.estado)
      .map((p) => {
        const cat = this.data.categorias.find((c) => c.id_categoria === p.id_categoria);
        const tipo = this.data.tipos_producto.find((t) => t.id_tipo_producto === p.id_tipo_producto);

        return {
          id_producto: p.id_producto,
          referencia: p.nombre,
          nombre: p.nombre,
          categoria: cat?.nombre || "General",
          id_categoria: p.id_categoria,
          tipo: tipo?.nombre || "Producto terminado",
          tipo_producto_nombre: tipo?.nombre || "Producto terminado",
          id_tipo_producto: p.id_tipo_producto,
          unidad_stock: tipo?.unidad_stock || "u",
          unidad: tipo?.unidad_stock || "u",
          disponible: p.stock_actual ?? 0,
          precio: p.precio_unitario,
          precio_unitario: p.precio_unitario,
          moneda: p.moneda || "ARS",
          ultimo_mov: p.ultimo_mov || new Date().toISOString().slice(0, 10),
          alto: p.alto,
          ancho: p.ancho,
          profundidad: p.profundidad,
          notas: p.notas || "",
          estado: p.estado,
        };
      });
  }

  // ─── Transacciones de Compras ──────────────────────────────────────────────

  addCompra(compraPayload) {
    const { id_proveedor, fecha, observaciones, items = [] } = compraPayload;
    const prov = this.data.proveedores.find((p) => p.id_proveedor === Number(id_proveedor));

    let total = 0;
    const formattedItems = items.map((it) => {
      const prod = this.data.productos.find((p) => p.id_producto === Number(it.prodId || it.id_producto));
      const cant = Number(it.cantidad || 0);
      const precio = Number(it.precioUnit || it.precio_unitario || 0);
      const subtotal = cant * precio;
      total += subtotal;

      // Auto-incremento de stock
      if (prod) {
        prod.stock_actual = (prod.stock_actual || 0) + cant;
        prod.ultimo_mov = fecha || new Date().toISOString().slice(0, 10);
      }

      return {
        id_producto: prod?.id_producto || Number(it.prodId),
        producto: prod?.nombre || it.producto || "Producto",
        medida: it.medida || "u",
        cantidad: cant,
        precio_unitario: precio,
        subtotal: subtotal,
      };
    });

    const newId = Math.max(0, ...this.data.compras.map((c) => c.id_compra)) + 1;
    const nuevaCompra = {
      id_compra: newId,
      id_proveedor: Number(id_proveedor),
      proveedor_nombre: prov?.nombre || "Proveedor",
      total,
      fecha: fecha || new Date().toISOString().slice(0, 10),
      observaciones: observaciones || "",
      estado: "COMPLETADO",
      items: formattedItems,
    };

    this.data.compras.unshift(nuevaCompra);
    this.addAudit("COMPRAS", "CREAR", `Orden de compra #${newId} registrada por $${total.toLocaleString("es-AR")}`);
    this.saveData();
    return nuevaCompra;
  }

  anularCompra(idCompra) {
    const c = this.data.compras.find((x) => x.id_compra === Number(idCompra));
    if (!c) throw new Error("Compra no encontrada");
    if (c.estado === "ANULADA") return c;

    // Descontar el stock sumado previamente
    (c.items || []).forEach((it) => {
      const prod = this.data.productos.find((p) => p.id_producto === it.id_producto);
      if (prod) {
        prod.stock_actual = Math.max(0, (prod.stock_actual || 0) - Number(it.cantidad || 0));
      }
    });

    c.estado = "ANULADA";
    this.addAudit("COMPRAS", "ANULAR", `Orden de compra #${idCompra} anulada. Se revirtió el stock ingresado.`);
    this.saveData();
    return c;
  }

  // ─── Transacciones de Ventas ───────────────────────────────────────────────

  addVenta(ventaPayload) {
    const { id_cliente, fecha, observaciones, productos = [] } = ventaPayload;
    const cliente = this.data.clientes.find((c) => c.id_cliente === Number(id_cliente));

    let total = 0;
    const formattedItems = productos.map((it) => {
      const prod = this.data.productos.find((p) => p.id_producto === Number(it.id_producto));
      const cant = Number(it.cantidad || 0);
      const precio = Number(it.precio_unitario || it.precio || 0);
      const subtotal = cant * precio;
      total += subtotal;

      // Auto-decremento de stock
      if (prod) {
        prod.stock_actual = Math.max(0, (prod.stock_actual || 0) - cant);
        prod.ultimo_mov = fecha || new Date().toISOString().slice(0, 10);
      }

      return {
        id_producto: prod?.id_producto || Number(it.id_producto),
        producto: prod?.nombre || it.producto || "Producto",
        tipo: prod ? (prod.id_tipo_producto === 2 ? "Material a granel" : "Producto terminado") : "Producto terminado",
        tipo_producto: prod ? (prod.id_tipo_producto === 2 ? "Material a granel" : "Producto terminado") : "Producto terminado",
        cantidad: cant,
        precio_unitario: precio,
        precio: precio,
        subtotal: subtotal,
        medida: it.medida || "u",
      };
    });

    const newId = Math.max(0, ...this.data.ventas.map((v) => v.id_venta)) + 1;
    const nuevaVenta = {
      id_venta: newId,
      id_cliente: Number(id_cliente),
      cliente_nombre: cliente?.razon_social || cliente?.nombre_fantasia || "Cliente Final",
      fecha: fecha || new Date().toISOString().slice(0, 10),
      total,
      observaciones: observaciones || "",
      estado: "COMPLETADO",
      items: formattedItems,
    };

    this.data.ventas.unshift(nuevaVenta);

    // Generar Remito automático asociado
    const newRemitoId = Math.max(0, ...this.data.remitos.map((r) => r.id_remito)) + 1;
    this.data.remitos.unshift({
      id_remito: newRemitoId,
      id_venta: newId,
      fecha: nuevaVenta.fecha,
      observaciones: `Remito automático para Venta #${newId}`,
      total: nuevaVenta.total,
      obs_venta: nuevaVenta.observaciones,
    });

    this.addAudit("VENTAS", "CREAR", `Venta #${newId} registrada por $${total.toLocaleString("es-AR")} para ${nuevaVenta.cliente_nombre}`);
    this.saveData();
    return nuevaVenta;
  }

  anularVenta(idVenta) {
    const v = this.data.ventas.find((x) => x.id_venta === Number(idVenta));
    if (!v) throw new Error("Venta no encontrada");
    if (v.estado === "ANULADO") return v;

    // Reponer el stock debitado
    (v.items || []).forEach((it) => {
      const prod = this.data.productos.find((p) => p.id_producto === it.id_producto);
      if (prod) {
        prod.stock_actual = (prod.stock_actual || 0) + Number(it.cantidad || 0);
      }
    });

    v.estado = "ANULADO";
    this.addAudit("VENTAS", "ANULAR", `Venta #${idVenta} anulada. Se restituyó el stock.`);
    this.saveData();
    return v;
  }

  // ─── Pesajes ───────────────────────────────────────────────────────────────

  addPesaje(pesajePayload) {
    const { id_producto, patente, chofer, peso_bruto, peso_tara, tipo_operacion = "ENTRADA", observaciones } = pesajePayload;
    const prod = this.data.productos.find((p) => p.id_producto === Number(id_producto));

    const bruto = Number(peso_bruto || 0);
    const tara = Number(peso_tara || 0);
    const neto = Math.max(0, bruto - tara);

    const newId = Math.max(0, ...this.data.pesajes.map((p) => p.id_pesaje)) + 1;
    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString("es-AR", { hour12: false })}`;

    const nuevoPesaje = {
      id_pesaje: newId,
      id_producto: Number(id_producto),
      material: prod?.nombre || "Material a granel",
      patente: patente || "—",
      chofer: chofer || "—",
      peso_bruto: bruto,
      peso_tara: tara,
      peso_neto: neto,
      tipo_operacion,
      fecha: formattedDate,
      observaciones: observaciones || "",
    };

    if (prod) {
      if (tipo_operacion === "ENTRADA") {
        prod.stock_actual = (prod.stock_actual || 0) + neto;
      } else {
        prod.stock_actual = Math.max(0, (prod.stock_actual || 0) - neto);
      }
      prod.ultimo_mov = now.toISOString().slice(0, 10);
    }

    this.data.pesajes.unshift(nuevoPesaje);
    this.addAudit("STOCK", "PESAJE", `Ticket de pesaje #${newId} (${tipo_operacion}): ${neto.toLocaleString("es-AR")} kg de ${nuevoPesaje.material} (Patente ${patente})`);
    this.saveData();
    return nuevoPesaje;
  }

  // ─── CRUD Productos ────────────────────────────────────────────────────────

  addProduct(p) {
    const newId = Math.max(0, ...this.data.productos.map((x) => x.id_producto)) + 1;
    const newProd = {
      id_producto: newId,
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      id_categoria: Number(p.id_categoria || 1),
      id_tipo_producto: Number(p.id_tipo_producto || 1),
      id_medida: Number(p.id_medida || 1),
      precio_unitario: Number(p.precio_unitario || 0),
      moneda: p.moneda || "ARS",
      estado: true,
      stock_actual: Number(p.stock_inicial || p.cantidad || 0),
      alto: p.alto ? Number(p.alto) : null,
      ancho: p.ancho ? Number(p.ancho) : null,
      profundidad: p.profundidad ? Number(p.profundidad) : null,
      notas: p.notas || "",
      ultimo_mov: new Date().toISOString().slice(0, 10),
    };
    this.data.productos.push(newProd);
    this.addAudit("STOCK", "CREAR", `Producto "${newProd.nombre}" creado exitosamente.`);
    this.saveData();
    return newProd;
  }

  updateProduct(id, p) {
    const prod = this.data.productos.find((x) => x.id_producto === Number(id));
    if (!prod) throw new Error("Producto no encontrado");
    Object.assign(prod, {
      nombre: p.nombre !== undefined ? p.nombre : prod.nombre,
      descripcion: p.descripcion !== undefined ? p.descripcion : prod.descripcion,
      id_categoria: p.id_categoria !== undefined ? Number(p.id_categoria) : prod.id_categoria,
      id_tipo_producto: p.id_tipo_producto !== undefined ? Number(p.id_tipo_producto) : prod.id_tipo_producto,
      precio_unitario: p.precio_unitario !== undefined ? Number(p.precio_unitario) : prod.precio_unitario,
      moneda: p.moneda !== undefined ? p.moneda : prod.moneda,
      alto: p.alto !== undefined ? p.alto : prod.alto,
      ancho: p.ancho !== undefined ? p.ancho : prod.ancho,
      profundidad: p.profundidad !== undefined ? p.profundidad : prod.profundidad,
      notas: p.notas !== undefined ? p.notas : prod.notas,
      estado: p.estado !== undefined ? p.estado : prod.estado,
    });
    this.addAudit("STOCK", "MODIFICAR", `Producto "${prod.nombre}" actualizado.`);
    this.saveData();
    return prod;
  }

  deleteProduct(id) {
    const prod = this.data.productos.find((x) => x.id_producto === Number(id));
    if (prod) {
      prod.estado = false;
      this.addAudit("STOCK", "ELIMINAR", `Producto "${prod.nombre}" deshabilitado.`);
      this.saveData();
    }
    return { ok: true };
  }

  updatePreciosBulk(preciosList = []) {
    preciosList.forEach((item) => {
      const prod = this.data.productos.find((p) => p.id_producto === Number(item.id_producto));
      if (prod && item.precio_unitario !== undefined) {
        prod.precio_unitario = Number(item.precio_unitario);
      }
    });
    this.addAudit("STOCK", "PRECIOS", `Actualización masiva de precios aplicada a ${preciosList.length} productos.`);
    this.saveData();
    return { ok: true, count: preciosList.length };
  }

  // ─── Auditoría ─────────────────────────────────────────────────────────────

  addAudit(modulo, accion, detalle) {
    const newId = Math.max(0, ...this.data.auditoria.map((a) => a.id)) + 1;
    const user =
      (typeof localStorage !== "undefined" &&
        (localStorage.getItem("dn_user_name") || localStorage.getItem("dn_user"))) ||
      "admin@gmail.com";
    this.data.auditoria.unshift({
      id: newId,
      modulo,
      accion,
      usuario: user,
      detalle,
      fecha: new Date().toISOString(),
    });
    if (this.data.auditoria.length > 200) {
      this.data.auditoria.pop();
    }
  }

  // ─── Métricas para Dashboard ───────────────────────────────────────────────

  getDashboardSummary() {
    const totalVentas = this.data.ventas
      .filter((v) => v.estado === "COMPLETADO")
      .reduce((sum, v) => sum + Number(v.total || 0), 0);

    const cantVentas = this.data.ventas.filter((v) => v.estado === "COMPLETADO").length;

    const totalCompras = this.data.compras
      .filter((c) => c.estado === "COMPLETADO")
      .reduce((sum, c) => sum + Number(c.total || 0), 0);

    const cantCompras = this.data.compras.filter((c) => c.estado === "COMPLETADO").length;

    const pesajesEntrada = this.data.pesajes.filter((p) => p.tipo_operacion === "ENTRADA");
    const totalKilosPesados = pesajesEntrada.reduce((sum, p) => sum + Number(p.peso_neto || 0), 0);

    const activeProds = this.data.productos.filter((p) => p.estado);
    const sinStockCount = activeProds.filter((p) => (p.stock_actual || 0) <= 0).length;

    // Ventas por día del mes
    const ventasPorDia = [
      { dia: "01", total: 320000 },
      { dia: "05", total: 680000 },
      { dia: "10", total: 1150000 },
      { dia: "15", total: 1380000 },
      { dia: "18", total: 950000 },
      { dia: "19", total: 2850000 },
      { dia: "20", total: 5760000 },
    ];

    // Kilos por material
    const kilosPorMaterial = [
      { material: "Fardos de Cartón Prensado (OCC)", kilos: 42500, unidad: "kg" },
      { material: "Fardos PET Cristal Compactado", kilos: 28400, unidad: "kg" },
      { material: "Polietileno (HDPE) Molido", kilos: 16200, unidad: "kg" },
      { material: "Papel Blanco Primera", kilos: 12300, unidad: "kg" },
      { material: "Chatarra de Aluminio Prensado", kilos: 8900, unidad: "kg" },
    ];

    return {
      ventasMes: {
        total: totalVentas,
        cantidad: cantVentas,
      },
      comprasMes: {
        total: totalCompras,
        cantidad: cantCompras,
      },
      pesajesMes: {
        kilos_totales: totalKilosPesados,
        movimientos: this.data.pesajes.length,
      },
      stockCritico: {
        sin_stock: sinStockCount,
        productos_activos: activeProds.length,
      },
      ventasPorDia,
      kilosPorMaterial,
    };
  }

  getDashboardCategoria() {
    return [
      { periodo: "Mayo", Cajas: 12500, "Materiales Reciclables": 68000 },
      { periodo: "Junio", Cajas: 14200, "Materiales Reciclables": 74000 },
      { periodo: "Julio", Cajas: 11800, "Materiales Reciclables": 82000 },
      { periodo: "Agosto", Cajas: 16400, "Materiales Reciclables": 95000 },
    ];
  }
}

export const mockDb = new MockDatabase();
export default mockDb;
