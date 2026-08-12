// ============================================================
// DADOS DE DEMONSTRAÇÃO — todos fictícios
// Em produção, substituir por chamadas ao banco (ex: Supabase)
// ============================================================

function demoStudent(id, name, overrides = {}) {
  return {
    id,
    name,
    fee: 200,
    dueDay: 10,
    payDate: null,
    status: "Pendente",
    obs: "",
    email: `demo${String(id).padStart(2, "0")}@email.com`,
    cpf: "",
    phone: "",
    level: "Iniciante",
    attendance: [],
    contractedDays: 2,
    schedule: [],
    modalidade: "Sócio",
    temMatricula: false,
    temExame: false,
    temBanhoLivre: false,
    ...overrides,
  };
}

export const BASE_ALUNOS_AFLITOS = [
  demoStudent(1,  "ALUNO DEMO 01", { status:"Pago", payDate:"2026-05-06", obs:"Recorrente", phone:"81 90000-0001", contractedDays:3, modalidade:"Sócio", fee:200, schedule:["Seg-14h","Qua-14h","Sex-14h"] }),
  demoStudent(2,  "ALUNO DEMO 02", { status:"Pago", payDate:"2026-05-07", obs:"Recorrente", phone:"81 90000-0002", contractedDays:2, modalidade:"Sócio", fee:190, schedule:["Ter-16h","Qui-16h"] }),
  demoStudent(3,  "ALUNO DEMO 03", { level:"Intermediário", phone:"81 90000-0003", contractedDays:3, modalidade:"Não Sócio", fee:220 }),
  demoStudent(4,  "ALUNO DEMO 04", { status:"Pago", payDate:"2026-05-10", obs:"PIX", level:"Intermediário", contractedDays:2, modalidade:"Sócio", fee:190, schedule:["Qua-17h","Qui-17h"] }),
  demoStudent(5,  "ALUNO DEMO 05", { level:"Avançado", contractedDays:4, modalidade:"Sócio", fee:210 }),
  demoStudent(6,  "ALUNO DEMO 06", { contractedDays:3, modalidade:"Militar", fee:160 }),
  demoStudent(7,  "ALUNO DEMO 07", { status:"Pago", payDate:"2026-05-15", obs:"Dinheiro", level:"Avançado", dueDay:15, contractedDays:3, modalidade:"Sócio", fee:200 }),
  demoStudent(8,  "ALUNO DEMO 08", { level:"Intermediário", dueDay:15, contractedDays:2, modalidade:"Não Sócio", fee:210 }),
  demoStudent(9,  "ALUNO DEMO 09", { status:"Pago", payDate:"2026-05-14", obs:"PIX", dueDay:15, contractedDays:3, modalidade:"Bebê", fee:230 }),
  demoStudent(10, "ALUNO DEMO 10", { level:"Avançado", dueDay:15, contractedDays:4, modalidade:"Não Sócio", fee:230 }),
  demoStudent(11, "ALUNO DEMO 11", { level:"Intermediário", dueDay:15, contractedDays:2, modalidade:"Sócio", fee:190 }),
  demoStudent(12, "ALUNO DEMO 12", { status:"Pago", payDate:"2026-05-15", obs:"Dinheiro", dueDay:15, contractedDays:3, modalidade:"Sócio", fee:200 }),
  demoStudent(13, "ALUNO DEMO 13", { level:"Intermediário", dueDay:15, contractedDays:2, modalidade:"Sócio", fee:190 }),
  demoStudent(14, "ALUNO DEMO 14", { dueDay:15, contractedDays:3, modalidade:"Militar", fee:160 }),
  demoStudent(15, "ALUNO DEMO 15", { level:"Avançado", dueDay:15, email:"", contractedDays:4, modalidade:"Sócio", fee:210 }),
  demoStudent(16, "ALUNO DEMO 16", { status:"Pago", payDate:"2026-05-13", obs:"Recorrente", level:"Intermediário", dueDay:15, contractedDays:3, modalidade:"Sócio", fee:200 }),
  demoStudent(17, "ALUNO DEMO 17", { dueDay:15, email:"", contractedDays:2, modalidade:"Não Sócio", fee:210 }),
  demoStudent(18, "ALUNO DEMO 18", { level:"Intermediário", dueDay:15, email:"", contractedDays:2, modalidade:"Sócio", fee:190 }),
  demoStudent(19, "ALUNO DEMO 19", { dueDay:15, email:"", contractedDays:3, modalidade:"Sócio", fee:200 }),
  demoStudent(20, "ALUNO DEMO 20", { level:"Avançado", dueDay:15, email:"", contractedDays:4, modalidade:"Não Sócio", fee:230 }),
  demoStudent(21, "ALUNO DEMO 21", { dueDay:15, email:"", contractedDays:2, modalidade:"Sócio", fee:190 }),
  demoStudent(22, "ALUNO DEMO 22", { level:"Intermediário", dueDay:25, contractedDays:3, modalidade:"Sócio", fee:200 }),
  demoStudent(23, "ALUNO DEMO 23", { level:"Avançado", dueDay:25, contractedDays:3, modalidade:"Bebê", fee:230 }),
];

export const BASE_GASTOS_AFLITOS = [
  { id: 1, desc: "Aquecimento da Piscina (Gás)",  amount: 5500, month: 5 },
  { id: 2, desc: "Tratamento Químico da Água",    amount: 2400, month: 5 },
  { id: 3, desc: "Energia Elétrica",              amount: 1500, month: 5 },
  { id: 4, desc: "Manutenção do Filtro de Areia", amount:  800, month: 5 },
];

export const BASE_ALUNOS_PRIME = [
  demoStudent(1, "ALUNO PRIME 01", { status:"Pago", payDate:"2026-05-08", obs:"PIX", phone:"81 90000-1001", contractedDays:3, modalidade:"Sócio", fee:200, schedule:["Seg-15h","Qua-15h","Sex-15h"] }),
  demoStudent(2, "ALUNO PRIME 02", { level:"Intermediário", phone:"81 90000-1002", contractedDays:2, modalidade:"Não Sócio", fee:210 }),
  demoStudent(3, "ALUNO PRIME 03", { status:"Pago", payDate:"2026-05-15", obs:"Dinheiro", level:"Avançado", dueDay:15, contractedDays:4, modalidade:"Sócio", fee:210 }),
  demoStudent(4, "ALUNO PRIME 04", { dueDay:15, email:"", phone:"81 90000-1004", contractedDays:3, modalidade:"Militar", fee:160 }),
  demoStudent(5, "ALUNO PRIME 05", { level:"Intermediário", dueDay:25, contractedDays:3, modalidade:"Bebê", fee:230 }),
];

export const BASE_GASTOS_PRIME = [
  { id: 1, desc: "Aluguel do Espaço",  amount: 3200, month: 5 },
  { id: 2, desc: "Tratamento da Água", amount: 1800, month: 5 },
  { id: 3, desc: "Energia Elétrica",   amount:  950, month: 5 },
];
