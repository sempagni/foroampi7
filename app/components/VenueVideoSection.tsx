"use client";

import { useEffect, useRef } from "react";
import FadeIn from "./FadeIn";

const YOUTUBE_VIDEO_ID = "xEMJTg6fSlE";
const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";

export default function VenueVideoSection() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const silenciar = () => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "mute", args: [] }),
        YOUTUBE_ORIGIN
      );
    };

    iframe.addEventListener("load", silenciar);
    const timeoutId = setTimeout(silenciar, 1000);

    return () => {
      iframe.removeEventListener("load", silenciar);
      clearTimeout(timeoutId);
    };
  }, []);

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
            textAlign: "center",
          }}
        >
          Conoce el recinto
        </h2>
      </FadeIn>

      <FadeIn index={1}>
        <div className="venue-video-wrapper">
          <iframe
            ref={iframeRef}
            src={`${YOUTUBE_ORIGIN}/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="Centro de Convenciones Isla San Marcos, Aguascalientes"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </FadeIn>

      <FadeIn index={2}>
        <p className="venue-video-caption">
          16 de octubre de 2026, Centro de Convenciones Isla San Marcos,
          Aguascalientes
        </p>
      </FadeIn>

      <style>{`
        .venue-video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--card-shadow);
          background: #000000;
        }
        .venue-video-wrapper iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        .venue-video-caption {
          text-align: center;
          color: var(--text-dim);
          font-weight: 300;
          font-size: 0.92rem;
          margin-top: 1.6rem;
        }
      `}</style>
    </section>
  );
}
