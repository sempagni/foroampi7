export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        paddingTop: "clamp(3rem, 8vw, 6rem)",
        paddingBottom: "clamp(1rem, 3vw, 2rem)",
      }}
    >
      <img
        src="/CerroFooter.png"
        alt="Silueta del Cerro del Muerto sobre la ciudad de Aguascalientes"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
      />
    </footer>
  );
}
