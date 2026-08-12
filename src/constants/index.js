// ============================================================
// CONSTANTES GLOBAIS — AcquaFlow
// ============================================================

// ── Design Tokens (paleta profissional) ──
export const COLORS = {
  primary:      "#1e3a5f",   // azul petróleo profundo
  primaryLight: "#2c5282",
  accent:       "#3182ce",   // azul corporativo
  accentSoft:   "#ebf4ff",
  success:      "#2f855a",
  successSoft:  "#e6f4ea",
  danger:       "#c53030",
  dangerSoft:   "#fdeaea",
  warning:      "#b7791f",
  warningSoft:  "#fdf6e3",
  slate900:     "#1a202c",
  slate700:     "#2d3748",
  slate500:     "#718096",
  slate400:     "#a0aec0",
  slate200:     "#e2e8f0",
  slate100:     "#edf2f7",
  slate50:      "#f7fafc",
  white:        "#ffffff",
};

export const FONT = "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif";

// ── Perfis de acesso ──
// admin     → dono/administrador: acesso total (dashboard, financeiro, pagamentos)
// professor → acesso operacional: alunos e frequência apenas
export const ROLES = {
  admin: {
    label: "Administrador",
    description: "Acesso total ao sistema",
    tabs: ["dashboard", "students", "attendance", "finance", "payments", "alerts"],
    canSeeFinancials: true,   // valores, mensalidades, faturamento
    canManageExpenses: true,  // lançar despesas
    canDeleteStudents: true,
    canEditPlans: true,       // alterar modalidade/plano/preço do aluno
  },
  professor: {
    label: "Professor",
    description: "Cadastro de alunos e controle de frequência",
    tabs: ["students", "attendance"],
    canSeeFinancials: false,
    canManageExpenses: false,
    canDeleteStudents: false,
    canEditPlans: false,
  },
};

// ── Usuários demo (substituir por autenticação real: Supabase Auth) ──
export const USERS = [
  { user: "admin",     password: "admin1234", name: "Administrador", role: "admin" },
  { user: "professor", password: "prof1234",  name: "Professor",     role: "professor" },
];

// Mantido para compatibilidade
export const CREDENTIALS = { user: "admin", password: "admin1234" };

// ── Calendário ──
export const MONTHS      = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
export const MONTHS_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// ── Grade de horários: Seg–Sex, 14h–20h ──
export const DAYS      = ["Seg","Ter","Qua","Qui","Sex"];
export const DAYS_FULL = ["Segunda","Terça","Quarta","Quinta","Sexta"];
export const HOURS     = ["14h","15h","16h","17h","18h","19h","20h"];

// ── Níveis dos alunos ──
export const LEVEL_CONFIG = {
  "Iniciante":     { color: "#3182ce", bg: "#ebf4ff", label: "Iniciante" },
  "Intermediário": { color: "#b7791f", bg: "#fdf6e3", label: "Intermediário" },
  "Avançado":      { color: "#2f855a", bg: "#e6f4ea", label: "Avançado" },
};
export const LEVELS = Object.keys(LEVEL_CONFIG);

// ── Tabela de planos e valores (R$/mês) ──
export const PLANOS = {
  "Sócio":     { "2x": 190, "3x": 200, "4x": 210 },
  "Não Sócio": { "2x": 210, "3x": 220, "4x": 230 },
  "Militar":   { "3x": 160 },
  "Bebê":      { "3x": 230 },
};

// ── Taxas avulsas (R$) ──
export const TAXA_MATRICULA   = 70;
export const TAXA_EXTRA       = 30;   // aula extra, qualquer modalidade
export const TAXA_EXAME       = 30;
export const TAXA_BANHO_LIVRE = 30;   // diária

export const HORARIOS_BANHO = [
  { dias: "Quartas e Sextas",   horas: "10h às 13h" },
  { dias: "Sábados e Domingos", horas: "09h às 15h" },
];

// ── Métodos de pagamento (labels e cores) ──
export const PAYMENT_METHODS = {
  pix:            { label: "Pix",             color: "#00a884", bg: "#e6f7f2" },
  cartao_credito: { label: "Cartão de Crédito", color: "#6b46c1", bg: "#f3effc" },
  cartao_debito:  { label: "Cartão de Débito",  color: "#3182ce", bg: "#ebf4ff" },
  boleto:         { label: "Boleto",          color: "#dd6b20", bg: "#fef3e8" },
  dinheiro:       { label: "Dinheiro",        color: "#2f855a", bg: "#e6f4ea" },
};

// ── Status de pagamento (labels e cores) ──
export const PAYMENT_STATUS = {
  pago:     { label: "Pago",     color: "#2f855a", bg: "#e6f4ea" },
  pendente: { label: "A vencer", color: "#b7791f", bg: "#fdf6e3" },
  atrasado: { label: "Atrasado", color: "#c53030", bg: "#fdeaea" },
  futuro:   { label: "Futuro",   color: "#718096", bg: "#edf2f7" },
};
