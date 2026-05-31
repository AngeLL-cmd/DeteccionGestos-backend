<div align="center">

# 🤖 SmartGesture Analytics — Backend

**API REST para el registro y análisis estadístico de detecciones gestuales**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/Licencia-ISC-blue?style=for-the-badge)](LICENSE)

---

*Servidor backend que expone endpoints para persistir detecciones de gestos corporativos y consultar estadísticas agregadas. Construido con Express 5 y Supabase como base de datos en la nube.*

</div>

<br>

## 📑 Tabla de contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Reglas de negocio](#-reglas-de-negocio)
- [Despliegue](#-despliegue)

<br>

## 📝 Descripción

Este backend forma parte de la plataforma **SmartGesture Analytics**, un sistema de reconocimiento gestual en tiempo real orientado al entorno corporativo. Su función principal es:

- **Recibir y almacenar** las detecciones de gestos que envía el frontend (con validación de confianza mínima).
- **Proveer estadísticas** agregadas por categoría de gesto.
- **Servir el historial** completo de detecciones ordenado cronológicamente.

<br>

## 🏛 Arquitectura

El proyecto sigue un patrón **MVC simplificado** (Routes → Controllers → Services) que separa responsabilidades de forma clara:

```
Cliente (Frontend)
       │
       ▼
   ┌────────┐
   │ Express│  ← CORS habilitado
   │ Server │
   └───┬────┘
       │
   ┌───┴────────────────────┐
   │        Routes          │
   │  /api/detecciones      │
   │  /api/estadisticas     │
   └───┬────────────────────┘
       │
   ┌───┴────────────────────┐
   │     Controllers        │
   │  deteccionesController │
   │  estadisticasController│
   └───┬────────────────────┘
       │
   ┌───┴────────────────────┐
   │      Services          │
   │   gestureService       │
   │  (validación ≥ 90%)    │
   └───┬────────────────────┘
       │
   ┌───┴────────────────────┐
   │   Supabase (PostgreSQL)│
   │   Tabla: detecciones   │
   └────────────────────────┘
```

<br>

## 🛠 Tecnologías

| Tecnología | Versión | Propósito |
|:---|:---:|:---|
| **Node.js** | 18+ | Entorno de ejecución |
| **Express** | 5.2.x | Framework HTTP |
| **Supabase JS** | 2.106.x | Cliente de base de datos |
| **dotenv** | 17.x | Gestión de variables de entorno |
| **CORS** | 2.8.x | Middleware de políticas CORS |

<br>

## 📂 Estructura del proyecto

```
backend/
├── config/
│   └── supabase.js            # Inicialización del cliente Supabase
├── controllers/
│   ├── deteccionesController.js   # Lógica para guardar y obtener detecciones
│   └── estadisticasController.js  # Lógica de estadísticas agregadas
├── middleware/                 # (Reservado para futuros middlewares)
├── routes/
│   ├── detecciones.js         # POST / GET  →  /api/detecciones
│   └── estadisticas.js        # GET         →  /api/estadisticas
├── services/
│   └── gestureService.js      # Lógica de negocio y validación de confianza
├── .env                       # Variables de entorno (no versionado)
├── .gitignore
├── package.json
└── server.js                  # Punto de entrada de la aplicación
```

<br>

## ⚙ Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- Una cuenta en [Supabase](https://supabase.com/) con una tabla `detecciones`

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Iniciar el servidor
npm start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto configurado en `.env`).

<br>

## 🔐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

| Variable | Descripción | Ejemplo |
|:---|:---|:---|
| `PORT` | Puerto del servidor | `3000` |
| `SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxxxx.supabase.co` |
| `SUPABASE_KEY` | Clave de servicio (service_role) | `eyJhbGciOiJIUz...` |

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_clave_de_servicio
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Ya está incluido en `.gitignore`.

<br>

## 📡 Endpoints de la API

### `GET /`

Estado del servidor.

**Respuesta** `200`:
```json
{
  "proyecto": "SmartGesture Analytics",
  "estado": "Activo"
}
```

---

### `POST /api/detecciones`

Registra una nueva detección de gesto.

**Body** (JSON):
```json
{
  "gesto": "Aprobación",
  "confianza": 95.42
}
```

**Respuesta exitosa** `201`:
```json
{
  "success": true,
  "message": "Detección guardada",
  "data": [{ "id": 1, "gesto": "Aprobación", "confianza": 95.42, "fecha": "..." }]
}
```

**Confianza insuficiente** `200`:
```json
{
  "success": false,
  "message": "Confianza insuficiente"
}
```

**Datos faltantes** `400`:
```json
{
  "success": false,
  "message": "Faltan datos"
}
```

---

### `GET /api/detecciones`

Obtiene todas las detecciones ordenadas por fecha descendente.

**Respuesta** `200`:
```json
{
  "success": true,
  "total": 42,
  "data": [
    { "id": 42, "gesto": "Consulta", "confianza": 97.15, "fecha": "..." },
    ...
  ]
}
```

---

### `GET /api/estadisticas`

Devuelve estadísticas agregadas de todas las detecciones.

**Respuesta** `200`:
```json
{
  "success": true,
  "estadisticas": {
    "total": 42,
    "aprobacion": 15,
    "consulta": 10,
    "atencion": 9,
    "desacuerdo": 8,
    "promedioConfianza": "96.73"
  }
}
```

<br>

## 📏 Reglas de negocio

| Regla | Detalle |
|:---|:---|
| **Confianza mínima** | Solo se persisten detecciones con confianza **≥ 90%** |
| **Campos obligatorios** | `gesto` y `confianza` son requeridos en cada POST |
| **Gestos válidos** | `Aprobación`, `Consulta`, `Atención`, `Desacuerdo` |
| **Orden del historial** | Por `fecha` descendente (más reciente primero) |

<br>

## 🚀 Despliegue

El backend está configurado para desplegarse en **[Render](https://render.com/)**:

- **URL de producción**: `https://detecciongestos-backend.onrender.com`
- **Comando de inicio**: `npm start`
- **Variables de entorno**: Configurar `SUPABASE_URL` y `SUPABASE_KEY` en el panel de Render

### Base de datos

La tabla `detecciones` en Supabase tiene la siguiente estructura:

| Columna | Tipo | Descripción |
|:---|:---|:---|
| `id` | `int8` (auto) | Identificador único |
| `gesto` | `text` | Nombre del gesto detectado |
| `confianza` | `float8` | Porcentaje de confianza (0–100) |
| `fecha` | `timestamptz` | Fecha y hora de la detección |

---

<div align="center">

**Desarrollado como parte de la plataforma SmartGesture Analytics** 🤝

</div>
