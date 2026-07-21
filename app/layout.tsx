import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import MountainWatermark from "./components/MountainWatermark";
import PageBackground from "./components/PageBackground";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable} ${montserrat.variable}`}>
        <PageBackground />
        <MountainWatermark />
        {children}
      </body>
    </html>
  );
}
