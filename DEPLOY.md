# Guía de Despliegue en Vercel (Portfolio Showcase)

Esta guía explica cómo desplegar la **Demo Técnica de RecycleFlow ERP** en **Vercel** en menos de 2 minutos para tu portfolio personal.

---

## 🚀 Despliegue en Vercel (Frontend Demo Autónomo)

Gracias al motor `mockDb` integrado en el frontend, la aplicación funciona de forma **100% interactiva** sin necesidad de configurar bases de datos ni backends externos.

### Paso 1: Subir tu código a GitHub
1. Crea un nuevo repositorio en tu cuenta de GitHub (ejemplo: `recycleflow-erp-demo`).
2. En tu terminal local, sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "feat: portfolio demo release"
   git branch -M main
   git remote add origin https://github.com/FedeTerradas/recycleflow-erp-demo.git
   git push -u origin main
   ```

### Paso 2: Importar en Vercel
1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** ➔ **"Project"**.
3. Selecciona tu repositorio recién creado y haz clic en **"Import"**.

### Paso 3: Configuración del Proyecto
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (o `web` si prefieres desplegar solo la carpeta del frontend)
- **Build Command**: `npm run build -w web`
- **Output Directory**: `web/dist`

*(El archivo `vercel.json` ya incluye las reglas de rewrite necesarias para que las rutas SPA como `/compras`, `/ventas`, `/stock` no den error 404 al recargar).*

### Paso 4: Deploy
Haz clic en **"Deploy"**. En ~30 segundos tendrás tu URL pública lista para agregar a tu portfolio (ej: `https://recycling-erp-demo.vercel.app`).

---

## 🔑 Credenciales para Evaluadores y Recruiters

Puedes ingresar con las credenciales demo o usar los botones de **1-Click Quick Access** en el Login:

- **Admin**: `admin@gmail.com` / `admin1234`
- **Compras**: `compras@demo.com` / `compras123`
- **Ventas**: `ventas@demo.com` / `ventas123`
- **Stock**: `operador@demo.com` / `operador123`
