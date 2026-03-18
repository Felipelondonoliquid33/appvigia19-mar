/**
 * genera_informe.mjs
 * Genera un Word (.docx) visual y corporativo para personal no técnico
 * que describe las pruebas automatizadas de la app ModoSeguro.
 *
 * Ejecutar con: node genera_informe.mjs
 */

import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, ShadingType,
  BorderStyle, TableLayoutType, VerticalAlign, PageBreak,
  convertInchesToTwip, LevelFormat, UnderlineType,
} from 'docx';
import { writeFileSync } from 'fs';

// ── Paleta de colores ModoSeguro ──────────────────────────────────────────────
const C = {
  rosado:    'FF008C',
  rosadoOsc: 'C0006A',
  rosadoPal: 'FFF0F6',
  rosadoMed: 'FFD6EC',
  grisOsc:   '333333',
  grisMed:   '555555',
  grisText:  '444444',
  blanco:    'FFFFFF',
  verdeOk:   '27AE60',
  rojoFail:  'E74C3C',
  amarillo:  'F39C12',
  azul:      '2980B9',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Párrafo de texto normal */
const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({
    text,
    size: opts.size ?? 22,
    font: opts.font ?? 'Calibri',
    color: opts.color ?? C.grisText,
    bold: opts.bold ?? false,
    italics: opts.italic ?? false,
  })],
  spacing: { after: opts.spaceAfter ?? 120, before: opts.spaceBefore ?? 0 },
  alignment: opts.align ?? AlignmentType.LEFT,
});

/** Párrafo vacío (separador) */
const gap = (pts = 80) => new Paragraph({ spacing: { after: pts } });

/** Texto con múltiples runs */
const pMixed = (runs, opts = {}) => new Paragraph({
  children: runs.map(r => new TextRun({
    text: r.text,
    size: r.size ?? 22,
    font: r.font ?? 'Calibri',
    color: r.color ?? C.grisText,
    bold: r.bold ?? false,
    italics: r.italic ?? false,
  })),
  spacing: { after: opts.spaceAfter ?? 120, before: opts.spaceBefore ?? 0 },
  alignment: opts.align ?? AlignmentType.LEFT,
});

/** Heading estilizado */
const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 36, color: C.rosado, font: 'Calibri' })],
  spacing: { before: 320, after: 160 },
  border: {
    bottom: { color: C.rosado, size: 4, space: 4, style: BorderStyle.SINGLE },
  },
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 28, color: C.rosadoOsc, font: 'Calibri' })],
  spacing: { before: 240, after: 120 },
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24, color: C.grisMed, font: 'Calibri' })],
  spacing: { before: 160, after: 80 },
});

/** Bullet simple */
const bullet = (text, color = C.grisText) => new Paragraph({
  children: [
    new TextRun({ text: '◼  ', color: C.rosado, size: 20, font: 'Calibri' }),
    new TextRun({ text, size: 20, color, font: 'Calibri' }),
  ],
  spacing: { after: 60 },
  indent: { left: 360 },
});

/** Celda de tabla con fondo y texto */
const tc = (text, {
  bg = C.blanco, bold = false, color = C.grisText, size = 20,
  align = AlignmentType.LEFT, vAlign = VerticalAlign.CENTER,
  colspan = 1,
} = {}) => new TableCell({
  children: [new Paragraph({
    children: [new TextRun({ text, bold, color, size, font: 'Calibri' })],
    alignment: align,
    spacing: { before: 60, after: 60 },
  })],
  shading: { type: ShadingType.CLEAR, fill: bg },
  verticalAlign: vAlign,
  columnSpan: colspan,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
  },
});

/** Fila de encabezado de tabla (fondo rosado) */
const headerRow = (cols) => new TableRow({
  children: cols.map(c => tc(c, { bg: C.rosado, bold: true, color: C.blanco, size: 20, align: AlignmentType.CENTER })),
  tableHeader: true,
});

/** Fila de datos */
const dataRow = (cols, bgEven = C.blanco, isEven = false) => new TableRow({
  children: cols.map((c, i) => {
    const isFirst = i === 0;
    return tc(c.text ?? c, {
      bg: isEven ? C.rosadoPal : bgEven,
      bold: c.bold ?? isFirst,
      color: c.color ?? C.grisText,
      align: c.align ?? (i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER),
    });
  }),
});

