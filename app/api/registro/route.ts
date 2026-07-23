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

function generarIdCompra(): string {
  const marca = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const aleatorio = Math.floor(1000 + Math.random() * 9000);
  return `${marca}${aleatorio}`;
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
      (zona !== "A" && zona !== "B" && zona !== "C") ||
      !Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_BOLETOS ||
      !asistentesValidos
    ) {
      return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
    }

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
    fs.writeFileSync(archivo, buffer);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
