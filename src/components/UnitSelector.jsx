import { useState } from "react";
import { COLORS, FONT, ROLES } from "../constants";

const UNITS = [
  { id: "aflitos", name: "Unidade Aflitos",    subtitle: "Náutico dos Aflitos · Recife – PE",      initials: "AF" },
  { id: "prime",   name: "Unidade Prime Vida", subtitle: "Jaboatão dos Guararapes – PE",            initials: "PV" },
];

export default function UnitSelector({ currentUser, onSelect, onLogout }) {
  const role = ROLES[currentUser?.role] || ROLES.professor;
  const [hover, setHover] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.slate50, fontFamily: FONT, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "white", padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: `1px solid ${COLORS.slate200}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: COLORS.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>AF</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.slate900 }}>AcquaFlow</div>
            <div style={{ fontSize: 11, color: COLORS.slate500 }}>Gestão de Natação</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.slate900 }}>{currentUser?.name}</div>
            <div style={{ fontSize: 11, color: COLORS.slate500 }}>{role.label}</div>
          </div>
          <button onClick={onLogout} style={{
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.slate200}`,
            background: "white", cursor: "pointer", fontSize: 13, color: COLORS.slate700, fontFamily: FONT,
          }}>
            Sair
          </button>
        </div>
      </header>

      {/* Cards */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.slate900, margin: 0, letterSpacing: "-0.5px" }}>
            Selecione a Unidade
          </h1>
          <p style={{ fontSize: 14, color: COLORS.slate500, margin: "6px 0 0" }}>
            Escolha qual unidade deseja gerenciar
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {UNITS.map((u) => (
            <div
              key={u.id}
              onClick={() => onSelect(u.id)}
              onMouseEnter={() => setHover(u.id)}
              onMouseLeave={() => setHover(null)}
              style={{
                width: 280, borderRadius: 12, cursor: "pointer",
                background: "white",
                border: `1px solid ${hover === u.id ? COLORS.accent : COLORS.slate200}`,
                boxShadow: hover === u.id ? "0 8px 24px rgba(49,130,206,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
                transform: hover === u.id ? "translateY(-3px)" : "none",
                transition: "all 0.2s", padding: 28,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 10, background: COLORS.primary,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
              }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "white" }}>{u.initials}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: COLORS.slate900 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: COLORS.slate500, marginTop: 4 }}>{u.subtitle}</div>
              <div style={{
                marginTop: 18, fontSize: 13, fontWeight: 600,
                color: hover === u.id ? COLORS.accent : COLORS.slate500,
              }}>
                Acessar →
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
