"use client";

const ENLACES = [
  { href: "#ponentes", label: "Ponentes" },
  { href: "#boletos", label: "Boletos" },
  { href: "#registro", label: "Registro" },
];

function irA(href: string, e: React.MouseEvent) {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

function irArriba(e: React.MouseEvent) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Navbar() {
  return (
    <nav className="site-nav">
      <a href="#" onClick={irArriba} className="site-nav-logo">
        <img src="/LOGO_AMPI.png" alt="AMPI Aguascalientes" />
      </a>

      <div className="site-nav-links">
        {ENLACES.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => irA(link.href, e)}
          >
            {link.label}
          </a>
        ))}
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
