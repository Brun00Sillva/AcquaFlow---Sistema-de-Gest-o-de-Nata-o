import { COLORS, FONT, DAYS, DAYS_FULL, HOURS, MONTHS_FULL, LEVEL_CONFIG, TAXA_EXTRA } from "../../constants";
import { fmt, getWeekDates, slotKey } from "../../utils/helpers";

export default function AttendanceTab({
  students, setStudents, role,
  attendDate, setAttendDate,
  attendStudent, setAttendStudent,
  extraPopup, setExtraPopup,
  frequencias,          // <-- dados do Supabase
  setFrequencias,       // <-- para atualizar localmente
  saveFrequencia,       // <-- função para salvar no Supabase
  loadFrequencias,      // <-- para recarregar ao mudar data
}) {
  const canSeeMoney = role?.canSeeFinancials !== false;
  const s = students.find((st) => st.id === attendStudent);
  const weekDates = getWeekDates(attendDate);
  const weekDatesArray = Object.values(weekDates);
  const mesRef = attendDate.slice(0, 7);

  const fixedSlots = s ? s.schedule || [] : [];
  const planLimit  = s ? s.contractedDays || 2 : 2;

  // Contagens usando os dados do Supabase
  const monthPres = s
    ? frequencias.filter(f => f.aluno_id === s.id && f.data_aula.startsWith(mesRef) && f.presente)
    : [];
  const weekPres = s
    ? frequencias.filter(f => f.aluno_id === s.id && weekDatesArray.includes(f.data_aula) && f.presente)
    : [];

  const monthExtras = s
    ? monthPres.filter(f => {
        const slot = f.observacao || '';
        return slot && !fixedSlots.includes(slot);
      }).length
    : 0;

  function isPresent(slot) {
    if (!s) return false;
    const day = slot.split("-")[0];
    const date = weekDates[day];
    if (!date) return false;
    return frequencias.some(f =>
      f.aluno_id === s.id &&
      f.data_aula === date &&
      f.presente &&
      f.observacao === slot
    );
  }

  function toggleSlot(slot) {
    if (!s) return;
    const day = slot.split("-")[0];
    const date = weekDates[day];
    if (!date) return;

    const existing = frequencias.find(f =>
      f.aluno_id === s.id &&
      f.data_aula === date &&
      f.observacao === slot
    );

    if (existing) {
      saveFrequencia(s.id, date, !existing.presente, slot);
      return;
    }

    const inPlan = fixedSlots.includes(slot);
    const weekPresCount = frequencias.filter(f =>
      f.aluno_id === s.id && weekDatesArray.includes(f.data_aula) && f.presente
    ).length;

    if (!inPlan && weekPresCount >= planLimit) {
      setExtraPopup({ student: s, slot, key: slotKey(date, slot) });
      return;
    }

    saveFrequencia(s.id, date, true, slot);
  }

  function confirmExtra() {
    if (!extraPopup) return;
    const { student, slot } = extraPopup;
    const day = slot.split("-")[0];
    const date = weekDates[day];
    if (date) {
      saveFrequencia(student.id, date, true, slot);
    }
    setExtraPopup(null);
  }

  const cfg = s ? LEVEL_CONFIG[s.level] || {} : {};
  const cardStyle = { background: "white", borderRadius: 10, border: `1px solid ${COLORS.slate200}` };
  const inputStyle = {
    padding: "9px 14px", border: `1px solid ${COLORS.slate200}`, borderRadius: 8,
    fontSize: 13, outline: "none", fontFamily: FONT, background: "white",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Seleção */}
      <div style={{ ...cardStyle, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.slate700, textTransform: "uppercase", marginBottom: 5 }}>Aluno</div>
            <select
              value={attendStudent || ""}
              onChange={(e) => setAttendStudent(Number(e.target.value) || null)}
              style={{ ...inputStyle, minWidth: 240 }}
            >
              <option value="">— Selecione um aluno —</option>
              {students.filter((st) => st.status !== "Trancado").map((st) => (
                <option key={st.id} value={st.id}>{st.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.slate700, textTransform: "uppercase", marginBottom: 5 }}>Semana</div>
            <input type="date" value={attendDate} onChange={(e) => setAttendDate(e.target.value)} style={inputStyle} />
          </div>
          {s && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600 }}>
                {s.level}
              </span>
              <span style={{ background: COLORS.accentSoft, color: COLORS.accent, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600 }}>
                Plano {planLimit}x/semana
              </span>
              <span style={{
                background: weekPres.length === 0 ? COLORS.successSoft : COLORS.warningSoft,
                color: weekPres.length === 0 ? COLORS.success : COLORS.warning,
                borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600,
              }}>
                {weekPres.length} presença(s) na semana
              </span>
              {monthExtras > 0 && (
                <span style={{
                  background: COLORS.warningSoft, color: COLORS.warning,
                  borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 700,
                  border: `1px solid ${COLORS.warning}44`,
                }}>
                  {monthExtras} extra(s) no mês{canSeeMoney ? ` · ${fmt(monthExtras * TAXA_EXTRA)}` : ""}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {!s ? (
        <div style={{ ...cardStyle, padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.slate500 }}>
            Selecione um aluno para registrar a frequência
          </div>
          <div style={{ fontSize: 12, color: COLORS.slate400, marginTop: 6 }}>
            Os horários do plano aparecem destacados em azul.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 14, alignItems: "start", flexWrap: "wrap" }}>

          {/* Grade semanal */}
          <div style={{ ...cardStyle, flex: "1 1 480px", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.slate900 }}>
                  Semana — {s.name.split(" ").slice(0, 2).join(" ")}
                </div>
                <div style={{ fontSize: 11, color: COLORS.slate500, marginTop: 2 }}>
                  Clique em um horário para marcar ou desmarcar a presença
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { bg: COLORS.accentSoft, border: COLORS.accent, label: "Plano" },
                  { bg: COLORS.accent, border: COLORS.accent, label: "Presente" },
                  { bg: COLORS.warning, border: COLORS.warning, label: "Extra" },
                  { bg: "white", border: COLORS.slate200, label: "Livre" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: l.bg, border: `1px solid ${l.border}` }} />
                    <span style={{ fontSize: 10, color: COLORS.slate500 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "separate", borderSpacing: 4, width: "100%", minWidth: 360 }}>
                <thead>
                  <tr>
                    <th style={{ width: 36, fontSize: 10, color: COLORS.slate400, fontWeight: 600, textAlign: "center", paddingBottom: 6 }}>Hora</th>
                    {DAYS.map((d) => (
                      <th key={d} style={{ fontSize: 11, fontWeight: 700, color: COLORS.slate900, textAlign: "center", padding: "0 2px 6px" }}>
                        {d}<br />
                        <span style={{ fontSize: 9, fontWeight: 400, color: COLORS.slate400 }}>
                          {new Date(weekDates[d] + "T12:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((h) => (
                    <tr key={h}>
                      <td style={{ fontSize: 11, fontWeight: 600, color: COLORS.slate500, textAlign: "center", paddingRight: 4, whiteSpace: "nowrap" }}>{h}</td>
                      {DAYS.map((d) => {
                        const slot = `${d}-${h}`;
                        const inPlan = fixedSlots.includes(slot);
                        const present = isPresent(slot);
                        const isExtra = present && !inPlan;

                        let bg, borderC, txtC, label;
                        if (present && inPlan)      { bg = COLORS.accent;     borderC = COLORS.accent;   txtC = "white"; label = "✓"; }
                        else if (isExtra)            { bg = COLORS.warning;    borderC = COLORS.warning;  txtC = "white"; label = "E"; }
                        else if (inPlan)             { bg = COLORS.accentSoft; borderC = COLORS.accent;   txtC = COLORS.accent; label = h.replace("h", ""); }
                        else                         { bg = "white";           borderC = COLORS.slate200; txtC = COLORS.slate400; label = h.replace("h", ""); }

                        return (
                          <td key={d} style={{ textAlign: "center", padding: 2 }}>
                            <div
                              onClick={() => toggleSlot(slot)}
                              title={present ? "Remover presença" : inPlan ? "Marcar presença (plano)" : "Marcar presença"}
                              style={{
                                width: 40, height: 32, borderRadius: 7, margin: "0 auto",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700, cursor: "pointer",
                                background: bg, color: txtC, border: `1px solid ${borderC}`,
                                transition: "all 0.12s", userSelect: "none",
                              }}
                            >
                              {label}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Painel lateral */}
          <div style={{ flex: "0 0 280px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ ...cardStyle, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.slate900, marginBottom: 10 }}>
                Presenças — {MONTHS_FULL[new Date(attendDate + "T12:00").getMonth()]}
              </div>
              {monthPres.length === 0 ? (
                <div style={{ fontSize: 12, color: COLORS.slate400 }}>Nenhuma presença registrada este mês.</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {monthPres.sort((a, b) => a.data_aula.localeCompare(b.data_aula)).map((f) => {
                    const dt = new Date(f.data_aula + "T12:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
                    const slot = f.observacao || '';
                    const isEx = slot && !fixedSlots.includes(slot);
                    return (
                      <span key={f.id} style={{
                        background: isEx ? COLORS.warningSoft : COLORS.accentSoft,
                        color: isEx ? COLORS.warning : COLORS.accent,
                        border: `1px solid ${isEx ? COLORS.warning + "44" : COLORS.accent + "33"}`,
                        borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 600,
                      }}>
                        {isEx ? "EXTRA · " : ""}{dt} {slot ? `(${slot.split("-")[1]})` : ''}
                      </span>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 11, color: COLORS.slate500 }}>
                Plano: {planLimit}x/semana · {monthPres.length} presença(s) no mês
                {monthExtras > 0 && (
                  <span style={{ color: COLORS.warning, fontWeight: 700 }}>
                    {" "}· {monthExtras} extra(s){canSeeMoney ? ` = ${fmt(monthExtras * TAXA_EXTRA)}` : ""}
                  </span>
                )}
              </div>
            </div>

            {monthExtras > 0 && canSeeMoney && (
              <div style={{
                background: COLORS.warning, borderRadius: 10, padding: 16, color: "white",
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Cobrança adicional do mês</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(monthExtras * TAXA_EXTRA)}</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>
                  {monthExtras} aula(s) extra(s) × {fmt(TAXA_EXTRA)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pop-up Aula Extra */}
      {extraPopup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}>
          <div style={{
            background: "white", borderRadius: 12, padding: 28, maxWidth: 400, width: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.slate900, marginBottom: 14 }}>
              Confirmar Aula Extra
            </div>
            <div style={{
              background: COLORS.warningSoft, borderRadius: 10, padding: "14px 18px",
              marginBottom: 16, border: `1px solid ${COLORS.warning}44`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.warning, marginBottom: 6 }}>
                {extraPopup.student.name.split(" ").slice(0, 2).join(" ")}
              </div>
              <div style={{ fontSize: 13, color: COLORS.slate700, lineHeight: 1.8 }}>
                {DAYS_FULL[DAYS.indexOf(extraPopup.slot.split("-")[0])]} às {extraPopup.slot.split("-")[1]}<br />
                Plano contratado: <strong>{extraPopup.student.contractedDays || 2}x por semana</strong>
                {canSeeMoney && (
                  <><br />Valor da aula extra: <strong style={{ color: COLORS.warning }}>{fmt(TAXA_EXTRA)}</strong></>
                )}
              </div>
            </div>
            <div style={{ fontSize: 13, color: COLORS.slate500, lineHeight: 1.6, marginBottom: 20 }}>
              Esta presença excede o plano contratado e será registrada como <strong>aula extra</strong>
              {canSeeMoney ? <>, com cobrança adicional de <strong>{fmt(TAXA_EXTRA)}</strong></> : " (sujeita a cobrança adicional)"}. Deseja confirmar?
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setExtraPopup(null)} style={{
                flex: 1, padding: "11px 0", borderRadius: 8, border: `1px solid ${COLORS.slate200}`,
                background: "white", cursor: "pointer", fontFamily: FONT,
                fontSize: 13, fontWeight: 600, color: COLORS.slate700,
              }}>
                Cancelar
              </button>
              <button onClick={confirmExtra} style={{
                flex: 1, padding: "11px 0", borderRadius: 8, border: "none",
                background: COLORS.warning, color: "white", cursor: "pointer",
                fontFamily: FONT, fontSize: 13, fontWeight: 700,
              }}>
                Confirmar Extra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}