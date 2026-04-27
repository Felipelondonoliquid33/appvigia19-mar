# CHANGELOG — ModoSeguro (vigiatpapp)
**Sesión de cambios: 16–17 marzo 2026**
**Responsable técnico:** GitHub Copilot (Claude Sonnet 4.6)
**Para:** Equipo de desarrollo / programador de continuidad

---

## RESUMEN EJECUTIVO

Durante esta sesión se realizaron **exclusivamente cambios de contenido textual, visibilidad de secciones y ajustes de layout/diseño** en pantallas de materiales educativos. No se modificaron flujos de navegación, lógica de negocio, base de datos ni APIs. Todos los cambios son en archivos dentro de `src/screens/`.

---

## ARCHIVOS MODIFICADOS

### 1. `src/screens/MaterialUnoScreen.js` — Antecedentes

**Cambios de estilo en `paragraph`:**
| Propiedad | Antes | Después |
|---|---|---|
| `fontFamily` | `PersonFontSize.require` | `PersonFontSize.regular` |
| `lineHeight` | `RelativeSize(22)` → `RelativeSize(12)` | `RelativeSize(19)` |
| `color` | `#444` | `#666` |
| `marginBottom` | `RelativeSize(16)` | `RelativeSize(6)` |

**Cambios de layout (sesión 17 marzo):**
| Propiedad | Antes | Después | Motivo |
|---|---|---|---|
| `iheight` | `iwidth * 2` | `iwidth * 1.4` | Imágenes demasiado altas generaban huecos vacíos |
| `iheight2` | `iwidth * 1.5` | `iwidth * 1.4` | Consistencia |
| `row.alignItems` | `flex-start` | `center` | Texto e imagen centrados verticalmente |
| `row.marginBottom` | `RelativeSize(20)` | `RelativeSize(10)` | Menos espacio entre bloques |
| `paragraphBlock.marginVertical` | `RelativeSize(16)` | `RelativeSize(8)` | Bloque central más compacto |
| `badgeWrapper.marginBottom` | `RelativeSize(25)` | `RelativeSize(14)` | Título más cercano al contenido |

**Cambio de layout en BLOQUE 3:**
- `<View style={[styles.textColumn, { justifyContent: "flex-end" }]}>` → `<View style={[styles.textColumn, { marginTop: 10 }]}>`
- Motivo: el texto no bajaba con `justifyContent` porque el padre no tenía altura fija.

---

### 2. `src/screens/MaterialVirtualUnoScreen.js` — Entornos virtuales

**Párrafo introductorio (TEXTO INTRODUCTORIO):**
> **Antes:** "Los entornos virtuales son espacios digitales en los que las personas interactúan a través de tecnologías de la información y la comunicación."

> **Después:** "Los entornos virtuales o digitales son espacios en línea donde las personas se comunican, aprenden, juegan y comparten mediante tecnologías de información y comunicación. Para niñas, niños y adolescentes, estos espacios representan oportunidades de desarrollo, socialización y aprendizaje, pero también escenarios de riesgo cuando no cuentan con acompañamiento adulto responsable o alfabetización digital."

**Sección TEXTO FINAL + IMAGEN (bottomRow):**
- Se eliminaron los 2 párrafos anteriores (NNA representan oportunidades... / dinámicas de captación...)
- Se reemplazaron por 1 solo párrafo nuevo:
> "La conectividad constante y el anonimato que ofrecen estos espacios facilitan que los agresores contacten, manipulen y exploten sin necesidad de encuentro físico, lo cual dificulta la detección oportuna por parte de familias, educadores y autoridades. Según UNICEF (2024), aproximadamente uno de cada tres usuarios de internet en el mundo es una niña, niño o adolescente, y cerca del 80% en 25 países han expresado sentirse en riesgo de abuso o explotación sexual en línea."

---

### 3. `src/screens/MaterialVirtualDosScreen.js` — Trata de personas con fines de explotación sexual

**Vista "uno" — párrafo principal:**
- Se dividió en 3 párrafos independientes (`<Text style={styles.paragraph}>` separados):
  1. "La trata de personas es un delito. Consiste en captar, trasladar, alojar o recibir una persona..."
  2. "Para lograrlo, las personas tratantes pueden usar engaños, fraudes, amenazas..."
  3. "La trata de personas con fines de explotación sexual en entornos virtuales implica una serie de acciones..."

