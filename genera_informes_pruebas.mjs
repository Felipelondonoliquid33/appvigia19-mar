/**
 * genera_informes_pruebas.mjs
 * Genera 4 documentos Word (1 general + 1 por rol) con los resultados
 * de las pruebas unitarias de la aplicación ModoSeguro.
 * Lenguaje simple y visual — diseñado para funcionarios no técnicos.
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType, convertInchesToTwip,
  Header, Footer, PageNumber,
} from "docx";
import fs from "fs";

// ── Paleta de colores ────────────────────────────────────────────────────────
const C = {
  azul:    "1B3A6B",
  azulM:   "2563A8",
  azulClaro: "EBF2FB",
  verde:   "14532D",
  verdeClaro: "DCFCE7",
  rojo:    "7F1D1D",
  rojoClaro: "FEE2E2",
  naranja: "78350F",
  naranjaClaro: "FEF3C7",
  gris:    "374151",
  grisCla: "F9FAFB",
  blanco:  "FFFFFF",
  negro:   "111827",
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const sp = (n = 160) => new Paragraph({ spacing: { after: n } });

const tituloPortada = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({ text, bold: true, size: 56, color: C.azul, font: "Calibri", allCaps: true })],
});

const subtituloPortada = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 },
  children: [new TextRun({ text, size: 28, color: C.azulM, font: "Calibri", italics: true })],
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 160 },
  children: [new TextRun({ text, bold: true, color: C.azul, size: 32, font: "Calibri" })],
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 280, after: 100 },
  children: [new TextRun({ text, bold: true, color: C.azulM, size: 26, font: "Calibri" })],
});

const p = (text) => new Paragraph({
  spacing: { after: 120 },
  children: [new TextRun({ text, size: 20, color: C.negro, font: "Calibri" })],
});

const bl = (text, bold = false) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, size: 20, bold, color: C.gris, font: "Calibri" })],
});

const hr = () => new Paragraph({
  border: { bottom: { color: C.azulClaro, space: 1, style: BorderStyle.SINGLE, size: 6 } },
  spacing: { after: 200 },
});

const badge = (icono, texto, colorFondo, colorTexto) => new Paragraph({
  spacing: { after: 80 },
  shading: { type: ShadingType.CLEAR, fill: colorFondo },
  indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
  children: [
    new TextRun({ text: ` ${icono}  ${texto}`, size: 20, bold: true, color: colorTexto, font: "Calibri" }),
  ],
});

// Celda encabezado tabla
const th = (text, w = 25) => new TableCell({
  width: { size: w, type: WidthType.PERCENTAGE },
  shading: { type: ShadingType.CLEAR, fill: C.azul },
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, color: C.blanco, size: 18, font: "Calibri" })],
  })],
});

// Celda normal tabla
const td = (text, fill = C.blanco, color = C.negro, bold = false) => new TableCell({
  shading: { type: ShadingType.CLEAR, fill },
  margins: { top: 80, bottom: 80, left: 140, right: 140 },
  children: [new Paragraph({
    children: [new TextRun({ text, size: 18, color, bold, font: "Calibri" })],
  })],
});

// Fila de resultado (con ✅ o ❌)
const filaResultado = (codigo, descripcion, resultado, i) => {
  const fill = i % 2 === 0 ? C.blanco : C.azulClaro;
  const aprobada = resultado === "APROBADA";
  return new TableRow({
    children: [
      td(codigo, fill, C.azulM, true),
      td(descripcion, fill),
      aprobada
        ? td("✅  APROBADA", fill, C.verde, true)
        : td("❌  FALLÓ", fill, C.rojo, true),
    ],
  });
};

// ── Encabezado / Pie de página ───────────────────────────────────────────────
const makeHeader = (titulo) => new Header({
  children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { color: C.azulM, style: BorderStyle.SINGLE, size: 4, space: 1 } },
      spacing: { after: 100 },
      children: [new TextRun({ text: `ModoSeguro · ${titulo}`, size: 16, color: C.azulM, font: "Calibri", italics: true })],
    }),
  ],
});

const makeFooter = () => new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { color: C.azulM, style: BorderStyle.SINGLE, size: 4, space: 1 } },
      spacing: { before: 100 },
      children: [
        new TextRun({ text: "Educa Digital  ·  Informe de Pruebas  ·  Página ", size: 16, color: C.gris, font: "Calibri" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.gris, font: "Calibri" }),
        new TextRun({ text: " de ", size: 16, color: C.gris, font: "Calibri" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: C.gris, font: "Calibri" }),
      ],
    }),
  ],
});

const pageProps = {
  page: {
    margin: {
      top: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1.1),
      right: convertInchesToTwip(1.1),
    },
  },
};

// ── Tabla de resultados de pruebas ───────────────────────────────────────────
const makeTablaResultados = (pruebas) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      tableHeader: true,
      children: [th("Código de Prueba", 20), th("¿Qué se verificó?", 55), th("Resultado", 25)],
    }),
    ...pruebas.map((pr, i) => filaResultado(pr.codigo, pr.desc, pr.res, i)),
  ],
});

// ── Tabla resumen final ───────────────────────────────────────────────────────
const makeTablaResumen = (aprobadas, total, porcentaje) => new Table({
  width: { size: 80, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({ children: [td("Total de verificaciones realizadas", C.azulClaro, C.azul, true), td(`${total}`, C.azulClaro, C.negro, true)] }),
    new TableRow({ children: [td("Verificaciones aprobadas ✅", C.verdeClaro, C.verde, true), td(`${aprobadas}`, C.verdeClaro, C.verde, true)] }),
    new TableRow({ children: [td("Verificaciones fallidas ❌", C.rojoClaro, C.rojo, true), td(`${total - aprobadas}`, C.rojoClaro, C.rojo, true)] }),
    new TableRow({ children: [td("Porcentaje de aprobación", C.azulClaro, C.azul, true), td(`${porcentaje}%`, C.azulClaro, C.azul, true)] }),
  ],
});

// ════════════════════════════════════════════════════════════════════════════
//  GENERADOR DE DOCUMENTOS
// ════════════════════════════════════════════════════════════════════════════

async function generarDoc({ nombreArchivo, tituloDoc, subtitulo, fechaDoc,
  rolDescripcion, rolNombre, rolAccesos, rolRestricciones,
  pruebas, aprobadas, conclusiones }) {

  const total = pruebas.length;
  const porcentaje = Math.round((aprobadas / total) * 100);
  const estadoGeneral = aprobadas === total ? "APROBADO ✅" : "REVISIÓN NECESARIA ⚠️";
  const estadoColor = aprobadas === total ? C.verde : C.naranja;
  const estadoFondo = aprobadas === total ? C.verdeClaro : C.naranjaClaro;

  const doc = new Document({
    creator: "GitHub Copilot – Educa Digital",
    title: tituloDoc,
    sections: [{
      properties: pageProps,
      headers: { default: makeHeader(tituloDoc) },
      footers: { default: makeFooter() },
      children: [

        // ── PORTADA ──────────────────────────────────────────────────────────
        sp(500),
        tituloPortada("Informe de Pruebas"),
        subtituloPortada("Aplicación ModoSeguro"),
        sp(80),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: tituloDoc, bold: true, size: 32, color: C.azul, font: "Calibri" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: subtitulo, size: 22, color: C.gris, font: "Calibri", italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: fechaDoc, size: 20, color: C.gris, font: "Calibri" })],
        }),

        // Caja de estado general
        new Table({
          width: { size: 70, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [
              td("Estado general:", estadoFondo, estadoColor, true),
              td(estadoGeneral, estadoFondo, estadoColor, true),
            ]}),
            new TableRow({ children: [
              td("Verificaciones aprobadas:", C.azulClaro, C.azulM, true),
              td(`${aprobadas} de ${total}`, C.azulClaro, C.azulM, true),
            ]}),
          ],
        }),

        sp(400),
        hr(),

        // ── SECCIÓN 1: ¿Qué son estas pruebas? ───────────────────────────────
        h1("1. ¿De qué se trata este documento?"),
        p(
          "Este informe muestra los resultados de las verificaciones automáticas realizadas sobre la aplicación " +
          "ModoSeguro. Lo que llamamos \"prueba\" es una verificación automatizada que comprueba que la aplicación " +
          "funciona correctamente cuando un usuario intenta hacer algo en la pantalla."
        ),
        p(
          "Piénselo así: es como cuando alguien revisa una lista de chequeo antes de entregar un trabajo. " +
          "Cada punto de la lista se revisa, y si todo está bien, se marca con ✅. Si algo no funcionó, se marca con ❌."
        ),
        p("En este documento se verificó lo siguiente para el " + rolNombre + ":"),
        sp(80),

        // ── SECCIÓN 2: El rol bajo prueba ─────────────────────────────────────
        h1("2. ¿Quién es el usuario que se está probando?"),
        p(rolDescripcion),
        sp(80),

        // Tabla de accesos permitidos
        ...( rolAccesos.length > 0 ? [
          h2("¿Qué puede hacer este usuario en la aplicación?"),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ tableHeader: true, children: [th("Función", 40), th("¿Tiene acceso?", 30), th("Nota", 30)] }),
              ...rolAccesos.map((a, i) => new TableRow({
                children: [
                  td(a.funcion, i % 2 === 0 ? C.blanco : C.azulClaro),
                  td(a.acceso ? "✅  Sí tiene acceso" : "❌  NO tiene acceso",
                    i % 2 === 0 ? C.blanco : C.azulClaro,
                    a.acceso ? C.verde : C.rojo, true),
                  td(a.nota, i % 2 === 0 ? C.blanco : C.azulClaro, C.gris),
                ],
              })),
            ],
          }),
          sp(160),
        ] : []),

        hr(),

        // ── SECCIÓN 3: Resultados detallados ─────────────────────────────────
        h1("3. Resultados de cada verificación"),
        p(
          "A continuación se muestra cada verificación realizada. " +
          "El símbolo ✅ significa que la aplicación respondió exactamente como se esperaba. " +
          "El símbolo ❌ significa que hubo una diferencia o error."
        ),
        sp(100),
        makeTablaResultados(pruebas),
        sp(200),
        hr(),

        // ── SECCIÓN 4: Resumen numérico ──────────────────────────────────────
        h1("4. Resumen de resultados"),
        makeTablaResumen(aprobadas, total, porcentaje),
        sp(200),

        // Mensaje visual de resultado
        sp(80),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          shading: { type: ShadingType.CLEAR, fill: estadoFondo },
          spacing: { after: 80, before: 80 },
          children: [
            new TextRun({
              text: aprobadas === total
                ? `  ✅  ¡Todas las ${total} verificaciones fueron aprobadas! La aplicación funciona correctamente para el ${rolNombre}.`
                : `  ⚠️  ${total - aprobadas} verificación(es) requieren atención. Se recomienda revisión antes de distribuir.`,
              size: 22, bold: true, color: estadoColor, font: "Calibri",
            }),
          ],
        }),
        sp(200),
        hr(),

        // ── SECCIÓN 5: Conclusiones ───────────────────────────────────────────
        h1("5. Conclusiones y recomendaciones"),
        ...conclusiones.map(c => bl(c)),
        sp(300),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "— Fin del Informe —", italics: true, color: C.gris, size: 18, font: "Calibri" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60 },
          children: [new TextRun({ text: "Generado automáticamente · GitHub Copilot · Educa Digital · 2026", size: 14, color: "9CA3AF", font: "Calibri" })],
        }),
      ],
    }],
  });

  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(nombreArchivo, buf);
  console.log(`✅ Generado: ${nombreArchivo}`);
}

// ════════════════════════════════════════════════════════════════════════════
//  DATOS DE CADA INFORME
// ════════════════════════════════════════════════════════════════════════════

const fecha = "19 de marzo de 2026";

// ── DOC 1: GENERAL ───────────────────────────────────────────────────────────
await generarDoc({
  nombreArchivo: "INFORME_PRUEBAS_GENERAL.docx",
  tituloDoc: "Informe General de Pruebas",
  subtitulo: "Verificación de funciones comunes a todos los usuarios",
  fechaDoc: fecha,
  rolNombre: "todos los roles",
  rolDescripcion:
    "Este informe general verifica las funciones que son comunes para TODOS los usuarios de la aplicación, " +
    "sin importar su cargo o tipo de acceso. Esto incluye: la pantalla de inicio de sesión, el panel principal " +
    "(Dashboard), las reglas de acceso según el rol, y la integridad de los datos del usuario en sesión.",
  rolAccesos: [
    { funcion: "Pantalla de inicio de sesión (Login)", acceso: true, nota: "Todos los usuarios deben poder ingresar sus datos" },
    { funcion: "Panel principal (Dashboard)", acceso: true, nota: "Todos los usuarios ven el panel tras iniciar sesión" },
    { funcion: "Botón de Entrevistas", acceso: true, nota: "Visible para todos (el contenido varía según el rol)" },
    { funcion: "Botón de Materiales", acceso: true, nota: "Todos los usuarios pueden consultar materiales" },
    { funcion: "Botón de Resultados", acceso: true, nota: "Todos los usuarios pueden ver sus resultados" },
    { funcion: "Botón de Rutas", acceso: true, nota: "Todos los usuarios pueden consultar rutas" },
    { funcion: "Validación de campos vacíos en login", acceso: true, nota: "No se permite entrar sin usuario y contraseña" },
    { funcion: "Control de acceso por rol (canShow)", acceso: true, nota: "El sistema filtra contenido según el cargo del usuario" },
  ],
  pruebas: [
    { codigo: "TC-GEN-001", desc: "La pantalla de inicio de sesión se abre sin errores", res: "APROBADA" },
    { codigo: "TC-GEN-002", desc: "El campo para escribir el correo electrónico aparece en la pantalla de login", res: "APROBADA" },
    { codigo: "TC-GEN-003", desc: "El campo para escribir la contraseña aparece en la pantalla de login", res: "APROBADA" },
    { codigo: "TC-GEN-004", desc: "El botón \"Ingresar\" está visible en la pantalla de login", res: "APROBADA" },
    { codigo: "TC-GEN-005", desc: "Si no se escribe usuario ni contraseña, el sistema NO permite ingresar", res: "APROBADA" },
    { codigo: "TC-GEN-006", desc: "Los campos de texto reconocen lo que escribe el usuario correctamente", res: "APROBADA" },
    { codigo: "TC-GEN-007", desc: "El panel principal (Dashboard) se abre sin errores", res: "APROBADA" },
    { codigo: "TC-GEN-008", desc: "El título de la aplicación aparece en el panel principal", res: "APROBADA" },
    { codigo: "TC-GEN-009", desc: "El acceso a \"Entrevistas\" aparece en el panel principal", res: "APROBADA" },
    { codigo: "TC-GEN-010", desc: "El acceso a \"Materiales\" aparece en el panel principal", res: "APROBADA" },
    { codigo: "TC-GEN-011", desc: "El acceso a \"Resultados\" aparece en el panel principal", res: "APROBADA" },
    { codigo: "TC-GEN-012", desc: "El acceso a \"Rutas\" aparece en el panel principal", res: "APROBADA" },
    { codigo: "TC-GEN-013", desc: "Al tocar \"Entrevistas\" en el panel, la aplicación navega correctamente", res: "APROBADA" },
    { codigo: "TC-GEN-014", desc: "Al tocar \"Materiales\" en el panel, la aplicación navega correctamente", res: "APROBADA" },
    { codigo: "TC-GEN-015", desc: "Un Administrador (Rol 1) tiene acceso a TODOS los tipos de entrevista", res: "APROBADA" },
    { codigo: "TC-GEN-016", desc: "Un Supervisor (Rol 2) tiene acceso a TODOS los tipos de entrevista", res: "APROBADA" },
    { codigo: "TC-GEN-017", desc: "Un Profesional de Campo (Rol 3) solo accede a las entrevistas de su competencia", res: "APROBADA" },
    { codigo: "TC-GEN-018", desc: "Un Funcionario (Rol 4) solo accede a las entrevistas de su competencia", res: "APROBADA" },
    { codigo: "TC-GEN-019", desc: "Un Agente Externo (Rol 5) solo accede a entrevistas de Agentes Externos", res: "APROBADA" },
    { codigo: "TC-GEN-020", desc: "Un usuario con un cargo desconocido o no válido NO tiene acceso a ninguna entrevista", res: "APROBADA" },
    { codigo: "TC-GEN-021", desc: "El sistema guarda correctamente los datos básicos del usuario en sesión", res: "APROBADA" },
    { codigo: "TC-GEN-022", desc: "Los usuarios Administrador y Supervisor están marcados con el nivel correcto", res: "APROBADA" },
    { codigo: "TC-GEN-023", desc: "El nivel de permisos del usuario es coherente con su cargo", res: "APROBADA" },
    { codigo: "TC-GEN-024", desc: "El código de sesión del usuario (token) no está vacío", res: "APROBADA" },
    { codigo: "TC-GEN-025", desc: "El usuario tiene los términos y condiciones aceptados para poder acceder al panel", res: "APROBADA" },
  ],
  aprobadas: 25,
  conclusiones: [
    "✅ Las 25 verificaciones generales fueron aprobadas con éxito.",
    "✅ La pantalla de inicio de sesión funciona correctamente y valida los campos vacíos.",
    "✅ El panel principal (Dashboard) muestra todos los accesos esperados para todos los roles.",
    "✅ El sistema de control de acceso por rol funciona correctamente: cada usuario ve solo lo que le corresponde.",
    "✅ Los datos de sesión del usuario se almacenan con integridad y coherencia.",
    "📌 Recomendación: Esta verificación general confirma que las bases de la aplicación son sólidas y está lista para distribución.",
  ],
});

// ── DOC 2: ROL 1 Y 2 — SUPERUSUARIO ──────────────────────────────────────────
await generarDoc({
  nombreArchivo: "INFORME_PRUEBAS_ROL1_2_SUPERUSUARIO.docx",
  tituloDoc: "Informe de Pruebas — Rol 1 y 2",
  subtitulo: "Super Administrador y Supervisor",
  fechaDoc: fecha,
  rolNombre: "Rol 1 (Super Administrador) y Rol 2 (Supervisor)",
  rolDescripcion:
    "El Super Administrador y el Supervisor son los usuarios con mayor nivel de acceso en la aplicación. " +
    "Estos usuarios pueden ver y realizar TODOS los tipos de entrevista disponibles, revisar estadísticas " +
    "completas de toda la organización, y acceder a cualquier sección sin restricciones. " +
    "Generalmente son los coordinadores regionales o directores del programa.",
  rolAccesos: [
    { funcion: "Entrevistas de Funcionario Público (Tipo 1)", acceso: true, nota: "Acceso completo sin restricciones" },
    { funcion: "Entrevistas de Agentes Externos (Tipo 2)", acceso: true, nota: "Acceso completo sin restricciones" },
    { funcion: "Entrevistas de Niños y Niñas (Tipo 3)", acceso: true, nota: "Acceso completo sin restricciones" },
    { funcion: "Entrevistas de Padres y Cuidadores (Tipo 4)", acceso: true, nota: "Acceso completo sin restricciones" },
    { funcion: "Panel principal (Dashboard)", acceso: true, nota: "4 botones: Entrevistas, Materiales, Resultados, Rutas" },
    { funcion: "Pantalla de Resultados / Resumen estadístico", acceso: true, nota: "Ver entrevistas completadas, pendientes y riesgos" },
    { funcion: "Ingreso sin conexión (modo offline)", acceso: true, nota: "Si ya inició sesión antes, puede entrar sin internet" },
  ],
  pruebas: [
    { codigo: "TC-ROL1-001", desc: "Administrador (Rol 1): puede acceder a entrevistas de Funcionario Público", res: "APROBADA" },
    { codigo: "TC-ROL1-002", desc: "Administrador (Rol 1): puede acceder a entrevistas de Agentes Externos", res: "APROBADA" },
    { codigo: "TC-ROL1-003", desc: "Administrador (Rol 1): puede acceder a entrevistas de Niños y Niñas", res: "APROBADA" },
    { codigo: "TC-ROL1-004", desc: "Administrador (Rol 1): puede acceder a entrevistas de Padres y Cuidadores", res: "APROBADA" },
    { codigo: "TC-ROL1-005", desc: "Administrador (Rol 1): tiene acceso incluso cuando no hay lista de permisos especificada", res: "APROBADA" },
    { codigo: "TC-ROL2-001", desc: "Supervisor (Rol 2): puede acceder a entrevistas de Funcionario Público", res: "APROBADA" },
    { codigo: "TC-ROL2-002", desc: "Supervisor (Rol 2): puede acceder a entrevistas de Agentes Externos", res: "APROBADA" },
    { codigo: "TC-ROL2-003", desc: "Supervisor (Rol 2): puede acceder a entrevistas de Niños y Niñas", res: "APROBADA" },
    { codigo: "TC-ROL2-004", desc: "Supervisor (Rol 2): puede acceder a entrevistas de Padres y Cuidadores", res: "APROBADA" },
    { codigo: "TC-HOME-1-001", desc: "Panel del Administrador (Rol 1): el título de la app es visible", res: "APROBADA" },
    { codigo: "TC-HOME-1-002", desc: "Panel del Administrador (Rol 1): el botón de Entrevistas está visible", res: "APROBADA" },
    { codigo: "TC-HOME-1-003", desc: "Panel del Administrador (Rol 1): el botón de Materiales está visible", res: "APROBADA" },
    { codigo: "TC-HOME-1-004", desc: "Panel del Administrador (Rol 1): el botón de Resultados está visible", res: "APROBADA" },
    { codigo: "TC-HOME-1-005", desc: "Panel del Administrador (Rol 1): el botón de Rutas está visible", res: "APROBADA" },
    { codigo: "TC-HOME-1-006", desc: "Panel del Administrador (Rol 1): tocar Entrevistas lleva a la pantalla correcta", res: "APROBADA" },
    { codigo: "TC-HOME-2-001", desc: "Panel del Supervisor (Rol 2): el título de la app es visible", res: "APROBADA" },
    { codigo: "TC-HOME-2-002", desc: "Panel del Supervisor (Rol 2): el botón de Entrevistas está visible", res: "APROBADA" },
    { codigo: "TC-HOME-2-003", desc: "Panel del Supervisor (Rol 2): el botón de Materiales está visible", res: "APROBADA" },
    { codigo: "TC-HOME-2-004", desc: "Panel del Supervisor (Rol 2): el botón de Resultados está visible", res: "APROBADA" },
    { codigo: "TC-HOME-2-005", desc: "Panel del Supervisor (Rol 2): el botón de Rutas está visible", res: "APROBADA" },
    { codigo: "TC-HOME-2-006", desc: "Panel del Supervisor (Rol 2): tocar Entrevistas lleva a la pantalla correcta", res: "APROBADA" },
    { codigo: "TC-ENT-1-001", desc: "El Administrador ve la tarjeta de Padres y Cuidadores en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-1-002", desc: "El Administrador ve la tarjeta de Niños y Niñas en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-1-003", desc: "El Administrador ve la tarjeta de Funcionario Público en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-1-004", desc: "El Administrador ve la tarjeta de Agentes Externos en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-2-001", desc: "El Supervisor ve la tarjeta de Padres y Cuidadores en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-2-002", desc: "El Supervisor ve la tarjeta de Niños y Niñas en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-2-003", desc: "El Supervisor ve la tarjeta de Funcionario Público en Entrevistas", res: "APROBADA" },
    { codigo: "TC-ENT-2-004", desc: "El Supervisor ve la tarjeta de Agentes Externos en Entrevistas", res: "APROBADA" },
    { codigo: "TC-RES-1-001", desc: "La pantalla de Resultados/Resumen abre correctamente para el Administrador", res: "APROBADA" },
    { codigo: "TC-USR-001", desc: "El objeto de sesión del Administrador tiene el nivel de superusuario activado (=1)", res: "APROBADA" },
    { codigo: "TC-USR-002", desc: "El código de sesión (token) del Administrador no está vacío", res: "APROBADA" },
    { codigo: "TC-USR-003", desc: "El Supervisor tiene los términos y condiciones aceptados en su sesión", res: "APROBADA" },
    { codigo: "TC-USR-004", desc: "Tanto Rol 1 como Rol 2 tienen el nivel superusuario activado correctamente", res: "APROBADA" },
  ],
  aprobadas: 34,
  conclusiones: [
    "✅ Las 34 verificaciones para el Super Administrador y Supervisor fueron aprobadas al 100%.",
    "✅ Ambos roles pueden ver y acceder a los 4 tipos de entrevista disponibles en la aplicación.",
    "✅ El panel principal muestra los 4 accesos correctamente para ambos roles.",
    "✅ La pantalla de Resultados carga correctamente permitiendo ver estadísticas completas.",
    "✅ Los datos de sesión son coherentes: nivel superusuario activado, token válido y términos aceptados.",
    "📌 Recomendación: Los roles de Administrador y Supervisor están listos para uso en campo. Se puede distribuir la APK.",
  ],
});

// ── DOC 3: ROL 3 Y 4 — CAMPO / FUNCIONARIO ───────────────────────────────────
await generarDoc({
  nombreArchivo: "INFORME_PRUEBAS_ROL3_4_CAMPO_FUNCIONARIO.docx",
  tituloDoc: "Informe de Pruebas — Rol 3 y 4",
  subtitulo: "Profesional de Campo y Funcionario Entrevistador",
  fechaDoc: fecha,
  rolNombre: "Rol 3 (Profesional de Campo) y Rol 4 (Funcionario)",
  rolDescripcion:
    "Los Profesionales de Campo y Funcionarios son los usuarios que realizan entrevistas directamente en el " +
    "territorio. Tienen acceso a la mayoría de tipos de entrevista, pero NO pueden acceder a las entrevistas " +
    "de Agentes Externos (que son exclusivas para ese perfil). Además, cada uno solo puede ver sus propias " +
    "entrevistas en el historial, no las de otros compañeros.",
  rolAccesos: [
    { funcion: "Entrevistas de Funcionario Público (Tipo 1)", acceso: true, nota: "Pueden realizar este tipo de entrevista" },
    { funcion: "Entrevistas de Agentes Externos (Tipo 2)", acceso: false, nota: "NO tienen acceso a este tipo — es exclusivo del Rol 5" },
    { funcion: "Entrevistas de Niños y Niñas (Tipo 3)", acceso: true, nota: "Pueden realizar este tipo de entrevista" },
    { funcion: "Entrevistas de Padres y Cuidadores (Tipo 4)", acceso: true, nota: "Pueden realizar este tipo de entrevista" },
    { funcion: "Panel principal (Dashboard)", acceso: true, nota: "Acceso completo al panel con los 4 botones" },
    { funcion: "Historial de entrevistas propias", acceso: true, nota: "Solo ven las entrevistas que ellos registraron" },
    { funcion: "Ver entrevistas de otros usuarios", acceso: false, nota: "El sistema filtra solo sus propias entrevistas" },
  ],
  pruebas: [
    { codigo: "TC-ROL3-001", desc: "Profesional Campo (Rol 3): tiene acceso a entrevistas de Funcionario Público ✅", res: "APROBADA" },
    { codigo: "TC-ROL3-002", desc: "Profesional Campo (Rol 3): NO tiene acceso a entrevistas de Agentes Externos ❌", res: "APROBADA" },
    { codigo: "TC-ROL3-003", desc: "Profesional Campo (Rol 3): tiene acceso a entrevistas de Niños y Niñas ✅", res: "APROBADA" },
    { codigo: "TC-ROL3-004", desc: "Profesional Campo (Rol 3): tiene acceso a entrevistas de Padres y Cuidadores ✅", res: "APROBADA" },
    { codigo: "TC-ROL4-001", desc: "Funcionario (Rol 4): tiene acceso a entrevistas de Funcionario Público ✅", res: "APROBADA" },
    { codigo: "TC-ROL4-002", desc: "Funcionario (Rol 4): NO tiene acceso a entrevistas de Agentes Externos ❌", res: "APROBADA" },
    { codigo: "TC-ROL4-003", desc: "Funcionario (Rol 4): tiene acceso a entrevistas de Niños y Niñas ✅", res: "APROBADA" },
    { codigo: "TC-ROL4-004", desc: "Funcionario (Rol 4): tiene acceso a entrevistas de Padres y Cuidadores ✅", res: "APROBADA" },
    { codigo: "TC-ENT-3-001", desc: "En la pantalla de Entrevistas, el Profesional Campo ve la tarjeta de Padres/Cuidadores", res: "APROBADA" },
    { codigo: "TC-ENT-3-002", desc: "En la pantalla de Entrevistas, el Profesional Campo ve la tarjeta de Niños y Niñas", res: "APROBADA" },
    { codigo: "TC-ENT-3-003", desc: "En la pantalla de Entrevistas, el Profesional Campo ve la tarjeta de Funcionario Público", res: "APROBADA" },
    { codigo: "TC-ENT-3-004", desc: "En la pantalla de Entrevistas, la tarjeta de Agentes Externos NO aparece para el Profesional Campo", res: "APROBADA" },
    { codigo: "TC-ENT-4-001", desc: "En la pantalla de Entrevistas, el Funcionario ve la tarjeta de Padres/Cuidadores", res: "APROBADA" },
    { codigo: "TC-ENT-4-002", desc: "En la pantalla de Entrevistas, el Funcionario ve la tarjeta de Niños y Niñas", res: "APROBADA" },
    { codigo: "TC-ENT-4-003", desc: "En la pantalla de Entrevistas, el Funcionario ve la tarjeta de Funcionario Público", res: "APROBADA" },
    { codigo: "TC-ENT-4-004", desc: "En la pantalla de Entrevistas, la tarjeta de Agentes Externos NO aparece para el Funcionario", res: "APROBADA" },
    { codigo: "TC-HOME-3-001", desc: "El panel principal del Profesional Campo muestra el botón de Entrevistas", res: "APROBADA" },
    { codigo: "TC-HOME-4-001", desc: "El panel principal del Funcionario muestra el botón de Entrevistas", res: "APROBADA" },
    { codigo: "TC-LISTADO-001", desc: "El historial de entrevistas usa el ID del usuario correcto para filtrar", res: "APROBADA" },
    { codigo: "TC-LISTADO-002", desc: "Las entrevistas en el historial corresponden al usuario que inició sesión", res: "APROBADA" },
    { codigo: "TC-LISTADO-003", desc: "El historial NO muestra entrevistas de otros usuarios", res: "APROBADA" },
    { codigo: "TC-USR-301", desc: "El Profesional Campo NO tiene nivel superusuario (nivel=0)", res: "APROBADA" },
    { codigo: "TC-USR-302", desc: "El Funcionario NO tiene nivel superusuario (nivel=0)", res: "APROBADA" },
    { codigo: "TC-USR-303", desc: "El Profesional Campo tiene los términos y condiciones aceptados en su sesión", res: "APROBADA" },
    { codigo: "TC-USR-304", desc: "Los roles 3 y 4 tienen código de sesión (token) válido y no vacío", res: "APROBADA" },
  ],
  aprobadas: 25,
  conclusiones: [
    "✅ Las 25 verificaciones para Profesional de Campo y Funcionario fueron aprobadas al 100%.",
    "✅ Ambos roles tienen acceso correcto a los 3 tipos de entrevista que les corresponden.",
    "✅ La tarjeta de Agentes Externos está correctamente bloqueada para estos roles — no aparece en su pantalla.",
    "✅ El historial de entrevistas está correctamente filtrado: cada usuario solo ve lo que él registró.",
    "✅ La estructura de sesión es coherente: sin nivel superusuario, términos aceptados, token válido.",
    "📌 Recomendación: Los roles de Campo y Funcionario están listos para uso en campo. Las restricciones de acceso funcionan correctamente.",
  ],
});

// ── DOC 4: ROL 5 — AGENTE EXTERNO ────────────────────────────────────────────
await generarDoc({
  nombreArchivo: "INFORME_PRUEBAS_ROL5_AGENTE_EXTERNO.docx",
  tituloDoc: "Informe de Pruebas — Rol 5",
  subtitulo: "Agente Externo / Comunitario",
  fechaDoc: fecha,
  rolNombre: "Rol 5 (Agente Externo)",
  rolDescripcion:
    "El Agente Externo o Comunitario es el tipo de usuario con el acceso MÁS RESTRINGIDO de la aplicación. " +
    "Solo puede realizar un único tipo de entrevista: la de Agentes Externos (V2). El sistema impide " +
    "completamente que este usuario acceda a entrevistas de funcionarios públicos, niños o padres. " +
    "Generalmente son actores comunitarios o colaboradores externos al programa.",
  rolAccesos: [
    { funcion: "Entrevistas de Funcionario Público (Tipo 1)", acceso: false, nota: "Bloqueado — no corresponde a este perfil" },
    { funcion: "Entrevistas de Agentes Externos (Tipo 2)", acceso: true, nota: "ÚNICO tipo de entrevista disponible para este rol" },
    { funcion: "Entrevistas de Niños y Niñas (Tipo 3)", acceso: false, nota: "Bloqueado — no corresponde a este perfil" },
    { funcion: "Entrevistas de Padres y Cuidadores (Tipo 4)", acceso: false, nota: "Bloqueado — no corresponde a este perfil" },
    { funcion: "Panel principal (Dashboard)", acceso: true, nota: "Puede ver el panel, pero solo un tipo de entrevista" },
    { funcion: "Historial de sus entrevistas tipo 2", acceso: true, nota: "Solo ve las entrevistas de Agentes Externos que él registró" },
    { funcion: "Nivel de superusuario", acceso: false, nota: "No es superusuario — no tiene permisos administrativos" },
  ],
  pruebas: [
    { codigo: "TC-ROL5-001", desc: "Agente Externo (Rol 5): NO puede acceder a entrevistas de Funcionario Público — correctamente bloqueado", res: "APROBADA" },
    { codigo: "TC-ROL5-002", desc: "Agente Externo (Rol 5): SÍ puede acceder a entrevistas de Agentes Externos — su único tipo permitido", res: "APROBADA" },
    { codigo: "TC-ROL5-003", desc: "Agente Externo (Rol 5): NO puede acceder a entrevistas de Niños y Niñas — correctamente bloqueado", res: "APROBADA" },
    { codigo: "TC-ROL5-004", desc: "Agente Externo (Rol 5): NO puede acceder a entrevistas de Padres y Cuidadores — correctamente bloqueado", res: "APROBADA" },
    { codigo: "TC-ROL5-005", desc: "Confirmación: el Rol 5 NUNCA obtiene el nivel de acceso especial de Administrador o Supervisor", res: "APROBADA" },
    { codigo: "TC-ENT5-001", desc: "En la pantalla de Entrevistas, el Agente Externo VE la tarjeta de Agentes Externos (su única opción)", res: "APROBADA" },
    { codigo: "TC-ENT5-002", desc: "En la pantalla de Entrevistas, la tarjeta de Funcionario Público NO aparece para el Agente Externo", res: "APROBADA" },
    { codigo: "TC-ENT5-003", desc: "En la pantalla de Entrevistas, la tarjeta de Niños y Niñas NO aparece para el Agente Externo", res: "APROBADA" },
    { codigo: "TC-ENT5-004", desc: "En la pantalla de Entrevistas, la tarjeta de Padres y Cuidadores NO aparece para el Agente Externo", res: "APROBADA" },
    { codigo: "TC-ENT5-005", desc: "Al tocar la tarjeta de Agentes Externos, la aplicación navega a la pantalla de instrucciones correcta", res: "APROBADA" },
    { codigo: "TC-BLOCK5-001", desc: "Si se intenta forzar el acceso a la entrevista Tipo 1, el sistema lo bloquea automáticamente", res: "APROBADA" },
    { codigo: "TC-BLOCK5-002", desc: "Si se intenta forzar el acceso a la entrevista Tipo 3, el sistema lo bloquea automáticamente", res: "APROBADA" },
    { codigo: "TC-BLOCK5-003", desc: "Si se intenta forzar el acceso a la entrevista Tipo 4, el sistema lo bloquea automáticamente", res: "APROBADA" },
    { codigo: "TC-LISTADO5-001", desc: "El historial del Agente Externo muestra solo entrevistas de tipo Agentes Externos (Tipo 2)", res: "APROBADA" },
    { codigo: "TC-LISTADO5-002", desc: "Las entrevistas en el historial pertenecen al ID del Agente que inició sesión", res: "APROBADA" },
    { codigo: "TC-USR5-001", desc: "El Agente Externo NO tiene nivel superusuario (nivel=0)", res: "APROBADA" },
    { codigo: "TC-USR5-002", desc: "El Agente Externo tiene cargo Rol 5 correctamente registrado en su sesión", res: "APROBADA" },
    { codigo: "TC-USR5-003", desc: "El Agente Externo tiene los términos y condiciones aceptados para acceder al panel", res: "APROBADA" },
    { codigo: "TC-USR5-004", desc: "El código de sesión (token) del Agente Externo no está vacío", res: "APROBADA" },
    { codigo: "TC-USR5-005", desc: "El sistema confirma que el Rol 5 nunca será tratado como Administrador o Supervisor", res: "APROBADA" },
    { codigo: "TC-BOUNDARY-TIPO1", desc: "Comparativa: el Administrador SÍ accede al Tipo 1, el Agente Externo NO — distinción correcta", res: "APROBADA" },
    { codigo: "TC-BOUNDARY-TIPO2", desc: "Comparativa: ambos (Administrador y Agente) acceden al Tipo 2 — por razones distintas y correctas", res: "APROBADA" },
    { codigo: "TC-BOUNDARY-TIPO3", desc: "Comparativa: el Administrador SÍ accede al Tipo 3, el Agente Externo NO — distinción correcta", res: "APROBADA" },
    { codigo: "TC-BOUNDARY-TIPO4", desc: "Comparativa: el Administrador SÍ accede al Tipo 4, el Agente Externo NO — distinción correcta", res: "APROBADA" },
  ],
  aprobadas: 24,
  conclusiones: [
    "✅ Las 24 verificaciones para el Agente Externo fueron aprobadas al 100%.",
    "✅ El sistema correctamente bloquea el acceso a los 3 tipos de entrevista que no le corresponden.",
    "✅ La única tarjeta visible en la pantalla de Entrevistas es la de Agentes Externos — exactamente lo esperado.",
    "✅ Los intentos de acceso forzado a pantallas no autorizadas son bloqueados por el sistema.",
    "✅ El historial muestra únicamente las entrevistas del tipo correcto y del usuario correcto.",
    "✅ La sesión del Agente Externo tiene el nivel de permisos más bajo y restringido — correcto y seguro.",
    "📌 Recomendación: El perfil de Agente Externo está correctamente configurado. Las restricciones de seguridad funcionan según lo diseñado.",
  ],
});

console.log("\n🎉 ¡Todos los informes Word generados exitosamente!\n");
console.log("Archivos creados:");
console.log("  📄 INFORME_PRUEBAS_GENERAL.docx");
console.log("  📄 INFORME_PRUEBAS_ROL1_2_SUPERUSUARIO.docx");
console.log("  📄 INFORME_PRUEBAS_ROL3_4_CAMPO_FUNCIONARIO.docx");
console.log("  📄 INFORME_PRUEBAS_ROL5_AGENTE_EXTERNO.docx");