/** Caja de resultado resaltada */
const resultBox = (icon, label, value, bgColor) => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({
            children: [
              new TextRun({ text: `${icon}  `, size: 44, font: 'Segoe UI Emoji' }),
              new TextRun({ text: label, bold: true, size: 26, color: bgColor === C.blanco ? C.grisOsc : C.blanco, font: 'Calibri' }),
              new TextRun({ text: `   ${value}`, bold: true, size: 30, color: bgColor === C.blanco ? bgColor : C.blanco, font: 'Calibri' }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
          })],
          shading: { type: ShadingType.CLEAR, fill: bgColor },
          margins: { top: 120, bottom: 120, left: 240, right: 240 },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: bgColor },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: bgColor },
            left: { style: BorderStyle.SINGLE, size: 6, color: bgColor },
            right: { style: BorderStyle.SINGLE, size: 6, color: bgColor },
          },
        }),
      ],
    }),
  ],
});

// ── Banner de título de portada ───────────────────────────────────────────────
const titleBanner = () => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      children: [new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Aplicación Móvil', size: 24, color: C.rosadoMed, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'ModoSeguro', bold: true, size: 56, color: C.blanco, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Informe de Pruebas Automatizadas', size: 28, color: C.rosadoMed, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '17 de Marzo de 2026  ·  Versión 1.0', size: 22, color: C.rosadoMed, font: 'Calibri', italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
        ],
        shading: { type: ShadingType.CLEAR, fill: C.rosado },
        margins: { top: 400, bottom: 400, left: 300, right: 300 },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      })],
    }),
  ],
});

// ── Tabla resumen general ─────────────────────────────────────────────────────
const tablaResumenGeneral = () => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    headerRow(['Indicador', 'Resultado']),
    dataRow(['✅  Pruebas que pasaron', { text: '41 de 41', bold: true, color: C.verdeOk }], C.blanco, false),
    dataRow(['❌  Pruebas con error', { text: '0', bold: true, color: C.verdeOk }], C.blanco, true),
    dataRow(['🗂️  Grupos de prueba evaluados', { text: '5', bold: true }], C.blanco, false),
    dataRow(['⏱️  Tiempo total de ejecución', { text: '16 segundos', bold: true }], C.blanco, true),
    dataRow(['📅  Fecha de ejecución', '17 de marzo de 2026'], C.blanco, false),
  ],
});

// ── Tabla de grupos de prueba ─────────────────────────────────────────────────
const tablaGrupos = () => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    headerRow(['#', 'Grupo probado', 'Pantalla / Componente', 'Tests', 'Estado']),
    dataRow(['1', 'Inicio de Sesión', 'LoginScreen', '6', { text: '✅ PASS', bold: true, color: C.verdeOk }], C.blanco, false),
    dataRow(['2', 'Menú Principal', 'HomeScreen', '9', { text: '✅ PASS', bold: true, color: C.verdeOk }], C.blanco, true),
    dataRow(['3', 'Navegación Inferior', 'FooterNav', '8', { text: '✅ PASS', bold: true, color: C.verdeOk }], C.blanco, false),
    dataRow(['4', 'Materiales Educativos', '4 pantallas de contenido', '16', { text: '✅ PASS', bold: true, color: C.verdeOk }], C.blanco, true),
    dataRow(['5', 'Aplicación Completa', 'App.js (raíz)', '2', { text: '✅ PASS', bold: true, color: C.verdeOk }], C.blanco, false),
    dataRow([{ text: '', bold: false }, { text: '', bold: false }, { text: 'TOTAL', bold: true }, { text: '41', bold: true, color: C.rosado }, { text: '✅ 100%', bold: true, color: C.verdeOk }], C.rosadoPal, false),
  ],
});

// ── Tabla de tipos de prueba ──────────────────────────────────────────────────
const tablaTiposPrueba = () => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    headerRow(['Tipo de prueba', '¿Qué comprueba?', 'Cantidad']),
    dataRow(['🟢  Smoke test', 'La pantalla abre sin errores', '10'], C.blanco, false),
    dataRow(['📝  Contenido visible', 'Textos y elementos presentes en pantalla', '14'], C.blanco, true),
    dataRow(['🔗  Navegación', 'Botones llevan a la pantalla correcta', '8'], C.blanco, false),
    dataRow(['🚫  Contenido oculto', 'Secciones desactivadas no aparecen', '2'], C.blanco, true),
    dataRow(['🐛  Regresión', 'Bugs corregidos no han vuelto', '3'], C.blanco, false),
    dataRow(['⚙️  Comportamiento', 'Lógica de validación y estados', '4'], C.blanco, true),
    dataRow([{ text: '', bold: false }, { text: 'TOTAL', bold: true }, { text: '41', bold: true, color: C.rosado }], C.rosadoPal, false),
  ],
});