**Botón linkText (vista "uno"):**
> **Antes:** "La explotación sexual en entornos virtuales no ocurre de manera aislada..."
> **Después:** "La explotación sexual en entornos digitales NO ocurre de manera aislada..."

**Vista "dos" — título linkText:**
- Mismo cambio: "virtuales" → "digitales", "no" → "NO"

**Vista "dos" — 4 ítems con círculos (trataCirculo1–4):**
Todos los textos expandidos con detalles técnicos:
| Ítem | Antes | Después |
|---|---|---|
| 1 | "Las características de víctimas y agresores." | "...edad, género, situación de vulnerabilidad, acceso a tecnología, intención criminal" |
| 2 | "Las prácticas utilizadas para la captación y acogida." | "...grooming, técnica del amante o loverboy, sextorsión, manipulación emocional, amenazas" |
| 3 | "Los medios tecnológicos empleados..." | "...redes sociales, apps de mensajería cifrada, plataformas de streaming, darknet, criptomonedas" |
| 4 | "Los factores de riesgo presentes en los distintos niveles del entorno." | "...modelo ecológico: individual, familiar, comunitario, cultural/institucional con ejemplos" |

**Fix de desbordamiento de texto:**
- Cada `<Text>` dentro de `<View style={styles.row}>` fue envuelto en `<View style={{ flex: 1 }}>` para evitar que el texto se saliera de la tarjeta.

---

### 4. `src/screens/MaterialVirtualTresScreen.js` — Dinámica de la trata

**Segundo párrafo — reemplazado completamente:**
> **Antes:** "Según la OIM (2018), prácticas como el phishing, el grooming en línea y la sextorsión han sido adoptadas..."

> **Después:** Párrafo introductorio + 4 puntos con guión:
> - "Internet y las plataformas digitales no son solamente escenarios donde ocurre el delito..."
> - "- Alcanzar víctimas a escala global..."
> - "- Operar con mayor anonimato e impunidad..."
> - "- Diversificar sus métodos de captación, control y explotación..."
> - "- Normalizar y mercantilizar la explotación..."

**Cambio de layout en `bottomRow`:**
- `alignItems: "flex-end"` → `alignItems: "center"`
- Motivo: el último párrafo quedaba pegado al pie de la imagen, ahora se centra verticalmente.

---

### 5. `src/screens/MaterialVirtualCuatroScreen.js` — Comportamientos o prácticas de riesgo

**Párrafo introductorio:**
> **Antes:** "Son aquelas prácticas o exposiciones que aumentan la vulnerabilidad de los niños, niñas y adolecentes frente a potenciales agresores." *(tenía errores ortográficos)*

> **Después:** "Son aquellas conductas o exposiciones que aumentan la vulnerabilidad de niñas, niños y adolescentes frente a potenciales agresores. Es importante destacar que estas prácticas NO son la causa de la violencia sexual, la responsabilidad siempre recae en el agresor, pero su conocimiento permite desarrollar estrategias de prevención y autocuidado."

---

### 6. `src/screens/MaterialVirtualClaveScreen.js` — Grooming en línea

**Párrafos 1 y 2 (PÁRRAFOS NORMALES):**
> **Antes párrafo 1:** "Seducción de menores de edad por medio de las tecnologías de la información y la comunicación."
> **Después párrafo 1:** "Seducción de niñas, niños y adolescentes por medio de las tecnologías de la información y la comunicación."

> **Antes párrafo 2:** "El grooming implica la manipulación deliberada de niños, niñas y adolescentes a través de internet, con el objetivo de establecer contacto sexual (Unicef, 2016)."
> **Después párrafo 2:** "El grooming en línea es el acoso sexual que un adulto realiza hacia un niño, niña o adolescente mediante plataformas digitales. El grooming NO es la antesala de un delito: es en sí mismo un delito y una forma de abuso sexual, aunque nunca se concrete un encuentro físico (UNICEF Argentina, 2023)."

