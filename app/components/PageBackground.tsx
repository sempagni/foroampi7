export default function PageBackground() {
  return (
    <img
      src="/background.jpg"
      alt=""
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        zIndex: -2,
        /* Al 50% esta foto bajaba el fondo de la página hasta #c4c7c0 en sus
           zonas más oscuras, y ahí el verde y los grises del sitio ya no
           alcanzaban el contraste de WCAG AA. Al 25% el fondo nunca baja de
           #d8d9d6 y la textura de nubes se sigue viendo. */
        opacity: 0.25,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}
