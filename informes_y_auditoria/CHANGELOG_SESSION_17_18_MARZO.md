# CHANGELOG: Integración y Estabilización (Sesión 17-18 Marzo 2026)

## 1. Resumen Ejecutivo
Se ha completado la integración de los archivos contenidos en "Temp Updates" hacia el nucleo de la aplicación (`src/`). Posteriormente, se realizó un proceso intensivo de depuración (debugging) para resolver múltiples bloqueos (crashes) relacionados con datos nulos, listas vacías y configuración de entorno Expo.

**Estado Actual:** Estable
**Versión de Base de Datos:** `modoseguro11.db` (Incluye nuevas columnas: edadEntrevista, momentos 1-3)

## 2. Infraestructura y Configuración (Critico)
### `app.json`
*   **FIX:** Se eliminó la propiedad `"owner": "felipelondono33"` y el bloque `"extra": { "eas": ... }`.
    *   *Razón:* Estos campos forzaban una autenticación en Expo CLI que impedía iniciar el servidor Metro localmente sin conexión a internet o sin las credenciales del propietario original.
    *   *Configuración Actual:* Metro corre bajo `EXPO_OFFLINE=1`.

### `package.json` / Entorno
*   Se habilitó la compilación y ejecución en Emulador Android (API 36) y dispositivos físicos (Samsung S25) mediante conexión LAN (ADB Reverse & WiFi).

## 3. Integración de Funcionalidades (Carpeta Temp Updates)
Se migraron y sobrescribieron los siguientes módulos con la lógica del programador anterior, verificando su integridad:
*   **Base de Datos:** `src/database/schema.js` (Nuevas columnas agregadas), `database.js` (Cambio a `modoseguro11.db`), `diligenciar.js` (Queries de Insert/Update actualizados).
*   **Componentes:** `funciones.js` (Nuevas validaciones de fecha), `apiBase.js`, `apiPost.js`.
*   **Pantallas (Lógica de Negocio):** `LoginScreen`, `AsentimientoScreen`, `PasoUnoScreen`, `PasoDosScreen`, `PasoComentarioScreen`, `PasoTresScreen`.

## 4. Corrección de Errores (Bug Fixes & Estabilización)

### A. Prevención de Crashes en Carga de Datos (Null Safety)
**Archivos afectados:** `PasoUnoScreen.js`, `PasoTresScreen.js`
*   **Problema:** La aplicación se cerraba inesperadamente al intentar abrir los selectores de "Etnia", "Discapacidad" o "Género" si la base de datos devolvía una cadena JSON corrupta o nula.
*   **Solución:** Se reescribió la función `handleCatalog` implementando bloques `try/catch` y valores por defecto (`|| []`) para todos los `JSON.parse`.
*   **Mapeo Seguro:** Se protegió el método `.map()` en las listas para evitar errores de "undefined is not an object".

### B. Flujo de Entrevista (Paso Dos)
**Archivos afectados:** `PasoDosScreen.js`, `AsentimientoScreen.js`
*   **FIX Visualización "Pregunta Dirigida":**
    *   Se mapeó correctamente el campo `Dirigida` desde `AsentimientoScreen.js` al objeto indicador.
    *   Se agregó renderizado condicional en `PasoDosScreen`: El banner rosa solo aparece si la pregunta tiene un destinatario específico.
    *   Se ajustaron estilos CSS (bordes rosados, fondo claro) para coincidir con el diseño.
*   **FIX Crash de Navegación:**
    *   Se corrigió el error al leer `detalle.currentIndex` (que era undefined) cambiando a `detalle.IndexIndicador`.
    *   Se protegió la lectura de `indicadorActual.Opciones` para evitar pantallas blancas si la pregunta no tiene opciones cargadas.
    *   Se cambió la función `guardarDetalle` de asíncrona a síncrona para evitar condiciones de carrera en el estado.

### C. Lógica Demográfica (Paso Uno)
**Archivos afectados:** `PasoUnoScreen.js`
*   **FIX Tipos Demográficos Desconocidos:** Se agregó una validación `else if` para capturar tipos demográficos que no coincidan con la lista estandar (edad, etnia, etc.), asignando `Valor = 0` para evitar bloqueos en el cálculo de puntaje.

### D. Utilerías
**Archivos afectados:** `componentes/funciones.js`
*   **FIX Validar Año:** Se ajustó `validarMayorToYear` para manejar correctamente valores nulos o `0`, permitiendo guardar fechas de nacimiento sin bloquear el formulario.

---
**Nota al Desarrollador:** Esta versión (ubicada en la carpeta raíz `vigiatpapp20260302`) es ahora la **RAMA MAESTRA**. No se deben reintroducir archivos de copias de seguridad anteriores sin revisar estos parches de estabilidad.