**Párrafo "Este fenómeno puede culminar...":**
> **Antes:** "Este fenómeno puede culminar en encuentros presenciales o actividades sexuales en línea, y representa un riesgo grave para la integridad física y emocional de los menores."

> **Después:** "Este proceso puede culminar en encuentros presenciales, producción de Material de Abuso Sexual Infantil (MASI), o actividades sexuales en línea, representando un riesgo grave para la integridad física y emocional de las infancias y adolescencias."

**Fix de superposición con imagen:**
- El párrafo largo fue movido **fuera** del bloque `<View style={styles.textWithCharacter}>` (que tiene la imagen posicionada con `position: absolute`).
- Ahora es un `<Text style={styles.paragraph}>` independiente debajo del bloque, evitando superposición.

**Ajustes de layout y diseño (sesión 17 marzo):**
| Propiedad | Antes | Después | Motivo |
|---|---|---|---|
| `textWithCharacter` layout | `position: relative` + `minHeight: 220` | `flexDirection: "row"` + `alignItems: "center"` | El minHeight fijo creaba hueco vacío grande |
| `character` layout | `position: absolute`, `140×250` | inline `flex`, `110×180` | Imagen flotante causaba desbordamiento |
| `textColumn.paddingRight` | `RelativeSize(105)` | eliminado (usa `flex: 1`) | Se reservaba espacio innecesario |
| `paragraph.lineHeight` | `RelativeSize(14)` | `RelativeSize(19)` | Texto comprimido, poco legible |
| `paragraph.marginBottom` | `RelativeSize(10)` | `RelativeSize(8)` | Espaciado más armónico |
| `groomingImage.height` | `RelativeSize(95)` | `RelativeSize(125)` | Subtexto del título era ilegible |
| `groomingImage.marginBottom` | `RelativeSize(16)` | `RelativeSize(8)` | Menos hueco bajo el header |

---

### 7. `src/screens/MaterialesSexteoScreen.js` — Sexteo o Sexting

**BLOQUE 2 — párrafo reemplazado:**
> **Antes:** "Cuando involucra a menores de edad, puede considerarse una forma de producción y distribución de pornografía infantil, independientemente de la intención original."

> **Después:** "Cuando involucra menores de edad constituye producción y distribución de Material de Abuso Sexual Infantil (MASI), independientemente de la intención original o de quién creó el contenido. Los niños, niñas y adolescentes NO pueden dar consentimiento legal para participar en actividades sexuales ni en su registro (RAINN, 2024; Asociación REA, 2024)."

**Fix de espacio en blanco / layout:**
- Los BLOQUES 4, 5 y CITA FINAL (3 párrafos independientes) fueron **movidos dentro del `<View style={styles.textColumn}>`** del BLOQUE 3 (que contiene la imagen del chico).
- Antes: los 3 párrafos quedaban flotando debajo de la imagen dejando gran espacio en blanco.
- Después: los 4 párrafos fluyen verticalmente junto a la imagen del chico.

---

### 8. `src/screens/MaterialesConsultaScreen.js` — Materiales de Consulta (grilla principal)

**Ítems ocultados:**

**Ítem id: 3** — "Ampliación del alcance del lineamiento técnico" (`page: "MaterialTres"`) — ocultado en sesión anterior.

**Ítem id: 4** — "Ruta de protección y restablecimiento de derechos" (`page: "MaterialCuatro"`, imagen amarilla) — **ocultado en sesión 17 marzo** por solicitud del cliente.

```javascript
// OCULTO POR SOLICITUD DEL CLIENTE — contenido disponible pero no visible en la app
// {
//   id: 3,
//   titulo: t("materials.items.ampliacion"),
//   imagen: require("../../assets/images/material3.png"),
//   page: "MaterialTres",
// },
// OCULTO POR SOLICITUD DEL CLIENTE — contenido disponible pero no visible en la app
// {
//   id: 4,
//   titulo: t("materials.items.rutaProteccion"),
//   imagen: require("../../assets/images/material4.png"),
//   page: "MaterialCuatro",
// },
```

