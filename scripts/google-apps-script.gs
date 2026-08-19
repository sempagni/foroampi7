/**
 * Foro Bajío 2026, receptor de registros.
 *
 * Este código NO vive en el sitio: vive en Google, pegado dentro de tu hoja
 * de cálculo (Extensiones > Apps Script). El sitio le manda cada registro y
 * este archivo hace dos cosas:
 *   1. escribe una fila por boleto en la hoja
 *   2. te manda un correo con los datos, como respaldo
 *
 * Además responde con el padrón completo cuando el reporte se lo pide.
 *
 * Antes de publicar, cambia las dos líneas de abajo.
 */

// Inventa una contraseña larga, la que sea, y anótala: la vas a necesitar
// para configurar el sitio. Ejemplo: "foro2026-xK9mP2vL8qR4"
const SECRETO = "CAMBIA-ESTO-POR-TU-CONTRASENA";

// A dónde llega el aviso de cada registro nuevo.
const CORREO_AVISO = "CAMBIA-ESTO-POR-TU-CORREO";

const COLUMNAS = [
  "Fecha y hora",
  "Nombre",
  "Correo",
  "WhatsApp",
  "Empresa",
  "Cargo",
  "Zona",
  "id_compra",
  "boleto_numero",
];

function doPost(e) {
  try {
    const peticion = JSON.parse(e.postData.contents);

    if (peticion.secreto !== SECRETO) {
      return responder({ ok: false, error: "No autorizado" });
    }

    if (peticion.accion === "leer") {
      return responder({ ok: true, filas: leerTodo() });
    }

    const filas = Array.isArray(peticion.filas) ? peticion.filas : [];
    if (filas.length === 0) {
      return responder({ ok: false, error: "Sin filas" });
    }

    guardar(filas);
    avisarPorCorreo(filas);
    return responder({ ok: true, guardadas: filas.length });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  }
}

function hoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let h = libro.getSheetByName("Registros");
  if (!h) {
    h = libro.insertSheet("Registros");
  }
  // Encabezados en la primera fila, sólo si la hoja está vacía.
  if (h.getLastRow() === 0) {
    h.appendRow(COLUMNAS);
    h.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold");
    h.setFrozenRows(1);
  }
  return h;
}

function guardar(filas) {
  const h = hoja();
  // Un solo setValues en bloque: más rápido y evita que dos registros
  // simultáneos se pisen entre sí.
  const matriz = filas.map(function (f) {
    return COLUMNAS.map(function (c) {
      return f[c] === undefined || f[c] === null ? "" : String(f[c]);
    });
  });
  h.getRange(h.getLastRow() + 1, 1, matriz.length, COLUMNAS.length).setValues(matriz);
}

function leerTodo() {
  const h = hoja();
  const ultima = h.getLastRow();
  if (ultima < 2) return [];
  const valores = h.getRange(2, 1, ultima - 1, COLUMNAS.length).getValues();
  return valores.map(function (fila) {
    const obj = {};
    COLUMNAS.forEach(function (c, i) {
      obj[c] = fila[i] === null || fila[i] === undefined ? "" : String(fila[i]);
    });
    return obj;
  });
}

function avisarPorCorreo(filas) {
  if (!CORREO_AVISO || CORREO_AVISO.indexOf("@") === -1) return;

  const primera = filas[0];
  const cuantos = filas.length;
  const asunto =
    cuantos === 1
      ? "Nuevo registro al Foro: " + primera["Nombre"]
      : "Nuevo registro al Foro: " + primera["Nombre"] + " y " + (cuantos - 1) + " más";

  let cuerpo = "Se registró alguien nuevo en foroampiags.com.mx\n\n";
  cuerpo += "Fecha: " + primera["Fecha y hora"] + "\n";
  cuerpo += "Correo: " + primera["Correo"] + "\n";
  cuerpo += "WhatsApp: " + primera["WhatsApp"] + "\n";
  cuerpo += "Empresa: " + primera["Empresa"] + "\n";
  cuerpo += "Cargo: " + primera["Cargo"] + "\n";
  cuerpo += "Zona: " + primera["Zona"] + "\n";
  cuerpo += "Boletos: " + cuantos + "\n\n";
  cuerpo += "Asistentes:\n";
  filas.forEach(function (f, i) {
    cuerpo += "  " + (i + 1) + ". " + f["Nombre"] + "\n";
  });
  cuerpo += "\nNúmero de compra: " + primera["id_compra"] + "\n";
  cuerpo += "\nRecuerda que el pago llega aparte, por transferencia y comprobante por WhatsApp.\n";

  // Si el correo falla, no debe tumbar el guardado: la hoja ya tiene el dato.
  try {
    MailApp.sendEmail(CORREO_AVISO, asunto, cuerpo);
  } catch (err) {
    console.error("No se pudo enviar el aviso: " + err);
  }
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON
  );
}
