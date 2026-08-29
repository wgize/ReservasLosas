# ⚽ MiCancha — Reservas de canchas deportivas en Cusco

Rediseño profesional del MVP **ReservasLosas**. Misma arquitectura (Express + MySQL + React),
misma separación backend/frontend y mismas rutas de negocio en español, pero con una base
técnica sólida para evolucionar a "red social deportiva".

> 📄 Lee [`PROPUESTA.md`](./PROPUESTA.md) para ver el estudio del layout, el stack elegido,
> la estructura y el plan de despliegue a $0.

---

## Stack

| Capa | Tecnología | Despliegue |
|---|---|---|
| Frontend | React 19 + Vite 7 + React Router 7 + Tailwind CSS v4 + Leaflet | **Vercel** ($0) |
| Backend | Node.js + Express 5 + mysql2 + JWT + Zod + rate limit | **Render** ($0, con sleep) |
| Base de datos | MySQL (utf8mb4, FKs, índices, migraciones versionadas) | **Aiven** (1 GB gratis) |
| Mapas | Leaflet + OpenStreetMap (sin API key) | $0 |

---

## Requisitos previos

- **Node.js 20+** (recomendado 22 o 24)
- **npm** 10+
- Una base de datos **MySQL** (local, Docker o el plan gratuito de Aiven)

---

## 1) Configuración del backend

```bash
cd backend
cp .env.example .env      # edita .env con tus datos reales
npm install
npm run migrate           # crea las tablas (usuarios, canchas, horarios, reservas)
npm run seed              # crea el usuario admin
# opcional, datos de demo (dueño + 2 canchas + horarios):
npm run seed -- --demo
npm run dev               # API en http://localhost:4000
```

Verifica: `http://localhost:4000/api/health` debe responder `{"status":"ok","db":"ok"}`.

### Usuarios iniciales

| Rol | Email | Password |
|---|---|---|
| Admin | `admin@micancha.pe` | `admin123456` |
| Dueño demo (solo `--demo`) | `dueno@micancha.pe` | `dueno123456` |

> ⚠️ Cambia `ADMIN_PASSWORD` en `.env` **antes** de desplegar a producción.

---

## 2) Configuración del frontend

```bash
cd frontend
cp .env.example .env      # en local: VITE_API_URL=/api (usa el proxy de Vite)
npm install
npm run dev               # app en http://localhost:5173
```

En desarrollo, Vite hace proxy de `/api` hacia `http://localhost:4000`, así no hay CORS.

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `4000` |
| `DB_HOST` | Host MySQL | `localhost` o el host de Aiven |
| `DB_PORT` | Puerto MySQL | `3306` |
| `DB_USER` / `DB_PASS` | Credenciales | — |
| `DB_NAME` | Nombre de la BD | `micancha` |
| `DB_SSL` | Conexión cifrada (obligatorio en Aiven) | `true` |
| `DB_CA_PATH` | Ruta al certificado CA (recomendado en prod) | `./ca.pem` |
| `JWT_SECRET` | Secreto de los tokens (generar uno largo) | — |
| `JWT_EXPIRES_IN` | Vigencia del token | `8h` |
| `CORS_ORIGIN` | Orígenes permitidos (coma) | `https://tu-app.vercel.app` |
| `RATE_LIMIT_LOGIN_MAX` | Intentos de login por ventana | `10` |
| `RATE_LIMIT_REGISTER_MAX` | Registros por ventana | `5` |
| `ADMIN_EMAIL/PASSWORD/NOMBRE` | Admin semilla | — |

Genera un secreto JWT:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `/api` (local) o `https://tu-api.onrender.com/api` (prod) |

---

## Estructura del proyecto