**Tarjetas actualmente visibles en Materiales de Consulta:**
1. Antecedentes (`MaterialUno`)
2. Conceptos clave sobre trata en entornos virtuales (`MaterialDos`)
3. Ruta para la atención especializada (`MaterialRutaAtencion`)
4. Restablecimiento de derechos específicos (`MaterialesSeis`)

### 9. `src/screens/MaterialInclucionScreen.js` — Inclusión social

**Modificado el 17 marzo 2026 (10:47 AM)**

**Fix de espacio en blanco excesivo:**
- El segundo párrafo tenía `style={[styles.paragraph, { marginBottom: RelativeSize(200) }]}` — un margen inferior de 200 unidades que generaba un hueco gigante antes de la imagen de fondo inferior.
- Corregido a `style={styles.paragraph}` (usa el `marginBottom: RelativeSize(12)` del estilo base).

**Ajuste de `lineHeight`:**
| Propiedad | Antes | Después |
|---|---|---|
| `lineHeight` | `RelativeSize(15)` | `RelativeSize(19)` |

---

## DIAGNÓSTICO DE ENTORNO — 17 MARZO 2026

**Problema detectado: IP incorrecta en el Prompt Maestro**
- IP documentada en el prompt maestro: `192.168.1.5`
- IP real de la PC en esta sesión: `192.168.1.6`
- **Impacto:** el emulador se conectaba a una IP inexistente, sirviendo bundle cacheado antiguo.

**Solución implementada:**
- Se configuró `adb reverse tcp:8081 tcp:8081` para que el emulador use `localhost` vía túnel ADB (independiente de IP WiFi).
- URL del emulador: `exp://localhost:8081`
- URL del S25 Ultra: `exp://192.168.1.6:8081`

**Problema detectado: bundle cacheado persistente**
- Metro servía bundle antiguo aunque el código fuente ya estuviera modificado.
- **Solución:** `adb shell pm clear host.exp.exponent` (borra datos internos de Expo Go en el emulador) + `npx expo start --port 8081 --clear` (limpia `node_modules/.cache`).

**Emulador con pantalla negra al inicio:**
- Causa: snapshot corrupto + conflicto de GPU.
- Solución: `& emulator.exe -avd Medium_Phone_API_36.1 -no-snapshot-load -gpu swiftshader_indirect`

---

## ARCHIVOS NO MODIFICADOS (referencia)

Los siguientes archivos de contenido educativo **NO fueron tocados** en esta sesión:
- `MaterialCiberacosoScreen.js`
- `MaterialRestablecimientoScreen.js`
- `MaterialRutableAtencionfScreen.js`
- Todos los archivos de `src/database/`, `src/api/`, `src/context/`, `src/i18n/`
- `App.js`, `package.json`, `app.json`, `eas.json`

---

## CAMBIOS DE INFRAESTRUCTURA / ENTORNO

| Acción | Detalle |
|---|---|
| Backup creado | `D:\respaldoapk 18 marzo` (excluye node_modules, build, .gradle, .expo) |
| Prompt maestro creado | `D:\respaldoapk 18 marzo\prompt maestro.md` |
| Firewall Windows | Regla "Expo Metro 8081" — TCP port 8081 inbound |
| Metro server | Corriendo en puerto `8081` (IP actual: `192.168.1.6`) |
| Emulador URL | `exp://localhost:8081` (vía ADB reverse) |
| S25 Ultra URL | `exp://192.168.1.6:8081` |
| AVD | `Medium_Phone_API_36.1` en `emulator-5554` |
| Flags de emulador recomendados | `-no-snapshot-load -gpu swiftshader_indirect` |

---

## NOTAS PARA EL PRÓXIMO DESARROLLADOR

