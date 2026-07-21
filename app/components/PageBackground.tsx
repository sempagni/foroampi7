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
        opacity: 0.5,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}
