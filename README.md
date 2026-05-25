# 🖤 moda-store

E-commerce de ropa full-stack con panel de administración, carrito de compras, autenticación JWT y subida de imágenes a Cloudinary.

Proyecto desarrollado como portfolio personal. Diseño minimalista inspirado en ASOS y Supreme.

---

## 🛠 Stack tecnológico

### Backend
| Tecnología | Uso |
|---|---|
| **Node.js + Express** | Servidor HTTP y API REST |
| **TypeScript** | Tipado estático end-to-end |
| **Prisma ORM** | Acceso a base de datos con type-safety |
| **PostgreSQL** | Base de datos relacional |
| **Docker** | Contenedor para PostgreSQL en desarrollo |
| **JWT + bcryptjs** | Autenticación y encriptación de contraseñas |
| **Zod** | Validación de schemas en las rutas |
| **Cloudinary** | Almacenamiento y optimización de imágenes |
| **Resend** | Emails transaccionales (bienvenida + órdenes) |
| **Multer** | Procesamiento de archivos multipart |

### Frontend
| Tecnología | Uso |
|---|---|
| **React 19** | UI con hooks y contextos |
| **TypeScript** | Tipado en componentes y llamadas a la API |
| **Vite** | Bundler y dev server |
| **Tailwind CSS v3** | Estilos utility-first |
| **React Router v6** | Navegación SPA |
| **Inter** | Tipografía (Google Fonts) |

---

## ✨ Funcionalidades

- **Catálogo** con filtro por categoría y grilla responsive
- **Detalle de producto** con selector de talles y stock en tiempo real
- **Carrito** persistente con controles de cantidad
- **Checkout** que crea una orden en el backend
- **Autenticación** (registro + login) con JWT almacenado en localStorage
- **Panel admin** protegido con:
  - CRUD de productos con subida de imágenes a Cloudinary
  - Gestión de órdenes con actualización de estado
  - Dashboard con estadísticas
- **Emails automáticos**: bienvenida al registrarse + confirmación de orden
- **Roles**: `ADMIN` y `CLIENTE`

---

## 🚀 Correr localmente

### Prerequisitos

- Node.js 18+
- Docker Desktop
- Cuenta en [Cloudinary](https://cloudinary.com) (gratuita)
- Cuenta en [Resend](https://resend.com) (gratuita)

### 1. Clonar el repositorio

```bash
git clone https://github.com/MathiasSuarez96/moda-store.git
cd moda-store
```

### 2. Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL="postgresql://admin:admin123@localhost:5432/ecommerce?schema=public"
JWT_SECRET=tu_clave_secreta_aqui

# Cloudinary — https://console.cloudinary.com/
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Resend — https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=onboarding@resend.dev
```

### 3. Levantar la base de datos

```bash
docker-compose up -d
```

### 4. Instalar dependencias y configurar la base de datos

```bash
# Backend
npm install
npx prisma migrate dev
npx prisma db seed

# Frontend
cd client && npm install
```

### 5. Correr el proyecto

En dos terminales separadas:

```bash
# Terminal 1 — Backend (puerto 3000)
npm run dev

# Terminal 2 — Frontend (puerto 5173)
cd client && npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173)

---

## 🔑 Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| **Admin** | admin@ecommerce.com | 123456 |
| **Cliente** | cliente@gmail.com | 123456 |

El panel de administración está disponible en `/admin` (solo para el rol Admin).

---

## 📡 API Endpoints

### Auth
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar usuario | — |
| POST | `/api/auth/login` | Iniciar sesión | — |
| GET | `/api/auth/me` | Perfil del usuario | ✅ |

### Productos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/productos` | Listar todos | — |
| GET | `/api/productos/:id` | Detalle | — |
| GET | `/api/productos/categoria/:id` | Por categoría | — |
| POST | `/api/productos` | Crear | Admin |
| PUT | `/api/productos/:id` | Actualizar | Admin |
| DELETE | `/api/productos/:id` | Eliminar | Admin |

### Categorías
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Listar todas |
| POST | `/api/categorias` | Crear |

### Órdenes
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/ordenes` | Crear orden | ✅ |
| GET | `/api/ordenes` | Mis órdenes / todas (admin) | ✅ |
| PUT | `/api/ordenes/:id` | Actualizar estado | Admin |

### Uploads
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/uploads` | Subir imagen a Cloudinary | Admin |

---

## 🗄 Modelo de datos

```
Usuario ──< Orden ──< OrdenItem >── Producto >── Categoria
                                        │
                                      Talle
```

---

## 🌐 Deploy

- **Backend** → [Railway](https://railway.app) (ver `railway.toml`)
- **Frontend** → [Vercel](https://vercel.com) (ver `client/vercel.json`)

Instrucciones detalladas de deploy en la sección [Deploy](#deploy-1) más abajo.

---

## Deploy

### Backend en Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo → seleccionar `moda-store`
3. Agregar un servicio **PostgreSQL** desde el dashboard
4. En el servicio del backend, ir a **Variables** y agregar:
   ```
   DATABASE_URL        → (copiar de la variable generada por Railway PostgreSQL)
   JWT_SECRET          → una clave segura aleatoria
   CLOUDINARY_URL      → tu URL de Cloudinary
   RESEND_API_KEY      → tu API key de Resend
   RESEND_FROM         → tu email verificado en Resend
   NODE_ENV            → production
   ```
5. Railway detecta el `railway.toml` y corre `npx prisma migrate deploy && npm start`
6. Copiar la URL del backend generada por Railway (ej: `https://moda-store.up.railway.app`)

### Frontend en Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. New Project → Import desde GitHub → seleccionar `moda-store`
3. Configurar:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. En **Environment Variables** agregar:
   ```
   VITE_API_URL → https://tu-backend.up.railway.app
   ```
5. Deploy

---

## 📁 Estructura del proyecto

```
moda-store/
├── src/                    # Backend
│   ├── index.ts            # Entry point Express
│   ├── lib/
│   │   ├── cloudinary.ts   # Config Cloudinary
│   │   └── resend.ts       # Emails transaccionales
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── isAdmin.middleware.ts
│   │   ├── upload.ts       # Multer
│   │   └── validate.ts     # Zod
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── productos.ts
│   │   ├── categorias.ts
│   │   ├── orden.ts
│   │   └── uploads.ts
│   ├── schema/             # Schemas Zod
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/       # Auth + Cart
│   │   ├── lib/api.ts      # Cliente HTTP
│   │   ├── pages/
│   │   └── types/
│   └── vercel.json
├── docker-compose.yml
├── railway.toml
└── .env.example
```

---

## 👤 Autor

**Mathias Suarez** — [@MathiasSuarez96](https://github.com/MathiasSuarez96)
