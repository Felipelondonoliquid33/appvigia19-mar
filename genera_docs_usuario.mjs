/**
 * genera_docs_usuario.mjs
 * Genera 10 documentos Word:
 *  - 5 Historias de Usuario por rol (con mockups de pantalla)
 *  - 5 Escenarios de Entrevista completa por rol
 * Proyecto: ModoSeguro — VigiatpApp — Educa Digital / OIM / ICBF
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, convertInchesToTwip,
  Header, Footer, PageNumber, VerticalAlign,
} from "docx";
import fs from "fs";

// ── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  azul:       "1B3A6B", azulM:    "2563A8", azulClaro: "EBF2FB",
  azulOscuro: "0F2044",
  verde:      "14532D", verdeClaro: "DCFCE7",
  rojo:       "7F1D1D", rojoClaro:  "FEE2E2",
  amarillo:   "78350F", amarClaro:  "FEF3C7",
  gris:       "374151", grisCla:    "F9FAFB",
  blanco:     "FFFFFF", negro:      "111827",
  rosado:     "FF007F", lila:       "7C3AED",
  lilaClaro:  "EDE9FE",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const sp  = (n = 160) => new Paragraph({ spacing: { after: n } });
const hr  = () => new Paragraph({
  border: { bottom: { color: C.azulClaro, style: BorderStyle.SINGLE, size: 6, space: 1 } },
  spacing: { after: 200 },
});

const titPortada = (t) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 },
  children: [new TextRun({ text: t, bold: true, size: 52, color: C.azul, font: "Calibri", allCaps: true })],
});
const subPortada = (t, col = C.azulM) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: t, size: 26, color: col, font: "Calibri", italics: true })],
});

const h1 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 140 },
  children: [new TextRun({ text: t, bold: true, color: C.azul, size: 30, font: "Calibri" })],
});
const h2 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 100 },
  children: [new TextRun({ text: t, bold: true, color: C.azulM, size: 24, font: "Calibri" })],
});
const h3 = (t, col = C.gris) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 180, after: 80 },
  children: [new TextRun({ text: t, bold: true, color: col, size: 22, font: "Calibri" })],
});

const p  = (t, bold = false, col = C.negro) => new Paragraph({
  spacing: { after: 100 },
  children: [new TextRun({ text: t, size: 20, bold, color: col, font: "Calibri" })],
});
const bl = (t, col = C.gris) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 70 },
  children: [new TextRun({ text: t, size: 20, color: col, font: "Calibri" })],
});
const blBold = (lbl, txt) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 70 },
  children: [
    new TextRun({ text: `${lbl}: `, bold: true, size: 20, color: C.azul, font: "Calibri" }),
    new TextRun({ text: txt, size: 20, color: C.negro, font: "Calibri" }),
  ],
});

// Celda TH
const th = (t, w = 25) => new TableCell({
  width: { size: w, type: WidthType.PERCENTAGE },
  shading: { type: ShadingType.CLEAR, fill: C.azul },
  verticalAlign: VerticalAlign.CENTER,
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: t, bold: true, color: C.blanco, size: 18, font: "Calibri" })],
  })],
});

// Celda TD normal
const td = (t, fill = C.blanco, col = C.negro, bold = false, align = AlignmentType.LEFT) =>
  new TableCell({
    shading: { type: ShadingType.CLEAR, fill },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text: t, size: 18, bold, color: col, font: "Calibri" })],
    })],
  });

const makeHeader = (titulo) => new Header({ children: [new Paragraph({
  alignment: AlignmentType.RIGHT,
  border: { bottom: { color: C.azulM, style: BorderStyle.SINGLE, size: 4, space: 1 } },
  spacing: { after: 80 },
  children: [new TextRun({ text: `ModoSeguro · ${titulo}`, size: 16, color: C.azulM, font: "Calibri", italics: true })],
})] });

const makeFooter = () => new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  border: { top: { color: C.azulM, style: BorderStyle.SINGLE, size: 4, space: 1 } },
  spacing: { before: 80 },
  children: [
    new TextRun({ text: "Educa Digital · OIM · ICBF · Página ", size: 16, color: C.gris, font: "Calibri" }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.gris, font: "Calibri" }),
    new TextRun({ text: " de ", size: 16, color: C.gris, font: "Calibri" }),
    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: C.gris, font: "Calibri" }),
  ],
})] });

const pageProps = { page: { margin: {
  top: convertInchesToTwip(1), bottom: convertInchesToTwip(1),
  left: convertInchesToTwip(1.1), right: convertInchesToTwip(1.1),
}}};

// ── Mockup de pantalla (simula captura de pantalla) ──────────────────────────
const mockupPantalla = (nombre, elementos) => {
  const rows = [];
  // Barra de título
  rows.push(new TableRow({ children: [
    new TableCell({
      columnSpan: 1,
      shading: { type: ShadingType.CLEAR, fill: C.azul },
      margins: { top: 60, bottom: 60, left: 140, right: 140 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: `● ● ●  ${nombre}`, bold: true, size: 18, color: C.blanco, font: "Calibri Mono" }),
      ]})],
    }),
  ]}));
  // Elementos de pantalla
  elementos.forEach((el, i) => {
    const bg = el.tipo === "boton"    ? C.rosado :
               el.tipo === "campo"    ? "F3F4F6" :
               el.tipo === "titulo"   ? C.azulClaro :
               el.tipo === "tarjeta"  ? "FEFCE8" :
               el.tipo === "badge"    ? C.verdeClaro :
               C.blanco;
    const fg = el.tipo === "boton" ? C.blanco : C.negro;
    rows.push(new TableRow({ children: [
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: bg },
        margins: { top: 50, bottom: 50, left: 200, right: 200 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: el.texto, size: 17, color: fg, bold: el.tipo === "boton" || el.tipo === "titulo", font: "Calibri" }),
        ]})],
      }),
    ]}));
  });
  return new Table({
    width: { size: 55, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: C.azul },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: C.azul },
      left:   { style: BorderStyle.SINGLE, size: 4, color: C.azul },
      right:  { style: BorderStyle.SINGLE, size: 4, color: C.azul },
    },
  });
};

// Wrapper para centrar el mockup
const mockupCentrado = (nombre, elementos) => [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 160, after: 20 },
    children: [new TextRun({ text: `Pantalla: ${nombre}`, bold: true, size: 18, color: C.azulM, font: "Calibri" })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: "(Representacion de la interfaz de la aplicacion)", italics: true, size: 16, color: "9CA3AF", font: "Calibri" })],
  }),
  mockupPantalla(nombre, elementos),
  sp(160),
];

// ── Tabla de historia de usuario ──────────────────────────────────────────────
const tablaHistoria = (h, i) => {
  const fill = i % 2 === 0 ? C.blanco : "F0F4FF";
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        new TableCell({ columnSpan: 2, shading: { type: ShadingType.CLEAR, fill: C.azulOscuro },
          margins: { top: 80, bottom: 80, left: 140, right: 140 },
          children: [new Paragraph({ children: [
            new TextRun({ text: h.id, bold: true, color: C.blanco, size: 20, font: "Calibri" }),
            new TextRun({ text: `  ·  ${h.titulo}`, color: "B8CCE8", size: 20, font: "Calibri" }),
          ]})],
        }),
      ]}),
      new TableRow({ children: [
        td("Como", fill, C.azulM, true),
        td(h.como, fill),
      ]}),
      new TableRow({ children: [
        td("Quiero", fill, C.azulM, true),
        td(h.quiero, fill),
      ]}),
      new TableRow({ children: [
        td("Para", fill, C.azulM, true),
        td(h.para, fill),
      ]}),
      ...(h.pantalla ? [new TableRow({ children: [
        td("Pantalla", fill, C.lila, true),
        td(h.pantalla, fill, C.lila),
      ]})] : []),
      new TableRow({ children: [
        td("Prioridad", fill, C.azulM, true),
        td(h.prioridad === "Crítica" ? "🔴 Crítica" : h.prioridad === "Alta" ? "🟠 Alta" : h.prioridad === "Media" ? "🟡 Media" : "🟢 Baja", fill, C.negro, true),
      ]}),
      new TableRow({ children: [
        td("Estado", fill, C.azulM, true),
        td(h.estado, fill, C.verde, true),
      ]}),
      ...(h.criterios && h.criterios.length > 0 ? [new TableRow({ children: [
        new TableCell({ shading: { type: ShadingType.CLEAR, fill: C.azulClaro },
          margins: { top: 60, bottom: 60, left: 140, right: 140 },
          children: [new Paragraph({ children: [new TextRun({ text: "Criterios de Aceptación", bold: true, size: 18, color: C.azul, font: "Calibri" })] })],
        }),
        new TableCell({ shading: { type: ShadingType.CLEAR, fill: C.azulClaro },
          margins: { top: 60, bottom: 60, left: 140, right: 140 },
          children: h.criterios.map(c => new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: `✓  ${c}`, size: 18, color: C.verde, font: "Calibri" })],
          })),
        }),
      ]})] : []),
      ...(h.notas ? [new TableRow({ children: [
        td("Notas", "FFFBEB", C.amarillo, true),
        td(h.notas, "FFFBEB", C.gris),
      ]})] : []),
    ],
  });
};

// ── Tabla de pregunta del instrumento ────────────────────────────────────────
const tablaPregunta = (preg, idx, resp, colorCategoria = C.azul) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: [
      new TableCell({ columnSpan: 2, shading: { type: ShadingType.CLEAR, fill: colorCategoria },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({ children: [
          new TextRun({ text: `#${idx}  `, bold: true, size: 18, color: C.blanco, font: "Calibri" }),
          new TextRun({ text: preg.preg, size: 18, color: C.blanco, font: "Calibri" }),
        ]})],
      }),
    ]}),
    ...(preg.dirigida_a ? [new TableRow({ children: [
      td("Dirigida a", C.azulClaro, C.azulM, true),
      td(preg.dirigida_a, C.azulClaro, C.gris),
    ]})] : []),
    new TableRow({ children: [
      td("Indicador evaluado", C.grisCla, C.gris, true),
      td(preg.indicador, C.grisCla, C.negro),
    ]}),
    new TableRow({ children: [
      td("Opciones de respuesta", C.grisCla, C.gris, true),
      new TableCell({ shading: { type: ShadingType.CLEAR, fill: C.grisCla },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: preg.opciones.map(op => new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: op === resp.sel ? "✅  " : "○  ",
              size: 18, color: op === resp.sel ? C.verde : C.gris, font: "Calibri",
            }),
            new TextRun({
              text: op + (op === resp.sel ? " ← SELECCIONADA" : ""),
              size: 18, bold: op === resp.sel,
              color: op === resp.sel ? C.verde : C.gris, font: "Calibri",
            }),
          ],
        })),
      }),
    ]}),
    new TableRow({ children: [
      td("Valor obtenido", resp.valor === 0 ? C.verdeClaro : resp.valor === 1 ? C.amarClaro : C.rojoClaro,
        resp.valor === 0 ? C.verde : resp.valor === 1 ? C.amarillo : C.rojo, true),
      td(
        resp.valor === 0 ? `${resp.valor} — Sin factor de riesgo` :
        resp.valor === 1 ? `${resp.valor} — Factor de riesgo moderado` :
        `${resp.valor} — Factor de riesgo elevado`,
        resp.valor === 0 ? C.verdeClaro : resp.valor === 1 ? C.amarClaro : C.rojoClaro,
        resp.valor === 0 ? C.verde : resp.valor === 1 ? C.amarillo : C.rojo, true),
    ]}),
    new TableRow({ children: [
      td("Justificación (campo)", "F9FAFB", C.azulM, true),
      td(resp.just, "F9FAFB", C.negro),
    ]}),
  ],
});

// ── Tabla resumen de resultados ───────────────────────────────────────────────
const tablaResumen = (categorias, total, nivel, colorNivel) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ tableHeader: true, children: [th("Categoría de Evaluación", 60), th("Puntaje", 20), th("Nivel", 20)] }),
    ...categorias.map((cat, i) => new TableRow({ children: [
      td(cat.categoria, i % 2 === 0 ? C.blanco : C.azulClaro),
      td(String(cat.puntaje), i % 2 === 0 ? C.blanco : C.azulClaro, C.azulM, true, AlignmentType.CENTER),
      td(cat.puntaje <= 3 ? "Sin riesgo" : cat.puntaje <= 7 ? "Moderado" : "Elevado",
        i % 2 === 0 ? C.blanco : C.azulClaro,
        cat.puntaje <= 3 ? C.verde : cat.puntaje <= 7 ? C.amarillo : C.rojo, true),
    ]})),
    new TableRow({ children: [
      td("PUNTUACIÓN TOTAL", C.azulOscuro, C.blanco, true),
      td(String(total), C.azulOscuro, C.blanco, true, AlignmentType.CENTER),
      td(nivel, colorNivel === "red" ? C.rojo : colorNivel === "yellow" ? C.amarillo : C.verde,
        C.blanco, true, AlignmentType.CENTER),
    ]}),
  ],
});

// ════════════════════════════════════════════════════════════════════════════
//  DATOS DE CADA ROL
// ════════════════════════════════════════════════════════════════════════════

const ROLES = [
  {
    id: 1, nombre: "Super Administrador", nivel: "Superusuario", color: C.azul,
    descripcion: "Usuario con acceso total y sin restricciones. Coordina el programa a nivel nacional o regional. Puede aplicar los 4 tipos de entrevista y ver todas las estadísticas.",
    accesos: ["Versión 1 — Madres, padres y cuidadores", "Versión 2 — Niñas, Niños y Adolescentes", "Versión 3 — Funcionarios Públicos", "Versión 4 — Agentes Externos"],
    bloqueados: [],
    historias: [
      { id: "US-ROL1-001", titulo: "Iniciar sesión con credenciales institucionales", pantalla: "LoginScreen", como: "Super Administrador de la plataforma ModoSeguro", quiero: "ingresar mi correo y contraseña para autenticarme", para: "acceder a todas las funcionalidades con mis privilegios completos", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["La pantalla de login muestra campos de correo y contraseña", "Con credenciales válidas navego directamente al Dashboard", "La app sincroniza entrevistas pendientes automáticamente al iniciar sesión"], notas: "Funciona también en modo offline si ya se inició sesión antes en el dispositivo." },
      { id: "US-ROL1-002", titulo: "Iniciar sesión en modo sin conexión (offline)", pantalla: "LoginScreen", como: "Super Administrador en campo sin internet", quiero: "autenticarme aunque no haya conexión", para: "continuar trabajando sin depender de la red", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Sin internet y ya habiendo iniciado sesión antes, puedo entrar usando datos locales"], notas: "La validación offline usa MD5 del password almacenado en SQLite local." },
      { id: "US-ROL1-003", titulo: "Ver los 4 tipos de entrevista sin restricciones", pantalla: "EntrevistaScreen", como: "Super Administrador", quiero: "ver las 4 tarjetas de entrevista disponibles", para: "seleccionar cualquier tipo según la necesidad del caso", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Veo las 4 tarjetas: V1 Padres, V2 NNA, V3 Funcionarios, V4 Agentes Externos", "Puedo tocar cualquier tarjeta y navegar a las instrucciones sin bloqueos"], notas: "El bypass de acceso para Roles 1 y 2 está implementado en la función canShow()." },
      { id: "US-ROL1-004", titulo: "Ver resumen estadístico general de resultados", pantalla: "ResumenScreen", como: "Super Administrador responsable de supervisión general", quiero: "ver estadísticas completas de entrevistas y niveles de riesgo", para: "monitorear el estado del programa y priorizar intervenciones", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Veo total de entrevistas completas y pendientes", "Veo distribución por nivel de riesgo: Mínimo (verde), Bajo (amarillo), Significativo (rojo)"], notas: "Datos en tiempo real de la base de datos SQLite local del dispositivo." },
      { id: "US-ROL1-005", titulo: "Descargar reporte Excel de resultados individuales", pantalla: "PasoTresScreen", como: "Super Administrador tras completar una entrevista", quiero: "descargar el reporte completo en formato Excel", para: "documentar el caso y compartir el resultado con el equipo de atención", prioridad: "Alta", estado: "Implementada ✅", criterios: ["El botón Descargar genera un archivo .xlsx con datos demográficos, puntajes, riesgo y recomendaciones", "El archivo se comparte a través del sistema nativo del dispositivo"], notas: "El archivo Excel se comparte usando expo-sharing y expo-file-system." },
    ],
    pantallasMockup: [
      { nombre: "LoginScreen — Inicio de Sesión", elementos: [
        { tipo: "titulo", texto: "INICIAR" },
        { tipo: "campo", texto: "✉  Correo Electrónico" },
        { tipo: "campo", texto: "🔒  Contraseña" },
        { tipo: "boton", texto: "Iniciar Sesión" },
        { tipo: "normal", texto: "¿Olvidaste tu contraseña?" },
        { tipo: "normal", texto: "Crear Cuenta" },
      ]},
      { nombre: "HomeScreen — Dashboard", elementos: [
        { tipo: "titulo", texto: "BIENVENIDOS Y BIENVENIDAS" },
        { tipo: "tarjeta", texto: "📋  Formulario de Entrevista" },
        { tipo: "tarjeta", texto: "📚  Materiales de consulta" },
        { tipo: "tarjeta", texto: "📊  Resultados" },
        { tipo: "tarjeta", texto: "🗺️  Canales y reporte" },
        { tipo: "badge", texto: "Inicio | Entrevista | Resultados | Materiales" },
      ]},
      { nombre: "EntrevistaScreen — Selección (Rol 1: ve las 4)", elementos: [
        { tipo: "titulo", texto: "ENTREVISTAS" },
        { tipo: "tarjeta", texto: "📝  V1 — Madres, padres y cuidadores" },
        { tipo: "tarjeta", texto: "👦  V2 — Niñas, Niños y Adolescentes" },
        { tipo: "tarjeta", texto: "🏛️  V3 — Funcionarios Públicos" },
        { tipo: "tarjeta", texto: "🤝  V4 — Agentes Externos" },
      ]},
    ],
    entrevistaTipo: "Versión 2 — Niñas, Niños y Adolescentes",
  },
  {
    id: 2, nombre: "Supervisor", nivel: "Superusuario", color: C.azulM,
    descripcion: "Usuario co-administrador con acceso igual al Rol 1. Coordina equipos regionales y puede aplicar todos los tipos de entrevista. Reporta al Super Administrador.",
    accesos: ["Versión 1 — Madres, padres y cuidadores", "Versión 2 — Niñas, Niños y Adolescentes", "Versión 3 — Funcionarios Públicos", "Versión 4 — Agentes Externos"],
    bloqueados: [],
    historias: [
      { id: "US-ROL2-001", titulo: "Autenticarme como Supervisor con acceso de coordinación", pantalla: "LoginScreen", como: "Supervisor del equipo de campo", quiero: "iniciar sesión con mis credenciales institucionales", para: "acceder a todas las funciones con mis permisos de coordinación regional", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Con Rol 2 me autentifica correctamente y accedo al Dashboard completo", "La app sincroniza entrevistas del equipo al iniciar sesión con internet"], notas: "Funcional en modo offline igual que Rol 1." },
      { id: "US-ROL2-002", titulo: "Cambiar el idioma de la aplicación", pantalla: "LoginScreen", como: "Supervisor que trabaja con población bilingüe", quiero: "cambiar el idioma entre Español e Inglés", para: "adaptar la interfaz al contexto lingüístico del territorio", prioridad: "Baja", estado: "Implementada ✅", criterios: ["Ícono de idioma en esquina superior derecha", "Modal con opciones Español / Inglés", "Al cambiar, toda la interfaz se actualiza al idioma seleccionado"], notas: "Los textos del catálogo también se cargan en el idioma seleccionado." },
      { id: "US-ROL2-003", titulo: "Aplicar entrevista a NNA (Versión 2)", pantalla: "EntrevistaScreen", como: "Supervisor que también realiza trabajo directo en campo", quiero: "seleccionar y aplicar la entrevista de NNA", para: "evaluar directamente los factores de riesgo de un menor identificado", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Veo y puedo seleccionar Versión 2 en EntrevistaScreen", "Puedo completar el flujo completo: datos demográficos → preguntas → observaciones → resultados"], notas: "La Versión 2 evalúa NNA con indicadores sobre tecnología, redes sociales y factores de riesgo digital." },
      { id: "US-ROL2-004", titulo: "Revisar estadísticas del equipo en ResumenScreen", pantalla: "ResumenScreen", como: "Supervisor reportando avances del programa", quiero: "acceder al resumen estadístico de todas las entrevistas", para: "generar reportes de avance e identificar territorios de mayor riesgo", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Veo: total entrevistas, completas, pendientes, distribución por nivel de riesgo", "Los datos se actualizan automáticamente al regresar a la pantalla"], notas: "Las estadísticas reflejan las entrevistas del dispositivo local." },
      { id: "US-ROL2-005", titulo: "Ver resultados individuales de casos específicos", pantalla: "PasoTresScreen", como: "Supervisor haciendo seguimiento de casos de alto riesgo", quiero: "acceder a los resultados detallados de entrevistas completadas", para: "revisar el análisis y las recomendaciones para tomar decisiones de atención", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Desde el historial, puedo ver resultados de cualquier entrevista completada", "Veo puntajes por categoría, nivel de riesgo y recomendaciones específicas"], notas: "El flujo va por InstruccionScreen → AsentimientoScreen → PasoTres directamente." },
    ],
    pantallasMockup: [
      { nombre: "LoginScreen — Idioma", elementos: [
        { tipo: "titulo", texto: "INICIAR" },
        { tipo: "normal", texto: "🌐 Idioma  [arriba a la derecha]" },
        { tipo: "campo", texto: "✉  Correo Electrónico" },
        { tipo: "campo", texto: "🔒  Contraseña" },
        { tipo: "boton", texto: "Iniciar Sesión" },
      ]},
      { nombre: "EntrevistaScreen — Supervisor ve las 4", elementos: [
        { tipo: "titulo", texto: "ENTREVISTAS" },
        { tipo: "tarjeta", texto: "📝  V1 — Padres y Cuidadores" },
        { tipo: "tarjeta", texto: "👦  V2 — NNA" },
        { tipo: "tarjeta", texto: "🏛️  V3 — Funcionarios Públicos" },
        { tipo: "tarjeta", texto: "🤝  V4 — Agentes Externos" },
      ]},
      { nombre: "ResumenScreen — Estadísticas", elementos: [
        { tipo: "titulo", texto: "RESUMEN DE RESULTADOS" },
        { tipo: "tarjeta", texto: "📊  Entrevistas: 45 (38 Completas · 7 Pendientes)" },
        { tipo: "badge", texto: "🟢  Riesgo Mínimo: 18 entrevistas" },
        { tipo: "tarjeta", texto: "🟡  Riesgo Bajo: 14 entrevistas" },
        { tipo: "normal", texto: "🔴  Riesgo Significativo: 6 entrevistas" },
      ]},
    ],
    entrevistaTipo: "Versión 1 — Madres, Padres y Cuidadores",
  },
  {
    id: 3, nombre: "Profesional de Campo", nivel: "Operativo", color: "0D6E4D",
    descripcion: "Profesional (psicólogo/a, trabajador/a social, educador/a) que aplica entrevistas directamente en territorio. Accede a 3 de los 4 tipos. NO puede ver entrevistas de Agentes Externos. Solo ve sus propias entrevistas.",
    accesos: ["Versión 1 — Madres, padres y cuidadores", "Versión 2 — Niñas, Niños y Adolescentes", "Versión 3 — Funcionarios Públicos"],
    bloqueados: ["Versión 4 — Agentes Externos (exclusiva de Rol 5)"],
    historias: [
      { id: "US-ROL3-001", titulo: "Iniciar sesión antes de una jornada de campo", pantalla: "LoginScreen", como: "Profesional de Campo que inicia su jornada", quiero: "autenticarme con mis credenciales para acceder a mis instrumentos de trabajo", para: "empezar a registrar evaluaciones en campo", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Con Rol 3 me autentifica y accedo al Dashboard con los 4 accesos", "Con conexión, sincroniza mis entrevistas pendientes automáticamente", "Sin conexión, puedo entrar en modo offline si ya inicié sesión antes"], notas: "El modo offline es esencial para jornadas en zonas rurales sin conectividad." },
      { id: "US-ROL3-002", titulo: "Ver solo las 3 versiones autorizadas en EntrevistaScreen", pantalla: "EntrevistaScreen", como: "Profesional de Campo", quiero: "ver solo las versiones de entrevista que estoy autorizada/o a aplicar", para: "trabajar correctamente dentro de mi ámbito de competencia", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Veo tarjetas de V1, V2 y V3. La tarjeta de V4 NO aparece", "Si intento acceder a V4 por cualquier medio, el sistema bloquea el acceso"], notas: "canShow([3,4]) = TRUE para tipos 1,3,4. canShow([5]) = FALSE para tipo 2 con rolId=3." },
      { id: "US-ROL3-003", titulo: "Aplicar entrevista completa a NNA (Versión 2)", pantalla: "PasoUno → PasosDos → PasoComentario → PasoTres", como: "Profesional de Campo visitando una familia", quiero: "aplicar el flujo completo de entrevista a un NNA identificado en posible riesgo", para: "evaluar factores de riesgo digital y activar rutas de atención necesarias", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Puedo registrar todos los datos demográficos en PasoUno", "Respondo todas las preguntas del instrumento en PasosDos con barra de progreso", "Registro observaciones y confirmo finalización en PasoComentario", "Veo puntajes, nivel de riesgo y recomendaciones en PasoTres"], notas: "Una vez confirmada la finalización, la entrevista no puede modificarse." },
      { id: "US-ROL3-004", titulo: "Consultar solo mis propias entrevistas en el historial", pantalla: "ListadoEntrevistasScreen", como: "Profesional de Campo revisando su actividad", quiero: "ver únicamente el listado de mis propias entrevistas realizadas", para: "hacer seguimiento a mis casos sin mezclar el trabajo de otros colegas", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Solo aparecen entrevistas de mi ID de usuario", "Puedo buscar por ID o filtrar por fecha", "No puedo ver entrevistas de otros profesionales"], notas: "El filtrado automático por idUsuario garantiza la confidencialidad de cada profesional." },
      { id: "US-ROL3-005", titulo: "Salir de entrevista en curso y registrar motivo", pantalla: "PasoDosScreen", como: "Profesional de Campo que necesita interrumpir", quiero: "salir de una entrevista en curso y registrar el motivo", para: "documentar la incidencia y retomar la entrevista en otro momento", prioridad: "Media", estado: "Implementada ✅", criterios: ["El ícono de salir muestra un modal solicitando el motivo", "La entrevista queda guardada como Pendiente con el motivo registrado", "Puedo retomar la entrevista desde el historial"], notas: "Las entrevistas pendientes pueden retomarse desde ListadoEntrevistasScreen." },
    ],
    pantallasMockup: [
      { nombre: "EntrevistaScreen — Rol 3 (3 versiones)", elementos: [
        { tipo: "titulo", texto: "ENTREVISTAS" },
        { tipo: "tarjeta", texto: "📝  V1 — Madres, padres y cuidadores" },
        { tipo: "tarjeta", texto: "👦  V2 — Niñas, Niños y Adolescentes" },
        { tipo: "tarjeta", texto: "🏛️  V3 — Funcionarios Públicos" },
        { tipo: "normal", texto: "── NO APARECE: V4 (Agentes Externos) ──" },
      ]},
      { nombre: "PasoUnoScreen — Datos Demográficos", elementos: [
        { tipo: "titulo", texto: "ENTREVISTA — Versión 2: NNA" },
        { tipo: "campo", texto: "📅  Fecha de Nacimiento" },
        { tipo: "campo", texto: "⚧  Género [Picker]" },
        { tipo: "campo", texto: "⚔️  Víctima de conflicto  ○ Sí  ○ No" },
        { tipo: "campo", texto: "🏠  Zona  ○ Urbano  ○ Rural" },
        { tipo: "campo", texto: "🎓  Escolarizado  ○ Sí  ○ No" },
        { tipo: "campo", texto: "🗺️  Departamento / Municipio [Picker]" },
        { tipo: "boton", texto: "Siguiente →" },
      ]},
      { nombre: "PasoDosScreen — Pregunta del Instrumento", elementos: [
        { tipo: "badge", texto: "██████████░░░░ 68 %" },
        { tipo: "titulo", texto: "Acceso y Uso de Tecnología" },
        { tipo: "normal", texto: "Indicador: Tiempo de exposición a internet" },
        { tipo: "campo", texto: "○  Menos de 1 hora diaria" },
        { tipo: "campo", texto: "○  Entre 1 y 3 horas diarias" },
        { tipo: "campo", texto: "✅  Más de 3 horas diarias  ← seleccionada" },
        { tipo: "boton", texto: "Siguiente →" },
      ]},
    ],
    entrevistaTipo: "Versión 2 — Niñas, Niños y Adolescentes",
  },
  {
    id: 4, nombre: "Funcionario", nivel: "Operativo Institucional", color: "7C3AED",
    descripcion: "Entrevistador asignado a entidades públicas (colegios, alcaldías, comisarías). Accede a las mismas versiones que el Profesional de Campo. Puede auto-registrarse en la app. Solo ve sus propias entrevistas.",
    accesos: ["Versión 1 — Madres, padres y cuidadores", "Versión 2 — Niñas, Niños y Adolescentes", "Versión 3 — Funcionarios Públicos"],
    bloqueados: ["Versión 4 — Agentes Externos (exclusiva de Rol 5)"],
    historias: [
      { id: "US-ROL4-001", titulo: "Registrarme como nuevo Funcionario en la app", pantalla: "CrearScreen", como: "Nuevo Funcionario institucional que se une al programa", quiero: "crear mi cuenta con mis datos institucionales y rol de Funcionario Externo", para: "obtener acceso a los instrumentos de evaluación de mi rol", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Puedo seleccionar 'Funcionarios Externo' (Rol 4) en el picker de rol", "El formulario valida correo, teléfono (10 dígitos) y contraseña segura", "Sin aceptar los términos, el botón Registrarme está deshabilitado"], notas: "Solo Roles 4 y 5 pueden auto-registrarse. Roles 1, 2 y 3 son asignados por administrador." },
      { id: "US-ROL4-002", titulo: "Aplicar entrevista a Funcionarios Públicos (Versión 3)", pantalla: "EntrevistaScreen", como: "Funcionario institucional evaluando a sus colegas", quiero: "usar la Versión 3 para evaluar el nivel de conocimiento de funcionarios de mi entidad sobre ESDI", para: "medir la capacidad institucional y elaborar un plan de mejoramiento", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Veo y selecciono la V3 — Funcionarios Públicos", "El instrumento evalúa: conocimiento sobre ESDI, señales de alerta, protocolos y rutas de atención"], notas: "Esta es la entrevista más característica del Rol 4 en contextos institucionales." },
      { id: "US-ROL4-003", titulo: "Confirmar que NO veo la Versión 4 en EntrevistaScreen", pantalla: "EntrevistaScreen", como: "Funcionario que conoce sus límites de acceso", quiero: "verificar que el sistema bloquea el acceso a la Versión 4", para: "garantizar que solo aplico los instrumentos autorizados para mi rol", prioridad: "Alta", estado: "Implementada ✅", criterios: ["La V4 (Agentes Externos) NO aparece en la lista de entrevistas para Rol 4", "canShow([5]) retorna FALSE para rolId=4"], notas: "El control de acceso está en la función canShow() de EntrevistaScreen." },
      { id: "US-ROL4-004", titulo: "Ver y descargar resultados de evaluación institucional", pantalla: "PasoTresScreen", como: "Funcionario que presenta resultados a su directivo", quiero: "ver el resultado de la evaluación y exportarlo en Excel", para: "documentar el estado de conocimiento ESDI en la institución y reportar a la coordinación", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Ver puntajes por categoría (conocimiento, protocolos, rutas, etc.)", "Pressionar Descargar genera un Excel completo para el expediente institucional"], notas: "El Excel incluye: datos, versión, puntajes, nivel de riesgo y recomendaciones institucionales." },
      { id: "US-ROL4-005", titulo: "Gestionar el historial de mis entrevistas institucionales", pantalla: "ListadoEntrevistasScreen", como: "Funcionario con múltiples evaluaciones registradas", quiero: "consultar, buscar y gestionar mi historial de entrevistas", para: "hacer seguimiento a los casos evaluados en mi institución", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Solo veo mis propias entrevistas (filtradas por mi ID)", "Puedo buscar por ID o fecha", "Las pendientes pueden retomarse o eliminarse"], notas: "La privacidad es absoluta: cada funcionario solo accede a sus propios registros." },
    ],
    pantallasMockup: [
      { nombre: "CrearScreen — Formulario de Registro", elementos: [
        { tipo: "titulo", texto: "CREAR CUENTA" },
        { tipo: "campo", texto: "👤  Nombres" },
        { tipo: "campo", texto: "👤  Apellidos" },
        { tipo: "campo", texto: "✉  Correo electrónico" },
        { tipo: "campo", texto: "📱  +57 · Número de celular" },
        { tipo: "campo", texto: "🏢  Institución o Entidad" },
        { tipo: "campo", texto: "👔  Rol: [Funcionarios Externo ▼]" },
        { tipo: "campo", texto: "🔒  Contraseña (segura)" },
        { tipo: "normal", texto: "☐  Acepto los términos y condiciones" },
        { tipo: "boton", texto: "Registrarme" },
      ]},
      { nombre: "EntrevistaScreen — Rol 4 (3 versiones)", elementos: [
        { tipo: "titulo", texto: "ENTREVISTAS" },
        { tipo: "tarjeta", texto: "📝  V1 — Madres, padres y cuidadores" },
        { tipo: "tarjeta", texto: "👦  V2 — Niñas, Niños y Adolescentes" },
        { tipo: "tarjeta", texto: "🏛️  V3 — Funcionarios Públicos" },
        { tipo: "normal", texto: "── NO APARECE: V4 (Agentes Externos) ──" },
      ]},
      { nombre: "PasoTresScreen — Resultados Institucionales", elementos: [
        { tipo: "titulo", texto: "RESULTADO DE LA ENTREVISTA" },
        { tipo: "tarjeta", texto: "📊  Puntajes por categoría" },
        { tipo: "badge", texto: "🟡  Nivel de Riesgo: BAJO" },
        { tipo: "tarjeta", texto: "💡  Recomendaciones institucionales" },
        { tipo: "boton", texto: "⬇️  Descargar Excel" },
      ]},
    ],
    entrevistaTipo: "Versión 3 — Funcionarios Públicos",
  },
  {
    id: 5, nombre: "Agente Externo", nivel: "Comunitario (Restringido)", color: C.rosado,
    descripcion: "Líder comunitario, representante de ONG o actor educativo externo. Tiene el acceso MÁS RESTRINGIDO. Solo puede aplicar UN tipo de entrevista: la Versión 4. Puede auto-registrarse como Agente Educativo. Solo ve sus propias entrevistas.",
    accesos: ["Versión 4 — Agentes Externos (ÚNICO tipo autorizado)"],
    bloqueados: ["Versión 1 — Madres, padres y cuidadores", "Versión 2 — NNA", "Versión 3 — Funcionarios Públicos"],
    historias: [
      { id: "US-ROL5-001", titulo: "Registrarme como Agente Educativo comunitario", pantalla: "CrearScreen", como: "Líder comunitario que se une al programa ModoSeguro", quiero: "crear mi cuenta seleccionando el rol 'Agente Educativo'", para: "obtener acceso al instrumento de evaluación comunitaria asignado a mi perfil", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Puedo seleccionar 'Agente Educativo' (Rol 5) en el picker de rol", "El formulario valida todos los campos y envía instrucciones al correo", "Sin aceptar términos, el botón Registrarme está deshabilitado"], notas: "Agente Educativo = Rol 5. Registrable junto con Rol 4 (Funcionario Externo)." },
      { id: "US-ROL5-002", titulo: "Ver ÚNICAMENTE la Versión 4 en EntrevistaScreen", pantalla: "EntrevistaScreen", como: "Agente Externo accediendo a su único instrumento", quiero: "que la pantalla de Entrevistas solo muestre la Versión 4", para: "trabajar dentro de mi ámbito de competencia sin confusiones", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Solo aparece la tarjeta de V4 — Agentes Externos", "Las tarjetas de V1, V2 y V3 NO aparecen", "Si se intenta acceder a otras versiones, el sistema bloquea automáticamente"], notas: "canShow([5])=TRUE para tipo 2. canShow([3,4])=FALSE para rolId=5." },
      { id: "US-ROL5-003", titulo: "Aplicar la entrevista completa como Agente Externo (V4)", pantalla: "EntrevistaScreen → ... → PasoTres", como: "Agente Externo en jornada comunitaria", quiero: "aplicar el flujo completo de la Versión 4: asentimiento → demográficos → preguntas → resultados", para: "evaluar capacidades preventivas comunitarias ante la ESDI", prioridad: "Crítica", estado: "Implementada ✅", criterios: ["Puedo completar todo el flujo de entrevista con Versión 4", "Los puntajes y el nivel de riesgo se calculan automáticamente al finalizar"], notas: "El flujo técnico es idéntico a otras versiones; diferente es el contenido del instrumento." },
      { id: "US-ROL5-004", titulo: "Registrar rechazo al asentimiento informado", pantalla: "AsentimientoScreen", como: "Agente Externo cuando el participante decide no participar", quiero: "registrar el rechazo de manera correcta", para: "respetar la autonomía del participante y documentar el caso", prioridad: "Alta", estado: "Implementada ✅", criterios: ["Al tocar Rechazar, navego a ConsentimientoRechazadoScreen", "La pantalla muestra 'NO ES POSIBLE CONTINUAR' con opción de volver o salir"], notas: "El asentimiento es obligatorio y no puede omitirse." },
      { id: "US-ROL5-005", titulo: "Confirmar bloqueo total a entrevistas no autorizadas", pantalla: "EntrevistaScreen", como: "Agente Externo consciente de mis restricciones de acceso", quiero: "verificar que el sistema bloquea el acceso a V1, V2 y V3", para: "garantizar el uso correcto e íntegro del instrumento comunitario", prioridad: "Alta", estado: "Implementada ✅", criterios: ["V1, V2 y V3 no aparecen en EntrevistaScreen", "Intentos de acceso directo son bloqueados por canShow()"], notas: "Seguridad robusta: Rol 5 opera exclusivamente con su tipo de entrevista autorizado." },
    ],
    pantallasMockup: [
      { nombre: "EntrevistaScreen — Rol 5 (solo V4)", elementos: [
        { tipo: "titulo", texto: "ENTREVISTAS" },
        { tipo: "tarjeta", texto: "🤝  V4 — Agentes Externos" },
        { tipo: "normal", texto: "── NO APARECE: V1, V2, V3 ──" },
        { tipo: "badge", texto: "Solo tienes acceso a la Versión 4" },
      ]},
      { nombre: "AsentimientoScreen — Aceptar o Rechazar", elementos: [
        { tipo: "titulo", texto: "ASENTIMIENTO INFORMADO" },
        { tipo: "normal", texto: "[Texto del asentimiento cargado del servidor]" },
        { tipo: "boton", texto: "Aceptar" },
        { tipo: "normal", texto: "Rechazar" },
      ]},
      { nombre: "ConsentimientoRechazado — Rechazo", elementos: [
        { tipo: "titulo", texto: "NO ES POSIBLE CONTINUAR" },
        { tipo: "normal", texto: "Para usar la app es necesario aceptar el" },
        { tipo: "normal", texto: "consentimiento informado." },
        { tipo: "boton", texto: "Volver al consentimiento" },
        { tipo: "normal", texto: "Salir" },
      ]},
    ],
    entrevistaTipo: "Versión 4 — Agentes Externos",
  },
];

// ════════════════════════════════════════════════════════════════════════════
//  DATOS DE ENTREVISTAS (simplificadas para los docs Word)
// ════════════════════════════════════════════════════════════════════════════
const ENTREVISTAS = [
  {
    rolId: 1, rolNombre: "Super Administrador",
    version: "Versión 2 — Niñas, Niños y Adolescentes",
    idEntrevista: "1202503191423",
    fecha: "19/03/2026 14:23",
    aplicadoPor: "Carlos Andrés Gómez",
    dem: { fechaNac: "04/08/2012", edad: 13, genero: "Femenino", zona: "Urbano", conflicto: "Sí / Desplazada", etnia: "Afrocolombiana", grado: "Octavo", municipio: "Medellín, Antioquia" },
    categorias: [
      { nombre: "Acceso y Uso de Tecnología", color: "1B4F72", preguntas: [
        { preg: "¿Tiene el NNA acceso a internet desde su hogar?", indicador: "Acceso y disponibilidad de internet", opciones: ["No tiene acceso", "Tiene acceso supervisado", "Tiene acceso sin supervisión"], sel: "Tiene acceso sin supervisión", valor: 3, just: "Smartphone propio con datos. Sin supervisión parental." },
        { preg: "¿Cuántas horas diarias usa internet o dispositivos?", indicador: "Tiempo de exposición", opciones: ["Menos de 1 hora", "Entre 1 y 3 horas", "Más de 3 horas"], sel: "Más de 3 horas", valor: 3, just: "Más de 5 horas diarias, principalmente en la noche." },
        { preg: "¿Qué tipo de dispositivos utiliza?", indicador: "Tipo de dispositivo y exposición", opciones: ["Solo dispositivos del colegio", "Tablet con internet supervisado", "Smartphone propio sin filtros"], sel: "Smartphone propio sin filtros", valor: 3, just: "Galaxy propio desde los 11 años." },
      ]},
      { nombre: "Redes Sociales y Plataformas", color: "154360", preguntas: [
        { preg: "¿Tiene perfiles activos en redes sociales?", indicador: "Presencia en redes sociales", opciones: ["No tiene perfiles", "Tiene perfiles supervisados", "Tiene perfiles sin supervisión"], sel: "Tiene perfiles sin supervisión", valor: 3, just: "TikTok, Instagram, Snapchat y Discord activos." },
        { preg: "¿Sus perfiles son públicos o privados?", indicador: "Configuración de privacidad", opciones: ["Todos privados", "Algunos públicos", "Públicos con mensajes de desconocidos"], sel: "Públicos con mensajes de desconocidos", valor: 3, just: "Cuentas públicas. Recibe mensajes de adultos desconocidos." },
        { preg: "¿Ha aceptado contacto de desconocidos en redes?", indicador: "Contacto con desconocidos", opciones: ["Nunca", "En alguna ocasión", "Regularmente"], sel: "Regularmente", valor: 3, just: "Tiene seguidores desconocidos en varias plataformas." },
        { preg: "¿Comparte información personal en internet?", indicador: "Exposición de información personal", opciones: ["No comparte", "Solo con conocidos", "Abiertamente o con desconocidos"], sel: "Abiertamente o con desconocidos", valor: 3, just: "Ha compartido teléfono y ubicación con desconocidos." },
      ]},
      { nombre: "Factores de Riesgo de Explotación Digital", color: "7B241C", preguntas: [
        { preg: "¿Algún adulto desconocido le ha enviado mensajes?", indicador: "Contacto de adultos desconocidos", opciones: ["No ha ocurrido", "Ocurrió y lo reportó", "Ocurre frecuente sin reportar"], sel: "Ocurre frecuente sin reportar", valor: 3, just: "Adultos elogian sus fotos y la llaman por nombre." },
        { preg: "¿Le han pedido fotos o videos íntimos?", indicador: "Solicitudes de contenido íntimo", opciones: ["Nunca", "Lo pidieron, rechazó sin reportar", "Lo pidieron y lo considera normal"], sel: "Lo pidieron, rechazó sin reportar", valor: 1, just: "Un usuario de Discord le pidió fotos íntimas. Lo ignoró." },
        { preg: "¿Le han ofrecido regalos o dinero por internet?", indicador: "Ofrecimiento de beneficios por adultos", opciones: ["Nunca", "Una vez, rechazó", "Ha recibido o aceptado"], sel: "Ha recibido o aceptado", valor: 3, just: "Un adulto le ofreció recargas y créditos para juegos." },
        { preg: "¿Ha enviado o recibido contenido sexual (sexting)?", indicador: "Exposición a sexting", opciones: ["No", "Recibido sin enviar", "Enviado y/o recibido"], sel: "Recibido sin enviar", valor: 1, just: "Recibió videos adultos en WhatsApp. No lo buscó." },
      ]},
      { nombre: "Factores Protectores y Red de Apoyo", color: "145A32", preguntas: [
        { preg: "¿Sus cuidadores supervisan su uso de internet?", indicador: "Supervisión adulta de internet", opciones: ["Supervisión activa regular", "Supervisión ocasional", "Sin supervisión"], sel: "Sin supervisión", valor: 3, just: "La cuidadora trabaja todo el día. No revisa el celular." },
        { preg: "¿Sabe a quién acudir si algo en internet le da miedo?", indicador: "Conocimiento de redes de apoyo", opciones: ["Sí, sabe y lo haría", "No está segura", "No sabe"], sel: "No sabe", valor: 3, just: "Tiene miedo de que la regañen. No conoce líneas de ayuda." },
        { preg: "¿Ha recibido información sobre seguridad digital?", indicador: "Educación en seguridad digital", opciones: ["Regularmente", "Esporádicamente", "Nunca"], sel: "Esporádicamente", valor: 1, just: "Una charla en el colegio hace un año. En casa nada." },
      ]},
    ],
    observaciones: "Usa TikTok, Instagram, Discord y WhatsApp (+5h/día). Más de 800 seguidores desconocidos. Al menos 2 adultos en contacto privado. Uno ofreció beneficios. Cuidadora sin supervisión ni conocimiento de plataformas.",
    puntajeTotal: 37,
    puntajesCat: [{ cat: "Demografico", pts: 9 }, { cat: "Acceso a Tecnología", pts: 9 }, { cat: "Redes Sociales", pts: 12 }, { cat: "Riesgo Digital", pts: 8 }, { cat: "Factores Protectores", pts: 7 }],
    nivelRiesgo: "SIGNIFICATIVO",
    colorRiesgo: "red",
    recomendaciones: ["Activación INMEDIATA de ruta de protección: notificar a ICBF (Línea 141) y Defensor de Familia.", "Acompañamiento psicosocial especializado para la NNA y su cuidadora.", "Intervención familiar: capacitación en supervisión digital y controles parentales.", "Seguimiento con orientadora escolar para acompañamiento en el entorno educativo.", "Educación digital: habilidades de autoprotección y reconocimiento de grooming."],
  },
  {
    rolId: 2, rolNombre: "Supervisor",
    version: "Versión 1 — Madres, Padres y Cuidadores",
    idEntrevista: "2202503191845", fecha: "19/03/2026 18:45",
    aplicadoPor: "Luz Marina Torres Vega",
    dem: { fechaNac: "22/03/1985", edad: 40, genero: "Femenino", zona: "Urbano", conflicto: "No", etnia: "Mestiza", grado: "Bachillerato completo", municipio: "Bello, Antioquia" },
    categorias: [
      { nombre: "Supervisión del Uso de Tecnología", color: "1A5276", preguntas: [
        { preg: "¿Supervisa el uso de internet del NNA?", indicador: "Supervisión activa del uso de tecnología", opciones: ["Supervisión constante con normas", "Supervisión ocasional", "No supervisa"], sel: "No supervisa", valor: 3, just: "Trabaja jornada completa. Llega cuando el NNA ya duerme." },
        { preg: "¿Conoce las aplicaciones que usa el NNA?", indicador: "Conocimiento de plataformas del NNA", opciones: ["Conoce todas", "Conoce algunas", "Desconoce todas"], sel: "Desconoce todas", valor: 3, just: "Sabe que usa el celular mucho pero no sabe qué apps." },
        { preg: "¿Existen reglas de uso de internet en el hogar?", indicador: "Reglas del hogar sobre internet", opciones: ["Reglas claras y cumplidas", "Reglas que no se cumplen", "Sin reglas"], sel: "Sin reglas", valor: 3, just: "Nunca ha puesto límites de tiempo ni de contenido." },
      ]},
      { nombre: "Conocimiento sobre Riesgos Digitales", color: "641E16", preguntas: [
        { preg: "¿Conoce qué es la ESDI?", indicador: "Nivel de conocimiento sobre ESDI", opciones: ["Conoce claramente", "Conocimiento básico", "Desconoce"], sel: "Desconoce", valor: 3, just: "Nunca había escuchado esta sigla." },
        { preg: "¿Identifica señales de alerta en el NNA?", indicador: "Reconocimiento de señales de alerta", opciones: ["Las identifica claramente", "Identifica algunas", "No sabe identificar"], sel: "No sabe identificar", valor: 3, just: "Nota que la niña está más callada pero no lo relaciona con riesgo." },
        { preg: "¿El NNA le cuenta sobre situaciones en internet?", indicador: "Comunicación NNA-cuidador sobre riesgos", opciones: ["Comunica abiertamente", "A veces comenta", "Nunca comenta"], sel: "Nunca comenta", valor: 3, just: "La relación es distante por el trabajo. Poca comunicación." },
      ]},
      { nombre: "Capacidad de Respuesta y Protección", color: "1E8449", preguntas: [
        { preg: "¿Sabe a quién acudir ante un caso de explotación digital?", indicador: "Conocimiento de rutas de atención", opciones: ["Sabe y lo haría", "Conoce parcialmente", "No sabe a quién acudir"], sel: "No sabe a quién acudir", valor: 3, just: "Menciona la Policía pero desconoce Línea 141, ICBF y comisarías." },
        { preg: "¿Ha conversado con el NNA sobre riesgos de internet?", indicador: "Educación digital en el hogar", opciones: ["Conversaciones frecuentes", "Pocas conversaciones", "Nunca ha hablado del tema"], sel: "Nunca ha hablado del tema", valor: 3, just: "Nunca abordó el tema. No sabe cómo hacerlo." },
        { preg: "¿Tiene redes de apoyo para proteger al NNA?", indicador: "Redes de apoyo disponibles", opciones: ["Redes activas", "Apoyo limitado", "Sin redes de apoyo"], sel: "Apoyo limitado", valor: 1, just: "Una hermana que ayuda ocasionalmente. Sin red estable." },
      ]},
    ],
    observaciones: "Madre empleada doméstica jornada completa. NNA sola con celular tardes y noches. Sin supervisión ni comunicación sobre riesgos digitales. Disposición para aprender y fortalecer vínculo con su hija.",
    puntajeTotal: 28,
    puntajesCat: [{ cat: "Demografico", pts: 3 }, { cat: "Supervisión Digital", pts: 9 }, { cat: "Conocimiento Riesgos", pts: 9 }, { cat: "Capacidad Respuesta", pts: 7 }],
    nivelRiesgo: "SIGNIFICATIVO",
    colorRiesgo: "red",
    recomendaciones: ["Formación parental urgente: talleres de habilidades parentales digitales.", "Articulación con comisaría de familia y colegio para seguimiento conjunto.", "Psicoeducación: Informar sobre ESDI, señales de alerta, Línea 141, ICBF, Policía Cibernética.", "Plan de seguridad digital en el hogar: reglas, tiempo de pantalla, controles parentales.", "Fortalecimiento del vínculo madre-hija mediante actividades de comunicación."],
  },
  {
    rolId: 3, rolNombre: "Profesional de Campo",
    version: "Versión 2 — Niñas, Niños y Adolescentes",
    idEntrevista: "3202503191100", fecha: "19/03/2026 11:00 (OFFLINE)",
    aplicadoPor: "Sandra Milena Reyes Pinto",
    dem: { fechaNac: "18/01/2014", edad: 12, genero: "Masculino", zona: "Rural", conflicto: "Sí / Desplazado", etnia: "No aplica", grado: "Quinto (sin asistencia regular)", municipio: "Montería, Córdoba" },
    categorias: [
      { nombre: "Acceso y Uso de Tecnología", color: "1B4F72", preguntas: [
        { preg: "¿Tiene acceso a internet?", indicador: "Acceso y disponibilidad de internet", opciones: ["No tiene acceso", "Con supervisión adulta", "Sin supervisión"], sel: "Con supervisión adulta", valor: 1, just: "Celular de la madre con permiso. Solo WhatsApp." },
        { preg: "¿Cuántas horas usa internet diariamente?", indicador: "Tiempo de exposición a internet", opciones: ["Menos de 1 hora", "1 a 3 horas", "Más de 3 horas"], sel: "Menos de 1 hora", valor: 0, just: "Acceso muy limitado. Conexión rural inestable." },
        { preg: "¿Qué tipo de dispositivos usa?", indicador: "Tipo de dispositivo y exposición", opciones: ["Solo dispositivos del colegio/casa sin internet", "Tablet supervisada", "Smartphone propio sin filtros"], sel: "Solo dispositivos del colegio/casa sin internet", valor: 0, just: "Sin dispositivo propio. Solo celular de la madre con permiso." },
      ]},
      { nombre: "Redes Sociales y Plataformas", color: "154360", preguntas: [
        { preg: "¿Tiene perfiles en redes sociales?", indicador: "Presencia en redes sociales", opciones: ["No tiene perfiles", "Perfiles supervisados", "Sin supervisión"], sel: "No tiene perfiles", valor: 0, just: "Solo WhatsApp familiar. Sin otras redes." },
        { preg: "¿Sus perfiles son públicos o privados?", indicador: "Configuración de privacidad", opciones: ["Todos privados", "Mixtos", "Públicos con desconocidos"], sel: "Todos privados", valor: 0, just: "Solo WhatsApp sin perfil público." },
        { preg: "¿Ha aceptado contacto de desconocidos?", indicador: "Contacto con desconocidos", opciones: ["Nunca", "En alguna ocasión", "Regularmente"], sel: "En alguna ocasión", valor: 1, just: "Aceptó solicitud de familiar lejano no conocido en persona." },
        { preg: "¿Comparte información personal en internet?", indicador: "Exposición de información personal", opciones: ["No comparte", "Solo con conocidos", "Abiertamente"], sel: "No comparte", valor: 0, just: "Sin privacidad digital consciente pero no comparte datos." },
      ]},
      { nombre: "Factores de Riesgo de Explotación Digital", color: "7B241C", preguntas: [
        { preg: "¿Algún adulto le ha enviado mensajes?", indicador: "Contacto adultos desconocidos", opciones: ["No", "Sí, lo reportó", "Frecuente sin reportar"], sel: "No", valor: 0, just: "Sin exposición. Uso muy limitado de internet." },
        { preg: "¿Le han pedido fotos o contenido íntimo?", indicador: "Solicitudes de contenido íntimo", opciones: ["Nunca", "Lo rechazó sin reportar", "Lo normaliza"], sel: "Nunca", valor: 0, just: "Sin exposición a este tipo de solicitudes." },
        { preg: "¿Le han ofrecido regalos o dinero por internet?", indicador: "Ofrecimiento de beneficios", opciones: ["Nunca", "Una vez, rechazó", "Ha recibido o aceptado"], sel: "Nunca", valor: 0, just: "Sin exposición a este tipo de manipulación." },
        { preg: "¿Ha habido sexting?", indicador: "Exposición a sexting", opciones: ["No", "Recibido sin enviar", "Enviado y/o recibido"], sel: "No", valor: 0, just: "Sin experiencia. Uso de internet muy restringido." },
      ]},
      { nombre: "Factores Protectores y Red de Apoyo", color: "145A32", preguntas: [
        { preg: "¿Sus cuidadores supervisan el uso de internet?", indicador: "Supervisión adulta", opciones: ["Supervisión activa", "Ocasional", "Sin supervisión"], sel: "Supervisión activa", valor: 0, just: "La madre controla el celular. Sin permiso no puede usarlo." },
        { preg: "¿Sabe a quién acudir si algo en internet le da miedo?", indicador: "Conocimiento de redes de apoyo", opciones: ["Sí y lo haría", "No está seguro", "No sabe"], sel: "No está seguro", valor: 1, just: "Puede hablar con su mamá. No conoce otras redes." },
        { preg: "¿Ha recibido información sobre seguridad digital?", indicador: "Educación en seguridad digital", opciones: ["Regularmente", "Esporádicamente", "Nunca"], sel: "Nunca", valor: 3, just: "Sin asistencia regular al colegio. En casa nada del tema." },
      ]},
    ],
    observaciones: "NNA en zona rural con acceso muy limitado y supervisado. Sin factores de riesgo activos. Factores de vulnerabilidad estructural: desplazado, sin escolaridad regular, sin educación digital. Redes: solo WhatsApp familiar.",
    puntajeTotal: 11,
    puntajesCat: [{ cat: "Demografico", pts: 6 }, { cat: "Acceso Tecnología", pts: 1 }, { cat: "Redes Sociales", pts: 1 }, { cat: "Riesgo Digital", pts: 0 }, { cat: "Factores Protectores", pts: 4 }],
    nivelRiesgo: "BAJO",
    colorRiesgo: "yellow",
    recomendaciones: ["Educación en seguridad digital con el NNA y su familia sobre riesgos básicos de internet.", "Gestionar continuidad escolar como factor protector fundamental.", "Fortalecer habilidades protectoras: identificación de riesgos y rutas de apoyo.", "Visita de seguimiento en 2 meses para valorar cambios en acceso y uso de tecnología."],
  },
  {
    rolId: 4, rolNombre: "Funcionario",
    version: "Versión 3 — Funcionarios Públicos",
    idEntrevista: "4202503190930", fecha: "19/03/2026 09:30",
    aplicadoPor: "Patricia Lozano Herrera",
    dem: { fechaNac: "05/11/1979", edad: 46, genero: "Masculino", zona: "Urbano", conflicto: "No", etnia: "No aplica", grado: "Educación superior", municipio: "Cali, Valle del Cauca" },
    categorias: [
      { nombre: "Conocimiento sobre ESDI", color: "154360", preguntas: [
        { preg: "¿Conoce qué es la ESDI?", indicador: "Nivel de conocimiento sobre ESDI", opciones: ["Amplio conocimiento actualizado", "Conocimiento básico", "Desconoce el concepto"], sel: "Conocimiento básico", valor: 1, just: "Ha escuchado el término pero sin formación específica." },
        { preg: "¿Ha recibido capacitación en trata y explotación sexual?", indicador: "Capacitación en trata y ESDI", opciones: ["Capacitación reciente y específica", "Básica o desactualizada", "Sin capacitación"], sel: "Básica o desactualizada", valor: 1, just: "Jornada del MEN hace 3 años. No específica en digital." },
        { preg: "¿Identifica señales de alerta en NNA víctimas de ESDI?", indicador: "Reconocimiento de señales de alerta", opciones: ["Identifica claramente", "Identifica algunas", "No conoce las señales"], sel: "Identifica algunas", valor: 1, just: "Reconoce cambios generales. No los asocia a riesgo digital." },
      ]},
      { nombre: "Capacidad Institucional de Detección", color: "1A5276", preguntas: [
        { preg: "¿Tiene protocolo institucional de atención a ESDI?", indicador: "Existencia de protocolos institucionales", opciones: ["Actualizado y conocido", "Desactualizado o poco conocido", "No existe"], sel: "Desactualizado o poco conocido", valor: 1, just: "Manual de convivencia con capítulo general. No incluye ESDI digital." },
        { preg: "¿Ha identificado o atendido casos de ESDI?", indicador: "Experiencia en identificación de casos", opciones: ["Identificó y activó ruta", "Identificó pero no activó ruta completa", "No ha identificado casos"], sel: "Identificó pero no activó ruta completa", valor: 1, just: "Detectó cambios en 2 estudiantes. Gestionó con los padres sin reportar al ICBF." },
        { preg: "¿Hay coordinación interinstitucional activa?", indicador: "Coordinación interinstitucional", opciones: ["Activa y documentada", "Informal o esporádica", "Sin coordinación"], sel: "Informal o esporádica", valor: 1, just: "Conoce el número de ICBF pero sin proceso formalizado." },
      ]},
      { nombre: "Conocimiento de Rutas de Atención", color: "1E8449", preguntas: [
        { preg: "¿Conoce las rutas de denuncia para ESDI?", indicador: "Conocimiento de rutas de atención", opciones: ["Conocimiento completo", "Parcialmente", "No conoce"], sel: "Parcialmente", valor: 1, just: "Conoce Línea 141 y comisaría. No conoce PARD ni Policía Cibernética." },
        { preg: "¿El equipo docente está capacitado en ESDI?", indicador: "Capacidad del equipo docente", opciones: ["Plenamente capacitado", "Parte del equipo", "Sin capacitación"], sel: "Parte del equipo", valor: 1, just: "Solo orientación tiene formación básica. 90% del cuerpo docente sin capacitación." },
        { preg: "¿La institución realiza actividades preventivas de ESDI?", indicador: "Actividades preventivas institucionales", opciones: ["Regulares y documentadas", "Esporádicas sin plan", "No se han realizado"], sel: "Esporádicas sin plan", valor: 1, just: "Una charla en el día de la familia. Sin programación sistemática." },
      ]},
    ],
    observaciones: "Docente de bachillerato con 18 años de experiencia. Disposición para aprender. Sin protocolo específico para ESDI. Coordinación con ICBF informal. Ha detectado 2 posibles casos sin activar protocolo completo. Sala de informática sin filtros de contenido.",
    puntajeTotal: 16,
    puntajesCat: [{ cat: "Demografico", pts: 7 }, { cat: "Conocimiento ESDI", pts: 3 }, { cat: "Capacidad Institucional", pts: 3 }, { cat: "Rutas de Atención", pts: 3 }],
    nivelRiesgo: "BAJO",
    colorRiesgo: "yellow",
    recomendaciones: ["Capacitación específica en ESDI para el docente y equipo directivo.", "Actualizar protocolos del manual de convivencia incorporando ESDI digital.", "Establecer articulación formal con ICBF, Comisaría y Policía Cibernética.", "Implementar programa preventivo para estudiantes y familias con actividades regulares.", "Instalar filtros de contenido en sala de informática y establecer política digital institucional."],
  },
  {
    rolId: 5, rolNombre: "Agente Externo",
    version: "Versión 4 — Agentes Externos / Comunitarios",
    idEntrevista: "5202503191500", fecha: "19/03/2026 15:00 (OFFLINE)",
    aplicadoPor: "William Mosquera Palacios",
    dem: { fechaNac: "30/06/1975", edad: 50, genero: "Femenino", zona: "Urbano periférico", conflicto: "Sí", etnia: "Afrocolombiana", grado: "Bachillerato incompleto", municipio: "Buenaventura, Valle del Cauca" },
    categorias: [
      { nombre: "Conocimiento Comunitario sobre ESDI", color: "1B4F72", preguntas: [
        { preg: "¿Conoce el concepto de ESDI?", indicador: "Conocimiento sobre ESDI en la comunidad", opciones: ["Conocimiento profundo para explicar", "Conocimiento básico", "No lo conocía"], sel: "Conocimiento básico", valor: 1, just: "Ha escuchado sobre abuso por internet pero no conocía el término técnico." },
        { preg: "¿Existe conciencia sobre riesgos digitales en la comunidad?", indicador: "Conciencia comunitaria sobre riesgos", opciones: ["Alta conciencia con prevención activa", "Conciencia limitada", "Sin conciencia"], sel: "Conciencia limitada", valor: 1, just: "Familias saben que 'internet puede ser peligroso' pero sin especificidad." },
        { preg: "¿Conoce casos de NNA en riesgo digital en su comunidad?", indicador: "Identificación comunitaria de casos en riesgo", opciones: ["No conoce casos", "Conoce y reporta", "Conoce pero no reporta"], sel: "Conoce pero no reporta", valor: 3, just: "3 adolescentes con señales de riesgo conocidas. No sabía cómo reportarlos." },
      ]},
      { nombre: "Capacidades Comunitarias de Prevención", color: "154360", preguntas: [
        { preg: "¿Realiza actividades de prevención sobre ESDI?", indicador: "Actividades preventivas comunitarias", opciones: ["Actividades regulares documentadas", "Esporádicas sin plan", "No realiza actividades"], sel: "Esporádicas sin plan", valor: 1, just: "Charla en puesto de salud hace 6 meses para madres." },
        { preg: "¿Cuenta con materiales preventivos?", indicador: "Disponibilidad de materiales preventivos", opciones: ["Materiales actualizados distribuidos", "Materiales limitados", "Sin materiales"], sel: "Sin materiales", valor: 3, just: "Guía de ONG de hace 2 años se agotó. Sin recursos para más." },
      ]},
      { nombre: "Articulación con Entidades de Protección", color: "7B241C", preguntas: [
        { preg: "¿Está articulado con entidades de protección (ICBF, Policía)?", indicador: "Articulación con entidades de protección", opciones: ["Articulación formal activa", "Contactos informales", "Sin articulación"], sel: "Contactos informales", valor: 1, just: "Conoce trabajadora social del ICBF pero sin proceso establecido." },
        { preg: "¿Conoce rutas comunitarias de denuncia para ESDI?", indicador: "Conocimiento de rutas de denuncia", opciones: ["Conoce y las ha usado", "Conoce algunas", "No conoce rutas"], sel: "Conoce algunas", valor: 1, just: "Sabe del ICBF pero no conoce Línea 141 ni Policía Cibernética." },
      ]},
      { nombre: "Seguimiento y Acompañamiento Comunitario", color: "145A32", preguntas: [
        { preg: "¿Hace seguimiento a familias en riesgo digital?", indicador: "Seguimiento comunitario a casos de riesgo", opciones: ["Seguimiento sistemático", "Seguimiento informal", "Sin seguimiento"], sel: "Seguimiento informal", valor: 1, just: "Visita ocasional a familias conocidas. Sin proceso documentado." },
        { preg: "¿Tiene plan de prevención de ESDI comunitario?", indicador: "Plan comunitario de prevención", opciones: ["Plan formalizado con indicadores", "Plan informal", "Sin plan"], sel: "Sin plan", valor: 3, just: "Trabajo completamente voluntario sin estructura formal." },
        { preg: "¿Existe red comunitaria de protección de NNA en digital?", indicador: "Red comunitaria activa de protección", opciones: ["Red activa con reuniones", "Red en formación", "No existe red"], sel: "Red en formación", valor: 1, just: "Grupo de WhatsApp de líderes con acciones esporádicas." },
      ]},
    ],
    observaciones: "Líder comunitaria afrocolombiana voluntaria. Alta motivación, capacidades técnicas limitadas en ESDI. Conoce 3 NNA en posible riesgo. Sin materiales ni plan. Disposición total para aprender. Comunidad con brechas de conectividad pero NNA acceden desde amigos y puntos comunitarios.",
    puntajeTotal: 19,
    puntajesCat: [{ cat: "Demografico", pts: 9 }, { cat: "Conocimiento ESDI", pts: 5 }, { cat: "Capacidades Preventivas", pts: 4 }, { cat: "Articulación", pts: 2 }, { cat: "Seguimiento", pts: 5 }],
    nivelRiesgo: "BAJO",
    colorRiesgo: "yellow",
    recomendaciones: ["Articulación URGENTE con ICBF para los 3 casos de NNA identificados.", "Formación técnica incluida en talleres del programa ModoSeguro sobre ESDI.", "Dotación de materiales físicos y digitales para distribución comunitaria offline.", "Formalizar la red comunitaria con procesos documentados y vínculos institucionales.", "Plan de acción comunitario con indicadores de cobertura para 6 meses.", "Taller de rutas: Línea 141, PARD, Policía Cibernética, Comisaría de Familia."],
  },
];

// ════════════════════════════════════════════════════════════════════════════
//  GENERADOR DE DOC DE HISTORIAS DE USUARIO
// ════════════════════════════════════════════════════════════════════════════
async function generarHistoriasDoc(rol) {
  const tituloDoc = `Historias de Usuario — ${rol.nombre}`;
  const children = [
    // Portada
    sp(600),
    titPortada("Historias de Usuario"),
    subPortada("Aplicación ModoSeguro — VigiatpApp"),
    sp(60),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
      children: [new TextRun({ text: `Rol ${rol.id} — ${rol.nombre}`, bold: true, size: 36, color: rol.color || C.azulM, font: "Calibri" })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
      children: [new TextRun({ text: `Nivel de Acceso: ${rol.nivel}`, size: 22, color: C.gris, font: "Calibri", italics: true })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
      children: [new TextRun({ text: "19 de marzo de 2026", size: 20, color: C.gris, font: "Calibri" })],
    }),
    sp(400), hr(),

    // Sección 1
    h1("1. ¿Quién es este usuario?"),
    p(rol.descripcion),
    sp(80),

    // Tabla de accesos
    h2("Tipos de entrevista disponibles:"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [th("Versión de Entrevista", 60), th("¿Tiene Acceso?", 40)] }),
        ...rol.accesos.map((a, i) => new TableRow({ children: [
          td(a, i%2===0?C.blanco:C.azulClaro),
          td("✅  SÍ — Autorizado", i%2===0?C.blanco:C.azulClaro, C.verde, true),
        ]})),
        ...rol.bloqueados.map((b, i) => new TableRow({ children: [
          td(b, i%2===0?C.rojoClaro:C.rojoClaro),
          td("❌  NO — Bloqueado", C.rojoClaro, C.rojo, true),
        ]})),
      ],
    }),
    sp(200), hr(),

    // Sección 2: Pantallas
    h1("2. Pantallas principales de la aplicación"),
    p("A continuación se muestran las representaciones visuales de las pantallas más importantes para este perfil de usuario:"),
    sp(80),
    ...rol.pantallasMockup.flatMap(m => mockupCentrado(m.nombre, m.elementos)),
    hr(),

    // Sección 3: Historias de usuario
    h1("3. Historias de Usuario"),
    p("Cada historia de usuario describe UNA NECESIDAD ESPECÍFICA del usuario, expresada en lenguaje natural. Definen QUÉ hace el usuario, QUÉ quiere lograr y POR QUÉ:"),
    sp(100),
    ...rol.historias.flatMap((h, i) => [tablaHistoria(h, i), sp(200)]),
    hr(),

    // Sección 4: Flujo de navegación
    h1("4. Flujo de Navegación del Rol"),
    blBold("Pantalla de inicio", "LoginScreen — Ingreso con correo y contraseña"),
    blBold("Panel principal", "HomeScreen — 4 accesos: Entrevista, Materiales, Resultados, Canales"),
    blBold("Entrevistas", "EntrevistaScreen → InstruccionScreen → AsentimientoScreen → PasoUno → PasosDos → PasoComentario → PasoTres"),
    blBold("Historial", "ListadoEntrevistasScreen — Ver, buscar, reanudar y eliminar entrevistas propias"),
    blBold("Resultados", "ResumenScreen — Estadísticas de riesgo del dispositivo"),
    blBold("Materiales", "MaterialesConsultaScreen → DetalleScreen — Recursos educativos"),
    blBold("Rutas", "RutasScreen — Canales de denuncia y atención institucional"),
    sp(200),

    // Cierre
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "— Fin del Documento —", italics: true, color: C.gris, size: 18, font: "Calibri" })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 },
      children: [new TextRun({ text: "Generado automáticamente · GitHub Copilot · Educa Digital / OIM / ICBF · 2026", size: 14, color: "9CA3AF", font: "Calibri" })],
    }),
  ];

  const doc = new Document({
    creator: "GitHub Copilot – Educa Digital",
    title: tituloDoc,
    sections: [{ properties: pageProps, headers: { default: makeHeader(tituloDoc) }, footers: { default: makeFooter() }, children }],
  });
  const buf = await Packer.toBuffer(doc);
  const filename = `HISTORIAS_USUARIO_ROL${rol.id}_${rol.nombre.replace(/ /g, "_").toUpperCase()}.docx`;
  fs.writeFileSync(filename, buf);
  console.log(`✅ ${filename}`);
}

// ════════════════════════════════════════════════════════════════════════════
//  GENERADOR DE DOC DE ENTREVISTA COMPLETA
// ════════════════════════════════════════════════════════════════════════════
async function generarEntrevistaDoc(ent) {
  const tituloDoc = `Entrevista Completa — Rol ${ent.rolId}: ${ent.rolNombre}`;
  const nivelColor = ent.colorRiesgo === "red" ? C.rojo : ent.colorRiesgo === "yellow" ? C.amarillo : C.verde;
  const nivelFondo = ent.colorRiesgo === "red" ? C.rojoClaro : ent.colorRiesgo === "yellow" ? C.amarClaro : C.verdeClaro;

  const children = [
    sp(500),
    titPortada("Escenario de Entrevista Completa"),
    subPortada("Aplicación ModoSeguro — VigiatpApp"),
    sp(60),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 50 },
      children: [new TextRun({ text: `Rol ${ent.rolId} — ${ent.rolNombre}`, bold: true, size: 36, color: C.azul, font: "Calibri" })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 50 },
      children: [new TextRun({ text: ent.version, size: 26, color: C.azulM, font: "Calibri", italics: true })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 },
      children: [new TextRun({ text: `ID: ${ent.idEntrevista}  ·  ${ent.fecha}`, size: 20, color: C.gris, font: "Calibri" })],
    }),
    // Badge resultado
    new Table({ width: { size: 70, type: WidthType.PERCENTAGE }, rows: [
      new TableRow({ children: [
        td("Nivel de Riesgo Final:", nivelFondo, nivelColor, true),
        td(ent.nivelRiesgo, nivelFondo, nivelColor, true, AlignmentType.CENTER),
      ]}),
      new TableRow({ children: [
        td("Puntaje Total:", C.azulClaro, C.azul, true),
        td(String(ent.puntajeTotal), C.azulClaro, C.azul, true, AlignmentType.CENTER),
      ]}),
    ]}),
    sp(400), hr(),

    // Sección 1: Qué es esta entrevista
    h1("1. ¿Qué es este documento?"),
    p("Este documento muestra el registro completo de un escenario de entrevista aplicada con la aplicación ModoSeguro. Contiene los datos del participante, las respuestas a cada pregunta del instrumento, las observaciones del aplicador y los resultados finales con las recomendaciones de atención."),
    p("Este tipo de registro es la base del trabajo de campo del programa y constituye evidencia técnica para la activación de rutas de atención y protección."),
    sp(80), hr(),

    // Sección 2: Pantalla de selección (mockup)
    h1("2. Pantalla de Selección de Entrevista"),
    ...mockupCentrado("EntrevistaScreen — Versión seleccionada", [
      { tipo: "titulo", texto: "ENTREVISTAS" },
      { tipo: "tarjeta", texto: `✅  ${ent.version}  ← SELECCIONADA` },
      { tipo: "normal", texto: `Aplicado por: ${ent.aplicadoPor}` },
      { tipo: "badge", texto: `Rol: ${ent.rolNombre}  ·  ID: ${ent.idEntrevista}` },
    ]),
    hr(),

    // Sección 3: Datos demográficos
    h1("3. Paso 1 — Datos Demográficos del Participante"),
    ...mockupCentrado("PasoUnoScreen — Datos Demográficos", [
      { tipo: "titulo", texto: "ENTREVISTA — " + ent.version },
      { tipo: "campo", texto: `📅  Fecha de nacimiento: ${ent.dem.fechaNac}  (${ent.dem.edad} años)` },
      { tipo: "campo", texto: `⚧  Género: ${ent.dem.genero}` },
      { tipo: "campo", texto: `🏙️  Zona: ${ent.dem.zona}` },
      { tipo: "campo", texto: `⚔️  Conflicto armado: ${ent.dem.conflicto}` },
      { tipo: "campo", texto: `🎭  Etnia: ${ent.dem.etnia}` },
      { tipo: "campo", texto: `🎓  Grado: ${ent.dem.grado}` },
      { tipo: "campo", texto: `📍  Municipio: ${ent.dem.municipio}` },
      { tipo: "boton", texto: "Siguiente →" },
    ]),

    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
      new TableRow({ children: [th("Dato Demográfico", 40), th("Valor Registrado", 60)] }),
      ...Object.entries(ent.dem).map(([k, v], i) => new TableRow({ children: [
        td(k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), i%2===0?C.blanco:C.azulClaro, C.azulM, true),
        td(String(v), i%2===0?C.blanco:C.azulClaro),
      ]})),
    ]}),
    sp(200), hr(),

    // Sección 4: Preguntas del instrumento
    h1("4. Paso 2 — Preguntas del Instrumento"),
    p("A continuación se detallan todas las preguntas del instrumento respondidas durante la entrevista, organizadas por categoría de evaluación:"),
    sp(100),

    ...ent.categorias.flatMap((cat, ci) => [
      h2(`Categoría ${ci+1}: ${cat.nombre}`),
      ...mockupCentrado(`PasoDosScreen — ${cat.nombre}`, [
        { tipo: "badge", texto: `█████████░░░░  ${Math.round(((ci+1)/ent.categorias.length)*100)} %` },
        { tipo: "titulo", texto: cat.nombre },
        { tipo: "campo", texto: "Indicador: [texto del indicador evaluado]" },
        { tipo: "campo", texto: "○  Opción A (valor 0 — sin riesgo)" },
        { tipo: "campo", texto: "○  Opción B (valor 1 — riesgo moderado)" },
        { tipo: "campo", texto: "✅  Opción seleccionada (valor indicado)" },
        { tipo: "boton", texto: "Siguiente →" },
      ]),
      ...cat.preguntas.flatMap((preg, pi) => [
        tablaPregunta(preg, `${ci+1}.${pi+1}`, preg, cat.color),
        sp(120),
      ]),
      sp(80),
    ]),
    hr(),

    // Sección 5: Observaciones
    h1("5. Paso Comentario — Observaciones del Aplicador"),
    ...mockupCentrado("PasoComentarioScreen — Observaciones", [
      { tipo: "badge", texto: "████████████████  100 %" },
      { tipo: "titulo", texto: "¿Qué redes sociales, videojuegos o plataformas utiliza...?" },
      { tipo: "campo", texto: "[Área de texto libre con observaciones del aplicador]" },
      { tipo: "boton", texto: "Ver Resultados" },
    ]),
    new Paragraph({
      shading: { type: ShadingType.CLEAR, fill: C.grisCla },
      spacing: { before: 100, after: 100 },
      children: [
        new TextRun({ text: "Observaciones registradas: ", bold: true, size: 20, color: C.azulM, font: "Calibri" }),
        new TextRun({ text: ent.observaciones, size: 20, color: C.negro, font: "Calibri" }),
      ],
    }),
    sp(200), hr(),

    // Sección 6: Resultados
    h1("6. Paso 3 — Resultados Finales"),
    ...mockupCentrado("PasoTresScreen — Resultados", [
      { tipo: "titulo", texto: "RESULTADO DE LA ENTREVISTA" },
      { tipo: "tarjeta", texto: "📊  Puntajes por categoría" },
      { tipo: ent.colorRiesgo === "red" ? "normal" : "badge", texto: `🎯  Nivel de Riesgo: ${ent.nivelRiesgo}` },
      { tipo: "tarjeta", texto: "💡  Recomendaciones específicas" },
      { tipo: "boton", texto: "⬇️  Descargar Excel" },
    ]),

    h2("Puntajes por Categoría y Resultado General"),
    tablaResumen(ent.puntajesCat.map(p => ({ categoria: p.cat, puntaje: p.pts })), ent.puntajeTotal, ent.nivelRiesgo, ent.colorRiesgo),
    sp(200),

    // Nivel de riesgo visual
    new Paragraph({
      shading: { type: ShadingType.CLEAR, fill: nivelFondo },
      spacing: { before: 80, after: 80 },
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: `  ${ent.colorRiesgo === "red" ? "🔴" : ent.colorRiesgo === "yellow" ? "🟡" : "🟢"}  NIVEL DE RIESGO: ${ent.nivelRiesgo}  ·  PUNTAJE TOTAL: ${ent.puntajeTotal}  `,
        bold: true, size: 24, color: nivelColor, font: "Calibri",
      })],
    }),
    sp(160),

    h2("Recomendaciones de Atención"),
    ...ent.recomendaciones.map(r => bl(r, C.verde)),
    sp(200), hr(),

    // Sección 7: Descarga Excel
    h1("7. Descarga del Reporte Excel"),
    p("Al tocar el botón 'Descargar' en PasoTresScreen, la aplicación genera automáticamente un archivo Excel (.xlsx) con el siguiente contenido:"),
    blBold("Sección 1", "Información general y datos demográficos del participante"),
    blBold("Sección 2", `Versión aplicada: ${ent.version}`),
    blBold("Sección 3", `Puntajes por categoría de evaluación (${ent.categorias.length} categorías)`),
    blBold("Sección 4", `Nivel de riesgo general: ${ent.nivelRiesgo} (${ent.puntajeTotal} puntos)`),
    blBold("Sección 5", "Recomendaciones y acciones de canalización"),
    blBold("Sección 6", "Observaciones del aplicador"),
    sp(200),

    // Cierre
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "— Fin del Documento de Entrevista —", italics: true, color: C.gris, size: 18, font: "Calibri" })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 },
      children: [new TextRun({ text: "Generado automáticamente · GitHub Copilot · Educa Digital / OIM / ICBF · 2026", size: 14, color: "9CA3AF", font: "Calibri" })],
    }),
  ];

  const doc = new Document({
    creator: "GitHub Copilot – Educa Digital",
    title: tituloDoc,
    sections: [{ properties: pageProps, headers: { default: makeHeader(tituloDoc) }, footers: { default: makeFooter() }, children }],
  });
  const buf = await Packer.toBuffer(doc);
  const filename = `ENTREVISTA_COMPLETA_ROL${ent.rolId}_${ent.rolNombre.replace(/ /g, "_").toUpperCase()}.docx`;
  fs.writeFileSync(filename, buf);
  console.log(`✅ ${filename}`);
}

// ════════════════════════════════════════════════════════════════════════════
//  EJECUTAR GENERACIÓN
// ════════════════════════════════════════════════════════════════════════════
console.log("\n🚀 Generando 10 documentos Word...\n");
console.log("── Historias de Usuario (5 docs) ──────────────────");
for (const rol of ROLES) await generarHistoriasDoc(rol);

console.log("\n── Entrevistas Completas (5 docs) ─────────────────");
for (const ent of ENTREVISTAS) await generarEntrevistaDoc(ent);

console.log("\n🎉 ¡10 documentos Word generados exitosamente!\n");
console.log("Archivos de Historias de Usuario:");
ROLES.forEach(r => console.log(`  📄 HISTORIAS_USUARIO_ROL${r.id}_${r.nombre.replace(/ /g,"_").toUpperCase()}.docx`));
console.log("\nArchivos de Entrevistas Completas:");
ENTREVISTAS.forEach(e => console.log(`  📄 ENTREVISTA_COMPLETA_ROL${e.rolId}_${e.rolNombre.replace(/ /g,"_").toUpperCase()}.docx`));