1. **Para restaurar "Ampliación del alcance":** descomenta el bloque `id: 3` en `MaterialesConsultaScreen.js` ~línea 45.
2. **Para restaurar "Ruta de protección":** descomenta el bloque `id: 4` en `MaterialesConsultaScreen.js` ~línea 53.
3. **IP de la PC puede cambiar** entre sesiones (DHCP). Siempre verificar con:
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch "^127\." }
   ```
4. **Reinicio limpio de Metro:**
   ```powershell
   Get-Process -Name "node" | Stop-Process -Force
   npx expo start --port 8081 --clear
   ```
5. **Emulador pantalla negra:** usar flags `-no-snapshot-load -gpu swiftshader_indirect`.
6. **Emulador no refresca cambios:** ejecutar `adb -s emulator-5554 shell pm clear host.exp.exponent` y reconectar.
7. **Pendiente de sesiones anteriores (no tocado):**
   - Reducir nesting condicional en `LoginScreen.js` y `PasoTresScreen.js`
   - Reemplazar magic numbers con constantes nombradas

---

*Última actualización: 17 marzo 2026 | Proyecto: ModoSeguro — ICBF + OIM*

---

## ARCHIVOS MODIFICADOS

### 1. `src/screens/MaterialUnoScreen.js` — Antecedentes

**Cambios de estilo en `paragraph`:**
| Propiedad | Antes | Después |
|---|---|---|
| `fontFamily` | `PersonFontSize.require` | `PersonFontSize.regular` |
| `lineHeight` | `RelativeSize(22)` | `RelativeSize(12)` |
| `color` | `#444` | `#666` |
| `marginBottom` | *(no existía)* | `RelativeSize(16)` |

**Cambio de layout en BLOQUE 3:**
- `<View style={[styles.textColumn, { justifyContent: "flex-end" }]}>` → `<View style={[styles.textColumn, { marginTop: 10 }]}>`
- Motivo: el texto no bajaba con `justifyContent` porque el padre no tenía altura fija.

**Textos reemplazados (BLOQUES 1, 2 y 3):**
- BLOQUE 1: Texto sobre Art. 44 Constitución, Ley 985/2005, Ley 1098/2006 e ICBF *(sin cambios en esta sesión)*
- BLOQUE 2: Texto sobre desarrollo de "Modo Seguro a un Clic" *(sin cambios en esta sesión)*
- BLOQUE 3: Texto sobre colaboradores del ICBF *(sin cambios en esta sesión)*

---

### 2. `src/screens/MaterialVirtualUnoScreen.js` — Entornos virtuales

**Párrafo introductorio (TEXTO INTRODUCTORIO):**
> **Antes:** "Los entornos virtuales son espacios digitales en los que las personas interactúan a través de tecnologías de la información y la comunicación."

> **Después:** "Los entornos virtuales o digitales son espacios en línea donde las personas se comunican, aprenden, juegan y comparten mediante tecnologías de información y comunicación. Para niñas, niños y adolescentes, estos espacios representan oportunidades de desarrollo, socialización y aprendizaje, pero también escenarios de riesgo cuando no cuentan con acompañamiento adulto responsable o alfabetización digital."

**Sección TEXTO FINAL + IMAGEN (bottomRow):**
- Se eliminaron los 2 párrafos anteriores (NNA representan oportunidades... / dinámicas de captación...)
- Se reemplazaron por 1 solo párrafo nuevo:
> "La conectividad constante y el anonimato que ofrecen estos espacios facilitan que los agresores contacten, manipulen y exploten sin necesidad de encuentro físico, lo cual dificulta la detección oportuna por parte de familias, educadores y autoridades. Según UNICEF (2024), aproximadamente uno de cada tres usuarios de internet en el mundo es una niña, niño o adolescente, y cerca del 80% en 25 países han expresado sentirse en riesgo de abuso o explotación sexual en línea."

---

### 3. `src/screens/MaterialVirtualDosScreen.js` — Trata de personas con fines de explotación sexual

**Vista "uno" — párrafo principal:**
- Se dividió en 3 párrafos independientes (`<Text style={styles.paragraph}>` separados):
  1. "La trata de personas es un delito. Consiste en captar, trasladar, alojar o recibir una persona..."
  2. "Para lograrlo, las personas tratantes pueden usar engaños, fraudes, amenazas..."
  3. "La trata de personas con fines de explotación sexual en entornos virtuales implica una serie de acciones..."

**Botón linkText (vista "uno"):**
> **Antes:** "La explotación sexual en entornos virtuales no ocurre de manera aislada..."
> **Después:** "La explotación sexual en entornos digitales NO ocurre de manera aislada..."

**Vista "dos" — título linkText:**
- Mismo cambio: "virtuales" → "digitales", "no" → "NO"

