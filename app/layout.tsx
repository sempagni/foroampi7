import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import MountainWatermark from "./components/MountainWatermark";
import PageBackground from "./components/PageBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieConsent from "./components/CookieConsent";
import MetaPixel from "./components/MetaPixel";

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
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {/* El banner va primero en el DOM a propósito: así es de los primeros
            destinos al tabular, en vez de quedar detrás de toda la página aun
            estando fijo abajo en pantalla. */}
        <CookieConsent />
        {/* Sólo se monta si ya hay consentimiento. Se quitó también el <noscript>
            del pixel: sin JavaScript no hay forma de preguntar, y ese <img>
            medía a la persona sin haberle dado a elegir. */}
        <MetaPixel />
        <PageBackground />
        <MountainWatermark />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
