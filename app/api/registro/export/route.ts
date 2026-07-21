import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

const EXPORT_DIR = path.join(process.cwd(), "data", "exports");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const key = searchParams.get("key");

  const accessKey = process.env.EXPORT_ACCESS_KEY;
  if (!accessKey || key !== accessKey) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Fecha inválida, usa AAAA-MM-DD" }, { status: 400 });
  }

  const archivo = path.join(EXPORT_DIR, `registros_${date}.xlsx`);
  if (!fs.existsSync(archivo)) {
    return NextResponse.json({ ok: false, error: "No hay registros para esa fecha" }, { status: 404 });
  }

  const contenido = fs.readFileSync(archivo);
  return new NextResponse(contenido, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="registros_${date}.xlsx"`,
    },
  });
}
