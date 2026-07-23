"use client";

import { useEffect, useState } from "react";
import FadeIn from "./FadeIn";
import { ZONAS, type ZonaId } from "./TicketsSection";

const WHATSAPP_EVENTO = "524492287481";
const TITULAR_CUENTA =
  "Asociación Mexicana de Profesionales Inmobiliarios Sección Ciudad de Aguascalientes AC";
const BANCO = "INBURSA";
const NUMERO_CUENTA = "50034698982";
const CLABE_BANCARIA = "036010500346989828";

// Lada de México para WhatsApp: 52 (país) + 1 (requerido por el formato
// de WhatsApp para números mexicanos). Ajustar aquí si el requisito cambia.
const LADA_MEXICO = "521";

const MAX_BOLETOS = 10;

type FormState = {
  nombre: string;
  correo: string;
  ladaTipo: "MX" | "OTRO";
  ladaManual: string;
  whatsapp: string;
  empresa: string;
  cargo: string;
  zona: ZonaId;
  cantidadBoletos: number;
  asistentes: string[];
};

const INITIAL: FormState = {
  nombre: "",
  correo: "",
  ladaTipo: "MX",
  ladaManual: "",
  whatsapp: "",
  empresa: "",
  cargo: "",
  zona: "A",
  cantidadBoletos: 1,
  asistentes: [],
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#ffffff",
  border: "1px solid var(--border-subtle)",
  borderRadius: "4px",
  padding: "0.9rem 1rem",
  color: "var(--text-primary)",
  fontSize: "1rem",
  fontFamily: "inherit",
  fontWeight: 300,
  boxShadow: "var(--card-shadow)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.45rem",
  fontSize: "0.9rem",
  color: "var(--text-body)",
  fontWeight: 400,
};

const errorStyle: React.CSSProperties = {
  color: "var(--accent-hover)",
  fontSize: "0.85rem",
  marginTop: "0.4rem",
};

