import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Términos y Condiciones, Foro Regional Inmobiliario Bajío 2026",
  description:
    "Condiciones de compra de boletos, reembolsos y acceso al Foro Regional Inmobiliario Bajío 2026.",
};

export default function TerminosYCondiciones() {
  return (
    <LegalPage titulo="Términos y Condiciones">
      <p>
        Estos términos aplican a la compra de boletos para el Foro Regional
        Inmobiliario Bajío 2026, organizado por AMPI Aguascalientes, a
        realizarse el 16 de octubre de 2026 en el Centro de Convenciones Isla
        San Marcos, Aguascalientes.
      </p>

      <h2>Boletos y zonas</h2>
      <p>
        El evento tiene tres zonas de boleto: Zona A ($1,050 MXN), Zona B ($750
        MXN) y Zona C ($500 MXN). El precio, ubicación y beneficios de cada zona
        se describen en el sitio al momento de la compra. El aforo total del
        recinto es de 650 personas, por lo que la disponibilidad de boletos está
        sujeta a existencia.
      </p>

      <h2>Proceso de compra y pago</h2>
      <p>
        El pago se realiza por transferencia SPEI o depósito en efectivo en OXXO
        a la cuenta de AMPI Aguascalientes en Inbursa. Una vez realizado el
        pago, debes enviar tu comprobante por WhatsApp al número +521 449 227
        1310 siguiendo las instrucciones del sitio. Tu compra queda confirmada
        hasta que el equipo de AMPI Aguascalientes valida el comprobante, no en
        el momento en que lo envías.
      </p>
      <p>
        Tu código QR y credencial de acceso te llegarán por WhatsApp o correo
        electrónico una vez validado el pago. Es tu responsabilidad revisar que
        el correo y el número de WhatsApp que registraste estén correctos, ya
        que AMPI Aguascalientes no se hace responsable por credenciales no
        entregadas debido a datos de contacto incorrectos.
      </p>

      <h2>Reembolsos y cambios</h2>
      <p>
        No se hacen reembolsos una vez validado el pago, salvo cancelación del
        evento por parte de AMPI Aguascalientes, en cuyo caso se reembolsará el
        cien por ciento del monto pagado.
      </p>
      <p>
        AMPI Aguascalientes se reserva el derecho de modificar la fecha, el
        horario, el recinto o el programa de ponentes del evento por causas de
        fuerza mayor o ajenas a su control, y lo comunicará a los compradores
        por WhatsApp o correo con la mayor anticipación posible.
      </p>

      <h2>Acceso al evento</h2>
      <p>
        El acceso al recinto se realiza únicamente mediante el código QR y la
        credencial entregados. Cada credencial es válida para una sola entrada y
        corresponde a una persona; AMPI Aguascalientes puede solicitar una
        identificación oficial para verificar la titularidad del boleto.
      </p>

      <h2>Uso de imagen</h2>
      <p>
        Al asistir al evento aceptas que AMPI Aguascalientes pueda tomar
        fotografías y video durante el foro con fines de difusión y promoción de
        futuras ediciones, en redes sociales y en el sitio del evento. Si no
        deseas aparecer en este material, puedes indicarlo al personal de
        logística el día del evento.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        AMPI Aguascalientes no se hace responsable por objetos personales
        extraviados dentro del recinto, ni por gastos de traslado, hospedaje o
        cualquier otro gasto en el que incurra el asistente para llegar al
        evento. El contenido de las ponencias es responsabilidad de cada ponente
        y no representa necesariamente la postura de AMPI Aguascalientes.
      </p>

      <h2>Aceptación</h2>
      <p>
        Al comprar un boleto aceptas estos Términos y Condiciones y el{" "}
        <Link href="/aviso-privacidad">Aviso de Privacidad</Link>. Cualquier
        controversia relacionada con la compra de boletos se resolverá conforme
        a las leyes aplicables en el estado de Aguascalientes, México.
      </p>
    </LegalPage>
  );
}
