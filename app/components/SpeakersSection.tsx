"use client";

import Image from "next/image";
import FadeIn from "./FadeIn";

export default function SpeakersSection() {
  return (
    <section
      style={{
        padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)",
        maxWidth: "1200px",
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
          Ponentes
        </h2>
      </FadeIn>
      <div className="speakers-grid">
        <FadeIn index={0}>
          <div
            className="speaker-card-main"
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              boxShadow: "var(--card-shadow)",
              overflow: "hidden",
              height: "100%",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "0 0 42%",
                minHeight: "280px",
              }}
            >
              <Image
                src="/TonyHanna.jpeg"
                alt="Tony Hanna, El Tiburón Inmobiliario, ponente principal del foro"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div
              className="speaker-info"
              style={{
                background: "var(--accent)",
                padding: "clamp(1.8rem, 3.5vw, 2.8rem)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "0.8rem",
                }}
              >
                Ponente principal
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                  marginBottom: "0.5rem",
                  color: "#ffffff",
                }}
              >
                Tony Hanna
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 300,
                  fontSize: "1.15rem",
                }}
              >
                El Tiburón Inmobiliario
              </p>
            </div>
          </div>
        </FadeIn>
        <FadeIn index={1}>
          <div
            style={{
              background: "#ffffff",
              border: "1px dashed var(--border-subtle)",
              borderRadius: "8px",
              boxShadow: "var(--card-shadow)",
              padding: "clamp(2rem, 4vw, 3rem)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              minHeight: "280px",
              gap: "0.7rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display), serif",
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
                fontSize: "1.5rem",
              }}
            >
              Más ponentes por anunciar
            </h3>
            <p
              style={{
                color: "var(--text-dim)",
                fontWeight: 300,
                fontSize: "0.98rem",
              }}
            >
              Muy pronto revelaremos al resto del cartel
            </p>
          </div>
        </FadeIn>
      </div>
      <style>{`
        .speakers-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 1.4rem;
        }
        .speaker-info {
          justify-content: flex-end;
        }
        @media (min-width: 769px) {
          .speaker-info {
            flex: 1;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .speakers-grid {
            grid-template-columns: 1fr;
          }
          .speaker-card-main {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
