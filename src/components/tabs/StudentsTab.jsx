import { COLORS, FONT, LEVEL_CONFIG } from "../../constants";
import { fmt } from "../../utils/helpers";
import { StatusBadge, WhatsAppButton } from "../common";

export default function StudentsTab({
  students, role, search, setSearch, statusFilter, setStatusFilter,
  onEdit, onDelete, onToggleLock,
}) {
  const canSeeMoney = role?.canSeeFinancials !== false;
  const canDelete   = role?.canDeleteStudents !== false;
  const filtered = students.filter((s) => {
    const nameOk = s.name.toLowerCase().includes(search.toLowerCase());
    const statusOk = statusFilter === "Todos" || s.status === statusFilter;
    return nameOk && statusOk;
  });

  const btn = (bg, color) => ({
    padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
    fontSize: 11, fontWeight: 600, background: bg, color, fontFamily: FONT,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filtros */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar aluno por nome..."
          style={{
            flex: 1, minWidth: 200, padding: "10px 14px",
            border: `1px solid ${COLORS.slate200}`, borderRadius: 8,
            fontSize: 13, outline: "none", fontFamily: FONT,
          }}
        />
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 14px", border: `1px solid ${COLORS.slate200}`,
            borderRadius: 8, fontSize: 13, outline: "none", background: "white", fontFamily: FONT,
          }}
        >
          <option value="Todos">Todos</option>
          <option value="Pago">Em dia</option>
          <option value="Pendente">Pendente</option>
          <option value="Trancado">Trancados</option>
        </select>
        <span style={{ fontSize: 12, color: COLORS.slate500 }}>
          {filtered.length} de {students.length} alunos
        </span>
      </div>

      {/* Tabela */}
      <div style={{ background: "white", borderRadius: 10, border: `1px solid ${COLORS.slate200}`, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: COLORS.slate50, borderBottom: `1px solid ${COLORS.slate200}` }}>
                {[
                  "Nome", "Modalidade / Plano", "Nível",
                  ...(canSeeMoney ? ["Mensalidade", "Venc.", "Status"] : []),
                  "Contato", "Ações",
                ].map((h) => (
                  <th key={h} style={{
                    padding: "11px 16px", fontSize: 11, fontWeight: 600,
                    color: COLORS.slate500, textAlign: "left",
                    textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const cfg = LEVEL_CONFIG[s.level] || {};
                return (
                  <tr key={s.id} style={{
                    borderBottom: `1px solid ${COLORS.slate100}`,
                    opacity: s.status === "Trancado" ? 0.55 : 1,
                  }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, color: COLORS.slate900 }}>
                      {s.name}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 12, color: COLORS.slate700, fontWeight: 600 }}>{s.modalidade || "—"}</div>
                      <div style={{ fontSize: 11, color: COLORS.slate500 }}>
                        {s.contractedDays}x/semana
                        {(s.schedule || []).length > 0 && ` · ${(s.schedule || []).map((sl) => sl.replace("-", " ")).join(", ")}`}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        background: cfg.bg, color: cfg.color,
                        borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
                      }}>{s.level}</span>
                    </td>
                    {canSeeMoney && (
                      <>
                        <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, color: COLORS.slate900 }}>
                          {fmt(s.fee)}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.slate500 }}>Dia {s.dueDay}</td>
                        <td style={{ padding: "12px 16px" }}><StatusBadge student={s} /></td>
                      </>
                    )}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {s.phone && <span style={{ fontSize: 11, color: COLORS.slate500 }}>{s.phone}</span>}
                        <WhatsAppButton student={s} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button onClick={() => onToggleLock(s.id)} style={btn(COLORS.slate100, COLORS.slate700)}>
                          {s.status === "Trancado" ? "Reativar" : "Trancar"}
                        </button>
                        <button onClick={() => onEdit(s)} style={btn(COLORS.accentSoft, COLORS.accent)}>Editar</button>
                        {canDelete && (
                          <button onClick={() => onDelete(s.id)} style={btn(COLORS.dangerSoft, COLORS.danger)}>Excluir</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
