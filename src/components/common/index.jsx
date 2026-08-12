import { COLORS } from "../../constants";
import { getPaymentAlert } from "../../utils/helpers";

/** Dot colorido + texto — substitui badges com emoji */
function Dot({ color }) {
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />;
}

export function StatusBadge({ student }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
  };
  if (student.status === "Trancado")
    return <span style={{ ...base, background: COLORS.slate100, color: COLORS.slate700 }}><Dot color={COLORS.slate400} /> Trancado</span>;

  const alert = getPaymentAlert(student);
  if (student.status === "Pago")
    return <span style={{ ...base, background: COLORS.successSoft, color: COLORS.success }}><Dot color={COLORS.success} /> Pago</span>;
  if (alert?.type === "overdue")
    return <span style={{ ...base, background: COLORS.dangerSoft, color: COLORS.danger }}><Dot color={COLORS.danger} /> {alert.days}d em atraso</span>;
  if (alert?.type === "due_soon")
    return <span style={{ ...base, background: COLORS.warningSoft, color: COLORS.warning }}><Dot color={COLORS.warning} /> Vence em {alert.days}d</span>;
  return <span style={{ ...base, background: COLORS.dangerSoft, color: COLORS.danger }}><Dot color={COLORS.danger} /> Pendente</span>;
}

export function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "white", borderRadius: 10, padding: "18px 20px",
      border: `1px solid ${COLORS.slate200}`,
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.slate500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.slate900, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent || COLORS.slate500, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

export function WhatsAppButton({ student }) {
  const phone = student.phone?.replace(/\D/g, "");
  if (!phone) return <span style={{ fontSize: 11, color: COLORS.slate400 }}>Sem telefone</span>;

  const alert = getPaymentAlert(student);
  let msg = "";
  const first = student.name.split(" ")[0];
  if (alert?.type === "due_soon")
    msg = `Olá, ${first}! Sua mensalidade da escola de natação vence em ${alert.days} dia(s) (dia ${student.dueDay}). Antecipe o pagamento e evite pendências.`;
  else if (alert?.type === "overdue")
    msg = `Olá, ${first}. Identificamos que sua mensalidade está em atraso há ${alert.days} dia(s). Por favor, regularize o quanto antes.`;
  else
    msg = `Olá, ${first}! Sua mensalidade da escola de natação está em dia. Obrigado!`;

  const url = `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      background: "#25d366", color: "white", borderRadius: 6, padding: "4px 10px",
      fontSize: 11, fontWeight: 600, textDecoration: "none", display: "inline-block",
    }}>
      WhatsApp
    </a>
  );
}
