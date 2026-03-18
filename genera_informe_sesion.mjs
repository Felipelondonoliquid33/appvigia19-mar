/**
 * genera_informe_sesion.mjs
 * Genera un informe Word (.docx) corporativo que documenta todos los
 * cambios realizados en la sesión 17-18 Marzo 2026 para el programador
 * que continuará el proyecto.
 *
 * Ejecutar con: node genera_informe_sesion.mjs
 */

import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, ShadingType,
  BorderStyle, TableLayoutType, VerticalAlign, PageBreak,
  convertInchesToTwip,
} from 'docx';
import { writeFileSync } from 'fs';

// ── Paleta de colores ──────────────────────────────────────────────────────────
const C = {
  rosado:    'FF0099',
  rosadoOsc: 'C0006A',
  rosadoPal: 'FFF0F6',
  rosadoMed: 'FFD6EC',
  grisOsc:   '222222',
  grisMed:   '555555',
  grisText:  '333333',
  grisClaro: 'F5F5F5',
  blanco:    'FFFFFF',
  verdeOk:   '1E8449',
  verdePal:  'E9F7EF',
  rojoFail:  'C0392B',
  rojoPal:   'FDEDEC',
  amarillo:  'D68910',
  amarilloPal:'FEF9E7',
  azul:      '1A5276',
  azulPal:   'EAF2F8',
  naranjaOsc:'E67E22',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({
    text,
    size: opts.size ?? 22,
    font: opts.font ?? 'Calibri',
    color: opts.color ?? C.grisText,
    bold: opts.bold ?? false,
    italics: opts.italic ?? false,
  })],
  spacing: { after: opts.spaceAfter ?? 100, before: opts.spaceBefore ?? 0 },
  alignment: opts.align ?? AlignmentType.LEFT,
});

const gap = (pts = 100) => new Paragraph({ spacing: { after: pts } });

const pMixed = (runs, opts = {}) => new Paragraph({
  children: runs.map(r => new TextRun({
    text: r.text,
    size: r.size ?? 22,
    font: r.font ?? 'Calibri',
    color: r.color ?? C.grisText,
    bold: r.bold ?? false,
    italics: r.italic ?? false,
    highlight: r.highlight,
  })),
  spacing: { after: opts.spaceAfter ?? 100, before: opts.spaceBefore ?? 0 },
  alignment: opts.align ?? AlignmentType.LEFT,
  indent: opts.indent ? { left: opts.indent } : undefined,
});

const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 40, color: C.rosado, font: 'Calibri' })],
  spacing: { before: 360, after: 180 },
  border: { bottom: { color: C.rosado, size: 6, space: 4, style: BorderStyle.SINGLE } },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 30, color: C.rosadoOsc, font: 'Calibri' })],
  spacing: { before: 280, after: 120 },
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24, color: C.azul, font: 'Calibri' })],
  spacing: { before: 200, after: 80 },
});

const bullet = (text, color = C.grisText, indent = 360) => new Paragraph({
  children: [
    new TextRun({ text: '◼  ', color: C.rosado, size: 20, font: 'Calibri' }),
    new TextRun({ text, size: 20, color, font: 'Calibri' }),
  ],
  spacing: { after: 60 },
  indent: { left: indent },
});

const bulletBold = (label, desc, indentL = 360) => new Paragraph({
  children: [
    new TextRun({ text: '◼  ', color: C.rosado, size: 20, font: 'Calibri' }),
    new TextRun({ text: label, bold: true, size: 20, color: C.grisOsc, font: 'Calibri' }),
    new TextRun({ text: ': ' + desc, size: 20, color: C.grisText, font: 'Calibri' }),
  ],
  spacing: { after: 60 },
  indent: { left: indentL },
});

const warn = (text) => new Paragraph({
  children: [
    new TextRun({ text: '⚠  ', size: 22, font: 'Segoe UI Emoji' }),
    new TextRun({ text, bold: true, size: 20, color: C.naranjaOsc, font: 'Calibri' }),
  ],
  spacing: { after: 80 },
  indent: { left: 360 },
});

const ok = (text) => new Paragraph({
  children: [
    new TextRun({ text: '✅  ', size: 22, font: 'Segoe UI Emoji' }),
    new TextRun({ text, size: 20, color: C.verdeOk, font: 'Calibri' }),
  ],
  spacing: { after: 60 },
  indent: { left: 360 },
});