**Vista "dos" — 4 ítems con círculos (trataCirculo1–4):**
Todos los textos expandidos con detalles técnicos:
| Ítem | Antes | Después |
|---|---|---|
| 1 | "Las características de víctimas y agresores." | "...edad, género, situación de vulnerabilidad, acceso a tecnología, intención criminal" |
| 2 | "Las prácticas utilizadas para la captación y acogida." | "...grooming, técnica del amante o loverboy, sextorsión, manipulación emocional, amenazas" |
| 3 | "Los medios tecnológicos empleados..." | "...redes sociales, apps de mensajería cifrada, plataformas de streaming, darknet, criptomonedas" |
| 4 | "Los factores de riesgo presentes en los distintos niveles del entorno." | "...modelo ecológico: individual, familiar, comunitario, cultural/institucional con ejemplos" |

**Fix de desbordamiento de texto:**
- Cada `<Text>` dentro de `<View style={styles.row}>` fue envuelto en `<View style={{ flex: 1 }}>` para evitar que el texto se saliera de la tarjeta.

---

### 4. `src/screens/MaterialVirtualTresScreen.js` — Dinámica de la trata

**Segundo párrafo — reemplazado completamente:**
> **Antes:** "Según la OIM (2018), prácticas como el phishing, el grooming en línea y la sextorsión han sido adoptadas..."

> **Después:** Párrafo introductorio + 4 puntos con guión:
> - "Internet y las plataformas digitales no son solamente escenarios donde ocurre el delito..."
> - "- Alcanzar víctimas a escala global..."
> - "- Operar con mayor anonimato e impunidad..."
> - "- Diversificar sus métodos de captación, control y explotación..."
> - "- Normalizar y mercantilizar la explotación..."

**Cambio de layout en `bottomRow`:**
- `alignItems: "flex-end"` → `alignItems: "center"`
- Motivo: el último párrafo quedaba pegado al pie de la imagen, ahora se centra verticalmente.

---

### 5. `src/screens/MaterialVirtualCuatroScreen.js` — Comportamientos o prácticas de riesgo

**Párrafo introductorio:**
> **Antes:** "Son aquelas prácticas o exposiciones que aumentan la vulnerabilidad de los niños, niñas y adolecentes frente a potenciales agresores." *(tenía errores ortográficos)*

> **Después:** "Son aquellas conductas o exposiciones que aumentan la vulnerabilidad de niñas, niños y adolescentes frente a potenciales agresores. Es importante destacar que estas prácticas NO son la causa de la violencia sexual, la responsabilidad siempre recae en el agresor, pero su conocimiento permite desarrollar estrategias de prevención y autocuidado."

---

### 6. `src/screens/MaterialVirtualClaveScreen.js` — Grooming en línea

**Párrafos 1 y 2 (PÁRRAFOS NORMALES):**
> **Antes párrafo 1:** "Seducción de menores de edad por medio de las tecnologías de la información y la comunicación."
> **Después párrafo 1:** "Seducción de niñas, niños y adolescentes por medio de las tecnologías de la información y la comunicación."

> **Antes párrafo 2:** "El grooming implica la manipulación deliberada de niños, niñas y adolescentes a través de internet, con el objetivo de establecer contacto sexual (Unicef, 2016)."
> **Después párrafo 2:** "El grooming en línea es el acoso sexual que un adulto realiza hacia un niño, niña o adolescente mediante plataformas digitales. El grooming NO es la antesala de un delito: es en sí mismo un delito y una forma de abuso sexual, aunque nunca se concrete un encuentro físico (UNICEF Argentina, 2023)."

**Párrafo "Este fenómeno puede culminar...":**
> **Antes:** "Este fenómeno puede culminar en encuentros presenciales o actividades sexuales en línea, y representa un riesgo grave para la integridad física y emocional de los menores."

> **Después:** "Este proceso puede culminar en encuentros presenciales, producción de Material de Abuso Sexual Infantil (MASI), o actividades sexuales en línea, representando un riesgo grave para la integridad física y emocional de las infancias y adolescencias."

