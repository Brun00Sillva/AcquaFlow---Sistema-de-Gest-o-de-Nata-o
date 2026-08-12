import { COLORS, FONT, MONTHS_FULL } from "../../constants";
import { fmt } from "../../utils/helpers";

export default function FinanceTab({ students, gastos, onAddExpense, onDeleteExpense }) {
  const mes = new Date().getMonth() + 1;
  const pagos = students.filter((s) => s.status === "Pago");
  const faturamento = pagos.reduce((a, s) => a + (s.fee || 0), 0);
  const totalGastos = gastos.filter((g) => g.month === mes).reduce((a, g) => a + g.amount, 0);
  const saldo = faturamento - totalGastos;

  const cardStyle = { background: "white", borderRadius: 10, padding: 20, border: `1px solid ${COLORS.slate200}` };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onAddExpense} style={{
          padding: "10px 20px", borderRadius: 8, border: "none",
          background: COLORS.danger, color: "white", cursor: "pointer",
          fontWeight: 600, fontSize: 13, fontFamily: FONT,
        }}>
          Lançar Despesa
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Receitas */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.slate900, marginBottom: 14 }}>Receitas Recebidas</div>
          {pagos.length === 0 && <div style={{ color: COLORS.slate400, fontSize: 13 }}>Nenhum pagamento registrado.</div>}
          {pagos.map((s) => (
            <div key={s.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${COLORS.slate100}`,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.slate900 }}>
                  {s.name.split(" ").slice(0, 2).join(" ")}
                </div>
                <div style={{ fontSize: 11, color: COLORS.slate500 }}>
                  {s.obs || "Pagamento"} · {s.payDate || "—"}
                </div>
              </div>
              <span style={{ fontWeight: 700, color: COLORS.success, fontSize: 13 }}>+{fmt(s.fee)}</span>
            </div>
          ))}
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: `2px solid ${COLORS.slate100}`,
            display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14,
          }}>
            <span style={{ color: COLORS.slate900 }}>Total Recebido</span>
            <span style={{ color: COLORS.success }}>{fmt(faturamento)}</span>
          </div>
        </div>

        {/* Despesas */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.slate900, marginBottom: 14 }}>Despesas Operacionais</div>
          {gastos.length === 0 && <div style={{ color: COLORS.slate400, fontSize: 13 }}>Nenhuma despesa lançada.</div>}
          {gastos.map((g) => (
            <div key={g.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: `1px solid ${COLORS.slate100}`,
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.slate900 }}>{g.desc}</div>
                <div style={{ fontSize: 11, color: COLORS.slate500 }}>{MONTHS_FULL[g.month - 1]}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, color: COLORS.danger, fontSize: 13 }}>−{fmt(g.amount)}</span>
                <button onClick={() => onDeleteExpense(g.id)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: COLORS.slate400, fontFamily: FONT,
                }}>
                  Remover
                </button>
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: `2px solid ${COLORS.slate100}`,
            display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14,
          }}>
            <span style={{ color: COLORS.slate900 }}>Total Despesas</span>
            <span style={{ color: COLORS.danger }}>−{fmt(totalGastos)}</span>
          </div>
        </div>
      </div>

      {/* Saldo */}
      <div style={{
        background: saldo >= 0 ? COLORS.success : COLORS.danger,
        borderRadius: 10, padding: "22px 26px", color: "white",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Saldo Líquido do Mês</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px" }}>{fmt(Math.abs(saldo))}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{saldo >= 0 ? "Resultado positivo" : "Resultado negativo"}</div>
        </div>
      </div>
    </div>
  );
}
