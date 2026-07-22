"use client";

import { useEffect, useState } from "react";
import FadeIn from "./FadeIn";

// Hora confirmada por el cliente: 8:00 hrs, hora de Aguascalientes
// (America/Mexico_City, UTC-6 todo el año).
const FECHA_EVENTO = new Date("2026-10-16T08:00:00-06:00");

type Restante = {
  meses: number;
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  terminado: boolean;
};

function calcularRestante(): Restante {
  const ahora = new Date();
  if (ahora >= FECHA_EVENTO) {
    return { meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };
  }

  let meses =
    (FECHA_EVENTO.getFullYear() - ahora.getFullYear()) * 12 +
    (FECHA_EVENTO.getMonth() - ahora.getMonth());

  let cursor = new Date(ahora);
  cursor.setMonth(cursor.getMonth() + meses);
  if (cursor > FECHA_EVENTO) {
    meses -= 1;
    cursor = new Date(ahora);
    cursor.setMonth(cursor.getMonth() + meses);
  }

  const msRestantes = FECHA_EVENTO.getTime() - cursor.getTime();
  const segundosTotales = Math.floor(msRestantes / 1000);
  const dias = Math.floor(segundosTotales / 86400);
  const horas = Math.floor((segundosTotales % 86400) / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;

  return { meses, dias, horas, minutos, segundos, terminado: false };
}

const UNIDADES = [
  { clave: "meses", etiqueta: "Meses" },
  { clave: "dias", etiqueta: "Días" },
  { clave: "horas", etiqueta: "Horas" },
  { clave: "minutos", etiqueta: "Minutos" },
  { clave: "segundos", etiqueta: "Segundos" },
] as const;

export default function CountdownSection() {
  const [restante, setRestante] = useState<Restante | null>(null);

  useEffect(() => {
    setRestante(calcularRestante());
    const id = setInterval(() => setRestante(calcularRestante()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 6vw, 6rem)",
        width: "100%",
      }}
    >
      <FadeIn>
        <h2
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.9rem, 4vw, 3rem)",
            marginBottom: "clamp(2rem, 5vw, 3.5rem)",
            textAlign: "center",
          }}
        >
          Te esperamos desde las 8:00 hasta las 19:00 hrs.
        </h2>
      </FadeIn>

      <FadeIn index={1}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            boxShadow: "var(--card-shadow)",
            padding: "clamp(1.8rem, 4vw, 3rem)",
          }}
        >
          {restante?.terminado ? (
            <p
              style={{
                textAlign: "center",
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                color: "var(--accent)",
              }}
            >
              ¡El foro ya está aquí!
            </p>
          ) : (
            <div className="countdown-grid">
              {UNIDADES.map((u) => (
                <div key={u.clave} className="countdown-unit">
                  <span className="countdown-number">
                    {restante ? String(restante[u.clave]).padStart(2, "0") : "--"}
                  </span>
                  <span className="countdown-label">{u.etiqueta}</span>
                </div>
              ))}
            </div>
          )}
          <p
            style={{
              textAlign: "center",
              color: "var(--text-dim)",
              fontWeight: 300,
              fontSize: "0.92rem",
              marginTop: "1.8rem",
            }}
          >
            16 de octubre de 2026, Centro de Convenciones Isla San Marcos,
            Aguascalientes
          </p>
        </div>
      </FadeIn>

      <style>{`
        .countdown-grid {
          display: flex;
          justify-content: center;
          gap: clamp(1.2rem, 4vw, 3rem);
        }
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 4.5rem;
        }
        .countdown-number {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: clamp(2.2rem, 6vw, 3.6rem);
          color: var(--accent);
          line-height: 1;
        }
        .countdown-label {
          margin-top: 0.6rem;
          color: var(--text-dim);
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        @media (max-width: 480px) {
          .countdown-grid {
            flex-wrap: wrap;
            row-gap: 1.4rem;
            column-gap: 1rem;
          }
          .countdown-unit {
            min-width: 5rem;
            flex: 0 0 auto;
          }
          .countdown-label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </section>
  );
}
