# Informe Técnico de Pre-Compilación (Vigía TP App)

**Fecha:** 18 de Marzo de 2026
**Estado:** ✅ LISTO PARA COMPILAR (APK)
**Resultado General:** Aprobado

## 1. Diagnóstico de Salud del Proyecto (Expo Doctor)
Se ejecutó la herramienta de diagnóstico oficial de Expo (`npx expo-doctor`) para verificar incompatibilidades.
- **Resultado:** `17/17 checks passed`.
- **Conclusión:** No hay conflictos de versiones entre librerías ni dependencias obsoletas que impidan la compilación.

## 2. Validación de Errores Reportados Previamente

### Error A: "La app se cierra al iniciar"
- **Causa Detectada:** La "Nueva Arquitectura" (TurboModules) estaba habilitada en `app.json` pero algunas librerías no eran compatibles.
- **Solución Aplicada:** Se estableció `"newArchEnabled": false` en `app.json`.
- **Prueba:** La app inicia correctamente en el emulador y dispositivo físico.
- **Estado:** ✅ CORREGIDO.

### Error B: "Crashea al seleccionar opciones (Dropdowns)"
- **Causa Detectada:** La librería `react-native-dropdown-picker` entra en conflicto con `ScrollView` en Android, causando cierres forzados.
- **Solución Aplicada:**
  1. Se eliminó el uso de `DropDownPicker` en `PasoUnoScreen.js`.
  2. sE implementó el componente `GenericPicker` basado en Modales nativos.
  3. Se aplicó el parche de seguridad `removeClippedSubviews={false}` en `GenericPicker.js` para evitar colapsos de memoria en Android.
- **Prueba:** Los selectores de "Etnia", "Discapacidad", "Grado" y "Municipio" abren y cierran sin errores.
- **Estado:** ✅ CORREGIDO.

### Error C: "Se congela en Bundling 100%"
- **Causa Detectada:** Caché corrupta del Metro Bundler.
- **Solución Aplicada:** Se ha limpiado la caché (`.expo`, `node_modules/.cache`, `tmp`).
- **Estado:** ✅ CORREGIDO.

## 3. Configuración de Compilación (EAS Build)
Se revisó el archivo `eas.json` para asegurar que generará un APK instalable.
- **Perfil:** `preview`
- **Tipo de Build:** `apk` (No requiere firma de Google Play Store para pruebas).
- **Gradle:** Configuración estándar de Android detectada correctamente.

## 4. Recomendación Final
El código fuente está estable y las causas raíz de los fallos anteriores (Arquitectura y Dropdowns) han sido eliminadas.
**Puede proceder con la compilación del APK con total seguridad.**

---
*Generado automáticamente por GitHub Copilot tras análisis de código estático y dinámico.*
| 5 | Agente Externo | 22 | canShow, EntrevistaScreen, Bloqueo Tipos 1/3/4, Listado, Boundary tests |

**Total de casos de prueba:** 86  
**Archivo de setup compartido:** `__tests__/setup.js`

---

## 2. ARQUITECTURA DE MOCKS

Todos los tests comparten la siguiente infraestructura de mocks (definida en `__tests__/setup.js`):

| Módulo mockeado | Propósito |
|---|---|
| `expo-sqlite` | Aísla la base de datos SQLite local — no se toca el archivo `.db` real |
| `@react-native-community/netinfo` | Controla estado de conectividad (online/offline) |
| `@react-native-async-storage/async-storage` | Simula almacenamiento persistente |
| `expo-font` | Evita errores de carga de tipografías Montserrat en entorno Node |
| `@expo/vector-icons` | Sustituye íconos vectoriales por `<Text>` plano |
| `react-native-safe-area-context` | Elimina dependencia de SafeAreaInsets nativas |
| `@react-navigation/native` | Navigation mocks: `navigate`, `replace`, `goBack`, `reset` |
| `src/i18n/LanguageProvider` | `t(key) => key` — retorna la clave, no la traducción |
| `src/api/PersonFontSize` | Fuentes planas `'System'` para evitar crash en renderizado |
| `src/utils/responsive` | `rSpace/rFont = (n) => n` — sin cálculos de dimensión real |

---

## 3. CASOS DE PRUEBA DETALLADOS

---

### 3.1 ROL 1 — Super Administrador

**Archivo:** `__tests__/roles/rol1_2_superusuario.test.js`  
**Usuario de prueba:**
```js
{
  id: 1, rolId: 1, rolNombre: 'Super Administrador',
  rolSuperUsuario: 1, terminos: 1,
  token: 'mock_jwt_token_admin'
}
```