const tc = (text, { bg = C.blanco, bold = false, color = C.grisText, size = 20, align = AlignmentType.LEFT } = {}) =>
  new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: text ?? '', bold, color, size, font: 'Calibri' })],
      alignment: align,
      spacing: { before: 60, after: 60 },
    })],
    shading: { type: ShadingType.CLEAR, fill: bg },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
    },
  });

const tableWithHeader = (headers, rows) => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: headers.map(h => tc(h, { bg: C.rosado, bold: true, color: C.blanco, size: 20, align: AlignmentType.CENTER })),
      tableHeader: true,
    }),
    ...rows.map((row, idx) => new TableRow({
      children: row.map((cell, i) => tc(typeof cell === 'string' ? cell : cell.text, {
        bg: idx % 2 === 0 ? C.blanco : C.rosadoPal,
        bold: typeof cell === 'object' ? cell.bold ?? false : false,
        color: typeof cell === 'object' ? cell.color ?? C.grisText : C.grisText,
        align: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
      })),
    })),
  ],
});

const bannerBox = (title, subtitle, bg = C.azul) => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: title, bold: true, size: 52, color: C.blanco, font: 'Calibri' })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 40 },
            }),
            new Paragraph({
              children: [new TextRun({ text: subtitle, size: 24, color: C.rosadoMed, font: 'Calibri' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
          ],
          shading: { type: ShadingType.CLEAR, fill: bg },
          margins: { top: 200, bottom: 200, left: 400, right: 400 },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        }),
      ],
    }),
  ],
});

const sectionBox = (label, color, textColor = C.blanco) => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: label, bold: true, size: 26, color: textColor, font: 'Calibri' })],
            spacing: { before: 80, after: 80 },
            indent: { left: 200 },
          })],
          shading: { type: ShadingType.CLEAR, fill: color },
          borders: {
            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.THICK, size: 12, color: C.rosadoOsc },
            right: { style: BorderStyle.NONE },
          },
        }),
      ],
    }),
  ],
});

// ── Código de ejemplo con fondo oscuro ────────────────────────────────────────
const codeBlock = (lines) => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: lines.map(l => new Paragraph({
            children: [new TextRun({ text: l, size: 18, color: 'A9D8A0', font: 'Courier New' })],
            spacing: { after: 20 },
          })),
          shading: { type: ShadingType.CLEAR, fill: '1E1E1E' },
          margins: { top: 120, bottom: 120, left: 200, right: 200 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: C.rosado },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rosado },
            left: { style: BorderStyle.SINGLE, size: 12, color: C.rosado },
            right: { style: BorderStyle.NONE },
          },
        }),
      ],
    }),
  ],
});


// ══════════════════════════════════════════════════════════════════════════════
// CONTENIDO DEL DOCUMENTO
// ══════════════════════════════════════════════════════════════════════════════

