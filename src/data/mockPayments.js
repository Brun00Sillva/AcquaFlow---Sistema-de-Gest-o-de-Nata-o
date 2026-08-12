// ============================================================
// HISTÓRICO DE PAGAMENTOS — dados de demonstração
//
// IMPORTANTE: A estrutura de cada pagamento abaixo é EXATAMENTE
// a que o webhook do gateway (ex: Asaas / Mercado Pago) vai
// preencher automaticamente no futuro. Ao integrar o backend,
// basta substituir este array por dados vindos do banco.
//
// Campos que o gateway fornece via webhook:
//   id            → id da cobrança no gateway
//   studentId     → vínculo com o aluno (referência externa)
//   value         → valor pago
//   status        → "pago" | "pendente" | "futuro" | "atrasado"
//   method        → "pix" | "cartao_credito" | "cartao_debito" | "boleto" | "dinheiro"
//   dueDate       → data de vencimento (YYYY-MM-DD)
//   paidDate      → data em que o pagamento caiu (null se não pago)
//   paidBy        → quem pagou: "aluno" | "responsavel"
//   payerName     → nome de quem efetuou o pagamento
//   reference     → competência da mensalidade (ex: "2026-05")
//   gatewayId     → id da transação no gateway (para conciliação)
// ============================================================

export const BASE_PAGAMENTOS_AFLITOS = [
  // ── Pagos ──
  { id: "pay_001", studentId: 1, value: 200, status: "pago", method: "pix",             dueDate: "2026-05-10", paidDate: "2026-05-06", paidBy: "responsavel", payerName: "Maria (mãe)",     reference: "2026-05", gatewayId: "asa_9f2a1" },
  { id: "pay_002", studentId: 2, value: 190, status: "pago", method: "cartao_credito",  dueDate: "2026-05-10", paidDate: "2026-05-07", paidBy: "aluno",       payerName: "Aluno Demo 02",    reference: "2026-05", gatewayId: "asa_9f2a2" },
  { id: "pay_003", studentId: 4, value: 190, status: "pago", method: "pix",             dueDate: "2026-05-10", paidDate: "2026-05-10", paidBy: "aluno",       payerName: "Aluno Demo 04",    reference: "2026-05", gatewayId: "asa_9f2a3" },
  { id: "pay_004", studentId: 7, value: 200, status: "pago", method: "dinheiro",        dueDate: "2026-05-15", paidDate: "2026-05-15", paidBy: "responsavel", payerName: "João (pai)",       reference: "2026-05", gatewayId: null },
  { id: "pay_005", studentId: 9, value: 230, status: "pago", method: "pix",             dueDate: "2026-05-15", paidDate: "2026-05-14", paidBy: "responsavel", payerName: "Ana (responsável)", reference: "2026-05", gatewayId: "asa_9f2a5" },
  { id: "pay_006", studentId: 12, value: 200, status: "pago", method: "dinheiro",       dueDate: "2026-05-15", paidDate: "2026-05-15", paidBy: "aluno",       payerName: "Aluno Demo 12",    reference: "2026-05", gatewayId: null },
  { id: "pay_007", studentId: 16, value: 200, status: "pago", method: "cartao_debito",  dueDate: "2026-05-15", paidDate: "2026-05-13", paidBy: "aluno",       payerName: "Aluno Demo 16",    reference: "2026-05", gatewayId: "asa_9f2a7" },

  // ── A vencer (próximos dias) ──
  { id: "pay_008", studentId: 3,  value: 220, status: "pendente", method: null, dueDate: "2026-05-10", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_9f2a8" },
  { id: "pay_009", studentId: 5,  value: 210, status: "pendente", method: null, dueDate: "2026-05-10", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_9f2a9" },
  { id: "pay_010", studentId: 8,  value: 210, status: "pendente", method: null, dueDate: "2026-05-15", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_9f2b0" },

  // ── Atrasados ──
  { id: "pay_011", studentId: 6,  value: 160, status: "atrasado", method: null, dueDate: "2026-05-05", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_9f2b1" },
  { id: "pay_012", studentId: 11, value: 190, status: "atrasado", method: null, dueDate: "2026-05-08", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_9f2b2" },

  // ── Futuros (próxima competência — junho) ──
  { id: "pay_013", studentId: 1, value: 200, status: "futuro", method: null, dueDate: "2026-06-10", paidDate: null, paidBy: null, payerName: null, reference: "2026-06", gatewayId: "asa_9f2b3" },
  { id: "pay_014", studentId: 2, value: 190, status: "futuro", method: null, dueDate: "2026-06-10", paidDate: null, paidBy: null, payerName: null, reference: "2026-06", gatewayId: "asa_9f2b4" },
  { id: "pay_015", studentId: 7, value: 200, status: "futuro", method: null, dueDate: "2026-06-15", paidDate: null, paidBy: null, payerName: null, reference: "2026-06", gatewayId: "asa_9f2b5" },
];

export const BASE_PAGAMENTOS_PRIME = [
  { id: "pay_p01", studentId: 1, value: 200, status: "pago", method: "pix",            dueDate: "2026-05-10", paidDate: "2026-05-08", paidBy: "responsavel", payerName: "Carlos (pai)", reference: "2026-05", gatewayId: "asa_p001" },
  { id: "pay_p02", studentId: 3, value: 210, status: "pago", method: "dinheiro",       dueDate: "2026-05-15", paidDate: "2026-05-15", paidBy: "aluno",       payerName: "Aluno Prime 03", reference: "2026-05", gatewayId: null },
  { id: "pay_p03", studentId: 2, value: 210, status: "pendente", method: null, dueDate: "2026-05-10", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_p003" },
  { id: "pay_p04", studentId: 4, value: 160, status: "atrasado", method: null, dueDate: "2026-05-06", paidDate: null, paidBy: null, payerName: null, reference: "2026-05", gatewayId: "asa_p004" },
  { id: "pay_p05", studentId: 1, value: 200, status: "futuro", method: null, dueDate: "2026-06-10", paidDate: null, paidBy: null, payerName: null, reference: "2026-06", gatewayId: "asa_p005" },
];
