import { useState, useEffect } from "react";
import { COLORS, FONT } from "../../constants";
import { supabase } from "../../lib/supabase";

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, resolved

  // Carregar alertas do Supabase
  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Erro ao carregar alertas:", error);
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  }

  async function toggleResolved(id, currentStatus) {
    const { error } = await supabase
      .from('alertas')
      .update({ resolvido: !currentStatus })
      .eq('id', id);
    if (error) {
      console.error("Erro ao atualizar alerta:", error);
    } else {
      setAlerts(prev =>
        prev.map(a => a.id === id ? { ...a, resolvido: !currentStatus } : a)
      );
    }
  }

  // Filtros
  const filteredAlerts = alerts.filter(a => {
    if (filter === "pending") return !a.resolvido;
    if (filter === "resolved") return a.resolvido;
    return true;
  });

  const pendingCount = alerts.filter(a => !a.resolvido).length;

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: COLORS.slate500 }}>
        Carregando alertas...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Cabeçalho */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.slate900 }}>
            Alertas
          </div>
          <div style={{ fontSize: 13, color: COLORS.slate500 }}>
            {pendingCount} pendente(s) · {alerts.length} no total
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { value: "all", label: "Todos" },
            { value: "pending", label: "Pendentes" },
            { value: "resolved", label: "Resolvidos" },
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
      </div>

      {/* Lista de alertas */}
      {filteredAlerts.length === 0 ? (
        <div style={{
          background: "white",
          borderRadius: 10,
          padding: 48,
          textAlign: "center",
          border: `1px solid ${COLORS.slate200}`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.slate500 }}>
            Nenhum alerta encontrado
          </div>
          <div style={{ fontSize: 12, color: COLORS.slate400, marginTop: 6 }}>
            {filter === "all" && "Não há alertas gerados."}
            {filter === "pending" && "Todos os alertas foram resolvidos."}
            {filter === "resolved" && "Nenhum alerta resolvido ainda."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                background: "white",
                borderRadius: 10,
                padding: "16px 20px",
                border: `1px solid ${alert.resolvido ? COLORS.slate200 : COLORS.accentSoft}`,
                borderLeft: `4px solid ${alert.resolvido ? COLORS.slate300 : COLORS.accent}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                opacity: alert.resolvido ? 0.7 : 1,
                transition: "all 0.15s",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: alert.resolvido ? COLORS.slate500 : COLORS.slate900,
                }}>
                  {alert.mensagem}
                </div>
                <div style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 4,
                  fontSize: 11,
                  color: COLORS.slate400,
                }}>
                  <span>📅 {new Date(alert.data_alerta).toLocaleDateString('pt-BR')}</span>
                  <span>🕒 {new Date(alert.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>🏷️ {alert.tipo}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 10,
                  fontWeight: 600,
                  background: alert.resolvido ? COLORS.successSoft : COLORS.warningSoft,
                  color: alert.resolvido ? COLORS.success : COLORS.warning,
                }}>
                  {alert.resolvido ? "Resolvido" : "Pendente"}
                </span>
                <button
                  onClick={() => toggleResolved(alert.id, alert.resolvido)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: `1px solid ${alert.resolvido ? COLORS.slate200 : COLORS.accent}`,
                    background: alert.resolvido ? COLORS.slate50 : COLORS.accent,
                    color: alert.resolvido ? COLORS.slate700 : "white",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: FONT,
                    transition: "all 0.15s",
                  }}
                >
                  {alert.resolvido ? "Reabrir" : "Resolver"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}