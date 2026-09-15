import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies, Foro Regional Inmobiliario Bajío 2026",
  description:
    "Qué cookies usa el sitio del Foro Regional Inmobiliario Bajío 2026 y cómo controlarlas.",
};

export default function PoliticaDeCookies() {
  return (
    <LegalPage titulo="Política de Cookies">
      <p>
        Este sitio utiliza cookies, que son pequeños archivos que se guardan en
        tu navegador para que el sitio funcione correctamente y para entender
        cómo lo usas.
      </p>

      <h2>Tipos de cookies que usamos</h2>
      <p>
        Cookies necesarias: permiten que el sitio funcione (por ejemplo,
        recordar que ya aceptaste o rechazaste el uso de cookies, o mantener tu
        progreso al llenar el formulario de registro). No se pueden desactivar
        porque el sitio no funcionaría sin ellas.
      </p>
      <p>
        Cookies de medición y publicidad: usadas por Meta (Facebook e Instagram)
        para medir el desempeño de nuestras campañas de anuncios y mostrarte
        publicidad relacionada con el Foro Regional Inmobiliario Bajío 2026.
        Solo se activan si das tu consentimiento en el aviso de cookies del
        sitio.
      </p>

      <h2>Cómo controlar las cookies</h2>
      <p>
        Puedes aceptar o rechazar las cookies de medición y publicidad desde el
        aviso que aparece al entrar al sitio. También puedes borrar o bloquear
        cookies desde la configuración de tu navegador en cualquier momento; ten
        en cuenta que bloquear todas las cookies puede afectar el funcionamiento
        del formulario de registro.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tienes dudas sobre el uso de cookies en este sitio, escríbenos a
        aguascalientes@ampi.org.
      </p>
    </LegalPage>
  );
}