// ── Tabla de frecuencia ───────────────────────────────────────────────────────
const tablaFrecuencia = () => new Table({
  layout: TableLayoutType.FIXED,
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    headerRow(['Momento', 'Recomendación']),
    dataRow(['Antes de cada entrega al cliente', { text: '✅ Obligatorio', bold: true, color: C.verdeOk }], C.blanco, false),
    dataRow(['Después de modificar cualquier pantalla', { text: '✅ Recomendado', bold: true, color: C.verdeOk }], C.blanco, true),
    dataRow(['Antes de generar el APK de producción', { text: '✅ Obligatorio', bold: true, color: C.verdeOk }], C.blanco, false),
    dataRow(['Después de actualizar librerías o dependencias', { text: '✅ Recomendado', bold: true, color: C.verdeOk }], C.blanco, true),
    dataRow(['Durante el desarrollo diario', { text: '⚡ Opcional (modo watch)', bold: false }], C.blanco, false),
  ],
});

// ── CONSTRUCCIÓN DEL DOCUMENTO ───────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22, color: C.grisText },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(1),
          right: convertInchesToTwip(1),
          bottom: convertInchesToTwip(1),
          left: convertInchesToTwip(1),
        },
      },
    },
    children: [
      // ── PORTADA ────────────────────────────────────────────────────────────
      titleBanner(),
      gap(400),

      // Subtítulo portada
      p('Documento elaborado para personal directivo, coordinadores y responsables de proyecto.', {
        align: AlignmentType.CENTER, italic: true, color: C.grisMed, size: 20,
      }),
      p('No se requieren conocimientos técnicos para leer este informe.', {
        align: AlignmentType.CENTER, italic: true, color: C.grisMed, size: 20, spaceAfter: 400,
      }),

      // Salto de página
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECCIÓN 1: QUÉ SON LAS PRUEBAS ────────────────────────────────────
      h1('¿Qué son las pruebas automatizadas?'),
      p('Imagine que antes de entregar un vehículo recién reparado, el mecánico hace una lista de verificación: enciende el motor, prueba los frenos, revisa las luces... Todo esto de forma sistemática para garantizar que nada falla.'),
      gap(),
      p('Las pruebas automatizadas hacen exactamente lo mismo con una aplicación móvil: son instrucciones de computador que verifican, de forma automática y en segundos, que cada pantalla y cada función del app funciona correctamente, sin necesidad de que una persona lo haga manualmente cada vez que se realice un cambio.'),
      gap(200),

      // ── SECCIÓN 2: RESULTADO GENERAL ────────────────────────────────────
      h1('Resultado General'),
      gap(80),
      tablaResumenGeneral(),
      gap(120),

      // Caja de conclusión
      resultBox('✅', 'Conclusión:', 'La aplicación pasa el 100% de las pruebas definidas.', C.verdeOk),
      gap(280),

      // Salto de página
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECCIÓN 3: PANTALLAS PROBADAS ─────────────────────────────────────
      h1('¿Qué pantallas se probaron?'),
      p('Se evaluaron 5 grupos de pantallas y componentes de la aplicación:'),
      gap(160),

      // --- Grupo 1: Login
      h2('1  ·  Pantalla de Inicio de Sesión (Login)'),
      pMixed([
        { text: '¿Qué hace? ', bold: true },
        { text: 'Primera pantalla al abrir la app. Permite ingresar usuario y contraseña.' },
      ]),
      gap(60),
      p('¿Qué verificamos?', { bold: true, spaceAfter: 60 }),
      bullet('La pantalla se abre sin errores'),
      bullet('Existen los campos para escribir usuario y contraseña'),
      bullet('El indicador de carga no aparece cuando no se ha iniciado ninguna acción'),
      bullet('Se puede escribir en los campos sin que la app se caiga'),
      bullet('El componente funciona incluso sin conexión a internet'),
      gap(60),
      pMixed([{ text: 'Resultado: ', bold: true }, { text: '✅ 6 pruebas pasadas', bold: true, color: C.verdeOk }], { spaceAfter: 220 }),

      // --- Grupo 2: Home
      h2('2  ·  Pantalla de Inicio (Home, Menú Principal)'),
      pMixed([
        { text: '¿Qué hace? ', bold: true },
        { text: 'Menú principal con dos opciones: iniciar una Entrevista o consultar los Materiales educativos.' },
      ]),
      gap(60),
      p('¿Qué verificamos?', { bold: true, spaceAfter: 60 }),
      bullet('La pantalla se abre sin errores'),
      bullet('El título de la aplicación se muestra correctamente'),
      bullet('El subtítulo descriptivo aparece en pantalla'),
      bullet('La tarjeta de "Entrevista" está visible'),
      bullet('La tarjeta de "Materiales" está visible'),
      bullet('Al tocar "Entrevista", la app navega a la pantalla correcta'),
      bullet('Al tocar "Materiales", la app navega a la pantalla correcta'),
      bullet('La barra de navegación inferior está visible y activa'),
      bullet('La pantalla funciona aunque no se reciban datos del usuario'),
      gap(60),
      pMixed([{ text: 'Resultado: ', bold: true }, { text: '✅ 9 pruebas pasadas', bold: true, color: C.verdeOk }], { spaceAfter: 220 }),

      // --- Grupo 3: FooterNav
      h2('3  ·  Barra de Navegación Inferior (Footer)'),
      pMixed([
        { text: '¿Qué hace? ', bold: true },
        { text: 'Barra rosada en la parte inferior del app con los botones de Inicio, Entrevistas y Resultados.' },
      ]),
      gap(60),
      p('¿Qué verificamos?', { bold: true, spaceAfter: 60 }),
      bullet('La barra se muestra sin errores'),
      bullet('Los tres botones (Inicio, Entrevista, Resultados) muestran sus etiquetas'),
      bullet('Al tocar cada botón, navega a la pantalla correcta con los datos del usuario'),
      bullet('Si hay una validación activa que bloquea la navegación, se respeta'),
      bullet('Si la validación permite continuar, la navegación ocurre correctamente'),
      gap(60),
      pMixed([{ text: 'Resultado: ', bold: true }, { text: '✅ 8 pruebas pasadas', bold: true, color: C.verdeOk }], { spaceAfter: 220 }),

      // Salto de página
      new Paragraph({ children: [new PageBreak()] }),

      // --- Grupo 4: Materiales
      h2('4  ·  Materiales de Consulta y Pantallas de Contenido'),
      pMixed([
        { text: '¿Qué hace? ', bold: true },
        { text: 'Pantallas con material educativo sobre grooming, inclusión social, antecedentes del contexto y más.' },
      ]),
      gap(100),

      h3('Menú de Materiales (MaterialesConsulta)'),
      bullet('El menú de materiales se abre sin errores'),
      bullet('El título de la sección aparece correctamente'),
      pMixed([
        { text: '◼  ', color: C.rosado, size: 20 },
        { text: 'La tarjeta ', size: 20 },
        { text: '"Ruta de Protección y Restablecimiento de Derechos"', bold: true, size: 20 },
        { text: ' NO aparece (ocultada por solicitud del cliente)', size: 20 },
      ], { spaceAfter: 60 }),
      pMixed([
        { text: '◼  ', color: C.rosado, size: 20 },
        { text: 'La tarjeta ', size: 20 },
        { text: '"Ampliación"', bold: true, size: 20 },
        { text: ' NO aparece (también ocultada por solicitud del cliente)', size: 20 },
      ], { spaceAfter: 120 }),

      h3('Pantalla de Antecedentes (MaterialUno)'),
      bullet('La pantalla se abre sin errores'),
      bullet('El contenido se muestra correctamente con el espaciado apropiado'),
      gap(100),

      h3('Pantalla de Grooming Digital (MaterialVirtualClave)'),
      bullet('La pantalla se abre sin errores'),
      bullet('El párrafo introductorio sobre grooming digital es visible en pantalla'),
      gap(100),

      h3('Pantalla de Inclusión Social (MaterialInclucion)'),
      bullet('La pantalla se abre sin errores'),
      pMixed([
        { text: '◼  ', color: C.rosado, size: 20 },
        { text: 'Un espacio visual excesivo que tenía esta pantalla (error de diseño corregido) ', size: 20 },
        { text: 'no ha regresado', bold: true, size: 20 },
        { text: ' (prueba de regresión)', size: 20 },
      ], { spaceAfter: 120 }),

      gap(60),
      pMixed([{ text: 'Resultado: ', bold: true }, { text: '✅ 16 pruebas pasadas', bold: true, color: C.verdeOk }], { spaceAfter: 220 }),

      // --- Grupo 5: App.js
      h2('5  ·  Aplicación Completa (App.js)'),
      pMixed([
        { text: '¿Qué hace? ', bold: true },
        { text: 'Verifica que toda la aplicación, con todas sus pantallas registradas, puede iniciarse sin errores desde cero.' },
      ]),
      gap(60),
      p('¿Qué verificamos?', { bold: true, spaceAfter: 60 }),
      bullet('El archivo principal de la app se carga sin lanzar ningún error'),
      bullet('El componente raíz exportado es un componente de React válido'),
      gap(60),
      pMixed([{ text: 'Resultado: ', bold: true }, { text: '✅ 2 pruebas pasadas', bold: true, color: C.verdeOk }], { spaceAfter: 200 }),

      // Salto de página
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECCIÓN 4: RESUMEN VISUAL ───────────────────────────────────────────
      h1('Resumen por Grupo'),
      gap(80),
      tablaGrupos(),
      gap(280),

      // ── SECCIÓN 5: TIPOS DE VERIFICACIÓN ───────────────────────────────────
      h1('Tipos de Verificaciones Realizadas'),
      gap(80),
      tablaTiposPrueba(),
      gap(280),

      // ── SECCIÓN 6: FRECUENCIA ───────────────────────────────────────────────
      h1('¿Con qué frecuencia ejecutar las pruebas?'),
      gap(80),
      tablaFrecuencia(),
      gap(120),
      pMixed([
        { text: 'Para ejecutar todas las pruebas, se escribe en el computador: ', size: 20 },
        { text: 'npm test', bold: true, size: 20, color: C.rosadoOsc },
        { text: ' — el resultado aparece en 16 segundos.', size: 20 },
      ], { spaceAfter: 280 }),

      // Salto de página
      new Paragraph({ children: [new PageBreak()] }),

      // ── SECCIÓN 7: GLOSARIO ─────────────────────────────────────────────────
      h1('Glosario Rápido'),
      gap(80),

      ...[
        ['Prueba automatizada', 'Instrucción que verifica automáticamente si algo funciona bien, sin intervención humana.'],
        ['Smoke test', 'Prueba básica de "encendido". Verifica que la pantalla abre sin explotar.'],
        ['Mock', 'Sustituto falso de un componente real (como una base de datos o internet) que permite probar sin conexión real.'],
        ['PASS', 'La prueba fue exitosa. Todo funciona como se esperaba.'],
        ['FAIL', 'La prueba falló. Algo no coincide con lo esperado y debe revisarse.'],
        ['Suite de pruebas', 'Un grupo de pruebas relacionadas que se ejecutan juntas.'],
        ['Regresión', 'Bug que reaparece después de haber sido corregido. Las pruebas de regresión garantizan que no vuelva.'],
      ].flatMap(([term, def]) => [
        pMixed([
          { text: `${term}: `, bold: true, color: C.rosadoOsc, size: 21 },
          { text: def, size: 21 },
        ], { spaceAfter: 80 }),
      ]),

      gap(280),

      // ── PIE DE PÁGINA ───────────────────────────────────────────────────────
      new Table({
        layout: TableLayoutType.FIXED,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({
                    text: 'Documento generado automáticamente el 17 de marzo de 2026  ·  Proyecto ModoSeguro  ·  ICBF + OIM',
                    size: 16, color: C.rosadoMed, italics: true, font: 'Calibri',
                  })],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 80, after: 80 },
                }),
              ],
              shading: { type: ShadingType.CLEAR, fill: C.rosado },
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            })],
          }),
        ],
      }),
    ],
  }],
});

// ── GUARDAR ARCHIVO ──────────────────────────────────────────────────────────
const outPath = 'INFORME_PRUEBAS_AUTOMATIZADAS_ModoSeguro_Marzo2026.docx';
const buffer = await Packer.toBuffer(doc);
writeFileSync(outPath, buffer);
const sizeKB = (buffer.length / 1024).toFixed(1);
console.log(`✅ Documento generado: ${outPath} (${sizeKB} KB)`);
