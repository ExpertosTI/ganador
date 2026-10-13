# 👁️⚡ EL OJO GANADOR (elojoganador.com)

Plataforma Web (PWA/SPA Multi-Página) de Calzado y Streetwear en República Dominicana, con landing **Coming Soon**, gestor de **Carga Masiva de Catálogo (JSON/CSV)**, sincronización bidireccional con **Whaticket API v1.0.0**, enlace directo a **Odoo ERP**, **Catálogo Pro para Personal de Ventas**, **Cotizador Rápido Whaticket**, y despliegue automatizado con **Docker + Traefik** bajo el dominio oficial **`elojoganador.com`**.

---

## 🌐 URLs de Acceso y Enlaces del Personal

| Módulo / Función | URL Pública / Link de Acceso | Descripción |
| :--- | :--- | :--- |
| **Landing Oficial (Coming Soon / Teaser)** | `https://elojoganador.com/` | Landing de expectación con cuenta regresiva, registro VIP y switcher discreto a tienda completa. |
| **Tienda Completa (Preview Directo)** | `https://elojoganador.com/?store=1` | Acceso directo a la tienda en línea completa sin pasar por el teaser. |
| **Catálogo Pro (Personal de Ventas)** | `https://elojoganador.com/catalogo.html` o `/staff` | Catálogo dedicado con fichas para WhatsApp, existencias Odoo, selector de visibilidad Web y atajos. |
| **Cotizador Express Whaticket** | `https://elojoganador.com/?cotizador=1` | Cotizador rápido con selector de chat abierto en Whaticket, cálculo de envío por KM y despacho en 1 clic. |
| **Subida de Fotos HD (Link Único)** | `https://elojoganador.com/subir-fotos.html` | Herramienta móvil para que el personal tome y suba fotos de mercancía en mano al catálogo. |
| **Subida de Historias y Reels** | `https://elojoganador.com/subir-historias.html` | Gestor de videos verticales estilo TikTok / Reels (@elojoganador) con link directo de compra. |
| **Panel Administrativo CMS** | `https://elojoganador.com/?admin=1` | Panel de control para cargar catálogo masivo (JSON/CSV), configurar Odoo/Whaticket y rastrear pedidos. |

---

## 🚀 Despliegue en Servidor (Traefik + Docker)

El proyecto está configurado con **Traefik** sobre la red `RenaceNet` con redirección automática HTTP → HTTPS y certificados SSL vía Let's Encrypt para `elojoganador.com` y `www.elojoganador.com`.

### 1. Variables de Entorno (`.env`)
```ini
STORE_NAME="EL OJO GANADOR"
STORE_DOMAIN="elojoganador.com"
STORE_WHATSAPP_PHONE="18293759724"
PORT=3000
NODE_ENV=production

# Whaticket API
WHATICKET_API_URL=https://api.whaticket.com/api/v1
WHATICKET_TOKEN=your_token
WHATICKET_COMPANY_ID=1b6f3958-9511-4bc5-94d7-8ba6e26061a5
WHATICKET_CONNECTION_ID=b24ea8c3-f5ed-46de-b612-dbe8f76e53c8

# Odoo ERP
ODOO_URL=https://mvpflow.renace.tech
ODOO_DB=mvpflow
ODOO_USERNAME=info@mvpflowboutique.com
ODOO_API_KEY=your_key
```

### 2. Ejecutar Despliegue Automático
```bash
cd /var/www/ganador
bash deploy.sh
```

El script ejecuta automáticamente:
1. Respaldo y preservación de `/server/data` y `.env`.
2. Compilación del frontend Vite multi-página (`dist/`).
3. Construcción de imagen Docker `ganador:latest`.
4. Enrolamiento en Traefik dentro de la red `RenaceNet` bajo `elojoganador.com`.

---

## 📦 Carga y Gestión Masiva del Catálogo

En el Panel de Administración (`/?admin=1`), pulsa en **"Cargar Catálogo"**:
- **Formato JSON**: Pega un arreglo de objetos con los productos (`name`, `price`, `category`, `stockLeft`, `images`, `sizes`).
- **Formato CSV**: Pega líneas con la estructura `Nombre, Precio, Categoría, Stock, PrecioOriginal, Tallas, Imagen, Tag`.
- **Modos de importación**:
  - `Combinar / Actualizar`: Agrega productos nuevos sin borrar los existentes.
  - `Reemplazar Catálogo Completo`: Sustituye todo el inventario con el nuevo lote cargado.
- **Exportar Catálogo**: Descarga instantánea en formato JSON para respaldos.
