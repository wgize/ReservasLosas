# 📐 MiCancha v2 — Propuesta técnica

## 1. Objetivo

Llevar el MVP **ReservasLosas** a un producto profesional ("casi una red social" para el deporte
amateur en Cusco), sin descartar lo existente: se **reutiliza** la arquitectura, las rutas de
negocio en español y la distribución visual de secciones que ya te gusta. Se corrigen los bugs
y huecos de seguridad encontrados en la auditoría y se deja una base reproducible desde cero.

---

## 2. Estudio de la distribución de secciones del front actual

La clave del front actual es que **todo vive en tarjetas apiladas dentro de un contenedor
centrado**: simple, interactiva y muy legible para el público objetivo. Esa distribución se
conserva y se pule:

| # | Sección actual | Archivo origen | Qué se conserva | Mejora aplicada |
|---|---|---|---|---|
| 1 | Barra superior (logo + sesión) | `HeaderCard.js` | Sticky, logo a la izquierda, nav a la derecha | Tailwind, botón "Mi panel" según rol |
| 2 | Hero + intro de marca | `Home.js` | Tarjeta centrada con título y subtítulo | Colores de marca (verde cancha) |
| 3 | 3 tarjetas por rol | `Home.js` | Grid de Clientes/Dueños/Administradores | Responsive (`sm:grid-cols-3`) |
| 4 | CTA | `Home.js` | Botón "Comienza ahora" | Ahora **sí navega** (bug corregido) |
| 5 | Auth centrada | `Login/Register.js` + `CardContainer.js` | Card centrada con hover | Labels, estados de carga, toasts |
| 6 | Búsqueda de canchas | `ClientDashboard.js` | Card de filtros (zona + texto) | Loading/empty states |
| 7 | Cancha + horarios | `ClientDashboard.js` | Card por cancha, lista de horarios, botón Reservar | Mapa Leaflet si hay coordenadas, badges de estado |
| 8 | Alta de cancha + horarios | `OwnerDashboard.js` | Cards de formulario + lista | **Bug de `cancha_id` corregido** (estado local por formulario) |
| 9 | Listas de admin | `AdminDashboard.js` | Cards de usuarios y reservas | Protección contra auto-bloqueo |
| 10 | `alert()` | varios | — | Reemplazado por **toasts** |

El lenguaje visual (tarjetas blancas, sombras suaves, botón primario, inputs redondeados,
espaciado generoso) se traduce a un mini design-system en `index.css` usando tokens de
Tailwind v4 (`--color-brand-*`, `.card`, `.btn`, `.input`, `.badge`).

---

## 3. Stack elegido (y por qué)

Dado el presupuesto **$0** (Vercel + Render + Aiven + Leaflet):

- **Frontend: Vite + React 19 + React Router 7 + Tailwind CSS v4.**
  Se reemplaza Create React App (deprecado) por Vite: build más rápido, menor peso y soporte
  oficial de React 19. Se mantiene **React** y **Axios** (lo que ya usabas). Tailwind v4 es
  liviano y no impone un look genérico, como pediste. **No** se usan librerías pesadas de UI.
- **Backend: Express 5 + mysql2/promise + JWT + bcryptjs + Zod + express-rate-limit + helmet.**
  Se mantiene Express + MySQL (perfecto para Render/Aiven). Se pasa de *callbacks* a
  `mysql2/promise` (async/await, más legible y menos anidamiento). `bcryptjs` sustituye a
  `bcrypt` para **eliminar dependencia nativa** y hacer la instalación reproducible en cualquier
  SO sin toolchain de compilación (mismo algoritmo, misma API).
- **Mapas: Leaflet + react-leaflet + OpenStreetMap.** Sin API key, sin costo, ideal para el MVP.

### Por qué no Next.js en Vercel

Next.js acoplaría el frontend con el backend y complicaría la separación que quieres mantener
(frontend estático en Vercel + API en Render + MySQL en Aiven). Un SPA con Vite es más simple de
desplegar y de mantener en este escenario de costo cero.

---

## 4. Estructura (rediseño)

```
micancha-v2/
├── backend/                 # API (Express 5)
│   ├── src/
│   │   ├── server.js
│   │   ├── db.js            # pool + TLS para Aiven
│   │   ├── middleware/auth.js
│   │   ├── routes/          # auth, canchas, horarios, reservas, admin
│   │   ├── migrations/      # migraciones SQL versionadas
│   │   └── scripts/         # migrate + seed
│   ├── schema.sql
│   └── .env.example
└── frontend/                # SPA (Vite + React + Tailwind)
    ├── src/
    │   ├── context/         # AuthContext, ToastContext
    │   ├── components/      # Header, Card, MapView, ProtectedRoute
    │   ├── pages/           # Home, Login, Register, 3 dashboards, NotFound
    │   └── utils/api.js
    ├── vite.config.js
    └── vercel.json
```

Cambios estructurales clave:
- Backend reorganizado bajo `src/` y con **scripts de migración y seed**.
- `migrations/` versionadas (requisito para evolucionar la BD sin romper nada).
- Frontend con `context/` (auth + toasts), `components/` y `pages/` bien separados.

---

## 5. Correcciones de la auditoría aplicadas

| Hallazgo | Fix |
|---|---|
| Registro permitía crear `admin` desde el body | `z.enum(['cliente','dueno'])`; admin solo por seed |
| `JWT_SECRET` por defecto `'secret'` | Sin fallback; el servidor no arranca sin secreto |
| Horarios PUT/DELETE sin ownership | Validación de dueño de cancha o admin |
| Doble reserva (race condition) | Transacción + `SELECT ... FOR UPDATE` |
| Cancel reserva permitía a dueños ajenos | Autorización por rol y ownership en transacción |
| Login/Register no actualizaban el estado global | Usan `login()` del AuthContext |
| `alert()` | Sistema de toasts |
| Token de usuario bloqueado seguía válido | `authRequired` re-consulta la BD |
| `baseURL` hardcodeada | `VITE_API_URL` + proxy de Vite |
| Sin esquema reproducible | `schema.sql` + migraciones + seed |

---

## 6. Plan de despliegue $0

1. **Aiven** (MySQL gratis 1 GB): se conecta con TLS (`DB_SSL=true`, y `DB_CA_PATH` con el
   certificado CA en producción).
2. **Render** (Web Service free): `npm install` → `npm start`, con las variables de entorno.
   Entra en *sleep* a los ~15 min de inactividad (el primer request tarda unos segundos).
3. **Vercel** (frontend estático): framework Vite, `VITE_API_URL` apuntando a Render,
   `vercel.json` con rewrites SPA.
4. **Leaflet + OSM**: sin configuración.

---

## 7. Roadmap evolutivo (bajo tu confirmación en cada fase)

- **Fase A — Perfiles y descubrimiento:** perfil público (foto, bio, deportes favoritos),
  página de cancha (galería, mapa, rating, reseñas 1–5★ tras reserva completada).
- **Fase B — Interacción social:** seguir usuarios/canchas, feed de actividad, "armar partido"
  con cupo, comentarios/likes, notificaciones in-app.
- **Fase C — Comunidad y monetización:** equipos, chat, estadísticas para dueños, pagos
  (Culqi o Mercado Pago por ser locales a Perú).

Cada fase nueva añade sus tablas como migración versionada (`002_...`, `003_...`) y sus
endpoints con control de rol/ownership, manteniendo el mismo estilo de tarjetas en el front.
