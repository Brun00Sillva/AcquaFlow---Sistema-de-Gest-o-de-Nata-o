// ============================================================
// FUNÇÕES UTILITÁRIAS — formatação e datas
// ============================================================
import { DAYS, PLANOS, TAXA_MATRICULA, TAXA_EXAME, TAXA_BANHO_LIVRE } from "../constants";

/** Formata número como moeda BRL: 190 → "R$ 190,00" */
export function fmt(v) {
  return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Dias até o próximo vencimento (dueDay = dia do mês) */
export function daysUntilDue(dueDay) {
  const now = new Date();
  const due = new Date(now.getFullYear(), now.getMonth(), dueDay);
  if (due < now) due.setMonth(due.getMonth() + 1);
  return Math.ceil((due - now) / 86400000);
}

/** Dias de atraso (0 se ainda não venceu) */
export function daysOverdue(dueDay) {
  const now = new Date();
  const due = new Date(now.getFullYear(), now.getMonth(), dueDay);
  if (due >= now) return 0;
  return Math.ceil((now - due) / 86400000);
}

/** Alerta de pagamento: null | {type:"due_soon"|"overdue", days} */
export function getPaymentAlert(student) {
  if (student.status === "Pago" || student.status === "Trancado") return null;
  const overdue = daysOverdue(student.dueDay);
  if (overdue >= 1) return { type: "overdue", days: overdue };
  const until = daysUntilDue(student.dueDay);
  if (until <= 5) return { type: "due_soon", days: until };
  return null;
}

/** Datas (YYYY-MM-DD) de Seg a Sex da semana que contém refDate */
export function getWeekDates(refDate) {
  const base = new Date(refDate + "T12:00");
  const dow = base.getDay() === 0 ? 6 : base.getDay() - 1; // Seg = 0
  const mon = new Date(base);
  mon.setDate(base.getDate() - dow);
  const result = {};
  DAYS.forEach((d, i) => {
    const dt = new Date(mon);
    dt.setDate(mon.getDate() + i);
    result[d] = dt.toISOString().split("T")[0];
  });
  return result;
}

/** Chave de presença slot-level: "2026-05-26|Seg-15h" */
export function slotKey(date, slot) {
  return `${date}|${slot}`;
}

/** Calcula mensalidade total: plano + adicionais */
export function calcFee(modalidade, contractedDays, temMatricula, temExame, temBanhoLivre) {
  const planoKey = contractedDays + "x";
  const mensalidade = (PLANOS[modalidade] || {})[planoKey] || 0;
  let total = mensalidade;
  if (temMatricula)  total += TAXA_MATRICULA;
  if (temExame)      total += TAXA_EXAME;
  if (temBanhoLivre) total += TAXA_BANHO_LIVRE;
  return total;
}

/** Presenças slot-level do aluno em um mês "YYYY-MM" */
export function presencesInMonth(student, monthRef) {
  return (student.attendance || []).filter(
    (e) => e.includes("|") && e.startsWith(monthRef)
  );
}

/** Presenças slot-level do aluno em uma semana (objeto weekDates) */
export function presencesInWeek(student, weekDates) {
  const weekKeys = Object.values(weekDates);
  return (student.attendance || []).filter(
    (e) => e.includes("|") && weekKeys.some((wd) => e.startsWith(wd + "|"))
  );
}
