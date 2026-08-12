import { useState } from "react";
import {
  COLORS, FONT, LEVELS, LEVEL_CONFIG, PLANOS, DAYS, DAYS_FULL, HOURS,
  TAXA_MATRICULA, TAXA_EXTRA, TAXA_EXAME, TAXA_BANHO_LIVRE, HORARIOS_BANHO,
} from "../../constants";
import { fmt, calcFee } from "../../utils/helpers";

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px",
  border: `1px solid ${COLORS.slate200}`, borderRadius: 8, fontSize: 13,
  outline: "none", fontFamily: FONT, background: "white",
};
const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600, color: COLORS.slate700,
  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px",
};

export default function StudentModal({ student, role, onSave, onClose }) {
  const canEditPlans = role?.canEditPlans !== false;
  const [form, setForm] = useState(student || {
    name: "", fee: 190, dueDay: 10, status: "Pendente", payDate: "", obs: "",
    email: "", cpf: "", phone: "", level: "Iniciante", attendance: [],
    contractedDays: 2, schedule: [],
    modalidade: "Sócio", temMatricula: false, temExame: false, temBanhoLivre: false,
  });
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  function setModalidade(m) {
    const keys = Object.keys(PLANOS[m] || {}).map((k) => parseInt(k));
    const validDay = keys.includes(form.contractedDays) ? form.contractedDays : keys[0] || 2;
    const newFee = calcFee(m, validDay, form.temMatricula, form.temExame, form.temBanhoLivre);
    setForm((p) => ({ ...p, modalidade: m, contractedDays: validDay, fee: newFee }));
  }

  function setContractedDays(n) {
    const newFee = calcFee(form.modalidade, n, form.temMatricula, form.temExame, form.temBanhoLivre);
    const fixed = form.schedule || [];
    setForm((p) => ({
      ...p, contractedDays: n, fee: newFee,
      schedule: fixed.length > n ? fixed.slice(0, n) : fixed,
    }));
  }

  function toggleAdditional(key) {
    const newVal = !form[key];
    const newFee = calcFee(
      form.modalidade, form.contractedDays,
      key === "temMatricula" ? newVal : form.temMatricula,
      key === "temExame" ? newVal : form.temExame,
      key === "temBanhoLivre" ? newVal : form.temBanhoLivre,
    );
    setForm((p) => ({ ...p, [key]: newVal, fee: newFee }));
  }

  function handleSlotClick(slot) {
    const cur = form.schedule || [];
    if (cur.includes(slot)) {
      f("schedule", cur.filter((s) => s !== slot));
    } else if (cur.length < (form.contractedDays || 2)) {
      f("schedule", [...cur, slot]);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "white", borderRadius: 12, width: "100%", maxWidth: 560,
        maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
      }}>
        {/* Header */}
        <div style={{
          background: COLORS.primary, padding: "18px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          color: "white", borderRadius: "12px 12px 0 0",
          position: "sticky", top: 0, zIndex: 5,
        }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            {student?.id ? "Editar Aluno" : "Cadastrar Aluno"}
          </span>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.12)", border: "none", color: "white",
            fontSize: 16, cursor: "pointer", borderRadius: 6, width: 30, height: 30,
          }}>✕</button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Dados pessoais */}
          {[["Nome Completo","text","name"],["E-mail","email","email"],["CPF","text","cpf"],["Telefone (WhatsApp)","text","phone"]].map(([label, type, key]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type} value={form[key]} onChange={(e) => f(key, e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.slate200)}
              />
            </div>
          ))}

          {/* Vencimento + Nível + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Vencimento</label>
              <select value={form.dueDay} onChange={(e) => f("dueDay", parseInt(e.target.value))} style={inputStyle}>
                {[5, 10, 15, 20, 25, 30].map((d) => <option key={d} value={d}>Dia {d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Nível</label>
              <select value={form.level} onChange={(e) => f("level", e.target.value)} style={inputStyle}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            {canEditPlans ? (
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={(e) => f("status", e.target.value)} style={inputStyle}>
                  <option>Pago</option><option>Pendente</option><option>Trancado</option>
                </select>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>Matrícula</label>
                <select
                  value={form.status === "Trancado" ? "Trancado" : "Ativa"}
                  onChange={(e) => f("status", e.target.value === "Trancado" ? "Trancado" : "Pendente")}
                  style={inputStyle}
                >
                  <option>Ativa</option><option>Trancado</option>
                </select>
              </div>
            )}
          </div>

          {canEditPlans && form.status === "Pago" && (
            <div>
              <label style={labelStyle}>Data do Pagamento</label>
              <input type="date" value={form.payDate || ""} onChange={(e) => f("payDate", e.target.value)} style={inputStyle} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Observações</label>
            <input
              type="text" value={form.obs} onChange={(e) => f("obs", e.target.value)}
              placeholder="Ex: PIX, Dinheiro, Recorrente" style={inputStyle}
            />
          </div>

          {/* ── MODALIDADE E PLANO (somente administrador) ── */}
          {canEditPlans ? (
          <div style={{ borderTop: `1px solid ${COLORS.slate200}`, paddingTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Modalidade</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.keys(PLANOS).map((m) => {
                  const sel = form.modalidade === m;
                  return (
                    <button key={m} onClick={() => setModalidade(m)} style={{
                      padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
                      border: `1px solid ${sel ? COLORS.accent : COLORS.slate200}`,
                      background: sel ? COLORS.accentSoft : "white",
                      fontSize: 13, fontWeight: 600,
                      color: sel ? COLORS.accent : COLORS.slate700,
                    }}>
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Frequência Semanal</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries(PLANOS[form.modalidade] || {}).map(([key, val]) => {
                  const n = parseInt(key);
                  const sel = form.contractedDays === n;
                  return (
                    <button key={key} onClick={() => setContractedDays(n)} style={{
                      padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
                      border: `1px solid ${sel ? COLORS.accent : COLORS.slate200}`,
                      background: sel ? COLORS.accentSoft : "white",
                      textAlign: "center", minWidth: 90,
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: sel ? COLORS.accent : COLORS.slate700 }}>{key}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: sel ? COLORS.accent : COLORS.slate500 }}>{fmt(val)}/mês</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Adicionais */}
            <div>
              <label style={labelStyle}>Adicionais</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { key: "temMatricula", label: "Matrícula", valor: TAXA_MATRICULA },
                  { key: "temExame", label: "Exame Médico", valor: TAXA_EXAME },
                  { key: "temBanhoLivre", label: "Banho Livre", valor: TAXA_BANHO_LIVRE },
                ].map(({ key, label, valor }) => {
                  const sel = form[key];
                  return (
                    <button key={key} onClick={() => toggleAdditional(key)} style={{
                      padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
                      border: `1px solid ${sel ? COLORS.success : COLORS.slate200}`,
                      background: sel ? COLORS.successSoft : "white",
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 12, fontWeight: 600,
                      color: sel ? COLORS.success : COLORS.slate700,
                    }}>
                      {sel && "✓"} {label}
                      <span style={{ color: sel ? COLORS.success : COLORS.slate400, fontSize: 11 }}>+{fmt(valor)}</span>
                    </button>
                  );
                })}
              </div>
              {form.temBanhoLivre && (
                <div style={{
                  marginTop: 8, padding: "8px 12px", background: COLORS.successSoft,
                  borderRadius: 8, fontSize: 11, color: COLORS.success,
                }}>
                  <strong>Banho Livre:</strong> {HORARIOS_BANHO.map((h) => `${h.dias} (${h.horas})`).join(" · ")} — {fmt(TAXA_BANHO_LIVRE)} a diária
                </div>
              )}
            </div>

            {/* Resumo */}
            <div style={{
              background: COLORS.primary, borderRadius: 10, padding: "16px 20px",
              color: "white", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Total mensal</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(form.fee || 0)}</div>
                <div style={{ fontSize: 11, opacity: 0.75 }}>
                  {form.modalidade} · {form.contractedDays}x/semana
                  {form.temMatricula ? " · Matrícula" : ""}
                  {form.temExame ? " · Exame" : ""}
                  {form.temBanhoLivre ? " · Banho Livre" : ""}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: COLORS.slate500 }}>
              Aulas extras: <strong style={{ color: COLORS.warning }}>{fmt(TAXA_EXTRA)} cada</strong> — registradas na aba Frequência.
            </div>
          </div>
          ) : (
            <div style={{
              borderTop: `1px solid ${COLORS.slate200}`, paddingTop: 18,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: COLORS.slate50, borderRadius: 8, padding: "14px 16px", marginTop: 4,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.slate700 }}>
                  {form.modalidade} · {form.contractedDays}x por semana
                </div>
                <div style={{ fontSize: 11, color: COLORS.slate500, marginTop: 2 }}>
                  Alterações de plano e valores são feitas pelo administrador.
                </div>
              </div>
            </div>
          )}

          {/* ── GRADE DE HORÁRIOS FIXOS ── */}
          <div style={{ borderTop: `1px solid ${COLORS.slate200}`, paddingTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Horários Fixos do Plano</label>
              <span style={{
                background: (form.schedule || []).length >= form.contractedDays ? COLORS.successSoft : COLORS.accentSoft,
                color: (form.schedule || []).length >= form.contractedDays ? COLORS.success : COLORS.accent,
                borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700,
              }}>
                {(form.schedule || []).length}/{form.contractedDays}
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "separate", borderSpacing: 3, width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: 36 }}></th>
                    {DAYS.map((d) => (
                      <th key={d} style={{ fontSize: 11, fontWeight: 700, color: COLORS.slate700, textAlign: "center", padding: "3px 2px" }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((h) => (
                    <tr key={h}>
                      <td style={{ fontSize: 10, fontWeight: 600, color: COLORS.slate500, textAlign: "center", paddingRight: 4, whiteSpace: "nowrap" }}>{h}</td>
                      {DAYS.map((d) => {
                        const slot = `${d}-${h}`;
                        const sel = (form.schedule || []).includes(slot);
                        const full = (form.schedule || []).length >= form.contractedDays && !sel;
                        return (
                          <td key={d} style={{ textAlign: "center", padding: 2 }}>
                            <div
                              onClick={() => handleSlotClick(slot)}
                              title={full ? `Limite de ${form.contractedDays}x atingido` : sel ? "Remover" : "Marcar"}
                              style={{
                                width: 36, height: 28, borderRadius: 6, margin: "0 auto",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, fontWeight: 700,
                                cursor: full ? "not-allowed" : "pointer",
                                background: sel ? COLORS.accent : full ? COLORS.slate50 : COLORS.slate100,
                                color: sel ? "white" : full ? COLORS.slate200 : COLORS.slate500,
                                border: sel ? `1px solid ${COLORS.accent}` : "1px solid transparent",
                                transition: "all 0.12s", userSelect: "none",
                              }}
                            >
                              {sel ? "✓" : h.replace("h", "")}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(form.schedule || []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {(form.schedule || []).map((slot) => {
                  const [day, hour] = slot.split("-");
                  return (
                    <div key={slot} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: COLORS.accentSoft, color: COLORS.accent,
                      borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600,
                    }}>
                      <span>{DAYS_FULL[DAYS.indexOf(day)]} {hour}</span>
                      <span
                        onClick={() => f("schedule", (form.schedule || []).filter((s) => s !== slot))}
                        style={{ cursor: "pointer", fontWeight: 700 }}
                      >✕</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botões */}
          <div style={{
            display: "flex", gap: 12, justifyContent: "flex-end",
            paddingTop: 14, borderTop: `1px solid ${COLORS.slate200}`,
          }}>
            <button onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 8, border: `1px solid ${COLORS.slate200}`,
              background: "white", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: COLORS.slate700,
            }}>
              Cancelar
            </button>
            <button onClick={() => onSave(form)} style={{
              padding: "10px 24px", borderRadius: 8, border: "none",
              background: COLORS.primary, color: "white", cursor: "pointer",
              fontFamily: FONT, fontSize: 13, fontWeight: 600,
            }}>
              {student?.id ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
