import { useState, useEffect } from "react";
import { COLORS, FONT, ROLES } from "../constants";
import StudentModal from "./modals/StudentModal";
import ExpenseModal from "./modals/ExpenseModal";
import DashboardTab from "./tabs/DashboardTab";
import StudentsTab from "./tabs/StudentsTab";
import AttendanceTab from "./tabs/AttendanceTab";
import FinanceTab from "./tabs/FinanceTab";
import AlertsTab from "./tabs/AlertsTab";
import PaymentsTab from "./tabs/PaymentsTab";
import { getPaymentAlert } from "../utils/helpers";
import { supabase } from "../lib/supabase";

const TABS = [
  { id: "dashboard",  label: "Dashboard" },
  { id: "students",   label: "Alunos" },
  { id: "attendance", label: "Frequência" },
  { id: "finance",    label: "Financeiro" },
  { id: "payments",   label: "Pagamentos" },
  { id: "alerts",     label: "Alertas" },
];

export default function UnitDashboard({ unitId, unitName, currentUser, onBack, onLogout }) {
  const role = ROLES[currentUser?.role] || ROLES.professor;
  const allowedTabs = TABS.filter((t) => role.tabs.includes(t.id));

  // Estados
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gastos, setGastos] = useState([]);
  const [payments, setPayments] = useState([]);
  const [frequencias, setFrequencias] = useState([]);

  // UI state
  const [tab, setTab] = useState(role.tabs[0]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [studentModal, setStudentModal] = useState(null);
  const [expenseModal, setExpenseModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Frequência
  const [attendDate, setAttendDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendStudent, setAttendStudent] = useState(null);
  const [extraPopup, setExtraPopup] = useState(null);

  // ── Funções de Pagamentos ──
  async function loadPayments() {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .order('data', { ascending: false });
    if (error) {
      console.error("Erro ao carregar pagamentos:", error);
      return [];
    }
    return data || [];
  }

  // ── Funções de Frequência ──
  async function loadFrequencias(dataAula) {
    const { data, error } = await supabase
      .from('frequencia')
      .select('*')
      .eq('data_aula', dataAula);
    if (error) {
      console.error("Erro ao carregar frequências:", error);
      return [];
    }
    return data || [];
  }

  async function saveFrequencia(alunoId, dataAula, presente, observacao = '') {
    const existing = frequencias.find(
      f => f.aluno_id === alunoId && f.data_aula === dataAula && f.observacao === observacao
    );

    try {
      if (existing) {
        const { error } = await supabase
          .from('frequencia')
          .update({ presente, observacao })
          .eq('id', existing.id);
        if (error) throw error;
        setFrequencias(prev =>
          prev.map(f => f.id === existing.id ? { ...f, presente, observacao } : f)
        );
      } else {
        const { data, error } = await supabase
          .from('frequencia')
          .insert({ aluno_id: alunoId, data_aula: dataAula, presente, observacao })
          .select();
        if (error) throw error;
        setFrequencias(prev => [...prev, data[0]]);
      }
    } catch (err) {
      console.error("Erro ao salvar frequência:", err);
      alert("Erro ao salvar frequência: " + err.message);
    }
  }

  // ── Carregar dados iniciais ──
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        // Carregar alunos
        const { data: alunosData, error: alunosError } = await supabase
          .from('alunos')
          .select('*')
          .order('nome');
        if (alunosError) throw alunosError;

        const formatted = (alunosData || []).map(item => ({
          id: item.id,
          name: item.nome || '',
          birthDate: item.data_nascimento || '',
          phone: item.telefone || '',
          email: item.email || '',
          responsible: item.responsavel || '',
          active: item.ativo !== undefined ? item.ativo : true,
          status: item.status || 'Pendente',
          payDate: item.pay_date || null,
          fee: item.fee || 0,
          dueDay: item.due_day || 0,
          level: item.level || '',
          contractedDays: item.contracted_days || 0,
          schedule: item.schedule || [],
        }));
        setStudents(formatted);

        // Carregar frequências da data atual
        const hoje = new Date().toISOString().split('T')[0];
        const freqs = await loadFrequencias(hoje);
        setFrequencias(freqs);

        // Carregar pagamentos
        const paymentsData = await loadPayments();
        setPayments(paymentsData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Recarregar frequências quando a data mudar
  useEffect(() => {
    async function updateFrequencias() {
      const freqs = await loadFrequencias(attendDate);
      setFrequencias(freqs);
    }
    updateFrequencias();
  }, [attendDate]);

  // ── Toast ──
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── CRUD de alunos ──
  async function saveStudent(form) {
    const alunoData = {
      nome: form.name,
      data_nascimento: form.birthDate || null,
      telefone: form.phone || null,
      email: form.email || null,
      responsavel: form.responsible || null,
      ativo: true,
      professor_id: currentUser?.id || null,
      fee: form.fee || 0,
      due_day: form.dueDay || 0,
      level: form.level || '',
      contracted_days: form.contractedDays || 0,
      schedule: form.schedule || [],
    };

    try {
      if (studentModal?.id) {
        const { error } = await supabase
          .from('alunos')
          .update(alunoData)
          .eq('id', studentModal.id);
        if (error) throw error;
        setStudents((prev) =>
          prev.map((s) =>
            s.id === studentModal.id
              ? {
                  ...s,
                  name: alunoData.nome,
                  birthDate: alunoData.data_nascimento,
                  phone: alunoData.telefone,
                  email: alunoData.email,
                  responsible: alunoData.responsavel,
                  fee: alunoData.fee,
                  dueDay: alunoData.due_day,
                  level: alunoData.level,
                  contractedDays: alunoData.contracted_days,
                  schedule: alunoData.schedule,
                }
              : s
          )
        );
        showToast("Aluno atualizado com sucesso.");
      } else {
        const { data, error } = await supabase
          .from('alunos')
          .insert(alunoData)
          .select();
        if (error) throw error;

        const newStudent = {
          id: data[0].id,
          name: alunoData.nome,
          birthDate: alunoData.data_nascimento,
          phone: alunoData.telefone,
          email: alunoData.email,
          responsible: alunoData.responsavel,
          active: true,
          status: 'Pendente',
          payDate: null,
          fee: alunoData.fee,
          dueDay: alunoData.due_day,
          level: alunoData.level,
          contractedDays: alunoData.contracted_days,
          schedule: alunoData.schedule,
        };
        setStudents((prev) => [...prev, newStudent]);
        showToast("Aluno cadastrado com sucesso.");
      }
      setStudentModal(null);
    } catch (err) {
      console.error("Erro ao salvar aluno:", err);
      showToast("Erro ao salvar aluno: " + err.message);
    }
  }

  function deleteStudent(id) {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast("Aluno removido.");
  }

  function toggleLock(id) {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return s.status === "Trancado"
          ? { ...s, status: "Pendente" }
          : { ...s, status: "Trancado", payDate: null };
      })
    );
    showToast("Status da matrícula atualizado.");
  }

  function markPaid(id) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id !== id
          ? s
          : { ...s, status: "Pago", payDate: new Date().toISOString().split("T")[0] }
      )
    );
    showToast("Pagamento registrado.");
  }

  // ── Despesas (mock) ──
  function saveExpense(exp) {
    setGastos((prev) => [...prev, exp]);
    setExpenseModal(false);
    showToast("Despesa lançada.");
  }

  function deleteExpense(id) {
    setGastos((prev) => prev.filter((g) => g.id !== id));
    showToast("Despesa removida.");
  }

  const alertCount = students.filter((s) => getPaymentAlert(s) !== null).length;

  // ── Renderização ──
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: COLORS.slate50, fontFamily: FONT }}>
      <header style={{ background: COLORS.primary, color: "white", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, paddingBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={onBack} style={{
              background: "rgba(255,255,255,0.1)", border: "none", color: "white",
              borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: FONT,
            }}>
              ← Unidades
            </button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>AcquaFlow</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{unitName}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setStudentModal("new")} style={{
              background: "white", border: "none", color: COLORS.primary,
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: FONT,
            }}>
              + Novo Aluno
            </button>
            {role.canManageExpenses && (
              <button onClick={() => setExpenseModal(true)} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "white", borderRadius: 8, padding: "8px 14px",
                cursor: "pointer", fontSize: 12, fontFamily: FONT,
              }}>
                Despesa
              </button>
            )}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              paddingLeft: 12, marginLeft: 4, borderLeft: "1px solid rgba(255,255,255,0.2)",
            }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{currentUser?.name}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{role.label}</div>
              </div>
              <button onClick={onLogout} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.7)",
                cursor: "pointer", fontSize: 13, fontFamily: FONT,
              }}>
                Sair
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 2, overflowX: "auto" }}>
          {allowedTabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 18px", border: "none", cursor: "pointer", fontFamily: FONT,
              fontSize: 13, fontWeight: 600, borderRadius: "8px 8px 0 0", whiteSpace: "nowrap",
              background: tab === t.id ? COLORS.slate50 : "transparent",
              color: tab === t.id ? COLORS.primary : "rgba(255,255,255,0.7)",
              transition: "all 0.15s",
            }}>
              {t.label}
              {t.id === "alerts" && alertCount > 0 && (
                <span style={{
                  marginLeft: 6, background: COLORS.danger, color: "white",
                  borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                }}>
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main style={{ flex: 1, padding: 24, maxWidth: 1400, width: "100%", boxSizing: "border-box", margin: "0 auto" }}>
        {tab === "dashboard" && role.canSeeFinancials && <DashboardTab />}

        {tab === "students" && (
          <StudentsTab
            students={students}
            role={role}
            search={search} setSearch={setSearch}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            onEdit={(s) => setStudentModal(s)}
            onDelete={deleteStudent}
            onToggleLock={toggleLock}
          />
        )}

        {tab === "attendance" && (
          <AttendanceTab
            students={students}
            setStudents={setStudents}
            role={role}
            attendDate={attendDate}
            setAttendDate={setAttendDate}
            attendStudent={attendStudent}
            setAttendStudent={setAttendStudent}
            extraPopup={extraPopup}
            setExtraPopup={setExtraPopup}
            frequencias={frequencias}
            setFrequencias={setFrequencias}
            saveFrequencia={saveFrequencia}
            loadFrequencias={loadFrequencias}
          />
        )}

        {tab === "finance" && role.canSeeFinancials && (
          <FinanceTab
            students={students} gastos={gastos}
            onAddExpense={() => setExpenseModal(true)}
            onDeleteExpense={deleteExpense}
          />
        )}

        {tab === "payments" && role.canSeeFinancials && (
          <PaymentsTab students={students} />
        )}

        {tab === "alerts" && role.canSeeFinancials && <AlertsTab />}
      </main>

      {studentModal && (
        <StudentModal
          student={studentModal === "new" ? null : studentModal}
          role={role}
          onSave={saveStudent}
          onClose={() => setStudentModal(null)}
        />
      )}
      {expenseModal && role.canManageExpenses && <ExpenseModal onSave={saveExpense} onClose={() => setExpenseModal(false)} />}

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: COLORS.slate900, color: "white", borderRadius: 10,
          padding: "13px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          fontSize: 13, fontWeight: 500,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}