export default function RegistrationSection() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errores, setErrores] = useState<Partial<Record<keyof FormState, string>>>({});
  const [erroresAsistentes, setErroresAsistentes] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const zona = (e as CustomEvent).detail as ZonaId;
      if (zona === "A" || zona === "B" || zona === "C") {
        setForm((f) => ({ ...f, zona }));
      }
    };
    window.addEventListener("select-zone", handler);
    return () => window.removeEventListener("select-zone", handler);
  }, []);

  const zonaElegida = ZONAS.find((z) => z.id === form.zona) ?? ZONAS[0];
  const precioTotal = zonaElegida.precio * form.cantidadBoletos;

  const set = (campo: "nombre" | "correo" | "whatsapp" | "empresa" | "cargo" | "zona" | "ladaManual") =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  const cambiarLadaTipo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor: "MX" | "OTRO" = e.target.value === "OTRO" ? "OTRO" : "MX";
    setForm((f) => ({ ...f, ladaTipo: valor }));
  };

  const cambiarCantidad = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cantidad = Math.min(MAX_BOLETOS, Math.max(1, Number(e.target.value) || 1));
    setForm((f) => ({
      ...f,
      cantidadBoletos: cantidad,
      asistentes: Array.from({ length: cantidad - 1 }, (_, i) => f.asistentes[i] ?? ""),
    }));
  };

  const cambiarAsistente = (indice: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setForm((f) => {
      const copia = [...f.asistentes];
      copia[indice] = valor;
      return { ...f, asistentes: copia };
    });
  };

  const ladaCompleta =
    form.ladaTipo === "MX" ? LADA_MEXICO : form.ladaManual.replace(/\D/g, "");
  const whatsappCompleto = `${ladaCompleta}${form.whatsapp.replace(/\D/g, "")}`;

  const validar = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) errs.nombre = "Escribe tu nombre completo";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim()))
      errs.correo = "Escribe un correo válido";

    const numero = form.whatsapp.replace(/\D/g, "");
    if (form.ladaTipo === "MX") {
      if (!/^\d{10}$/.test(numero)) errs.whatsapp = "Escribe un WhatsApp de 10 dígitos";
    } else {
      if (!form.ladaManual.replace(/\D/g, "")) errs.ladaManual = "Escribe el código de país";
      if (!numero) errs.whatsapp = "Escribe tu número de WhatsApp";
    }

    if (!form.empresa.trim()) errs.empresa = "Escribe tu empresa";

    const nuevosErroresAsistentes = form.asistentes.map((n) =>
      !n.trim() ? "Escribe el nombre del asistente" : ""
    );
    setErroresAsistentes(nuevosErroresAsistentes);

    setErrores(errs);
    return Object.keys(errs).length === 0 && nuevosErroresAsistentes.every((e) => !e);
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEnvio("");
    if (!validar()) return;
    setEnviando(true);
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          whatsapp: whatsappCompleto,
          empresa: form.empresa,
          cargo: form.cargo,
          zona: form.zona,
          cantidadBoletos: form.cantidadBoletos,
          asistentes: form.asistentes,
        }),
      });
      if (!res.ok) throw new Error("Respuesta no exitosa");
      setConfirmado(true);
    } catch {
      setErrorEnvio(
        "No pudimos guardar tu registro. Intenta de nuevo en un momento."
      );
    } finally {
      setEnviando(false);
    }
  };

  const mensajeWhatsApp = encodeURIComponent(
    `Hola, me acabo de registrar al Foro Bajío 2026, zona ${zonaElegida.id}, ${form.cantidadBoletos} boletos, adjunto mi comprobante de pago.`
  );

  return (
    <div id="registro" style={{ position: "relative", overflow: "hidden" }}>
      <img
        src="/CerroDelMuerto.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "auto",
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 6rem)",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
      <FadeIn>
        <h2
          style={{
            fontFamily: "var(--font-heading), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.9rem, 4vw, 3rem)",
            marginBottom: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          {confirmado ? "Registro recibido" : "Regístrate al foro"}
        </h2>
      </FadeIn>

      {!confirmado ? (
        <FadeIn index={1}>
          <form onSubmit={enviar} noValidate style={{ display: "grid", gap: "1.4rem" }}>
            <div>
              <label htmlFor="nombre" style={labelStyle}>
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                onChange={set("nombre")}
                style={inputStyle}
                autoComplete="name"
              />
              {errores.nombre && <p style={errorStyle}>{errores.nombre}</p>}
            </div>
            <div>
              <label htmlFor="correo" style={labelStyle}>
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={form.correo}
                onChange={set("correo")}
                style={inputStyle}
                autoComplete="email"
              />
              {errores.correo && <p style={errorStyle}>{errores.correo}</p>}
            </div>
            <div>
              <label htmlFor="whatsapp" style={labelStyle}>
                WhatsApp
              </label>
              <div className="reg-whatsapp-row">
                <select
                  aria-label="Código de país"
                  value={form.ladaTipo}
                  onChange={cambiarLadaTipo}
                  className="reg-lada-select"
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  <option value="MX">México (+52)</option>
                  <option value="OTRO">Otro</option>
                </select>
                {form.ladaTipo === "OTRO" && (
                  <input
                    aria-label="Código de país manual"
                    type="tel"
                    inputMode="numeric"
                    placeholder="Código"
                    value={form.ladaManual}
                    onChange={set("ladaManual")}
                    className="reg-lada-manual"
                    style={inputStyle}
                  />
                )}
                <input
                  id="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  value={form.whatsapp}
                  onChange={set("whatsapp")}
                  style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                  autoComplete="tel-national"
                  placeholder={form.ladaTipo === "MX" ? "10 dígitos" : "Número"}
                />
              </div>
              {errores.ladaManual && <p style={errorStyle}>{errores.ladaManual}</p>}
              {errores.whatsapp && <p style={errorStyle}>{errores.whatsapp}</p>}
            </div>
            <div>
              <label htmlFor="empresa" style={labelStyle}>
                Empresa
              </label>
              <input
                id="empresa"
                type="text"
                value={form.empresa}
                onChange={set("empresa")}
                style={inputStyle}
                autoComplete="organization"
              />
              {errores.empresa && <p style={errorStyle}>{errores.empresa}</p>}
            </div>
            <div>
              <label htmlFor="cargo" style={labelStyle}>
                Cargo (opcional)
              </label>
              <input
                id="cargo"
                type="text"
                value={form.cargo}
                onChange={set("cargo")}
                style={inputStyle}
                autoComplete="organization-title"
              />
            </div>
            <div className="reg-zona-cantidad-row">
              <div>
                <label htmlFor="zona" style={labelStyle}>
                  Haz clic aquí para elegir tu zona
                </label>
                <select
                  id="zona"
                  value={form.zona}
                  onChange={set("zona")}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  {ZONAS.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nombre}, ${z.precio.toLocaleString("es-MX")} MXN ({z.ubicacion.toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cantidad" style={labelStyle}>
                  Cantidad de boletos
                </label>
                <select
                  id="cantidad"
                  value={form.cantidadBoletos}
                  onChange={cambiarCantidad}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                >
                  {Array.from({ length: MAX_BOLETOS }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.asistentes.length > 0 && (
              <div style={{ display: "grid", gap: "1.4rem" }}>
                {form.asistentes.map((nombreAsistente, i) => (
                  <div key={i}>
                    <label htmlFor={`asistente-${i}`} style={labelStyle}>
                      Nombre del asistente {i + 2}
                    </label>
                    <input
                      id={`asistente-${i}`}
                      type="text"
                      value={nombreAsistente}
                      onChange={cambiarAsistente(i)}
                      style={inputStyle}
                    />
                    {erroresAsistentes[i] && <p style={errorStyle}>{erroresAsistentes[i]}</p>}
                  </div>
                ))}
              </div>
            )}

            {errorEnvio && (
              <p style={{ color: "var(--accent-hover)", fontSize: "0.95rem" }}>
                {errorEnvio}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando}
              style={{
                background: "var(--accent)",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "1rem 2rem",
                fontSize: "1.05rem",
                fontWeight: 600,
                cursor: enviando ? "wait" : "pointer",
                fontFamily: "inherit",
                opacity: enviando ? 0.7 : 1,
                transition: "background 0.25s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--accent-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent)")
              }
            >
              {enviando ? "Enviando..." : "Completar registro"}
            </button>
          </form>
        </FadeIn>
      ) : (
        <div style={{ display: "grid", gap: "1.6rem" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              boxShadow: "var(--card-shadow)",
              padding: "1.8rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.4rem",
                marginBottom: "0.8rem",
              }}
            >
              Tu selección
            </h3>
            <p style={{ color: "var(--text-body)", fontWeight: 300, lineHeight: 1.7 }}>
              {zonaElegida.nombre} ({zonaElegida.ubicacion.toLowerCase()})
            </p>
            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "var(--accent-hover)",
                marginTop: "0.4rem",
              }}
            >
              ${precioTotal.toLocaleString("es-MX")} MXN
            </p>
            {form.cantidadBoletos > 1 && (
              <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.2rem" }}>
                {form.cantidadBoletos} boletos x ${zonaElegida.precio.toLocaleString("es-MX")} MXN
              </p>
            )}
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              boxShadow: "var(--card-shadow)",
              padding: "1.8rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.4rem",
                marginBottom: "0.8rem",
              }}
            >
              Transferencia SPEI
            </h3>
            <p style={{ color: "var(--text-body)", fontWeight: 300, lineHeight: 1.9 }}>
              Titular: {TITULAR_CUENTA}
              <br />
              Banco: {BANCO}
              <br />
              Número de cuenta: {NUMERO_CUENTA}
              <br />
              CLABE interbancaria: {CLABE_BANCARIA}
              <br />
              <strong>
                Envía tu comprobante (captura de pantalla) de la
                transferencia por WhatsApp.
              </strong>
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_EVENTO}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--accent)",
              color: "#ffffff",
              borderRadius: "4px",
              padding: "1rem 2rem",
              fontSize: "1.05rem",
              fontWeight: 600,
              textAlign: "center",
              textDecoration: "none",
              transition: "background 0.25s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            Enviar comprobante por WhatsApp
          </a>
          <p style={{ color: "var(--text-dim)", fontWeight: 300, fontSize: "0.92rem", lineHeight: 1.6 }}>
            Una vez validado tu pago recibirás tu acceso con código QR por
            correo y WhatsApp.
          </p>
        </div>
      )}
      </section>

      <style>{`
        .reg-whatsapp-row {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .reg-lada-select {
          flex: 0 0 auto;
          width: auto;
        }
        .reg-lada-manual {
          flex: 0 0 90px;
          width: 90px;
        }
        .reg-zona-cantidad-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 560px) {
          .reg-zona-cantidad-row {
            grid-template-columns: 1fr;
          }
          .reg-lada-select {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
}
