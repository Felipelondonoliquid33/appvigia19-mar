<div align="center">

# 📱 ModoSeguro — VigiatpApp

**Aplicación móvil de campo para el ICBF**  
Herramienta de visita, valoración de riesgo y diligenciamiento de entrevistas

[![Expo](https://img.shields.io/badge/Expo-54.0-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev)
[![EAS Build](https://img.shields.io/badge/EAS%20Build-production-4630EB?logo=expo)](https://expo.dev/eas)
[![Plataforma](https://img.shields.io/badge/Plataforma-Android-green?logo=android)](https://play.google.com/store)
[![Seguridad](https://img.shields.io/badge/Seguridad-v1.1.0-blue?logo=shield)](https://github.com/Felipelondonoliquid33/appvigia19-mar)

</div>

---

## 📋 Tabla de Contenidos

1. [¿Qué es ModoSeguro?](#-qué-es-modoseguro)
2. [Prerequisitos del entorno](#-prerequisitos-del-entorno)
3. [Configuración del entorno de producción](#-configuración-del-entorno-de-producción)
4. [Compilar el APK para distribución interna](#-compilar-el-apk-para-distribución-interna)
5. [Publicar en producción (Google Play)](#-publicar-en-producción-google-play)
6. [Variables de entorno](#-variables-de-entorno)
7. [Ejecutar en modo desarrollo local](#-ejecutar-en-modo-desarrollo-local)
8. [Verificar la conexión al backend](#-verificar-la-conexión-al-backend)
9. [Tests E2E automatizados (Maestro)](#-tests-e2e-automatizados-maestro)
10. [Estructura del proyecto](#-estructura-del-proyecto)
11. [Roles y permisos](#-roles-y-permisos)
12. [Solución de problemas frecuentes](#-solución-de-problemas-frecuentes)

---

## 🔍 ¿Qué es ModoSeguro?

**ModoSeguro** es la aplicación móvil oficial para los funcionarios y agentes de campo del ICBF. Permite:

- ✅ Realizar entrevistas estructuradas en campo (sin conexión a internet)
- ✅ Valorar niveles de riesgo de protección de niñas, niños y adolescentes
- ✅ Sincronizar resultados con el servidor central cuando hay conectividad
- ✅ Consultar materiales de apoyo, rutas de atención y protocolos
- ✅ Gestión de usuarios por roles (5 roles diferenciados)

> **Versión actual:** `1.1.0` — Incluye seguridad reforzada (SHA-256, JWT, timeout de inactividad 15 min, audit logging)

---

## 🛠️ Prerequisitos del entorno

Antes de compilar o ejecutar la aplicación, asegúrese de tener instalado lo siguiente:

### Software requerido

| Herramienta | Versión mínima | Instalación |
|---|---|---|
| **Node.js** | 18 LTS o superior | https://nodejs.org |
| **npm** | 9+ (incluido con Node) | — |
| **EAS CLI** | 3.0+ | `npm install -g eas-cli` |
| **Expo CLI** | 6.0+ | `npm install -g expo-cli` |
| **Git** | 2.x | https://git-scm.com |

### Para compilación en la nube (recomendado para ICBF)

La compilación usa **EAS Build** (Expo Application Services), servicio en la nube. Solo se necesita:

- Una cuenta en [expo.dev](https://expo.dev) asociada al proyecto `felipelondono33/vigiatpapp`
- Acceso a internet desde el servidor CI/CD

> ⚠️ **No se requiere Android Studio** ni JDK en la máquina local para compilar con EAS Build en la nube.

### Para compilación local (Android Studio)

Si se requiere compilar localmente:

| Herramienta | Versión |
|---|---|
| Android Studio | Hedgehog 2023.1+ |
| JDK | 17 (OpenJDK recomendado) |
| Android SDK | API Level 33+ |

---

## ⚙️ Configuración del entorno de producción

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/Felipelondonoliquid33/appvigia19-mar.git
cd appvigia19-mar
```

### Paso 2 — Instalar dependencias

```bash
npm install --legacy-peer-deps
```

> El flag `--legacy-peer-deps` es necesario por compatibilidad de las librerías de Expo con React 19.

### Paso 3 — Configurar la URL del backend

Cree el archivo `.env.production` en la raíz del proyecto:

```env
# .env.production
EXPO_PUBLIC_API_BASE_URL=https://app1-prod.icbf.gov.co
```

Reemplace la URL con la dirección del servidor backend del ICBF en producción.

> Para desarrollo/pruebas use `.env.development` apuntando al servidor de staging.

### Paso 4 — Autenticar con EAS

```bash
eas login
```

Ingrese las credenciales de la cuenta Expo del proyecto. Si no las tiene, solicítelas al equipo de desarrollo.

### Paso 5 — Verificar la configuración del proyecto

```bash
eas project:info
```

Debe mostrar el proyecto `vigiatpapp` con `projectId: 7dc719ae-93c5-41e1-aa4f-bc75bd9c8127`.

---

## 🏗️ Compilar el APK para distribución interna

Este proceso genera un archivo `.apk` listo para instalar en dispositivos Android sin necesidad de la Play Store.

### Compilación en la nube (EAS Build — recomendado)

```bash
# Genera APK para distribución interna (perfil "preview")
eas build --platform android --profile preview
```

**¿Qué hace este comando?**
1. Sube el código fuente a los servidores de EAS
2. Compila la app en un contenedor Android en la nube
3. Genera el `.apk` firmado
4. Provee un enlace de descarga al terminar (~10-15 minutos)

Al finalizar verá algo como:
```
✔ Build finished
Download the build artifact:
  https://expo.dev/artifacts/eas/xxxx.apk
```

### Compilación en modo desarrollo (para debugging)

```bash
eas build --platform android --profile development
```

> Este perfil incluye el Expo Dev Client para depuración. No usar en producción.

---

## 🚀 Publicar en producción (Google Play)

Para publicar en la Play Store, use el perfil `production` que genera un `.aab` (Android App Bundle):

### Paso 1 — Compilar en modo producción

```bash
eas build --platform android --profile production
```

### Paso 2 — Enviar a Google Play

```bash
eas submit --platform android
```

> Requiere tener configurada la API de Google Play en el panel de EAS (`eas.json` → `submit.production`).

---

## 🔐 Variables de entorno

La aplicación utiliza variables de entorno prefijadas con `EXPO_PUBLIC_` para configurar el backend según el ambiente:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base del backend | `https://app1-prod.icbf.gov.co` |

### Archivos de entorno por ambiente

```
.env.development    → Servidor de desarrollo / staging
.env.production     → Servidor de producción ICBF
```

> ⚠️ Estos archivos están en `.gitignore` por seguridad y **no se suben al repositorio**. Deben crearse manualmente en cada entorno de despliegue.

### Endpoints del backend utilizados

| Endpoint | Función |
|---|---|
| `POST /Home/LoginReact` | Autenticación de usuarios |
| `GET /Home/Catalogos` | Descarga catálogos para modo offline |
| `GET /Home/Parametros` | Parámetros de configuración |
| `POST /Diligenciar/DiligenciarRecibir` | Envío de entrevistas completadas |
| `GET /Diligenciar/DiligenciarPorUsuario` | Consulta de entrevistas previas |
| `POST /Auditoria/EventosMovil` | Registro de eventos de seguridad |

---

## 💻 Ejecutar en modo desarrollo local

Si necesita ejecutar la app en un emulador o dispositivo físico para pruebas:

### Usando Expo Go (más rápido)

```bash
npx expo start
```

Escanee el código QR con la app **Expo Go** (disponible en Play Store).

### Usando emulador Android

```bash
# Asegúrese de tener un emulador corriendo en Android Studio
npx expo start --android
```

### Usando dispositivo físico por USB

```bash
# Con depuración USB habilitada en el dispositivo
npx expo run:android
```

---

## 🔌 Verificar la conexión al backend

Para confirmar que la app se conecta correctamente al backend de producción:

### 1. Configure la variable de entorno de producción

```bash
echo "EXPO_PUBLIC_API_BASE_URL=https://app1-prod.icbf.gov.co" > .env.production
```

### 2. Compile y ejecute con el entorno de producción

```bash
EXPO_ENV=production npx expo start
```

### 3. Verifique en la pantalla Welcome

Al abrir la app, la pantalla de bienvenida (`WelcomeScreen`) automáticamente:
- Detecta si hay conexión a internet
- Descarga los catálogos del backend
- Redirige al Login si no hay conexión (modo offline)

Si los catálogos se descargan correctamente, la conexión está funcionando.

---

## 🧪 Tests E2E automatizados (Maestro)

El repositorio incluye flujos de prueba automatizados de UI con **Maestro CLI**.

### Instalar Maestro

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### Ejecutar todos los flujos

```bash
maestro test .maestro/flujo_principal.yaml
```

### Ejecutar flujo específico por rol

```bash
# Rol ICBF / Funcionario
maestro test .maestro/flows/02_rol_icbf.yaml

# Rol Agente Externo
maestro test .maestro/flows/03_rol_agente.yaml

# Rol Administrador / Superusuario
maestro test .maestro/flows/04_rol_admin.yaml
```

### Variables de entorno para las pruebas

```bash
export ADMIN_USER="usuario_admin"
export ADMIN_PASS="contraseña_admin"
export ICBF_USER="usuario_icbf"
export ICBF_PASS="contraseña_icbf"

maestro test .maestro/flujo_principal.yaml
```

| Rol | Variable usuario | Variable contraseña |
|---|---|---|
| Administrador (rolId 1-2) | `ADMIN_USER` | `ADMIN_PASS` |
| Funcionario ICBF (rolId 3-4) | `ICBF_USER` | `ICBF_PASS` |
| Agente Externo (rolId 5) | `AGENTE_USER` | `AGENTE_PASS` |

---

## 📁 Estructura del proyecto

```
vigiatpapp/
│
├── 📄 App.js                    # Punto de entrada principal, navegación global
├── 📄 index.js                  # Registro de la app con Expo
├── 📄 app.json                  # Configuración Expo (nombre, íconos, plugins)
├── 📄 eas.json                  # Perfiles de build: development, preview, production
├── 📄 package.json              # Dependencias del proyecto
│
├── 📂 src/
│   ├── 📂 api/                  # Configuración y conexión al backend
│   │   ├── apiBase.js           # URLs de endpoints (lee EXPO_PUBLIC_API_BASE_URL)
│   │   ├── apiPost.js           # Llamadas HTTP con timeout de 15s (AbortController)
│   │   └── Constantes.js        # Constantes de dimensiones y fuentes
│   │
│   ├── 📂 screens/              # Pantallas de la aplicación
│   │   ├── LoginScreen.js       # Autenticación SHA-256 + migración desde MD5
│   │   ├── WelcomeScreen.js     # Splash + descarga de catálogos
│   │   ├── HomeScreen.js        # Menú principal por rol
│   │   ├── PasoUnoScreen.js     # Paso 1 de entrevista
│   │   ├── PasoDosScreen.js     # Paso 2 de entrevista
│   │   ├── PasoTresScreen.js    # Paso 3 + generación de reporte Excel
│   │   └── ...                  # Demás pantallas
│   │
│   ├── 📂 database/             # Base de datos local SQLite (modo offline)
│   │   ├── database.js          # Inicialización y apertura de la BD
│   │   ├── schema.js            # Esquema de tablas + migraciones
│   │   ├── usuarios.js          # CRUD de usuarios locales
│   │   ├── catalogos.js         # Catálogos descargados del backend
│   │   └── diligenciar.js       # Entrevistas completadas pendientes de sync
│   │
│   ├── 📂 utils/                # Utilidades de seguridad y caché
│   │   ├── secureStorage.js     # Wrapper JWT storage (AsyncStorage)
│   │   ├── auditLogger.js       # Cola de eventos de auditoría → backend
│   │   └── entrevistaCache.js   # Caché singleton para objetos grandes
│   │
│   ├── 📂 context/              # Contextos globales de React
│   │   └── InactivityContext.js # Timeout de inactividad 15 min con modal
│   │
│   ├── 📂 componentes/          # Componentes reutilizables de UI
│   └── 📂 i18n/                 # Internacionalización (español / lenguas nativas)
│
├── 📂 assets/                   # Imágenes, íconos, PDFs de la app
│
└── 📂 .maestro/                 # Pruebas E2E automatizadas de UI
    ├── flujo_principal.yaml     # Orquestador: ejecuta todos los flujos
    ├── flows/                   # Flujos por rol (01 al 08)
    └── helpers/                 # Subflows reutilizables (login, logout)
```

---

## 👥 Roles y permisos

La app gestiona 5 roles de usuario con acceso diferenciado:

| rolId | Nombre del rol | Capacidades principales |
|---|---|---|
| 1 | **Super Administrador** | Gestión completa de usuarios, todos los reportes |
| 2 | **Supervisor** | Supervisión de campo, reportes consolidados |
| 3 | **Funcionario ICBF** | Entrevistas de protección, valoración de riesgo |
| 4 | **Funcionario de campo** | Entrevistas en campo, modo offline |
| 5 | **Agente Externo** | Entrevistas limitadas, sin gestión de usuarios |

---

## 🔒 Características de seguridad

| Característica | Descripción |
|---|---|
| **Hashing SHA-256 con salt** | Contraseñas nunca viajan ni se almacenan en texto plano |
| **Migración automática MD5 → SHA-256** | Usuarios existentes actualizados al primer login |
| **Timeout de inactividad** | Cierre de sesión automático tras 15 minutos sin interacción |
| **Timeout de red** | Todas las llamadas API tienen límite de 15 segundos (AbortController) |
| **Audit logging** | Eventos de seguridad enviados al backend cada 60 segundos |
| **JWT Secure Storage** | Tokens almacenados con AsyncStorage (preparado para expo-secure-store) |

---

## ❗ Solución de problemas frecuentes

<details>
<summary><strong>Error: "Cannot connect to backend" en WelcomeScreen</strong></summary>

**Causa:** La URL de backend en `EXPO_PUBLIC_API_BASE_URL` no es accesible desde el dispositivo.

**Solución:**
1. Verifique que `.env.production` contenga la URL correcta del servidor ICBF
2. Confirme que el servidor backend esté activo: `curl https://app1-prod.icbf.gov.co/Home/Catalogos`
3. Verifique que el firewall del dispositivo permita conexiones HTTPS salientes
4. La app funciona en **modo offline** si no hay conexión — los catálogos se cargan desde la BD local

</details>

<details>
<summary><strong>Error: "eas: command not found"</strong></summary>

**Solución:**
```bash
npm install -g eas-cli
eas --version  # Debe mostrar 3.x o superior
```

</details>

<details>
<summary><strong>Error durante npm install: peer dependency conflict</strong></summary>

**Solución:** Use siempre el flag `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

</details>

<details>
<summary><strong>El build de EAS falla con "Project not found"</strong></summary>

**Solución:**
1. Verifique que esté logueado con `eas whoami`
2. Confirme el projectId en `app.json` → `expo.extra.eas.projectId`
3. Si es necesario, vincule el proyecto: `eas project:link`

</details>

<details>
<summary><strong>La app cierra sesión inesperadamente cada 15 minutos</strong></summary>

**Causa:** Es un comportamiento esperado de seguridad. El `InactivityContext` cierra la sesión tras 15 minutos de inactividad para proteger datos sensibles.

**Nota:** El temporizador se reinicia con cualquier toque en la pantalla.

</details>

---

## 📞 Soporte técnico

Para soporte en el despliegue o integración con los sistemas del ICBF:

- **Repositorio:** [github.com/Felipelondonoliquid33/appvigia19-mar](https://github.com/Felipelondonoliquid33/appvigia19-mar)
- **Versión del proyecto EAS:** `felipelondono33/vigiatpapp`
- **ID del proyecto Expo:** `7dc719ae-93c5-41e1-aa4f-bc75bd9c8127`

---

<div align="center">

**ModoSeguro v1.1.0** · Desarrollado para el **Instituto Colombiano de Bienestar Familiar (ICBF)**  
Protección de niñas, niños y adolescentes · Colombia 🇨🇴

</div>