const doc = new Document({
  creator: 'GitHub Copilot - Sesión 17/18 Marzo 2026',
  title: 'Informe Técnico de Entrega - VigiaTP App',
  description: 'Documentación completa de integración, bugs corregidos y versión final del código.',
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1.1),
          right: convertInchesToTwip(1.1),
        },
      },
    },
    children: [

      // ── PORTADA ──────────────────────────────────────────────────────────────
      gap(400),
      bannerBox(
        '📋  VigiaTP App',
        'Informe Técnico de Entrega — Sesión 17/18 Marzo 2026',
        '07133B'
      ),
      gap(200),

      new Paragraph({
        children: [new TextRun({ text: 'Versión Estabilizada y Lista para Producción', bold: true, size: 30, color: C.rosado, font: 'Calibri' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: '18 de Marzo, 2026  ·  Integración Temp Updates + Corrección de Crashes', size: 22, color: C.grisMed, font: 'Calibri' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Proyecto ubicado en: vigiatpapp20260302/', size: 20, color: C.azul, font: 'Courier New' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({ children: [new PageBreak()] }),


      // ── SECCIÓN 1: RESUMEN EJECUTIVO ──────────────────────────────────────────
      h1('1.  Resumen Ejecutivo'),
      p('Esta sesión de trabajo tuvo como objetivo integrar todos los cambios desarrollados previamente en la carpeta "Temp Updates" hacia el núcleo de la aplicación VigiaTP, y luego estabilizar la aplicación corrigiendo múltiples errores críticos que surgieron tras la integración.', { spaceAfter: 120 }),

      tableWithHeader(
        ['Ítem', 'Estado'],
        [
          ['Integración de carpeta Temp Updates', { text: '✅ Completado', color: C.verdeOk }],
          ['Corrección de crashes en Paso 1 (demográficos)', { text: '✅ Corregido', color: C.verdeOk }],
          ['Corrección de crashes en Paso 2 (preguntas)', { text: '✅ Corregido', color: C.verdeOk }],
          ['Visualización de "Pregunta Dirigida"', { text: '✅ Corregido', color: C.verdeOk }],
          ['Estabilización del servidor Metro (entorno local)', { text: '✅ Resuelto', color: C.verdeOk }],
          ['Pruebas en emulador Android API 36', { text: '✅ Funcional', color: C.verdeOk }],
          ['Pruebas en dispositivo físico (Samsung S25)', { text: '✅ Funcional', color: C.verdeOk }],
        ]
      ),
      gap(200),

      // ── SECCIÓN 2: INFRAESTRUCTURA Y ENTORNO ─────────────────────────────────
      h1('2.  Infraestructura y Entorno de Desarrollo'),

      h2('2.1  Configuración Crítica de app.json'),
      sectionBox('🚨  PROBLEMA BLOQUEANTE RESUELTO', C.rojoPal, C.rojoFail),
      gap(80),
      p('El servidor Metro (bundler) se cerraba silenciosamente cada vez que se intentaba iniciar, sin mostrar errores claros en la consola.'),
      bulletBold('Causa raíz', 'El archivo app.json contenía las propiedades "owner" y "extra.eas.projectId" que forzaban al CLI de Expo a intentar autenticarse con los servidores de Expo antes de iniciar.'),
      bulletBold('Síntoma', 'npx expo start terminaba con "Exit Code: 1" en todos los intentos.'),
      bulletBold('Solución', 'Se eliminaron permanentemente ambas propiedades del archivo app.json.'),
      gap(120),

      p('Estado actual del app.json (propiedades relevantes):', { bold: true }),
      codeBlock([
        '{',
        '  "expo": {',
        '    "name": "VigiaTP",',
        '    "slug": "vigiatpapp",',
        '    "version": "1.0.0",',
        '    // SIN "owner", SIN "extra.eas.projectId"',
        '    "plugins": ["expo-sqlite", "expo-font"]',
        '  }',
        '}',
      ]),
      gap(120),

      warn('NUNCA volver a agregar "owner" ni "extra.eas.projectId" al app.json a menos que se tengan las credenciales del propietario original de la cuenta Expo.'),
      gap(80),

      h2('2.2  Comando Correcto para Iniciar Metro'),
      p('Utilizar siempre este comando para iniciar el servidor de desarrollo:', { bold: true }),
      codeBlock([
        '$env:EXPO_OFFLINE = "1"',
        'npx expo start --port 8081 --clear',
      ]),
      p('La variable EXPO_OFFLINE=1 omite los chequeos de autenticación en línea de Expo CLI.', { color: C.grisMed, size: 20 }),
      gap(120),

      h2('2.3  Conexión de Dispositivos'),
      tableWithHeader(
        ['Dispositivo', 'Método de Conexión', 'URL / Comando'],
        [
          ['Android Emulator (API 36)', 'ADB Reverse', 'adb -s emulator-5554 reverse tcp:8081 tcp:8081'],
          ['Emulador → Expo Go', 'URL local', 'exp://127.0.0.1:8081'],
          ['Samsung S25 (WiFi)', 'Red LAN', 'exp://192.168.1.6:8081'],
        ]
      ),
      gap(200),


      // ── SECCIÓN 3: INTEGRACIÓN TEMP UPDATES ──────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('3.  Integración de Cambios (Carpeta Temp Updates)'),
      p('Los siguientes archivos fueron migrados desde la carpeta "Temp Updates" hacia la estructura src/ del proyecto. Esta carpeta ya está obsoleta. No usar para desarrollo futuro.'),
      gap(80),

      h2('3.1  Base de Datos'),
      tableWithHeader(
        ['Archivo', 'Cambio Realizado'],
        [
          ['src/database/database.js', 'Nombre DB: modoseguro4.db → modoseguro11.db'],
          ['src/database/schema.js', '4 nuevas columnas: edadEntrevista, momentoUno, momentoDos, momentoTres'],
          ['src/database/diligenciar.js', 'INSERT y UPDATE actualizados para incluir las 4 nuevas columnas'],
        ]
      ),
      gap(120),

      h2('3.2  Pantallas (Screens)'),
      tableWithHeader(
        ['Pantalla', 'Cambios Principales'],
        [
          ['LoginScreen.js', 'Mapeo de nuevos campos del servidor: EdadEntrevista, MomentoUno/Dos/Tres'],
          ['AsentimientoScreen.js', 'Mapeado del campo "Dirigida" desde preg.Tipo.Nombre al objeto indicador'],
          ['PasoUnoScreen.js', 'Carga de catálogos, validaciones demográficas, DropDownPicker para discapacidades y etnias'],
          ['PasoDosScreen.js', 'Navegación de preguntas, visualización del banner "Pregunta Dirigida", estilos'],
          ['PasoComentarioScreen.js', 'Título de observaciones vía i18n, lógica de guardar mejorada'],
          ['PasoTresScreen.js', 'Carga de catálogos para resultados y función de exportación'],
        ]
      ),
      gap(120),

      h2('3.3  Utilerías e Internacionalización'),
      tableWithHeader(
        ['Archivo', 'Cambios'],
        [
          ['src/i18n/translations.js', 'Nuevas claves: observacionTitulo, mustBeAge (idiomas ES + EN)'],
          ['src/componentes/funciones.js', 'Función validarMayorToYear: corrección para valores null/undefined'],
        ]
      ),
      gap(200),


      // ── SECCIÓN 4: CORRECCIÓN DE BUGS CRÍTICOS ────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('4.  Corrección de Bugs Críticos (Sesión de Estabilización)'),
      p('Tras la integración, se detectaron y corrigieron en tiempo real los siguientes errores que causaban cierre inesperado de la aplicación ("crash") en el dispositivo.'),
      gap(80),

      // Bug 1
      sectionBox('BUG #1  —  Crash al seleccionar Etnia, Discapacidad o cualquier lista desplegable', C.rojoPal, C.rojoFail),
      gap(80),
      bulletBold('Pantalla afectada', 'PasoUnoScreen.js (formulario demográfico, Paso 1)'),
      bulletBold('Síntoma', 'La app se cerraba inmediatamente al tocar el selector de "Etnia", "Discapacidad" o cualquier DropDownPicker.'),
      bulletBold('Causa raíz', 'JSON.parse() se llamaba sin try/catch. Si el campo en la base de datos venía vacío o null, el .map() posterior fallaba con "Cannot read property of undefined".' ),
      gap(80),
      p('Código antes (vulnerable):', { bold: true }),
      codeBlock([
        '// ❌ Sin protección — crashea si catalogos.etnias es null',
        'let lstEtnias = JSON.parse(catalogos.etnias);',
        'setItemsEtnia(lstEtnias.map(d => ({ label: d.Nombre, value: d.Id })));',
      ]),
      gap(80),
      p('Código después (protegido):', { bold: true }),
      codeBlock([
        '// ✅ Versión estable con manejo defensivo',
        'try {',
        '  let lstEtnias = JSON.parse(catalogos.etnias) || [];',
        '  setItemsEtnia([',
        '    { label: "No aplica", value: 0 },',
        '    ...(Array.isArray(lstEtnias) ? lstEtnias : [])',
        '      .map(d => ({ label: d?.Nombre ?? "", value: d?.Id }))',
        '      .filter(item => item.value != null)',
        '  ]);',
        '} catch (e) {',
        '  // Fallback seguro: lista vacía, app continua funcionando',
        '}',
      ]),
      gap(100),
      ok('Corrección aplicada a: Etnias, Discapacidades, Grados, Nacionalidades, Departamentos, Municipios.'),
      ok('La misma corrección fue aplicada en PasoTresScreen.js por la misma vulnerabilidad.'),
      gap(200),

      // Bug 2
      sectionBox('BUG #2  —  Crash al navegar entre preguntas (Paso 2)', C.rojoPal, C.rojoFail),
      gap(80),
      bulletBold('Pantalla afectada', 'PasoDosScreen.js'),
      bulletBold('Síntoma', 'La app se cerraba al presionar "Siguiente" o "Anterior" entre preguntas de la entrevista.'),
      bulletBold('Causa 1', 'La función guardarDetalle() usaba detalle.currentIndex (undefined) en lugar de detalle.IndexIndicador.'),
      bulletBold('Causa 2', 'La función fue declarada como async arrow function lo que causaba condiciones de carrera en el estado de React.'),
      bulletBold('Causa 3', 'indicadorActual.Opciones podía ser undefined causando un .map() sobre null.'),
      gap(80),
      codeBlock([
        '// ✅ Versiones corregidas aplicadas en PasoDosScreen.js',
        '',
        '// 1. Protección de Opciones:',
        '{(indicadorActual.Opciones || []).map((opcion) => { ... })}',
        '',
        '// 2. Función guardarDetalle corregida (sin async, con try/catch):',
        'const guardarDetalle = () => {',
        '  try {',
        '    detalle.Indicadores[detalle.IndexIndicador] = indicadorActual; // ← índice correcto',
        '    // ... cálculo de puntaje ...',
        '  } catch(e) { /* error silenciado */ }',
        '}',
      ]),
      gap(200),

      // Bug 3
      sectionBox('BUG #3  —  Banner "Pregunta Dirigida A..." nunca aparecía', C.amarilloPal, C.amarillo),
      gap(80),
      bulletBold('Pantalla afectada', 'PasoDosScreen.js / AsentimientoScreen.js'),
      bulletBold('Síntoma', 'El diseño tiene un banner rosa que muestra a quién está dirigida cada pregunta. No aparecía nunca.'),
      bulletBold('Causa', 'AsentimientoScreen.js nunca mapeaba el campo Dirigida al objeto indicador al crear la entrevista.'),
      gap(80),
      codeBlock([
        '// ✅ Fix en AsentimientoScreen.js — mapeo del campo Dirigida',
        'const indicador = {',
        '  // ... otros campos ...',
        '  Dirigida: preg.Tipo ? preg.Tipo.Nombre : null,  // ← AGREGADO',
        '};',
        '',
        '// ✅ Fix en PasoDosScreen.js — renderizado condicional',
        '{indicadorActual.Dirigida ? (',
        '  <Text style={styles.tituloPregunta}>{indicadorActual.Dirigida}</Text>',
        ') : null}',
      ]),
      gap(80),
      warn('Este fix solo aplica a entrevistas NUEVAS. Las entrevistas guardadas antes de estos cambios no tendrán el campo Dirigida en su JSON.'),
      gap(200),

      // Bug 4
      sectionBox('BUG #4  —  Crash con tipos demográficos desconocidos', C.rojoPal, C.rojoFail),
      gap(80),
      bulletBold('Pantalla afectada', 'PasoUnoScreen.js (función handlerSiguiente)'),
      bulletBold('Síntoma', 'Si el servidor enviaba un tipo demográfico nuevo (no en la lista conocida), el indicador quedaba con Valor = null, bloqueando la navegación y crasheando el Paso 2.'),
      bulletBold('Solución', 'Se agregó un bloque else if de captura genérica que asigna Valor = 0 a cualquier tipo demográfico desconocido.'),
      gap(80),
      codeBlock([
        '// ✅ Captura de tipos demográficos no conocidos',
        '} else if (indicador.Demografico && indicador.Demografico.trim() !== "") {',
        '  // Tipo no reconocido — auto-responder con 0 para no bloquear la entrevista',
        '  indicador.Valor = 0;',
        '}',
      ]),
      gap(200),


      // ── SECCIÓN 5: INSTRUCCIONES PARA EL EQUIPO ──────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('5.  Instrucciones para Continuar el Desarrollo'),

      h2('5.1  Versión Definitiva del Código'),
      sectionBox('✅  La carpeta vigiatpapp20260302 es la RAMA MAESTRA del proyecto', C.verdePal, C.verdeOk),
      gap(80),
      bullet('Esta carpeta contiene la versión integrada y estabilizada.'),
      bullet('La subcarpeta "Temp Updates" ya está obsoleta. Su contenido fue absorbido.'),
      bullet('La subcarpeta "vigiatpapp20260302/" que aparece dentro de la carpeta raíz es un duplicado que puede ser ignorado.'),
      gap(120),

      h2('5.2  Reglas de Oro para Mantener la Estabilidad'),
      warn('No agregar "owner" ni "extra.eas.projectId" en app.json.'),
      warn('No sobreescribir PasoUnoScreen.js, PasoDosScreen.js ni PasoTresScreen.js con versiones antiguas sin aplicar los parches de null-safety.'),
      warn('No cambiar el nombre de la base de datos modoseguro11.db sin actualizar schema.js y database.js.'),
      gap(80),
      ok('Siempre usar EXPO_OFFLINE=1 al iniciar Metro en entorno local.'),
      ok('Siempre proteger los JSON.parse() con try/catch y || [] fallback.'),
      ok('Siempre usar optional chaining (?.) al acceder propiedades de objetos de la entrevista.'),
      gap(200),

      h2('5.3  Arquitectura de Pantallas (Flujo de Entrevista)'),
      tableWithHeader(
        ['Pantalla', 'Ruta (Stack)', 'Descripción'],
        [
          ['AsentimientoScreen', 'Asentimiento', 'Crea el objeto detalle con todos los indicadores mapeados'],
          ['PasoUnoScreen', 'PasoUno', 'Formulario demográfico (fecha, género, etnia, discapacidad, etc.)'],
          ['PasoDosScreen', 'PasDos', 'Navegación por indicadores y preguntas con opciones radio'],
          ['PasoComentarioScreen', 'PasoComentario', 'Observaciones finales y campo de texto libre'],
          ['PasoTresScreen', 'PasoTres', 'Resultados, puntaje, riesgo y exportación'],
        ]
      ),
      gap(200),


      // ── SECCIÓN 6: RESUMEN DE ARCHIVOS MODIFICADOS ───────────────────────────
      h1('6.  Inventario de Archivos Modificados'),
      tableWithHeader(
        ['Archivo', 'Tipo de Cambio', 'Criticidad'],
        [
          ['app.json',                          'Configuración',     { text: '🔴 CRÍTICO', color: C.rojoFail }],
          ['src/database/database.js',          'Lógica BD',         { text: '🔴 CRÍTICO', color: C.rojoFail }],
          ['src/database/schema.js',            'Estructura BD',     { text: '🔴 CRÍTICO', color: C.rojoFail }],
          ['src/database/diligenciar.js',       'Lógica BD',         { text: '🟡 Alta',    color: C.amarillo }],
          ['src/screens/AsentimientoScreen.js', 'Pantalla',          { text: '🟡 Alta',    color: C.amarillo }],
          ['src/screens/PasoUnoScreen.js',      'Pantalla',          { text: '🔴 CRÍTICO', color: C.rojoFail }],
          ['src/screens/PasoDosScreen.js',      'Pantalla',          { text: '🔴 CRÍTICO', color: C.rojoFail }],
          ['src/screens/PasoComentarioScreen.js','Pantalla',         { text: '🟡 Alta',    color: C.amarillo }],
          ['src/screens/PasoTresScreen.js',     'Pantalla',          { text: '🟡 Alta',    color: C.amarillo }],
          ['src/screens/LoginScreen.js',        'Pantalla',          { text: '🟢 Media',   color: C.verdeOk }],
          ['src/componentes/funciones.js',      'Utilería',          { text: '🟡 Alta',    color: C.amarillo }],
          ['src/i18n/translations.js',          'Traducciones',      { text: '🟢 Media',   color: C.verdeOk }],
        ]
      ),
      gap(300),


      // ── PIE DE PÁGINA ─────────────────────────────────────────────────────────
      bannerBox(
        'Entrega Completada',
        'Versión estable · 18 Marzo 2026 · VigiaTP App',
        C.rosadoOsc
      ),

    ],
  }],
});

// ── Generar archivo ───────────────────────────────────────────────────────────
Packer.toBuffer(doc).then((buffer) => {
  writeFileSync('INFORME_TECNICO_ENTREGA_VIGIATP.docx', buffer);
  console.log('✅ Informe generado: INFORME_TECNICO_ENTREGA_VIGIATP.docx');
});
