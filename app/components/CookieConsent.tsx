"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { guardarConsentimiento, leerConsentimiento } from "./consent";

export default function CookieConsent() {
  // null mientras no sepamos qué decidió: en el servidor no hay localStorage,
  // así que el primer render no pinta nada y evitamos el desajuste de
  // hidratación. El banner aparece apenas corre el efecto en el navegador.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(leerConsentimiento() === null);
  }, []);

  if (!visible) return null;

  const decidir = (valor: "aceptado" | "rechazado") => {
    guardarConsentimiento(valor);
    setVisible(false);
  };

  return (
    <div
      className="cookie-banner"
      // region, no dialog: el banner no debe atrapar el foco ni impedir que
      // la persona siga navegando y leyendo el sitio mientras decide.
      role="region"
      aria-label="Aviso de cookies"
    >
      <p className="cookie-banner-texto">
        Usamos cookies para mejorar tu experiencia y medir nuestras campañas.
        Puedes leer más en nuestra{" "}
        <Link href="/politica-de-cookies">Política de Cookies</Link>
      </p>

      <div className="cookie-banner-botones">
        <button
          type="button"
          className="cookie-banner-rechazar"
          onClick={() => decidir("rechazado")}
        >
          Rechazar
        </button>
        <button
          type="button"
          className="cookie-banner-aceptar"
          onClick={() => decidir("aceptado")}
        >
          Aceptar
        </button>
      </div>

      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          /* Por encima del navbar (40), pero sin cubrir la pantalla: sólo
             ocupa la franja de abajo y el resto del sitio sigue usable. */
          z-index: 50;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(0.9rem, 3vw, 2rem);
          padding: clamp(1rem, 2.5vw, 1.4rem) clamp(1.2rem, 5vw, 3rem);
          background: #ffffff;
          border-top: 1px solid var(--border-subtle);
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
        }
        .cookie-banner-texto {
          color: var(--text-body);
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 62ch;
          flex: 1 1 320px;
        }
        .cookie-banner-texto a {
          color: var(--accent-text);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .cookie-banner-botones {
          display: flex;
          gap: 0.7rem;
          flex-shrink: 0;
        }
        .cookie-banner-aceptar,
        .cookie-banner-rechazar {
          border-radius: 4px;
          padding: 0.75rem 1.6rem;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .cookie-banner-aceptar {
          background: var(--accent);
          color: #ffffff;
          border: 1px solid var(--accent);
        }
        .cookie-banner-aceptar:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
        }
        .cookie-banner-rechazar {
          background: #ffffff;
          color: var(--accent-text);
          border: 1px solid var(--accent);
        }
        .cookie-banner-rechazar:hover {
          background: rgba(13, 118, 87, 0.08);
        }
        @media (max-width: 560px) {
          .cookie-banner-botones {
            width: 100%;
          }
          .cookie-banner-aceptar,
          .cookie-banner-rechazar {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