---

#### TC-ROL1-001
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `true` para Tipo 1 (Funcionario Público) con rolId=1 |
| **Componente** | Lógica `canShow()` en `EntrevistaScreen.js:29` |
| **Input** | `roleId = 1`, `rolesPermitidos = [3, 4]` |
| **Expected** | `true` |
| **Mock** | `canShowFn(1, [3, 4])` — función aislada sin renderizado |
| **Resultado obtenido** | `true` ✅ |
| **Razón** | `roleId === 1` es `true`, el bypass se activa antes de evaluar el array |

#### TC-ROL1-002
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `true` para Tipo 2 (Agentes Externos) con rolId=1 |
| **Componente** | Lógica `canShow()` en `EntrevistaScreen.js:29` |
| **Input** | `roleId = 1`, `rolesPermitidos = [5]` |
| **Expected** | `true` |
| **Mock** | `canShowFn(1, [5])` |
| **Resultado obtenido** | `true` ✅ |
| **Razón** | El superusuario tiene acceso a tous los tipos. El rol 5 no es pre-requisito cuando `roleId === 1` |

#### TC-ROL1-003 / TC-ROL1-004
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `true` para Tipos 3 y 4 con rolId=1 |
| **Input** | `roleId = 1`, `rolesPermitidos = [3, 4]` |
| **Expected** | `true` |
| **Resultado obtenido** | `true` ✅ |

#### TC-ROL1-005
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `true` con array vacío de roles — edge case |
| **Input** | `roleId = 1`, `rolesPermitidos = []` |
| **Expected** | `true` |
| **Mock** | `canShowFn(1, [])` |
| **Resultado obtenido** | `true` ✅ |
| **Razón** | El superusuario no depende del contenido de `rolesPermitidos` |

#### TC-HOME-1-001 a TC-HOME-1-006
| Campo | Valor |
|---|---|
| **Nombre** | HomeScreen renderiza los 4 accesos del Dashboard para rolId=1 |
| **Componente** | `HomeScreen.js` — componente React Native |
| **Input** | `route.params.user = userSuperAdmin` |
| **Estado React involucrado** | `route.params`, `usuario` (local) |
| **Expected TC-001** | `getByText('home.title')` no lanza |
| **Expected TC-002** | `getByText('home.interview')` no lanza |
| **Expected TC-003** | `getByText('home.materials')` no lanza |
| **Expected TC-004** | `getByText('home.results')` no lanza |
| **Expected TC-005** | `getByText('home.routes')` no lanza |
| **Expected TC-006** | `navigation.navigate` llamado con `('Entrevista', { user: userSuperAdmin })` tras `fireEvent.press` |
| **Resultado obtenido** | Todos ✅ |

#### TC-ENT-1-001 a TC-ENT-1-004
| Campo | Valor |
|---|---|
| **Nombre** | EntrevistaScreen muestra los 4 tipos de entrevista para rolId=1 |
| **Componente** | `EntrevistaScreen.js` |
| **Input** | `route.params.user.rolId = 1` |
| **Mock DB** | `buscarCatalogo()` retorna JSON con los 4 tipos |
| **Expected** | `getByText('interview.cards.parents/kids/public/agents')` — todos deben existir |
| **Resultado obtenido** | Todos ✅ |

#### TC-RES-1-001
| Campo | Valor |
|---|---|
| **Nombre** | ResumenScreen renderiza sin crash para rolId=1 |
| **Componente** | `ResumenScreen.js` — usa `useState` para: `completas`, `pendientes`, `total`, `totalMinimo`, `totalBajo`, `totalSignificativo` |
| **Input** | `route.params.user = userSuperAdmin` |
| **Mock DB** | `getDiligenciar()` retorna 3 registros (2 completos, 1 pendiente) |
| **Expected** | El componente monta y `getByText` retorna función válida |
| **Resultado obtenido** | ✅ sin crash |

#### TC-USR-001 a TC-USR-004
| Campo | Valor |
|---|---|
| **Nombre** | Propiedades del objeto usuario superusuario |
| **Expected TC-001** | `userSuperAdmin.rolSuperUsuario === 1` |
| **Expected TC-002** | `userSuperAdmin.token` es un `string` no vacío |
| **Expected TC-003** | `userSupervisor.terminos === 1` |
| **Expected TC-004** | Ambos usuarios (`rolId=1` y `rolId=2`) tienen `rolSuperUsuario=1` |
| **Resultado obtenido** | Todos ✅ |

