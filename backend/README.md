# Jarvis Ecommerce — Backend (Next.js API)

Backend de la API `/api/v1` de Jarvis Technology. Reemplaza el backend Spring Boot
original (`Sitio web J/backend`) replicando 1:1 sus rutas, DTOs, errores, paginación
Spring y JWT HS256, contra la misma base de datos PostgreSQL en Supabase.

## Stack

- Next.js 16 (App Router, Route Handlers)
- Prisma 6 (lectura del schema existente — sin migraciones propias)
- PostgreSQL (Supabase)
- JWT HS256 (`jose`) — réplica exacta del JWT de Spring
- Supabase Storage (imágenes)
- MercadoPago (SDK)

## Estructura

```
app/api/v1/     # Route handlers (la API)
services/       # Lógica de negocio por dominio
lib/            # Utilidades (http, errors, jwt, auth, pagination, resolvers, validators, supabase, db)
prisma/         # Schema introspectado (solo lectura: NO usar db push/migrate)
proxy.ts        # CORS (Next 16: middleware renombrado a proxy)
```

## Puesta en marcha

```bash
npm install
cp .env.example .env   # completar credenciales reales
npx prisma generate    # regenerar el cliente Prisma desde el schema
npm run dev            # API en http://localhost:3000
```

El frontend (React/Vite) vive en `../frontend` y consume esta API.

## Endpoints principales

- `GET/POST  /api/v1/products` (+ `/featured`, `/search`, `/category/{id}`, `/brand/{id}`, `/slug/{slug}`)
- `GET/POST  /api/v1/categories` , `/api/v1/brands`, `/api/v1/services`, `/api/v1/service-categories`, `/api/v1/promotions`
- `GET/POST/PUT/DELETE  /api/v1/{recurso}/{id}`
- `POST  /api/v1/auth/login`
- `GET/POST  /api/v1/cart`, `/api/v1/cart/items`
- `GET/PUT  /api/v1/business-settings` (+ `upload/{field}`)
- `POST  /api/v1/images/{product|service|promotion}/{id}`, `DELETE /api/v1/images/{id}`
- `GET  /api/v1/images/file/{fileName}`
- `POST  /api/v1/payments` (+ `/webhook`)

## Notas

- Los errores replican el formato Spring: `{timestamp, status, error, message}`
- La seguridad pública/protegida replica `SecurityConfig.java` (POST/PUT/DELETE requiere JWT válido)
- `prisma db pull` regenera el schema; **no** ejecutar `prisma db push` ni `migrate` (la BD es compartida con el backend original).
