// Estado del consentimiento de cookies, compartido entre el banner
// (CookieConsent) y los scripts de medición (MetaPixel).
//
// LIMITACIÓN IMPORTANTE: la decisión se guarda en localStorage, o sea en el
// navegador de cada persona, no en el servidor. Consecuencias:
//   - Es por navegador y por dispositivo. Quien acepte en su celular vuelve a
//     ver el banner si entra desde la computadora.
//   - Si borra los datos del sitio, usa modo incógnito, o cambia de navegador,
//     el banner reaparece y la medición queda apagada hasta que acepte otra vez.
//   - No queda un registro auditable de quién aceptó y cuándo. Si algún día se
//     necesita demostrar el consentimiento ante una autoridad, hay que
//     guardarlo también del lado del servidor, junto con fecha y hora.
// Para el alcance de este sitio (un evento de un día) es suficiente.

export const CLAVE_CONSENTIMIENTO = "foro-bajio-2026-consentimiento-cookies";

export type Consentimiento = "aceptado" | "rechazado";

// Único canal entre el banner y los scripts de medición, igual que el
// CustomEvent "select-zone" que ya usan TicketsSection y RegistrationSection.
export const EVENTO_CONSENTIMIENTO = "cookie-consent";

export function leerConsentimiento(): Consentimiento | null {
  // localStorage lanza excepción en Safari en modo privado y cuando el
  // navegador tiene bloqueado el almacenamiento del sitio. Ante la duda se
  // trata como "todavía no decide", que deja la medición apagada.
  try {
    const valor = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return valor === "aceptado" || valor === "rechazado" ? valor : null;
  } catch {
    return null;
  }
}

// Cookies que pone fbevents.js en nuestro propio dominio: _fbp identifica al
// navegador y _fbc guarda el clic del anuncio que trajo a la persona. Al ser
// de primera parte, se pueden borrar desde aquí. Sin esto, quien acepta y
// luego se arrepiente se queda con el identificador puesto: dejamos de mandar
// eventos, pero la cookie sigue ahí.
function borrarCookiesDeMeta() {
  const dominio = window.location.hostname;
  for (const nombre of ["_fbp", "_fbc"]) {
    for (const ambito of ["", `; domain=${dominio}`, `; domain=.${dominio}`]) {
      document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${ambito}`;
    }
  }
}

export function guardarConsentimiento(valor: Consentimiento) {
  try {
    window.localStorage.setItem(CLAVE_CONSENTIMIENTO, valor);
  } catch {
    // Si no se puede guardar, la elección vale para esta visita y el banner
    // volverá a aparecer en la siguiente. Preferible a romper la página.
  }
  if (valor === "rechazado") borrarCookiesDeMeta();
  window.dispatchEvent(
    new CustomEvent(EVENTO_CONSENTIMIENTO, { detail: valor })
  );
}
