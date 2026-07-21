"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

const PUNTOS = [
  "Panorama económico e inmobiliario del Bajío hacia 2026",
  "Cómo generar alianzas estratégicas que impulsen el crecimiento del mercado",
  "El impacto del asesor inmobiliario en la atracción de inversión y el desarrollo económico",
  "Herramientas para identificar nuevas oportunidades de negocio y aumentar tu competitividad",
  "Casos de éxito y mejores prácticas del sector",
];

export default function AboutSection() {
  const [index, setIndex] = useState(0);
  const total = PUNTOS.length;

  const avanzar = () => setIndex((i) => (i + 1) % total);

  const irA = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex(i);
  };

  return (
    <section
      style={{
        padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 6vw, 6rem)",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <FadeIn>
        <motion.div
          className="book"
          role="button"
          tabIndex={0}
          aria-label="Toca para ver el siguiente punto de qué vas a aprender"
          onClick={avanzar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              avanzar();
            }
          }}
          whileHover={{ boxShadow: "0 12px 36px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.25 }}
        >
          <div className="book-page book-page-left">
            <h2 className="book-title">Qué vas a aprender</h2>
            <div className="book-index-row">
              <span className="book-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="book-total">/ {String(total).padStart(2, "0")}</span>
            </div>
            <div className="book-dots">
              {PUNTOS.map((_, i) => (
                <span
                  key={i}
                  className={"book-dot" + (i === index ? " book-dot-active" : "")}
                  onClick={(e) => irA(i, e)}
                  role="button"
                  aria-label={`Ir al punto ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="book-page book-page-right">
            <div className="book-flip-stage">
              <p key={index} className="book-content" aria-live="polite">
                {PUNTOS[index]}
              </p>
            </div>
            <span className="book-hint">Toca para continuar →</span>
          </div>
        </motion.div>
      </FadeIn>

      <style>{`
        .book {
          position: relative;
          display: flex;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          background: #ffffff;
          cursor: pointer;
          min-height: clamp(260px, 32vw, 340px);
        }
        .book::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 38%;
          width: 24px;
          margin-left: -12px;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.1) 50%,
            rgba(0, 0, 0, 0.05)
          );
          pointer-events: none;
          z-index: 2;
        }
        .book-page {
          position: relative;
          padding: clamp(1.6rem, 3.4vw, 2.6rem);
        }
        .book-page-left {
          flex: 0 0 38%;
          background: rgba(13, 118, 87, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .book-title {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 2.8vw, 2rem);
          line-height: 1.15;
          color: var(--text-primary);
        }
        .book-index-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin-top: 1.2rem;
        }
        .book-index {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          color: var(--accent);
          line-height: 1;
        }
        .book-total {
          color: var(--text-dim);
          font-size: 1rem;
        }
        .book-dots {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.2rem;
        }
        .book-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-subtle);
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .book-dot-active {
          background: var(--accent);
          transform: scale(1.25);
        }
        .book-page-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          perspective: 1200px;
          background: var(--accent);
        }
        .book-flip-stage {
          overflow: hidden;
        }
        .book-content {
          color: #ffffff;
          font-weight: 300;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.6;
          max-width: 42ch;
          animation: bookContentIn 0.4s cubic-bezier(0.25, 0, 0, 1);
        }
        @keyframes bookContentIn {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .book-hint {
          position: absolute;
          bottom: clamp(1rem, 2vw, 1.5rem);
          right: clamp(1.6rem, 3.4vw, 2.6rem);
          color: #ffffff;
          font-size: 0.85rem;
          opacity: 0.6;
          transition: opacity 0.25s ease;
        }
        .book:hover .book-hint {
          opacity: 1;
        }
        @media (max-width: 768px) {
          .book {
            flex-direction: column;
            min-height: 0;
          }
          .book::before {
            display: none;
          }
          .book-page-left {
            flex: none;
            border-bottom: 1px solid var(--border-subtle);
          }
          .book-page-right {
            padding-top: 1.6rem;
            padding-bottom: 2.6rem;
          }
          .book-hint {
            position: static;
            display: block;
            margin-top: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
