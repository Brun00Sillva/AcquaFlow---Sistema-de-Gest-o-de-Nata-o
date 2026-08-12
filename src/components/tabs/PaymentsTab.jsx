import { useState, useEffect } from "react";
import { COLORS, FONT } from "../../constants";
import { fmt } from "../../utils/helpers";
import { supabase } from "../../lib/supabase";

export default function PaymentsTab({ students }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, receita, despesa

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .order('data', { ascending: false });
    if (error) {
      console.error("Erro ao carregar pagamentos:", error);
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  }

  const filteredPayments = payments.filter(p => {
    if (filter === "receita") return p.tipo === "receita";
    if (filter === "despesa") return p.tipo === "despesa";
    return true;
  });

  const totalReceitas = payments.filter(p => p.tipo === "receita").reduce((sum, p) => sum + p.valor, 0);
  const totalDespesas = payments.filter(p => p.tipo === "despesa").reduce((sum, p) => sum + p.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  // Função para buscar o nome do aluno (se houver)
  function getAlunoNome(alunoId) {
    if (!alunoId) return "—";
    const aluno = students.find(s => s.id === alunoId);
    return aluno ? aluno.name : "Aluno não encontrado";
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: COLORS.slate500 }}>
        Carregando pagamentos...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Resumo */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12,
      }}>
        <div style={{
          background: COLORS.success,
          borderRadius: 10,
          padding: "16px 20px",
          color: "white",
        }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Total Receitas</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt(totalReceitas)}</div>
        </div>
        <div style={{
          background: COLORS.danger,
          borderRadius: 10,
          padding: "16px 20px",
          color: "white",
        }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Total Despesas</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt(totalDespesas)}</div>
        </div>
        <div style={{
          background: saldo >= 0 ? COLORS.primary : COLORS.danger,
          borderRadius: 10,
          padding: "16px 20px",
          color: "white",
        }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Saldo</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{fmt(saldo)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { value: "all", label: "Todos" },
          { value: "receita", label: "Receitas" },
          { value: "despesa", label: "Despesas" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${filter === f.value ? COLORS.accent : COLORS.slate200}`,
              background: filter === f.value ? COLORS.accent : "white",
              color: filter === f.value ? "white" : COLORS.slate700,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT,
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de pagamentos */}
      {filteredPayments.length === 0 ? (
        <div style={{
          background: "white",
          borderRadius: 10,
          padding: 48,
          textAlign: "center",
          border: `1px solid ${COLORS.slate200}`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.slate500 }}>
            Nenhum pagamento registrado
          </div>
          <div style={{ fontSize: 12, color: COLORS.slate400, marginTop: 6 }}>
            {filter === "all" && "Não há pagamentos ou despesas lançadas."}
            {filter === "receita" && "Nenhuma receita registrada."}
            {filter === "despesa" && "Nenhuma despesa registrada."}
          </div>
        </div>
      ) : (
        <div style={{
          background: "white",
          borderRadius: 10,
          border: `1px solid ${COLORS.slate200}`,
          overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.slate50, borderBottom: `1px solid ${COLORS.slate200}` }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.slate500 }}>Data</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.slate500 }}>Tipo</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.slate500 }}>Descrição</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: COLORS.slate500 }}>Aluno</th>
                <th style={{ padding: "10px 16px", textAlign: "right", fontSize: 11, fontWeight: 600, color: COLORS.slate500 }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.slate100}` }}>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: COLORS.slate700 }}>
                    {new Date(p.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <span style={{
                      padding: "2px 10px",
                      borderRadius: 12,
                      fontSize: 10,
                      fontWeight: 600,
                      background: p.tipo === 'receita' ? COLORS.successSoft : COLORS.dangerSoft,
                      color: p.tipo === 'receita' ? COLORS.success : COLORS.danger,
                    }}>
                      {p.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: COLORS.slate900 }}>
                    {p.descricao || '—'}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: COLORS.slate700 }}>
                    {getAlunoNome(p.aluno_id)}
                  </td>
                  <td style={{
                    padding: "10px 16px",
                    textAlign: "right",
                    fontWeight: 600,
                    color: p.tipo === 'receita' ? COLORS.success : COLORS.danger,
                  }}>
                    {p.tipo === 'receita' ? '+' : '-'}{fmt(p.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}