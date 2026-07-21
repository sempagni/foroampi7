export default function LogosSection() {
  return (
    <section
      style={{
        background: "#134537",
        padding: "clamp(1.5rem, 3vw, 2.5rem) 1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="/LogosForo.svg"
        alt="1er Foro Regional Inmobiliario, Región 7 Centro, sede 2026 Aguascalientes"
        style={{
          width: "min(420px, 80vw)",
          height: "auto",
        }}
      />
    </section>
  );
}
