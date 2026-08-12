import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { COLORS, MONTHS, LEVEL_CONFIG } from "../../constants";
import { fmt } from "../../utils/helpers";
import { supabase } from "../../lib/supabase";

export default function DashboardTab() {
  const [loading, setLoading] = useState(true);
  const [alunosAtivos, setAlunosAtivos] = useState(0);
  const [situacaoPagamentos, setSituacaoPagamentos] = useState({ total: 0, emDia: 0, emAtraso: 0 });
  const [receitasDespesas, setReceitasDespesas] = useState([]);
  const [nivelData, setNivelData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      // 1. Carregar alunos ativos
      const { data: alunosData, error: alunosError } = await supabase
        .from('vw_alunos_ativos')
        .select('*');
      if (alunosError) throw alunosError;
      setAlunosAtivos(alunosData?.length || 0);

      // 2. Carregar situação de pagamentos
      const { data: situacaoData, error: situacaoError } = await supabase
        .from('vw_situacao_pagamentos')
        .select('*')
        .maybeSingle();
      if (situacaoError) throw situacaoError;
      setSituacaoPagamentos({
        total: situacaoData?.total_alunos || 0,
        emDia: situacaoData?.em_dia || 0,
        emAtraso: situacaoData?.em_atraso || 0,
      });

      // 3. Carregar receitas e despesas mensais
      const { data: receitasDespesasData, error: rdError } = await supabase
        .from('vw_receitas_despesas_mensais')
        .select('*')
        .order('mes', { ascending: true });
      if (rdError) throw rdError;
      
      // Formatar para o gráfico (usar os meses do sistema se não houver dados)
      const formatted = formatReceitasDespesas(receitasDespesasData || []);
      setReceitasDespesas(formatted);

      // 4. Carregar distribuição por nível (usando alunos ativos)
      const { data: nivelData, error: nivelError } = await supabase
        .from('vw_alunos_ativos')
        .select('nivel');
      if (nivelError) throw nivelError;

      // Agrupar por nível
      const nivelCount = (nivelData || []).reduce((acc, item) => {
        const nivel = item.nivel || 'Não definido';
        acc[nivel] = (acc[nivel] || 0) + 1;
        return acc;
      }, {});

      const nivelFormatted = Object.keys(nivelCount).map(nivel => ({
        name: nivel,
        value: nivelCount[nivel],
        color: LEVEL_CONFIG[nivel]?.color || COLORS.slate400,
      }));
      setNivelData(nivelFormatted);

    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatReceitasDespesas(data) {
    // Se não houver dados, criar um array com meses do ano atual com valores zerados
    if (!data || data.length === 0) {
      return MONTHS.map(month => ({
        name: month,
        Receitas: 0,
        Despesas: 0,
      }));
    }

    // Mapear os dados existentes
    const monthMap = {};
    data.forEach(item => {
      // item.mes está no formato 'YYYY-MM'
      const monthIndex = parseInt(item.mes.split('-')[1]) - 1;
      monthMap[monthIndex] = {
        Receitas: parseFloat(item.receitas || 0),
        Despesas: parseFloat(item.despesas || 0),
      };
    });

    // Preencher todos os meses
    return MONTHS.map((month, index) => ({
      name: month,
      Receitas: monthMap[index]?.Receitas || 0,
      Despesas: monthMap[index]?.Despesas || 0,
    }));
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  const faturamento = receitasDespesas.reduce((sum, item) => sum + item.Receitas, 0);
  const totalDespesas = receitasDespesas.reduce((sum, item) => sum + item.Despesas, 0);
  const saldo = faturamento - totalDespesas;

  const cardStyle = { background: "white", borderRadius: 10, padding: 20, border: `1px solid ${COLORS.slate200}` };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <div style={{ ...cardStyle, borderLeft: `4px solid ${COLORS.success}` }}>
          <div style={{ fontSize: 12, color: COLORS.slate500 }}>Alunos Ativos</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.slate900 }}>{alunosAtivos}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `4px solid ${COLORS.warning}` }}>
          <div style={{ fontSize: 12, color: COLORS.slate500 }}>Em Atraso</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.danger }}>{situacaoPagamentos.emAtraso}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `4px solid ${COLORS.success}` }}>
          <div style={{ fontSize: 12, color: COLORS.slate500 }}>Em Dia</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.success }}>{situacaoPagamentos.emDia}</div>
        </div>
        <div style={{ ...cardStyle, borderLeft: `4px solid ${saldo >= 0 ? COLORS.success : COLORS.danger}` }}>
          <div style={{ fontSize: 12, color: COLORS.slate500 }}>Saldo</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: saldo >= 0 ? COLORS.success : COLORS.danger }}>
            {fmt(saldo)}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.slate900, marginBottom: 2 }}>Receitas × Despesas</div>
          <div style={{ fontSize: 12, color: COLORS.slate500, marginBottom: 14 }}>Histórico mensal — {new Date().getFullYear()}</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={receitasDespesas}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.slate100} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.slate500 }} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.slate500 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Receitas" fill={COLORS.success} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Despesas" fill={COLORS.danger} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.slate900, marginBottom: 2 }}>Alunos por Nível</div>
          <div style={{ fontSize: 12, color: COLORS.slate500, marginBottom: 14 }}>Distribuição atual</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={nivelData} cx="50%" cy="50%" innerRadius={48} outerRadius={78}
                dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}
              >
                {nivelData.map((d) => <Cell key={d.name} fill={d.color || COLORS.slate400} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Situação */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.slate900, marginBottom: 14 }}>Situação dos Alunos — Mês Atual</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Em dia", count: situacaoPagamentos.emDia, bg: COLORS.successSoft, color: COLORS.success },
            { label: "Em atraso", count: situacaoPagamentos.emAtraso, bg: COLORS.dangerSoft, color: COLORS.danger },
          ].map((item) => (
            <div key={item.label} style={{
              background: item.bg, borderRadius: 10, padding: "12px 22px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: item.color }}>{item.count}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}