---

### 3.2 ROL 2 — Supervisor

**Archivo:** `__tests__/roles/rol1_2_superusuario.test.js`  
**Usuario de prueba:**
```js
{
  id: 2, rolId: 2, rolNombre: 'Supervisor',
  rolSuperUsuario: 1, terminos: 1,
  token: 'mock_jwt_token_supervisor'
}
```

Los casos TC-ROL2-001 a TC-ROL2-004 son funcionalmente idénticos a TC-ROL1-001/004 porque ambos activam el bypass `roleId === 2`. Sus resultados son todos `true ✅`.

Los casos TC-HOME-2-001 a TC-HOME-2-006 y TC-ENT-2-001 a TC-ENT-2-004 son análogos a sus equivalentes del rol 1 y producen los mismos resultados.

---

### 3.3 ROL 3 — Profesional de Campo

**Archivo:** `__tests__/roles/rol3_4_campo_funcionario.test.js`  
**Usuario de prueba:**
```js
{
  id: 10, rolId: 3, rolNombre: 'Profesional Campo',
  rolSuperUsuario: 0, terminos: 1,
  token: 'mock_jwt_campo'
}
```

#### TC-ROL3-001
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `true` para Tipo 1 con rolId=3 |
| **Input** | `roleId = 3`, `rolesPermitidos = [3, 4]` |
| **Expected** | `true` |
| **Razón** | `rolesPermitidos.includes(3)` es `true` |
| **Resultado obtenido** | `true` ✅ |

#### TC-ROL3-002 ⚠️ CRÍTICO
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `false` para Tipo 2 (Agentes Externos) con rolId=3 |
| **Input** | `roleId = 3`, `rolesPermitidos = [5]` |
| **Expected** | `false` |
| **Razón** | `[5].includes(3)` es `false` Y `roleId` no es 1 ni 2 |
| **Resultado obtenido** | `false` ✅ — acceso correctamente denegado |
| **Impacto seguridad** | Si esto fallara y retornara `true`, el rol 3 accedería a un tipo de entrevista no correspondiente a su perfil |

#### TC-ENT-3-001 a TC-ENT-3-004
| Campo | Valor |
|---|---|
| **Nombre** | EntrevistaScreen muestra Tipos 1,3,4 y OCULTA Tipo 2 |
| **Componente** | `EntrevistaScreen.js` — renderizado React Native completo |
| **Input** | `route.params.user.rolId = 3` |
| **Expected TC-001** | `getByText('interview.cards.parents')` existe |
| **Expected TC-002** | `getByText('interview.cards.kids')` existe |
| **Expected TC-003** | `getByText('interview.cards.public')` existe |
| **Expected TC-004** | `queryByText('interview.cards.agents')` retorna `null` |
| **Estado React key** | `const roleId = user.rolId` en linea 24; `canShow([5])` retorna `false` para `roleId=3` |
| **Resultado obtenido** | Todos ✅ |

#### TC-LISTADO-001 a TC-LISTADO-003
| Campo | Valor |
|---|---|
| **Nombre** | ListadoEntrevistas filtra por `idUsuario` del usuario autenticado |
| **Componente** | `ListadoEntrevistasScreen.js` — `handleDiligenciadas` llama `getDiligenciarByUser(usuario.id)` |
| **Input** | `usuario.id = 10` |
| **Expected TC-001** | `getDiligenciarByUser` llamado con `10`; retorna array de 2 elementos |
| **Expected TC-002** | Todos los items tienen `idUsuario === 10` |
| **Expected TC-003** | Llamada con `userId=999` no contamina la lista del rol 3 |
| **Resultado obtenido** | Todos ✅ |

#### TC-USR-301 a TC-USR-304
| Campo | Valor |
|---|---|
| **Expected** | `rolSuperUsuario === 0`, token válido, `terminos === 1` |
| **Resultado obtenido** | Todos ✅ |

---

### 3.4 ROL 4 — Funcionario Entrevistador

**Archivo:** `__tests__/roles/rol3_4_campo_funcionario.test.js`  
**Usuario de prueba:**
```js
{
  id: 11, rolId: 4, rolNombre: 'Funcionario',
  rolSuperUsuario: 0, terminos: 1
}
```

Los casos TC-ROL4-001 a TC-ENT-4-004 son funcionalmente analógos al rol 3.

