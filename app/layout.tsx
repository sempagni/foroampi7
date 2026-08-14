import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MountainWatermark from "./components/MountainWatermark";
import PageBackground from "./components/PageBackground";
import Navbar from "./components/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Foro Regional Inmobiliario Bajío 2026, AMPI Aguascalientes",
  description:
    "1er Foro Regional Inmobiliario, Región 7 Centro. San Luis Potosí, Aguascalientes y Zacatecas. Sede 2026: Aguascalientes.",
};

// El sitio es de tema claro únicamente. Sin esto, algunos navegadores
// (sobre todo Chrome en Android) fuerzan un "modo oscuro" automático
// sobre sitios que no lo declaran, mostrando el fondo gris en vez de blanco.
export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable} ${montserrat.variable}`}>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2059038554718235');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2059038554718235&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <PageBackground />
        <MountainWatermark />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
