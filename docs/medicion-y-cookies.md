# Medición y cookies

Qué mide este sitio, cuándo lo mide y qué se revisó para confirmarlo.
Última revisión: 14 de septiembre de 2026.

## Lo que está instalado

**Meta Pixel, ID `2059038554718235`.** Es el único script de medición o
publicidad del sitio. Vive en `app/components/MetaPixel.tsx`.

### Eventos que manda

| Evento | Cuándo se dispara | Dónde |
|---|---|---|
| `PageView` | Una vez, al montarse el componente del pixel, o sea en cuanto la persona acepta cookies y en cada carga de página posterior mientras el consentimiento siga en "aceptado". | `MetaPixel.tsx` |

**No manda ningún otro evento.** En particular no manda `Lead` al completar el
registro ni `Purchase` al confirmarse un pago. Vale la pena saberlo antes de
la próxima campaña: hoy Meta Ads sólo ve visitas, así que no puede optimizar
hacia quien de verdad se registra ni atribuir registros a un anuncio. Agregar
esos eventos es una decisión pendiente, no un olvido de esta revisión.

### Cuándo carga

Nunca antes del consentimiento. El componente devuelve `null` mientras la
persona no haya dado clic en "Aceptar", así que el `<script>` ni siquiera
llega al DOM y no se contacta a `connect.facebook.net`.

Antes de este cambio el pixel estaba escrito directo en `layout.tsx` y corría
en cuanto cargaba cualquier página, sin preguntar nada. También había un
`<img>` dentro de `<noscript>` que medía a quien navegara sin JavaScript; se
eliminó, porque sin JavaScript no hay forma de preguntarle nada a esa persona.

Al dar clic en "Rechazar" se borran además las cookies `_fbp` y `_fbc` que
Meta haya dejado en el dominio, para que arrepentirse sirva de algo. Lo que no
se puede borrar desde aquí son los datos que Meta ya haya recibido en sus
servidores.

## Lo que NO está instalado

Se buscó en todo el código (`app/`, `scripts/`, `next.config.ts`,
`package.json`) y no hay rastro de: Google Analytics, Google Tag Manager,
gtag, Hotjar, Microsoft Clarity, Mixpanel, Segment, Amplitude, Matomo,
Plausible, Fathom, ni pixeles de TikTok, LinkedIn, X, Snapchat o Pinterest.
No apareció ningún tracker que no supiéramos que estaba ahí.

Las tipografías tampoco filtran nada: `next/font/google` las descarga cuando
se compila el sitio y las sirve desde nuestro dominio, así que el navegador
de quien visita nunca contacta a Google Fonts.

## Terceros que sí contactan al navegador

**YouTube, en `VenueVideoSection.tsx`.** El video del recinto se carga en
cuanto abre la portada, con autoplay, y eso ocurre sin importar lo que la
persona haya respondido en el aviso de cookies.

Está embebido con `youtube-nocookie.com`, el modo de privacidad reforzada de
YouTube, que no pone cookies de publicidad hasta que el video se reproduce.
Pero el video arranca solo, así que en la práctica sí se reproduce, y de ahí
en adelante Google recibe la visita y guarda datos en el navegador.

**Esto sigue igual que antes: no se cambió.** Dejarlo tal cual, cargar el
video sólo después de aceptar cookies, o quitarle el autoplay y poner una
carátula que cargue el video al primer clic, son tres caminos posibles y la
decisión es del cliente. Hay que tenerlo en cuenta porque la Política de
Cookies que se publicó sólo menciona a Meta, no a Google.

## Cómo verificarlo

Con el sitio corriendo, en la consola del navegador:

```js
// Sin haber aceptado: debe decir "undefined" y no listar facebook
typeof window.fbq
performance.getEntriesByType('resource').map(r => r.name).filter(n => n.includes('facebook'))

// Ver qué dominios de terceros se contactaron
new Set(performance.getEntriesByType('resource')
  .map(r => new URL(r.name).hostname)
  .filter(h => h !== location.hostname))

// Volver a ver el banner
localStorage.removeItem('foro-bajio-2026-consentimiento-cookies'); location.reload()
```

Se comprobó así el 14 de septiembre de 2026: sin aceptar, `fbq` es
`undefined`, cero peticiones a Facebook y el único tercero es
`youtube-nocookie.com`. Al aceptar, carga `fbevents.js` y sale un `PageView`
hacia `facebook.com/tr/`. Al rechazar, no carga nada y `_fbp` desaparece.

## Limitación conocida

El consentimiento se guarda en `localStorage`, o sea por navegador y por
dispositivo, y no queda un registro auditable de quién aceptó y cuándo. El
detalle está comentado en `app/components/consent.ts`.
