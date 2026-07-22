"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import FadeIn from "./FadeIn";

const PONENTES = [
  {
    nombre: "Tony Hanna",
    rol: "Ponente principal",
    descripcion: "El Tiburón Inmobiliario",
    foto: "/TonyHanna.jpeg",
  },
  {
    nombre: "Mario Granillo",
    rol: "Ponente",
    descripcion: "Head of Growth, MICA",
    foto: "/MarioGranillo.jpeg",
  },
];

const VELOCIDAD_PX_POR_SEG = 40;

function SpeakerCard({
  nombre,
  rol,
  descripcion,
  foto,
}: (typeof PONENTES)[number]) {
  return (
    <div
      className="speaker-card"
      style={{
        background: "#ffffff",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        boxShadow: "var(--card-shadow)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", height: "220px" }}>
        <Image
          src={foto}
          alt={`${nombre}, ${descripcion}, ponente del foro`}
          fill
          sizes="320px"
          draggable={false}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          background: "var(--accent)",
          padding: "1.6rem",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.75rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: "0.6rem",
            display: "block",
          }}
        >
          {rol}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "1.5rem",
            marginBottom: "0.3rem",
            color: "#ffffff",
          }}
        >
          {nombre}
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: 300,
            fontSize: "1rem",
          }}
        >
          {descripcion}
        </p>
      </div>
    </div>
  );
}

function ProximamenteCard() {
  return (
    <div
      className="speaker-card"
      style={{
        background: "#ffffff",
        border: "1px dashed var(--border-subtle)",
        borderRadius: "8px",
        boxShadow: "var(--card-shadow)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        gap: "0.7rem",
        height: "324px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-heading), sans-serif",
          fontSize: "2.2rem",
          color: "var(--accent)",
        }}
      >
        ?
      </span>
      <h3
        style={{
          fontFamily: "var(--font-heading), sans-serif",
          fontWeight: 700,
          fontSize: "1.4rem",
        }}
      >
        Pronto revelaremos a otro ponente estrella
      </h3>
    </div>
  );
}

export default function SpeakersSection() {
  const tarjetas = [...PONENTES];
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const track = trackRef.current;
    if (!marquee || !track) return;

    let mitadAncho = track.scrollWidth / 2;
    let distancia = 0;
    let pausado = false;
    let arrastrando = false;
    let inicioPunteroX = 0;
    let inicioDistancia = 0;
    let ultimoTimestamp = 0;
    let rafId = 0;

    const envolver = (valor: number) =>
      ((valor % mitadAncho) + mitadAncho) % mitadAncho;

    const aplicar = () => {
      track.style.transform = `translateX(${-distancia}px)`;
    };

    const tick = (timestamp: number) => {
      rafId = requestAnimationFrame(tick);
      if (!ultimoTimestamp) ultimoTimestamp = timestamp;
      const delta = (timestamp - ultimoTimestamp) / 1000;
      ultimoTimestamp = timestamp;

      if (!pausado && !arrastrando) {
        distancia = envolver(distancia + VELOCIDAD_PX_POR_SEG * delta);
        aplicar();
      }
    };

    const onPointerEnter = () => {
      pausado = true;
    };
    const onPointerLeave = () => {
      pausado = false;
      if (arrastrando) {
        arrastrando = false;
        marquee.classList.remove("is-dragging");
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      arrastrando = true;
      inicioPunteroX = e.clientX;
      inicioDistancia = distancia;
      marquee.classList.add("is-dragging");
      marquee.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!arrastrando) return;
      const delta = e.clientX - inicioPunteroX;
      distancia = envolver(inicioDistancia - delta);
      aplicar();
    };
    const finalizarArrastre = (e: PointerEvent) => {
      if (!arrastrando) return;
      arrastrando = false;
      marquee.classList.remove("is-dragging");
      try {
        marquee.releasePointerCapture(e.pointerId);
      } catch {
        // el puntero ya pudo haberse liberado
      }
    };

    const onResize = () => {
      mitadAncho = track.scrollWidth / 2;
      distancia = envolver(distancia);
    };

    marquee.addEventListener("mouseenter", onPointerEnter);
    marquee.addEventListener("mouseleave", onPointerLeave);
    marquee.addEventListener("pointerdown", onPointerDown);
    marquee.addEventListener("pointermove", onPointerMove);
    marquee.addEventListener("pointerup", finalizarArrastre);
    marquee.addEventListener("pointercancel", finalizarArrastre);
    marquee.addEventListener("dragstart", (e) => e.preventDefault());
    window.addEventListener("resize", onResize);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      marquee.removeEventListener("mouseenter", onPointerEnter);
      marquee.removeEventListener("mouseleave", onPointerLeave);
      marquee.removeEventListener("pointerdown", onPointerDown);
      marquee.removeEventListener("pointermove", onPointerMove);
      marquee.removeEventListener("pointerup", finalizarArrastre);
      marquee.removeEventListener("pointercancel", finalizarArrastre);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="ponentes"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) 0",
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
            padding: "0 clamp(1.5rem, 6vw, 6rem)",
          }}
        >
          Ponentes
        </h2>
      </FadeIn>

      <div className="speakers-marquee" ref={marqueeRef}>
        <div className="speakers-track" ref={trackRef}>
          {tarjetas.map((p, i) => (
            <SpeakerCard key={`a-${i}`} {...p} />
          ))}
          <ProximamenteCard key="a-proximamente" />
          {tarjetas.map((p, i) => (
            <SpeakerCard key={`b-${i}`} {...p} />
          ))}
          <ProximamenteCard key="b-proximamente" />
        </div>
      </div>

      <style>{`
        .speakers-marquee {
          overflow: hidden;
          padding: 10px 0;
          cursor: grab;
          touch-action: pan-y;
          mask-image: linear-gradient(
            to right,
            transparent,
            #000 5%,
            #000 95%,
            transparent
          );
        }
        .speakers-marquee.is-dragging {
          cursor: grabbing;
        }
        .speakers-track {
          display: flex;
          width: max-content;
          gap: 1.4rem;
          will-change: transform;
        }
        .speaker-card {
          flex: 0 0 auto;
          width: min(85vw, 320px);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .speakers-marquee:not(.is-dragging) .speaker-card:hover {
          transform: scale(1.06);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
          z-index: 1;
          position: relative;
        }
      `}</style>
    </section>
  );
}
