"use client";

import { motion } from "framer-motion";

function scrollToRegistro() {
  document.getElementById("registro")?.scrollIntoView({ behavior: "smooth" });
}

const TITLE_GRADIENT =
  "linear-gradient(90deg, #0d2b25 0%, #14563f 30%, #1e9859 55%, #8fdb8a 78%, #eef8b8 100%)";

export default function HeroIntro() {
  return (
    <div className="hero-intro">
      <motion.img
        src="/LOGO_AMPI.png"
        alt="AMPI Aguascalientes"
        className="hero-intro-logo"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
      />

      <motion.button
        className="hero-intro-button"
        onClick={scrollToRegistro}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--accent-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--accent)")
        }
      >
        Regístrate aquí
      </motion.button>

      <motion.h1
        className="hero-intro-title"
        style={{
          backgroundImage: TITLE_GRADIENT,
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
      >
        Foro Regional
        <br />
        Inmobiliario
      </motion.h1>

      <motion.img
        src="/sello-foro.png"
        alt="1er Foro Regional Inmobiliario, Región 7 Centro, sede 2026 Aguascalientes"
        className="hero-intro-seal"
        initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
      />

      <motion.p
        className="hero-intro-subtitle"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      >
        Aguascalientes, San Luis Potosí, Zacatecas y Matehuala
      </motion.p>

      <style>{`
        .hero-intro {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: clamp(0.8rem, 2vw, 1.3rem);
          padding: clamp(2rem, 6vh, 4rem) 1.5rem;
        }
        .hero-intro-logo {
          width: clamp(180px, 24vw, 280px);
          height: auto;
        }
        .hero-intro-title {
          font-family: var(--font-display), serif;
          text-transform: uppercase;
          font-weight: 700;
          line-height: 1.08;
          font-size: clamp(2.6rem, 7vw, 5.8rem);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }
        .hero-intro-seal {
          width: clamp(160px, 26vw, 260px);
          height: auto;
          border-radius: 50%;
          clip-path: circle(50%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
        }
        .hero-intro-subtitle {
          color: var(--accent);
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          max-width: 40ch;
        }
        .hero-intro-button {
          background: var(--accent);
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 1.25rem 2.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.25s ease;
        }
      `}</style>
    </div>
  );
}
