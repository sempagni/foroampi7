"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  EVENTO_CONSENTIMIENTO,
  leerConsentimiento,
  type Consentimiento,
} from "./consent";

const PIXEL_ID = "2059038554718235";

export default function MetaPixel() {
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    // Antes este script se inyectaba directo en layout.tsx y se ejecutaba en
    // cuanto cargaba la página, sin preguntar nada. Ahora sólo se monta si la
    // persona ya aceptó, y el <Script> ni siquiera llega al DOM mientras no
    // lo haya hecho, así que no se contacta a connect.facebook.net.
    setActivo(leerConsentimiento() === "aceptado");

    const alDecidir = (e: Event) => {
      const valor = (e as CustomEvent).detail as Consentimiento;
      setActivo(valor === "aceptado");
    };
    window.addEventListener(EVENTO_CONSENTIMIENTO, alDecidir);
    return () => window.removeEventListener(EVENTO_CONSENTIMIENTO, alDecidir);
  }, []);

  // Rechazar después de haber aceptado deja de mandar eventos nuevos, pero no
  // borra las cookies que Meta ya haya puesto en este navegador. Para eso hay
  // que limpiarlas desde la configuración del navegador, como dice la Política
  // de Cookies.
  if (!activo) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');`}
    </Script>
  );
}
