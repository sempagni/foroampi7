import Link from "next/link";
import type { ReactNode } from "react";

// Fecha de publicación de los tres documentos legales. Se declara una sola
// vez aquí para que las tres páginas muestren siempre lo mismo: si se cambia
// el contenido legal, hay que actualizar esta fecha.
export const FECHA_PUBLICACION = "14 de septiembre de 2026";

export default function LegalPage({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <main id="contenido" className="legal-page">
      <article className="legal-prose">
        <h1>{titulo}</h1>
        <p className="legal-fecha">
          Última actualización: {FECHA_PUBLICACION}
        </p>
        {children}
        <p className="legal-volver">
          <Link href="/">Volver al inicio del foro</Link>
        </p>
      </article>

      <style>{`
        .legal-page {
          /* El navbar es fixed (84px de alto con su padding), así que el
             contenido arranca por debajo para no quedar tapado. */
          padding: calc(84px + clamp(2rem, 6vw, 4rem)) clamp(1.5rem, 6vw, 6rem)
            clamp(3rem, 8vw, 6rem);
          max-width: 820px;
          margin: 0 auto;
        }
        .legal-prose {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          padding: clamp(1.8rem, 5vw, 3.5rem);
        }
        .legal-prose h1 {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          line-height: 1.15;
          color: var(--text-primary);
        }
        .legal-fecha {
          color: var(--text-dim);
          font-size: 0.92rem;
          margin-top: 0.6rem;
          margin-bottom: clamp(1.8rem, 4vw, 2.6rem);
        }
        .legal-prose h2 {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: clamp(1.2rem, 2.4vw, 1.5rem);
          color: var(--text-primary);
          margin-top: clamp(1.8rem, 4vw, 2.4rem);
          margin-bottom: 0.8rem;
        }
        .legal-prose p {
          color: var(--text-body);
          font-weight: 300;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .legal-prose strong {
          font-weight: 600;
          color: var(--text-primary);
        }
        .legal-prose a {
          color: var(--accent-text);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .legal-prose a:hover {
          color: var(--accent-hover);
        }
        .legal-volver {
          margin-top: clamp(2rem, 5vw, 3rem);
          padding-top: 1.4rem;
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </main>
  );
}
