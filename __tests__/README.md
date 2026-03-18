# __tests__ — ModoSeguro (vigiatpapp)

Carpeta de pruebas unitarias para la aplicación **ModoSeguro** (React Native + Expo SDK 54).

---

## Archivos de prueba

| Archivo | Cobertura | Tests |
|---|---|---|
| `App.test.js` | Componente raíz `App.js` | 2 |
| `HomeScreen.test.js` | `src/screens/HomeScreen.js` | 9 |
| `LoginScreen.test.js` | `src/screens/LoginScreen.js` | 6 |
| `FooterNav.test.js` | `src/componentes/FooterNav.js` | 8 |
| `screens.test.js` | MaterialesConsulta, MaterialUno, MaterialVirtualClave, MaterialInclucion | 16 |
| `setup.js` | Configuración global de mocks (NO es un test) | — |

**Total: 41 tests en 5 suites**

---

## Cómo ejecutar

```bash
# Todos los tests
npm test

# Un archivo específico
npx jest __tests__/HomeScreen.test.js

# Con cobertura de código
npx jest --coverage

# En modo watch (re-ejecuta al guardar)
npx jest --watch
```

---

## Resultado de la última ejecución

```
PASS __tests__/HomeScreen.test.js    (5.3s)
PASS __tests__/FooterNav.test.js     (5.4s)
PASS __tests__/LoginScreen.test.js   (6.0s)
PASS __tests__/screens.test.js       (6.2s)
PASS __tests__/App.test.js          (14.3s)

Test Suites: 5 passed, 5 total
Tests:       41 passed, 41 total
Snapshots:   0 total
Time:        16.2 s
```

---

## Estrategia de pruebas

Todas las pruebas son **smoke tests + pruebas de comportamiento básico**:

1. **Smoke test**: verifica que el componente renderiza sin lanzar excepciones.
2. **Contenido visible**: verifica que traducciones clave (`t("home.title")`, etc.) están en el árbol de componentes.
3. **Navegación**: verifica que al presionar un botón se llama a `navigation.navigate()` con los parámetros correctos.
4. **Regresión**: verifica que bugs corregidos (ej. `marginBottom: 200` en MaterialInclucion) no regresen.
5. **Datos ocultos**: verifica que las secciones comentadas por solicitud del cliente (id:3, id:4 en Materiales) no aparecen en el DOM.

---

## Módulos mockeados (setup.js)

Los siguientes módulos nativos no pueden ejecutarse en Node.js y son mockeados:

- `expo-sqlite` → base de datos SQLite
- `expo-asset` → assets nativos
- `expo-sharing` → compartir archivos
- `expo-file-system` / `expo-file-system/legacy` → acceso al sistema de archivos
- `expo-font` → carga de fuentes
- `@expo/vector-icons` → íconos vectoriales
- `@react-native-community/netinfo` → estado de red
- `@react-native-async-storage/async-storage` → almacenamiento local
- `react-native-safe-area-context` → insets de área segura
- `@react-navigation/native` → navegación
- `src/i18n/LanguageProvider` → internacionalización (retorna la key tal cual)
- `src/api/PersonFontSize` → tamaños de fuente personalizados
- `src/database/*` → operaciones de base de datos
- `src/api/apiBase`, `src/api/apiPost` → llamadas HTTP
- `crypto-js/md5` → hash de contraseñas

---

## Dependencias de desarrollo instaladas

```
jest@29.7.0
jest-expo@55.0.10
@testing-library/react-native@13.3.3
react-test-renderer@19.1.0
@expo/vector-icons@15.0.3   (devDep para resolución en tests)
expo-asset@12.0.x           (devDep para resolución en tests)
```

---

## Notas

- `setup.js` usa `setupFilesAfterEnv` (no `setupFiles`) para poder usar `jest.mock()`.
- `testPathIgnorePatterns` excluye `setup.js` para que Jest no lo trate como suite de pruebas.
- `transformIgnorePatterns` incluye los paquetes Expo/RN que necesitan ser transpilados por Babel.
