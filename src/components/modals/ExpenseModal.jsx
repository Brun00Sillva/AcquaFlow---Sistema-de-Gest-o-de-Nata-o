import { useState } from "react";
import { COLORS, FONT, MONTHS_FULL } from "../../constants";

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px",
  border: `1px solid ${COLORS.slate200}`, borderRadius: 8, fontSize: 13,
  outline: "none", fontFamily: FONT, background: "white",
};
const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600, color: COLORS.slate700,
  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px",
};

export default function ExpenseModal({ onSave, onClose }) {
  const [form, setForm] = useState({ desc: "", amount: "", month: new Date().getMonth() + 1 });

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{ background: "white", borderRadius: 12, width: "100%", maxWidth: 400, boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
        <div style={{
          background: COLORS.danger, padding: "18px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          color: "white", borderRadius: "12px 12px 0 0",
        }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Lançar Despesa</span>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.12)", border: "none", color: "white",
            fontSize: 16, cursor: "pointer", borderRadius: 6, width: 30, height: 30,
          }}>✕</button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Descrição</label>
            <input
              value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
              placeholder="Ex: Tratamento químico" style={inputStyle}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Valor (R$)</label>
              <input
                type="number" value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="0,00" style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Mês</label>
              <select
                value={form.month}
                onChange={(e) => setForm((p) => ({ ...p, month: parseInt(e.target.value) }))}
                style={inputStyle}
              >
                {MONTHS_FULL.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${COLORS.slate200}` }}>
            <button onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 8, border: `1px solid ${COLORS.slate200}`,
              background: "white", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: COLORS.slate700,
            }}>
              Cancelar
            </button>
            <button
              onClick={() => { if (form.desc && form.amount) onSave({ ...form, amount: parseFloat(form.amount), id: Date.now() }); }}
              style={{
                padding: "10px 24px", borderRadius: 8, border: "none",
                background: COLORS.danger, color: "white", cursor: "pointer",
                fontFamily: FONT, fontSize: 13, fontWeight: 600,
              }}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