```
micancha-v2/
├── backend/
│   ├── src/
│   │   ├── server.js            # Express + helmet + CORS + error handler
│   │   ├── db.js                # pool mysql2/promise + TLS (Aiven)
│   │   ├── middleware/auth.js   # JWT + control de roles (valida contra BD)
│   │   ├── routes/              # auth, canchas, horarios, reservas, admin
│   │   ├── migrations/          # migraciones SQL versionadas
│   │   └── scripts/             # migrate.js y seed.js
│   ├── schema.sql               # esquema de referencia
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── context/             # AuthContext + ToastContext
│   │   ├── components/          # Header, Card, MapView, ProtectedRoute...
│   │   ├── pages/               # Home, Login, Register, Dashboards, NotFound
│   │   └── utils/api.js         # axios + token
│   ├── vite.config.js
│   └── vercel.json              # rewrites SPA para Vercel
├── PROPUESTA.md
└── README.md
```

---

## Despliegue ($0)

### 1. Base de datos — Aiven (MySQL gratis)

1. Crea un servicio **MySQL** (plan Free, 1 GB).
2. Anota: host, puerto, usuario, password y nombre de BD.
3. En `backend/.env`:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - `DB_SSL=true` (Aiven exige TLS)
   - Recomendado: descarga el **CA certificate** de Aiven, colócalo en `backend/ca.pem` y define `DB_CA_PATH=./ca.pem`.
4. Ejecuta las migraciones y el seed apuntando a Aiven:
   ```bash
   cd backend && npm run migrate && npm run seed
   ```

### 2. Backend — Render (Web Service)

1. Nuevo **Web Service** → conecta el repo → root directory: `micancha-v2/backend`.
2. **Build command**: `npm install`
3. **Start command**: `npm start`
4. Agrega las **mismas variables de entorno** del `.env` (menos `PORT`, que lo asigna Render).
5. Plan **Free**: el servicio entra en *sleep* tras ~15 min de inactividad (el primer request tarda unos segundos en despertar).

### 3. Frontend — Vercel

1. Importa el repo en Vercel → root directory: `micancha-v2/frontend`.
2. Framework: **Vite** (se autodetecta).
3. Build: `npm run build` · Output: `dist`.
4. Variable de entorno: `VITE_API_URL=https://tu-backend.onrender.com/api`.
5. El archivo `vercel.json` ya incluye los rewrites para React Router.

### 4. Mapas

Leaflet + OpenStreetMap funciona sin API key ni cuenta. Cero costo y cero configuración.

---

## Migraciones de base de datos

Las migraciones viven en `backend/src/migrations/` y se aplican en orden con:

```bash
npm run migrate
```

Cada archivo nuevo se registra en la tabla `schema_migrations`. Para agregar una tabla
nueva (fase de red social), crea `backend/src/migrations/002_....sql` y vuelve a ejecutar el comando.

---

## Seguridad aplicada (respecto al MVP anterior)

- ✅ Registro con **whitelist de roles** (`cliente`/`dueno`); `admin` solo vía seed.
- ✅ **Sin secreto JWT por defecto** (falla rápido si falta `JWT_SECRET`).
- ✅ Token validado contra la BD (usuarios bloqueados/eliminados pierden acceso al instante).
- ✅ **Reservas en transacción con `SELECT ... FOR UPDATE`** → sin doble reserva.
- ✅ PUT/DELETE de **horarios con control de ownership** (dueño de la cancha o admin).
- ✅ **Rate limiting** en login/register.
- ✅ Validación de entrada con **Zod** en todos los endpoints de escritura.
- ✅ `helmet`, CORS restringido y manejador global de errores.

---

## Roadmap (por fases, se implementa bajo tu confirmación)

- **Fase A** — Perfiles y descubrimiento: perfil público, página de cancha con galería + reseñas 1–5★, mapa.
- **Fase B** — Interacción social: seguir usuarios/canchas, feed de actividad, "armar partido", comentarios/likes, notificaciones in-app.
- **Fase C** — Comunidad y monetización: equipos/grupos, chat, estadísticas para dueños, pagos (Culqi/Mercado Pago).