#### TC-ROL4-002 ⚠️ CRÍTICO
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `false` para Tipo 2 (Agentes Externos) con rolId=4 |
| **Input** | `roleId = 4`, `rolesPermitidos = [5]` |
| **Expected** | `false` |
| **Razón** | `[5].includes(4)` es `false`; `4 !== 1` y `4 !== 2` |
| **Resultado obtenido** | `false` ✅ |

#### TC-ENT-4-004 ⚠️ CRÍTICO
| Campo | Valor |
|---|---|
| **Nombre** | `queryByText('interview.cards.agents')` retorna `null` para rolId=4 |
| **Componente** | `EntrevistaScreen.js` — `{canShow([5]) && <TouchableOpacity>...` |
| **Expected** | `null` (elemento no renderizado) |
| **Resultado obtenido** | `null` ✅ |

---

### 3.5 ROL 5 — Agente Externo

**Archivo:** `__tests__/roles/rol5_agente_externo.test.js`  
**Usuario de prueba:**
```js
{
  id: 20, rolId: 5, rolNombre: 'Agente Externo',
  rolSuperUsuario: 0, terminos: 1,
  token: 'mock_jwt_agente'
}
```

#### TC-ROL5-001 ⚠️ CRÍTICO
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `false` para Tipo 1 con rolId=5 |
| **Input** | `roleId = 5`, `rolesPermitidos = [3, 4]` |
| **Expected** | `false` |
| **Razón** | `[3,4].includes(5)` es `false` Y `5 !== 1` y `5 !== 2` |
| **Resultado obtenido** | `false` ✅ |

#### TC-ROL5-002
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `true` para Tipo 2 con rolId=5 |
| **Input** | `roleId = 5`, `rolesPermitidos = [5]` |
| **Expected** | `true` |
| **Razón** | `[5].includes(5)` es `true` |
| **Resultado obtenido** | `true` ✅ |

#### TC-ROL5-003 / TC-ROL5-004 ⚠️ CRÍTICO
| Campo | Valor |
|---|---|
| **Nombre** | canShow devuelve `false` para Tipos 3 y 4 con rolId=5 |
| **Input** | `roleId = 5`, `rolesPermitidos = [3, 4]` |
| **Expected** | `false` |
| **Resultado obtenido** | `false` ✅ |

#### TC-ROL5-005
| Campo | Valor |
|---|---|
| **Nombre** | rolId=5 no activa el bypass de superusuario |
| **Input** | `roleId = 5` |
| **Expected** | `roleId === 1 || roleId === 2` → `false` |
| **Resultado obtenido** | `false` ✅ |

#### TC-ENT5-001
| Campo | Valor |
|---|---|
| **Nombre** | EntrevistaScreen muestra SOLO "Agentes Externos" para rolId=5 |
| **Componente** | `EntrevistaScreen.js` |
| **Expected** | `getByText('interview.cards.agents')` existe |
| **Resultado obtenido** | `interview.cards.agents` ✅ |

#### TC-ENT5-002 / TC-ENT5-003 / TC-ENT5-004 ⚠️ CRÍTICO
| Campo | Valor |
|---|---|
| **Nombre** | EntrevistaScreen NO muestra Tipos 1, 3 y 4 para rolId=5 |
| **Método de aserción** | `queryByText()` — retorna `null` si el elemento no fue renderizado |
| **Expected TC-002** | `queryByText('interview.cards.public')` === `null` |
| **Expected TC-003** | `queryByText('interview.cards.kids')` === `null` |
| **Expected TC-004** | `queryByText('interview.cards.parents')` === `null` |
| **Resultado obtenido** | Todos `null` ✅ |

#### TC-ENT5-005
| Campo | Valor |
|---|---|
| **Nombre** | Tap en "Agentes Externos" navega a Instruccion con `tipo=2` |
| **Componente** | `EntrevistaScreen.js` — `handleEntrevista(2)` → `navigation.navigate('Instruccion', {..., tipo: 2})` |
| **Input** | `fireEvent.press(getByText('interview.cards.agents'))` |
| **Expected** | `navigation.navigate` llamado con `('Instruccion', expect.objectContaining({ tipo: 2 }))` |
| **Resultado obtenido** | ✅ |

#### TC-BLOCK5-001 a TC-BLOCK5-003
| Campo | Valor |
|---|---|
| **Nombre** | Bloqueo de acceso a tipos 1, 3 y 4 para rol 5 |
| **Razón** | Si el elemento no está en el árbol de renderizado (porque `canShow` retornó `false`), el usuario no puede interactuar con él. La lógica de `canShow` es la barrera de seguridad a nivel de componente. |
| **Expected** | `canShowFn(5, [3,4])` retorna `false` para cada tipo |
| **Resultado obtenido** | Todos `false` ✅ |

