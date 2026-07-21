"use client";

import FadeIn from "./FadeIn";

const PASOS = [
  "Llena el formulario con tus datos y elige tu zona",
  "Realiza tu pago por transferencia SPEI o depósito directo en OXXO",
  "Envía tu comprobante (foto o captura) al WhatsApp del evento",
  "Recibe tu acceso con código QR por correo y WhatsApp una vez validado tu pago",
];

export default function ProcessSection() {
  return (
    <section
      style={{
        padding: "clamp(3rem, 7vw, 5rem) clamp(1.5rem, 6vw, 6rem)",
        maxWidth: "1100px",
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
          Cómo funciona el registro
        </h2>
      </FadeIn>

      <div className="process-strip">
        {PASOS.map((paso, i) => (
          <FadeIn key={paso} index={i} style={{ flex: 1 }}>
            <div className="process-step">
              <span className="process-number">{i + 1}</span>
              <p className="process-text">{paso}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <style>{`
        .process-strip {
          display: flex;
          align-items: flex-start;
        }
        .process-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 1.2rem;
        }
        .process-step:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 22px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--border-subtle);
          z-index: 0;
        }
        .process-number {
          position: relative;
          z-index: 1;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 50%;
          background: transparent;
          border: 2px solid transparent;
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: 1.3rem;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .process-number:hover {
          background: #ffffff;
          border-color: var(--accent);
        }
        .process-text {
          margin-top: 1rem;
          color: var(--text-body);
          font-weight: 300;
          font-size: 0.98rem;
          line-height: 1.55;
          max-width: 22ch;
        }
        @media (max-width: 768px) {
          .process-strip {
            flex-direction: column;
          }
          .process-step {
            flex-direction: row;
            align-items: flex-start;
            text-align: left;
            width: 100%;
            padding: 0 0 2rem;
          }
          .process-step:last-child {
            padding-bottom: 0;
          }
          .process-step:not(:last-child)::after {
            top: 44px;
            left: 22px;
            width: 2px;
            height: calc(100% - 20px);
          }
          .process-text {
            margin-top: 0;
            margin-left: 1.2rem;
            max-width: none;
            padding-top: 0.6rem;
          }
        }
      `}</style>
    </section>
  );
}
