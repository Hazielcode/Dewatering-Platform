# 🔧 CONTEXTO DEL PROYECTO — LÉEME PRIMERO

> **INSTRUCCIÓN PARA LA IA:** Este archivo contiene TODO el contexto necesario para continuar
> el desarrollo de la plataforma Dewatering Solutions. Léelo completo antes de hacer cualquier cambio.

---

## 1. Origen del Proyecto

Este proyecto es un **clon de MainRoot** (una plataforma enterprise de gestión con Zero Trust).
Se reutiliza como base para construir la plataforma web de **Dewatering Solutions**.

- **MainRoot = la empresa desarrolladora (nosotros).**
- **Dewatering Solutions = el cliente real (empresa de Lima, Perú).**
- **Tipo de proyecto: Pre-tesis universitaria + producto real.**

---

## 2. Stack Actual

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js 22 + Express 5 |
| Frontend | React 19 + Vite 8 |
| Base de Datos | PostgreSQL (Supabase) |
| Auth | JWT (HS256, 8h exp) + bcrypt 12 rounds |
| Seguridad | RBAC + ABAC + Audit Trail |
| Deploy futuro | Docker (multi-stage) |
| Estilos | CSS vanilla con variables (Design System propio) |

---

## 3. ¿Qué es Dewatering Solutions?

