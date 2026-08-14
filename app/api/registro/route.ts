import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export const runtime = "nodejs";

const EXPORT_DIR = path.join(process.cwd(), "data", "exports");
const MAX_BOLETOS = 10;

// Supuesto a confirmar: la fecha del archivo se calcula en zona horaria
// America/Mexico_City sin importar dónde corra el servidor.
function fechaHoy(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

// La marca del id se arma en America/Mexico_City, igual que fechaHoy(). Con
// toISOString() (UTC) un registro de la tarde en México cae al día siguiente y
// el id_compra terminaba contradiciendo el nombre del archivo que lo contiene.
function generarIdCompra(): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const v = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "";
  const marca = `${v("year")}${v("month")}${v("day")}${v("hour")}${v("minute")}${v("second")}`;
  const aleatorio = Math.floor(1000 + Math.random() * 9000);
  return `${marca}${aleatorio}`;
}

// El endpoint lee el xlsx completo, le agrega filas y lo reescribe. Dos POST
// simultáneos leían la misma versión y el segundo sobrescribía al primero,
// perdiendo un registro sin dejar rastro. Encadenamos las escrituras para que
// cada una vea el archivo ya actualizado por la anterior.
// Nota: esto sólo serializa dentro de un mismo proceso de Node. Si algún día
// el sitio corre en varias instancias haría falta un lock de archivo real.
let cola: Promise<unknown> = Promise.resolve();

function enCola<T>(tarea: () => T): Promise<T> {
  const resultado = cola.then(tarea, tarea);
  cola = resultado.catch(() => undefined);
  return resultado;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, whatsapp, empresa, cargo, zona, cantidadBoletos, asistentes } =
      body ?? {};

    const cantidad = Number(cantidadBoletos);
    const asistentesValidos =
      cantidad <= 1 ||
      (Array.isArray(asistentes) &&
        asistentes.length === cantidad - 1 &&
        asistentes.every((n: unknown) => typeof n === "string" && n.trim()));

    if (
      typeof nombre !== "string" || !nombre.trim() ||
      typeof correo !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ||
      typeof whatsapp !== "string" || !/^\d{5,20}$/.test(whatsapp) ||
      typeof empresa !== "string" || !empresa.trim() ||
      typeof cargo !== "string" || !cargo.trim() ||
      (zona !== "A" && zona !== "B" && zona !== "C") ||
      !Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_BOLETOS ||
      !asistentesValidos
    ) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

    await enCola(() => {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
      const archivo = path.join(EXPORT_DIR, `registros_${fechaHoy()}.xlsx`);

      let registros: Record<string, unknown>[] = [];
      if (fs.existsSync(archivo)) {
        const libro = XLSX.read(fs.readFileSync(archivo), { type: "buffer" });
        const hoja = libro.Sheets[libro.SheetNames[0]];
        registros = XLSX.utils.sheet_to_json(hoja);
      }

      const fechaYHora = new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date());

      const idCompra = generarIdCompra();
      const nombresPorBoleto = [
        nombre.trim(),
        ...(cantidad > 1 ? (asistentes as string[]).map((n) => n.trim()) : []),
      ];

      for (let i = 0; i < cantidad; i++) {
        registros.push({
          "Fecha y hora": fechaYHora,
          Nombre: nombresPorBoleto[i],
          Correo: correo.trim(),
          WhatsApp: whatsapp,
          Empresa: empresa.trim(),
          Cargo: typeof cargo === "string" ? cargo.trim() : "",
          Zona: zona,
          id_compra: idCompra,
          boleto_numero: `${i + 1} de ${cantidad}`,
        });
      }

      const hojaNueva = XLSX.utils.json_to_sheet(registros);
      const libroNuevo = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libroNuevo, hojaNueva, "Registros");
      const buffer = XLSX.write(libroNuevo, { type: "buffer", bookType: "xlsx" });

      // Escritura atómica: si el proceso muere a media escritura, el .xlsx
      // original queda intacto en vez de truncado.
      const temporal = `${archivo}.tmp`;
      fs.writeFileSync(temporal, buffer);
      fs.renameSync(temporal, archivo);
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
