import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso de Privacidad, Foro Regional Inmobiliario Bajío 2026",
  description:
    "Cómo AMPI Aguascalientes trata los datos personales de quienes se registran al Foro Regional Inmobiliario Bajío 2026.",
};

export default function AvisoPrivacidad() {
  return (
    <LegalPage titulo="Aviso de Privacidad">
      <p>
        AMPI Aguascalientes (Asociación Mexicana de Profesionales Inmobiliarios,
        Región 7 Centro), con domicilio en Miguel Hidalgo 104, Int 11, Col.
        Centro, Aguascalientes, Aguascalientes, y RFC AMPI30305PM2, es
        responsable del tratamiento de tus datos personales conforme a la Ley
        Federal de Protección de Datos Personales en Posesión de los
        Particulares.
      </p>

      <h2>Datos que recabamos</h2>
      <p>
        Cuando te registras o compras un boleto para el Foro Regional
        Inmobiliario Bajío 2026 recabamos:
      </p>
      <p>
        Nombre completo del comprador y de cada asistente incluido en la compra,
        correo electrónico, número de teléfono (WhatsApp), comprobante de pago
        (transferencia SPEI o depósito OXXO), y de forma automática, datos de
        navegación en el sitio (dirección IP, tipo de dispositivo, páginas
        visitadas) a través de cookies.
      </p>
      <p>
        No solicitamos ni almacenamos datos bancarios completos: el pago se
        realiza directamente a la cuenta bancaria de AMPI Aguascalientes y tú
        solo nos compartes el comprobante para validarlo.
      </p>

      <h2>Para qué usamos tus datos</h2>
      <p>
        Usamos tus datos para: gestionar tu registro y la compra de tu boleto,
        validar tu pago, generar y enviarte tu código QR y credencial de acceso
        al evento, comunicarnos contigo por WhatsApp o correo sobre tu compra o
        cambios en el evento, y llevar un control administrativo interno del
        aforo.
      </p>
      <p>
        De manera adicional y opcional, si no te opones, podemos usar tu correo
        o los datos de navegación del sitio para enviarte información sobre
        futuras ediciones del foro o actividades de AMPI Aguascalientes, y para
        medir el desempeño de nuestras campañas de publicidad en redes sociales
        (Meta Ads). Puedes oponerte a este uso adicional en cualquier momento
        escribiendo a aguascalientes@ampi.org sin que esto afecte tu registro al
        evento.
      </p>

      <h2>Con quién compartimos tus datos</h2>
      <p>
        Compartimos tus datos únicamente con: el equipo de sistemas que genera y
        entrega los códigos QR y credenciales, el contador que valida los pagos,
        el proveedor de hospedaje del sitio (Hostinger) y, si aceptas cookies de
        publicidad, con Meta (Facebook/Instagram) para medición de campañas. No
        vendemos ni rentamos tus datos a terceros.
      </p>

      <h2>Tus derechos (ARCO)</h2>
      <p>
        Puedes acceder, rectificar o cancelar tus datos personales, así como
        oponerte al uso que les damos, escribiendo a aguascalientes@ampi.org.
        Indica tu nombre completo, el dato que quieres corregir o eliminar, y
        adjunta una identificación para confirmar que eres tú.
      </p>

      <h2>Cookies</h2>
      <p>
        Este sitio utiliza cookies. Consulta el detalle completo en nuestra{" "}
        <Link href="/politica-de-cookies">Política de Cookies</Link>.
      </p>

      <h2>Cambios a este aviso</h2>
      <p>
        Podemos actualizar este aviso cuando cambien nuestras prácticas de
        manejo de datos o por requerimiento legal. La fecha de la última
        actualización siempre aparece al inicio de este documento.
      </p>
    </LegalPage>
  );
}
