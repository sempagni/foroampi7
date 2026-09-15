"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { hash: "#ponentes", label: "Ponentes" },
  { hash: "#boletos", label: "Boletos" },
  { hash: "#registro", label: "Registro" },
];

function irA(hash: string, e: React.MouseEvent) {
  e.preventDefault();
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
}

function irArriba(e: React.MouseEvent) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Navbar() {
  // Las secciones del foro solo existen en la portada. Desde las páginas
  // legales el scroll suave no tiene a dónde ir, así que ahí los enlaces
  // navegan a "/#seccion" en vez de intentar hacer scroll en la página actual.
  const enPortada = usePathname() === "/";

  return (
    <nav className="site-nav">
      {enPortada ? (
        <a href="#" onClick={irArriba} className="site-nav-logo">
          <img src="/LOGO_AMPI.png" alt="AMPI Aguascalientes, ir al inicio" />
        </a>
      ) : (
        <Link href="/" className="site-nav-logo">
          <img src="/LOGO_AMPI.png" alt="AMPI Aguascalientes, ir al inicio" />
        </Link>
      )}

      <div className="site-nav-links">
        {ENLACES.map((link) =>
          enPortada ? (
            <a
              key={link.hash}
              href={link.hash}
              onClick={(e) => irA(link.hash, e)}
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.hash} href={`/${link.hash}`}>
              {link.label}
            </Link>
          )
        )}
      </div>

      <style>{`
        .site-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.6rem 1.5rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }
        .site-nav-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .site-nav-logo img {
          height: 32px;
          width: auto;
        }
        .site-nav-links {
          display: flex;
          justify-content: center;
          flex: 1;
          gap: clamp(1.2rem, 4vw, 3rem);
        }
        .site-nav-links a {
          color: var(--text-primary);
          font-family: var(--font-heading), sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .site-nav-links a:hover {
          color: var(--accent);
        }
        @media (max-width: 480px) {
          .site-nav-links {
            gap: 1rem;
          }
          .site-nav-links a {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </nav>
  );
}
