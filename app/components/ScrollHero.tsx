"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const FRAME_COUNT = 121;
const SCROLL_LENGTH_VH = 400;

function framePath(index: number) {
  return `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;
}

function scrollToRegistro() {
  document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" });
}

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let lastFrame = -1;

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i);
      images.push(img);
    }
    imagesRef.current = images;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height - viewportH;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * (FRAME_COUNT - 1))
      );

      setShowFloating(rect.bottom < viewportH * 0.5);

      const dpr = window.devicePixelRatio || 1;
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        lastFrame = -1;
      }

      if (frameIndex === lastFrame) return;
      const img = imagesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      lastFrame = frameIndex;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (cssW - drawW) / 2;
      const dy = (cssH - drawH) / 2;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{ height: `${SCROLL_LENGTH_VH}vh`, position: "relative" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                background: "#ffffff",
              }}
            />

            <img
              src="/LOGO_AMPI.png"
              alt="AMPI Aguascalientes"
              className="hero-logo"
              style={{
                position: "absolute",
                zIndex: 3,
                height: "auto",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 8%, rgba(255,255,255,0.05) 18%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            className="hero-overlay"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              flexShrink: 0,
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
              style={{
                color: "var(--accent)",
                fontSize: "0.85rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: "var(--hero-gap-label, 1rem)",
              }}
            >
              Región 7 Centro, San Luis Potosí, Aguascalientes, Zacatecas
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2.4rem, 6vw, 5.5rem)",
                lineHeight: 1.05,
                maxWidth: "18ch",
                marginBottom: "var(--hero-gap-title, 1rem)",
                color: "var(--text-primary)",
              }}
            >
              Foro Regional Inmobiliario Bajío 2026
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: "easeOut" }}
              style={{
                color: "var(--text-body)",
                fontWeight: 300,
                fontSize: "clamp(1.05rem, 2vw, 1.4rem)",
                marginBottom: "var(--hero-gap-p, 1.8rem)",
              }}
            >
              Impulsando el PIB del Sector Inmobiliario
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.7, ease: "easeOut" }}
              onClick={scrollToRegistro}
              style={{
                background: "var(--accent)",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "var(--hero-gap-btn-y, 1rem) 2.2rem",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--accent-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent)")
              }
            >
              Regístrate aquí
            </motion.button>
          </div>
        </div>
      </div>

      <motion.button
        onClick={scrollToRegistro}
        initial={false}
        animate={{
          opacity: showFloating ? 1 : 0,
          y: showFloating ? 0 : 16,
          pointerEvents: showFloating ? "auto" : "none",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "fixed",
          right: "1.5rem",
          bottom: "1.5rem",
          zIndex: 50,
          background: "var(--accent)",
          color: "#ffffff",
          border: "none",
          borderRadius: "999px",
          padding: "0.9rem 1.8rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
          transition: "background 0.25s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--accent-hover)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
      >
        Regístrate aquí
      </motion.button>

      <style>{`
        .hero-logo {
          top: 32px;
          right: 32px;
          width: 120px;
        }
        .hero-overlay {
          padding: 1rem clamp(1.5rem, 5vw, 4.5rem) 5vh;
        }
        @media (max-width: 768px) {
          .hero-logo {
            top: 20px;
            right: 20px;
            width: 80px;
          }
          .hero-overlay {
            padding-bottom: 3.5vh;
          }
        }
        /* Escritorio: bloque de texto más compacto para dejar más alto
           disponible al área de la animación, sin tocar la versión móvil. */
        @media (min-width: 769px) {
          .hero-overlay {
            padding-top: 0.4rem;
            padding-bottom: 1.5vh;
            --hero-gap-label: 0.5rem;
            --hero-gap-title: 0.5rem;
            --hero-gap-p: 0.8rem;
            --hero-gap-btn-y: 0.7rem;
          }
        }
      `}</style>
    </>
  );
}