**Fix de superposición con imagen:**
- El párrafo largo fue movido **fuera** del bloque `<View style={styles.textWithCharacter}>` (que tiene la imagen posicionada con `position: absolute`).
- Ahora es un `<Text style={styles.paragraph}>` independiente debajo del bloque, evitando superposición.

---

### 7. `src/screens/MaterialesSexteoScreen.js` — Sexteo o Sexting

**BLOQUE 2 — párrafo reemplazado:**
> **Antes:** "Cuando involucra a menores de edad, puede considerarse una forma de producción y distribución de pornografía infantil, independientemente de la intención original."

> **Después:** "Cuando involucra menores de edad constituye producción y distribución de Material de Abuso Sexual Infantil (MASI), independientemente de la intención original o de quién creó el contenido. Los niños, niñas y adolescentes NO pueden dar consentimiento legal para participar en actividades sexuales ni en su registro (RAINN, 2024; Asociación REA, 2024)."

**Fix de espacio en blanco / layout:**
- Los BLOQUES 4, 5 y CITA FINAL (3 párrafos independientes) fueron **movidos dentro del `<View style={styles.textColumn}>`** del BLOQUE 3 (que contiene la imagen del chico).
- Antes: los 3 párrafos quedaban flotando debajo de la imagen dejando gran espacio en blanco.
- Después: los 4 párrafos fluyen verticalmente junto a la imagen del chico.

---

### 8. `src/screens/MaterialesConsultaScreen.js` — Materiales de Consulta (grilla principal)

**Ítem ocultado:**
- El ítem `id: 3` ("Ampliación del alcance del lineamiento técnico", `page: "MaterialTres"`) fue **comentado** del array `materiales`.
- El código permanece en el archivo para restauración futura.
- Las pantallas `MaterialTres`, `MaterialesTres`, `MaterialAmpliacionUno`, `MaterialAmpliacionDos`, `MaterialAmpliacionTres` **NO fueron eliminadas**, solo son inaccesibles desde la UI.

```javascript
// OCULTO POR SOLICITUD DEL CLIENTE — contenido disponible pero no visible en la app
// {
//   id: 3,
//   titulo: t("materials.items.ampliacion"),
//   imagen: require("../../assets/images/material3.png"),
//   page: "MaterialTres",
// },
```

---

## ARCHIVOS NO MODIFICADOS (referencia)

Los siguientes archivos de contenido educativo **NO fueron tocados** en esta sesión:
- `MaterialVirtualDosScreen.js` — vista de componentes (ya existía correcta)
- `MaterialCiberacosoScreen.js`
- `MaterialRestablecimientoScreen.js`
- `MaterialRutableAtencionfScreen.js`
- Todos los archivos de `src/database/`, `src/api/`, `src/context/`, `src/i18n/`
- `App.js`, `package.json`, `app.json`, `eas.json`

---

## CAMBIOS DE INFRAESTRUCTURA / ENTORNO

| Acción | Detalle |
|---|---|
| Backup creado | `D:\respaldoapk 18 marzo` (excluye node_modules, build, .gradle, .expo) |
| Prompt maestro creado | `D:\respaldoapk 18 marzo\prompt maestro.md` |
| Firewall Windows | Regla "Expo Metro 8081" — TCP port 8081 inbound (ya existía de sesión anterior) |
| Metro server | Corriendo en `exp://192.168.1.5:8081` |
| AVD | `Medium_Phone_API_36.1` en `emulator-5554` |

---

## NOTAS PARA EL PRÓXIMO DESARROLLADOR

1. **Para restaurar "Ampliación del alcance":** descomenta el bloque comentado en `MaterialesConsultaScreen.js` línea ~45.
2. **Para reiniciar el entorno de desarrollo:** usa el archivo `prompt maestro.md` en `D:\respaldoapk 18 marzo`.
3. **Pendiente de sesiones anteriores (no tocado en esta sesión):**
   - Ítem #8 checklist: reducir nesting condicional en `LoginScreen.js` y `PasoTresScreen.js`
   - Ítem #9 checklist: reemplazar magic numbers con constantes nombradas

---

*Generado: 17 marzo 2026 | Proyecto: ModoSeguro — ICBF + OIM*
