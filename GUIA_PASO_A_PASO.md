# 🗳️ Guía de Despegue: Portal Electoral RELIDD 2026 ($0 Cero Costo)

Esta guía explica paso a paso la arquitectura, el funcionamiento colaborativo para los **3 miembros del Comité Electoral en diferentes ciudades** y las 4 cuentas gratuitas necesarias para poner en marcha el portal.

---

## 👥 ¿Por qué el diseño anterior no funcionaba para ustedes 3?

El diseño previo (`admin/index.html`) dependía de la API local del navegador: obligaba a una persona a tener los archivos en su computadora, abrir un archivo `.bat` (`PUBLICAR.bat`) y ejecutar comandos locales para publicar cambios. 
- Si tú hacías un cambio en una ciudad, tus otros dos compañeros en otras ciudades no lo veían.
- Requería instalar programas técnicos en cada laptop.

### 🌟 La Solución Moderna en la Nube ($0):
Transformamos el portal a **Next.js + Tailwind**, conectado a la nube:
1. **Página Pública (`/`):** Todos los votantes e integrantes de RELIDD ven la información actualizada al segundo.
2. **Panel Administrativo en la Nube (`/acceso` o `/admin`):** Cada uno de los 3 miembros del comité tiene su propio usuario y contraseña. Pueden entrar desde cualquier computadora o celular en cualquier ciudad.
3. **Cero Comandos Técnicos:** Suben un comunicado, cambian una fecha del calendario o suben un PDF oficial, pulsan "Guardar" y la web se actualiza al instante en todo el mundo.

---

## 🛠️ El Stack Tecnológico ($0 Cero Costo, Sin Tarjetas)

| Herramienta | Rol en el Proyecto | Costo |
| :--- | :--- | :--- |
| **GitHub** | Almacena el código fuente del proyecto y sincroniza las versiones. | $0 Gratis |
| **Firebase** (Google) | Base de datos en la nube (Firestore) y cuentas seguras para los 3 miembros del comité (Authentication). | $0 Gratis |
| **Cloudinary** | Almacena y distribuye las fotos de candidatos y los PDFs oficiales (Convocatoria, Reglamentos, Actas). | $0 Gratis |
| **Netlify** | Publica el sitio web en internet con dominio seguro HTTPS (`https://elecciones-relidd.netlify.app`). | $0 Gratis |

---

## 📋 Plan de Acción Paso a Paso

### 📍 Paso 1: Cuenta en GitHub (La Bóveda de Código)
1. Entra a [github.com](https://github.com) y crea tu cuenta gratuita (si ya tienes una, inicia sesión).
2. Generaremos un **Token Personal (Classic)** con permisos de `repo` para que el asistente pueda crear y subir el código automáticamente.

### 📍 Paso 2: Proyecto en Firebase (La Base de Datos de los 3 Miembros)
1. Entra a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google.
2. Crea un proyecto gratuito llamado `elecciones-relidd-2026`.
3. Activaremos **Firestore Database** (en modo de prueba) y **Authentication** (correo y contraseña).
4. Aquí registraremos los 3 correos de los miembros del Comité Electoral.

### 📍 Paso 3: Cuenta en Cloudinary (El Archivador de Fotos y PDFs)
1. Entra a [cloudinary.com](https://cloudinary.com) y regístrate gratis (no pide tarjeta de crédito).
2. Obtendremos el `Cloud Name`, `API Key` y `API Secret` para que el panel administrativo pueda subir archivos PDF y fotos directamente.

### 📍 Paso 4: Cuenta en Netlify (El Servidor Web Gratuito)
1. Entra a [netlify.com](https://netlify.com) e inicia sesión con tu cuenta de GitHub con un solo clic.
2. Obtendremos un `Personal Access Token` para que el asistente conecte el repositorio y publique el sitio automáticamente.

---

## 🚀 ¿Cómo empezamos?

Iremos **uno a uno**, con calma y sin prisas. No te pediré todo de golpe.
Cuando estés listo, arrancamos con el **Paso 1: GitHub**.
