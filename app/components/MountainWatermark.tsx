export default function MountainWatermark() {
  return (
    <img
      src="/CerroDelMuerto.svg"
      alt=""
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "auto",
        zIndex: -1,
        opacity: 0.06,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}
