"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

export const ZONAS = [
  {
    id: "A",
    nombre: "Zona A",
    precio: 1050,
    ubicacion: "Ubicación al frente",
    badge: "/badges/zona_a.png",
  },
  {
    id: "B",
    nombre: "Zona B",
    precio: 750,
    ubicacion: "Ubicación media",
    badge: "/badges/zona_b.png",
  },
  {
    id: "C",
    nombre: "Zona C",
    precio: 500,
    ubicacion: "Ubicación trasera",
    badge: "/badges/zona_c.png",
  },
] as const;

export type ZonaId = (typeof ZONAS)[number]["id"];

function elegirZona(zona: ZonaId) {
  window.dispatchEvent(new CustomEvent("select-zone", { detail: zona }));
  document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" });
}

const BANDAS: { id: ZonaId; y: number; etiqueta: string }[] = [
  { id: "A", y: 150, etiqueta: "Zona A" },
  { id: "B", y: 90, etiqueta: "Zona B" },
  { id: "C", y: 30, etiqueta: "Zona C" },
];

function VenueDiagram({
  hovered,
  setHovered,
}: {
  hovered: ZonaId | null;
  setHovered: (z: ZonaId | null) => void;
}) {
  return (
    <svg
      viewBox="0 0 320 270"
      role="img"
      aria-label="Diagrama del recinto con las zonas A al frente, B en medio y C atrás"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <text
        x="160"
        y="254"
        textAnchor="middle"
        fill="var(--text-dim)"
        fontSize="33"
        letterSpacing="2"
      >
        ESCENARIO
      </text>
      <rect x="70" y="208" width="180" height="8" rx="3" fill="var(--accent)" />
      {BANDAS.map((banda) => {
        const activa = hovered === banda.id;
        const apagada = hovered !== null && !activa;
        return (
          <g
            key={banda.id}
            onMouseEnter={() => setHovered(banda.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => elegirZona(banda.id)}
            style={{ cursor: "pointer", transition: "opacity 0.25s ease" }}
            opacity={apagada ? 0.35 : 1}
          >
            <rect
              x="20"
              y={banda.y}
              width="280"
              height="52"
              rx="8"
              fill={activa ? "var(--accent)" : "rgba(13,118,87,0.12)"}
              stroke="var(--accent)"
              strokeWidth={activa ? 0 : 1}
              style={{ transition: "fill 0.25s ease" }}
            />
            <text
              x="160"
              y={banda.y + 31}
              textAnchor="middle"
              fontSize="15"
              fontWeight="600"
              fill={activa ? "#ffffff" : "var(--accent)"}
              style={{ transition: "fill 0.25s ease", pointerEvents: "none" }}
            >
              {banda.etiqueta}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function TicketsSection() {
  const [hovered, setHovered] = useState<ZonaId | null>(null);
  const infoBannerRef = useRef<HTMLDivElement>(null);

  const moverSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = infoBannerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="boletos"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <FadeIn>
        <h2
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.9rem, 4vw, 3rem)",
            marginBottom: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          Zonas y boletos
        </h2>
      </FadeIn>

      <div className="tickets-layout">
        <FadeIn index={0}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              boxShadow: "var(--card-shadow)",
              padding: "1.6rem",
            }}
          >
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Elige tu zona en el mapa
            </p>
            <VenueDiagram hovered={hovered} setHovered={setHovered} />
          </div>
        </FadeIn>

        <div className="tickets-cards">
          {ZONAS.map((zona, i) => (
            <FadeIn key={zona.id} index={i + 1}>
              <motion.div
                className="ticket-card"
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
                }}
                transition={{ duration: 0.25 }}
                onMouseEnter={() => setHovered(zona.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  boxShadow: "var(--card-shadow)",
                  padding: "1.6rem",
                  height: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "1.3rem",
                }}
              >
                <img
                  src={zona.badge}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.35rem",
                    }}
                  >
                    {zona.nombre}
                  </h3>
                  <p
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                    }}
                  >
                    ${zona.precio.toLocaleString("es-MX")}{" "}
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 400,
                        color: "var(--text-dim)",
                      }}
                    >
                      MXN
                    </span>
                  </p>
                  <p
                    style={{
                      color: "var(--text-body)",
                      fontWeight: 300,
                      fontSize: "0.92rem",
                    }}
                  >
                    {zona.ubicacion}
                  </p>
                </div>
                <button
                  className="ticket-card-button"
                  onClick={() => elegirZona(zona.id)}
                  style={{
                    background: "transparent",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    borderRadius: "4px",
                    padding: "0.7rem 1.1rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "background 0.25s ease, color 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                >
                  Elegir esta zona
                </button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      <FadeIn index={4}>
        <div
          ref={infoBannerRef}
          onMouseMove={moverSpotlight}
          className="tickets-info-banner"
        >
          <p className="tickets-info-text">
            Incluye acceso al foro inmobiliario, recorrido por la zona de
            stands y patrocinadores, zona de networking y pláticas de
            nuestros ponentes VIP!
          </p>
          <div className="tickets-info-stats">
            <p className="tickets-info-cupo">Cupo limitado a 650 personas</p>
            <p className="tickets-info-cierre">
              Cierre de boletos 10 de Octubre.
            </p>
          </div>
        </div>
      </FadeIn>

      <style>{`
        .tickets-layout {
          display: grid;
          grid-template-columns: 2fr 3fr;
          gap: 1.4rem;
          align-items: start;
        }
        .tickets-cards {
          display: grid;
          gap: 1.1rem;
        }
        @media (max-width: 768px) {
          .tickets-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .ticket-card-button {
            width: 100%;
          }
        }
        .tickets-info-banner {
          position: relative;
          overflow: hidden;
          background: var(--accent);
          border-radius: 12px;
          padding: clamp(1.8rem, 4vw, 2.8rem);
          margin-top: 2.2rem;
          --mx: 50%;
          --my: 50%;
        }
        .tickets-info-banner::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle 280px at var(--mx) var(--my),
            rgba(255, 255, 255, 0.16),
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .tickets-info-banner:hover::before {
          opacity: 1;
        }
        .tickets-info-text {
          position: relative;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 300;
          line-height: 1.7;
        }
        .tickets-info-stats {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.5rem, 4vw, 3rem);
          margin-top: 1.6rem;
        }
        .tickets-info-cupo {
          color: #ffffff;
          font-weight: 700;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
        }
        .tickets-info-cierre {
          color: rgba(255, 255, 255, 0.92);
          font-weight: 600;
          align-self: flex-end;
        }
      `}</style>
    </section>
  );
}