- Fundada 2017, Lima, Perú
- Especializada en **separación sólido-líquido** para minería
- Servicios: ensayos de filtración, espesamiento, flotación, lixiviación, pilotajes, montaje
- Productos: filtros prensa, bombas, decanters, espesadores (Italia/Sudáfrica)
- Certificación **ISO 9001**
- +25 años experiencia técnica acumulada
- **Colores corporativos:** Azul (#1a365d, #2563eb) + Plomo (#4a5568, #94a3b8)
- Horario: Lunes a sábado 08:00-18:00

---

## 4. Roles RBAC del Sistema

| Rol | Acceso |
|-----|--------|
| `SUPER_ADMIN` | Todo — auditoría, gestión de usuarios, configuración |
| `ADMIN` | CRM completo, cotizaciones, proyectos, documentos |
| `COMMERCIAL` | Leads, cotizaciones, clientes |
| `ENGINEER` | Proyectos, documentos técnicos |
| `CLIENT` | Portal B2B — ver sus solicitudes, cotizaciones, documentos |

---

## 5. Base de Datos (Supabase)

- **Host:** `db.exkjyjfcgndhwwdytioa.supabase.co`
- **Puerto:** 5432
- **User:** postgres
- **Password:** Configurada en `backend/.env` (línea 9)
- **Database:** postgres

### Schema SQL (11 tablas) — ya escrito en `database/database.sql`:

1. `users` — Usuarios con role single (SUPER_ADMIN, ADMIN, COMMERCIAL, ENGINEER, CLIENT)
2. `service_categories` — Categorías de servicios (Filtración, Espesamiento, etc.)
3. `services` — Servicios individuales
4. `products` — Productos/equipos industriales con specs JSONB
5. `leads` — Solicitudes de contacto / prospectos CRM
6. `quotations` — Cotizaciones con items JSONB y versionado
7. `projects` — Proyectos post-venta
8. `documents` — Fichas técnicas, informes, certificados (archivos)
9. `chatbot_conversations` — Historial del chatbot IA
10. `audit_logs` — Auditoría de acciones
11. `document_embeddings` — Vectores para RAG (pgvector)

---

## 6. Estado Actual — ¿QUÉ YA SE HIZO?

### ✅ Frontend — Rebrand completo
- `index.css` — Paleta de colores cambiada a Azul Industrial + Plomo (light + dark mode)
- `LoginPage.jsx` — Logo "D", nombre "Dewatering Solutions", slogan, correo `@dewatering.com`
- `DashboardLayout.jsx` — Sidebar rebrandeado: logo "D", nombre "Dewatering", nuevas secciones de navegación (Cotizaciones, Leads, Proyectos, Documentos, Auditoría, Roles y Usuarios)
- `AuthContext.jsx` — Roles actualizados a SUPER_ADMIN/ADMIN/COMMERCIAL/ENGINEER/CLIENT
- `App.jsx` — Aún tiene las rutas viejas de MainRoot (necesita actualización)

### ✅ Backend — Parcialmente adaptado
- `.env` — Apunta a nueva Supabase (credenciales configuradas)
- `database/database.sql` — Schema nuevo con 11 tablas (LISTO para migrar)
- `config/db.js` — Logs rebrandeados a [Dewatering]
- `migrate.js` — Logs rebrandeados a [Dewatering]
- `middlewares/abacMiddleware.js` — Roles actualizados
- `middlewares/rbacMiddleware.js` — Sin cambios necesarios (es genérico)

### ⚠️ Backend — SIN CAMBIAR (aún tiene código de MainRoot)
- `controllers/` — Todos los controllers son de MainRoot (productController, storeController, etc.)
- `models/` — Todos los models son de MainRoot
- `routes/` — Todas las rutas son de MainRoot
- `services/authService.js` — Aún valida `@mainroot.com` y usa tabla `usuarios` vieja
- `app.js` — Aún registra rutas viejas

---

## 7. ¿QUÉ FALTA POR HACER? (En orden de prioridad)

### 🔴 PASO INMEDIATO — Conectar la DB
1. Ejecutar `npm install` en `backend/`
2. Ejecutar `node migrate.js` para crear las 11 tablas en Supabase
3. Ejecutar `npm run dev` para verificar que el backend levanta
4. Ejecutar `npm install` y `npm run dev` en `frontend/` para verificar el frontend

### 🟡 SEMANA 1 — Backend nuevo
5. **Reescribir `authService.js`**: Cambiar validación de `@mainroot.com` a `@dewatering.com`, usar tabla `users` (UUID) en vez de `usuarios`
6. **Crear nuevos models**: `leadModel.js`, `quotationModel.js`, `serviceModel.js`, `productModel.js` (Dewatering), `documentModel.js`, `projectModel.js`
7. **Crear nuevos controllers**: `leadController.js`, `quotationController.js`, `serviceController.js`, `documentController.js`, `projectController.js`
8. **Crear nuevas routes**: `/api/leads`, `/api/quotations`, `/api/services`, `/api/products`, `/api/documents`, `/api/projects`
9. **Actualizar `app.js`**: Registrar las nuevas rutas, eliminar las viejas (stores, inventory)
10. **Crear seed script nuevo**: `seed_dewatering.js` con datos demo (servicios, productos, usuarios admin)

### 🟡 SEMANA 2 — Frontend páginas nuevas
11. **Landing Page** (pública, sin login): Hero + servicios + equipos + contacto + WhatsApp
12. **Página "Nosotros"**: Misión, visión, valores, ISO 9001, trayectoria
13. **Catálogo de Servicios**: Cards con los 13 servicios organizados por categoría
14. **Catálogo de Productos**: Equipos con fichas técnicas descargables
15. **Formulario de Contacto**: Crea un lead automáticamente en el backend
16. **Dashboard ejecutivo**: KPIs reales (leads, cotizaciones, proyectos)
17. **Página de Leads (CRM)**: CRUD con pipeline visual (NEW→CONTACTED→PROPOSAL→WON/LOST)
18. **Página de Cotizaciones**: Crear, enviar, versionar cotizaciones
19. **Actualizar `App.jsx`**: Nuevas rutas para todas las páginas

### 🟢 SEMANA 3 — Portal Cliente + Chatbot IA
20. **Portal B2B**: Clientes ven sus solicitudes, cotizaciones, documentos
21. **Registro de clientes**: Con rol CLIENT
22. **Chatbot RAG**: Groq API (free tier) + pgvector para embeddings
23. **Widget de chat**: Componente flotante en el frontend
24. **Ingestión de documentos**: Subir PDFs → chunking → embeddings

### 🟢 SEMANA 4 — Pulido + Deploy
25. Testing completo
26. Responsive mobile/tablet
27. Deploy: frontend en Vercel, backend en Render (ambos free tier)
28. Docker Compose para demo local
29. Documentación de la tesis

---

## 8. Restricciones

- **Presupuesto: $0 durante desarrollo** — todo en free tiers
- **Timeline: 4 semanas**
- **El chatbot con IA es OBLIGATORIO** (requisito del cliente y la tesis)
- **Groq API** para el chatbot (free tier, 30 req/min, modelo llama-3.3-70b-versatile)
- **NO usar**: Redis, Terraform, Grafana, Sentry, AWS, Spring Boot, GraphQL
- **SÍ usar**: Express, React, Vite, PostgreSQL, Supabase, JWT, Docker

---

## 9. Archivos clave que la IA debe leer primero

| Archivo | Para qué |
|---------|----------|
| `backend/.env` | Verificar conexión a Supabase |
| `database/database.sql` | Ver el schema completo (11 tablas) |
| `backend/src/app.js` | Ver rutas actuales (necesitan actualización) |
| `backend/src/services/authService.js` | Lógica de auth (necesita adaptación) |
| `frontend/src/App.jsx` | Rutas del frontend (necesitan actualización) |
| `frontend/src/index.css` | Design system (ya rebrandeado) |
| `frontend/src/components/DashboardLayout.jsx` | Layout del admin (ya rebrandeado) |
| `analisis_dewatering.md` | Análisis completo de arquitectura y decisiones |

---

## 10. Identidad Visual

- **Nombre:** Dewatering Solutions
- **Slogan:** "Especialistas en separación sólido-líquido y soluciones integrales para la industria"
- **Tipografía:** Poppins (ya incluida)
- **Logo temporal:** Letra "D" con gradiente azul
- **Light mode:** Fondo #f4f6fb, texto #1a365d, accent #2563eb
- **Dark mode:** Fondo #0f172a, texto #f8fafc, accent #3b82f6
- **Estilo:** Industrial profesional, limpio, transmitir confianza técnica
