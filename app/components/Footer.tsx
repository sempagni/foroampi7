import Link from "next/link";

const ENLACES_LEGALES = [
  { href: "/aviso-privacidad", label: "Aviso de Privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
  { href: "/politica-de-cookies", label: "Política de Cookies" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Decorativa: es el mismo cerro que el watermark del sitio y no aporta
          información que el texto no tenga. Con alt="" el lector de pantalla
          la salta en vez de describir una foto sin relevancia. */}
      <img src="/CerroFooter.png" alt="" aria-hidden="true" className="site-footer-cerro" />

      <nav className="site-footer-legal" aria-label="Enlaces legales">
        {ENLACES_LEGALES.map((enlace) => (
          <Link key={enlace.href} href={enlace.href}>
            {enlace.label}
          </Link>
        ))}
      </nav>

      <p className="site-footer-creditos">
        AMPI Aguascalientes, Asociación Mexicana de Profesionales Inmobiliarios,
        Región 7 Centro
      </p>

      <style>{`
        .site-footer {
          width: 100%;
          padding-top: clamp(3rem, 8vw, 6rem);
          padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
        }
        .site-footer-cerro {
          display: block;
          width: 100%;
          height: auto;
        }
        .site-footer-legal {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: clamp(1rem, 4vw, 2.5rem);
          padding: clamp(1.6rem, 4vw, 2.4rem) clamp(1.5rem, 6vw, 6rem) 0;
        }
        .site-footer-legal a {
          color: var(--accent-text);
          font-size: 0.92rem;
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s ease;
        }
        .site-footer-legal a:hover {
          color: var(--accent-hover);
        }
        .site-footer-creditos {
          text-align: center;
          color: var(--text-dim);
          font-size: 0.85rem;
          font-weight: 400;
          line-height: 1.6;
          max-width: 46ch;
          margin: 1.2rem auto 0;
          padding: 0 clamp(1.5rem, 6vw, 6rem);
        }
      `}</style>
    </footer>
  );
}