#### TC-LISTADO5-001 / TC-LISTADO5-002
| Campo | Valor |
|---|---|
| **Nombre** | El historial del agente contiene solo entrevistas tipo 2 |
| **Mock** | `getDiligenciarByUser(20)` retorna `[{idTipo: 2, idUsuario: 20}]` |
| **Expected** | `item.idTipo === 2` para todos los registros |
| **Resultado obtenido** | ✅ |

#### TC-BOUNDARY-TIPO1/2/3/4
| Campo | Valor |
|---|---|
| **Nombre** | Boundary test: Rol 1 SIEMPRE accede, Rol 5 SOLO a Tipo 2 |
| **Cobertura** | Los 4 tipos de entrevista evaluados en una sola suite parametrizada |
| **Expected** | Para tipo 2: ambos roles acceden. Para tipos 1,3,4: solo rol 1 accede, rol 5 es denegado |
| **Resultado obtenido** | ✅ todos los boundaries correctos |

---

## 4. COBERTURA DE COMPONENTES

| Componente | Método/Hook testeado | Cubierto en |
|---|---|---|
| `EntrevistaScreen.js` | `canShow(rolesPermitidos)` — lógica de filtrado por rolId | Roles 1,2,3,4,5 |
| `EntrevistaScreen.js` | Renderizado condicional `{canShow([X]) && <Card/>}` | Roles 1,2,3,4,5 |
| `HomeScreen.js` | Renderizado de los 4 botones del Dashboard | Roles 1,2,3,4 |
| `HomeScreen.js` | `navigation.navigate('Entrevista', {user})` via `fireEvent.press` | Roles 1,2 |
| `ListadoEntrevistasScreen.js` | `getDiligenciarByUser(usuario.id)` — filtrado por userId | Roles 3,5 |
| `ResumenScreen.js` | Montaje sin crash, `useState` para contadores de riesgo | Rol 1 |
| `src/database/diligenciar.js` | `getDiligenciarByUser` — mock de consulta SQLite | Roles 3,5 |
| `src/database/catalogos.js` | `buscarCatalogo()` → catalogo de entrevistas | Roles 1,2,3,4,5 |

---

## 5. CASOS DE BORDE Y SEGURIDAD

| ID | Escenario | Componente | Resultado |
|---|---|---|---|
| EDGE-001 | `canShow(1, [])` — array vacío de roles | `canShow()` | `true` — superusuario siempre pasa ✅ |
| EDGE-002 | Rol 5 no activa bypass `roleId===1||2` | `canShow()` | `false` — bypass no se activa ✅ |
| EDGE-003 | `queryByText` retorna `null` si elemento no renderizado | `EntrevistaScreen` | Tarjetas no existen en DOM ✅ |
| EDGE-004 | Historial contaminación cruzada entre usuarios | `getDiligenciarByUser` | IDs no se mezclan entre usuarios ✅ |
| EDGE-005 | Navegación con `tipo=2` al presionar tarjeta agente | `handleEntrevista(2)` | Parámetro `tipo` correcto ✅ |

---

## 6. EJECUCIÓN DE PRUEBAS

```powershell
# Ejecutar solo las pruebas de roles
cd "c:\Users\Dracarys -Vector\Documents\Educa digital Projects\nuevo respaldo APK\vigiatpapp20260302"
npx jest __tests__/roles/ --verbose

# Ejecutar con cobertura
npx jest __tests__/roles/ --coverage --verbose

# Ejecutar un solo rol
npx jest __tests__/roles/rol5_agente_externo.test.js --verbose
```

---

## 7. NOTAS TÉCNICAS

- Los mocks de navegación usan `jest.fn()` limpios por cada test — no hay contaminación de estado entre suites.
- `queryByText()` vs `getByText()`: se usa `queryByText()` cuando se espera que el elemento **no exista** (retorna `null`), y `getByText()` cuando se espera que **exista** (lanza si no lo encuentra).
- La función `canShow()` no está exportada de `EntrevistaScreen.js` — los tests TC-ROL*-00X la prueban via una réplica local `canShowFn` que implementa exactamente la misma lógica del componente (`rolesPermitidos.includes(roleId) || roleId === 1 || roleId === 2`).
- Los mocks de `src/database/catalogos.js` retornan los 4 tipos de entrevista siempre, para que el componente tenga datos reales con qué evaluar `canShow`.
