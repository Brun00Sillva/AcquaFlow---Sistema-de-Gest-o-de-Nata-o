# 🏊 AcquaFlow - Sistema de Gestão de Natação

## 📋 Sobre o Projeto

O **AcquaFlow** é um sistema completo de gestão para academias de natação, desenvolvido para facilitar o controle de alunos, frequência, planos, pagamentos e alertas automatizados.

### 🎯 Objetivo

Oferecer uma solução intuitiva e eficiente para:
- **Gerenciar alunos** (cadastro, edição, exclusão)
- **Controlar frequência** com grade semanal interativa
- **Calcular automaticamente aulas extras** com cobrança adicional
- **Gerar alertas** para cobranças extras
- **Gerenciar pagamentos** (receitas e despesas)
- **Visualizar dashboard** com KPIs e gráficos em tempo real

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| **React** | Biblioteca para construção da interface |
| **Supabase** | Backend como serviço (PostgreSQL + Auth + Storage) |
| **Recharts** | Biblioteca para gráficos no dashboard |
| **CSS-in-JS** | Estilização inline com React |


## 🏗️ Estrutura do Projeto


## 🏗️ Estrutura do Projeto

```
AcquaFlowPro-main/
├── public/
├── src/
│   ├── components/
│   │   ├── modals/          # Modais (StudentModal, ExpenseModal)
│   │   ├── tabs/            # Abas do dashboard
│   │   ├── common/          # Componentes reutilizáveis
│   │   ├── LoginPage.jsx
│   │   ├── UnitDashboard.jsx
│   │   └── UnitSelector.jsx
│   ├── constants/           # Cores, textos, configurações
│   ├── data/                # Dados mockados (substituídos pelo Supabase)
│   ├── lib/                 # Configuração do Supabase
│   ├── utils/               # Funções auxiliares
│   ├── App.jsx
│   └── index.js
├── .env.local               # Variáveis de ambiente (NÃO SUBIR PARA O GIT)
├── .gitignore
├── package.json
└── README.md
```
## 🚀 Como Rodar o Projeto

### 1️⃣ Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **NPM** ou **Yarn**
- Conta no **Supabase** (gratuita)

### 2️⃣ Clonar o Repositório

## 🚀 Como Rodar o Projeto

### 1️⃣ Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **NPM** ou **Yarn**
- Conta no **Supabase** (gratuita)

### 2️⃣ Clonar o Repositório


git clone https://github.com/Brun00Sillva/AcquaFlow---Sistema-de-Gest-o-de-Nata-o.git
cd AcquaFlow---Sistema-de-Gest-o-de-Nata-o
3️⃣ Instalar Dependências
bash
npm install

4️⃣ Configurar Variáveis de Ambiente
Crie um arquivo .env.local na raiz do projeto com as credenciais do Supabase:

text
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

5️⃣ Configurar o Supabase
Crie um projeto no Supabase

Execute os scripts SQL disponíveis no SQL Editor para criar:

Tabelas (usuarios, alunos, matriculas, modalidades, frequencia, pagamentos, alertas)

Views (vw_extras_mensais, vw_receitas_despesas_mensais, vw_situacao_pagamentos, vw_alunos_ativos)

Funções (gerar_alertas_extras())

Agendamento (Cron) para gerar alertas mensais

Crie usuários de teste no Authentication:

admin@acquaflow.com / admin1234

professor@acquaflow.com / prof1234

Vincule os usuários na tabela usuarios com seus UUIDs.

6️⃣ Rodar o Servidor
bash
npm start
O aplicativo estará disponível em http://localhost:3000.

🧪 Credenciais de Teste
Perfil	E-mail	Senha
Administrador	admin@acquaflow.com	123456
Professor	professor@acquaflow.com	1234567
📦 Funcionalidades
🔐 Autenticação
Login com Supabase Auth (JWT)

Dois perfis: Admin (acesso total) e Professor (alunos e frequência)

👨‍🎓 Alunos
Cadastro, edição, exclusão

Campos: nome, data de nascimento, telefone, e-mail, responsável

Status: Pendente / Pago / Trancado

Plano: aulas por semana, horários, nível, mensalidade

📊 Frequência
Grade semanal interativa (dias × horários)

Marcação/desmarcação de presenças

Cálculo automático de aulas extras

Pop-up de confirmação para extras

Painel lateral com resumo mensal

💰 Financeiro
Receitas (mensalidades, extras)

Despesas (operacionais, materiais)

Saldo líquido

Gráficos de receitas × despesas

🔔 Alertas
Gerados automaticamente para aulas extras

Lista com status "Pendente" / "Resolvido"

Filtros por status

Botão para marcar como resolvido


📈 Dashboard
KPIs: alunos ativos, em atraso, em dia, saldo

Gráfico de barras: receitas × despesas (mensal)

Gráfico de pizza: distribuição por nível

Situação dos alunos (em dia / em atraso)

🗄️ Estrutura do Banco de Dados
Tabelas Principais
Tabela	Descrição
usuarios	Administradores e professores (vinculado ao Auth)
alunos	Alunos cadastrados
modalidades	Planos (Sócio, Não Sócio, Militar, Bebê)
matriculas	Vinculação aluno ↔ modalidade
frequencia	Registro de presenças (com observacao para slot)
pagamentos	Receitas e despesas
alertas	Alertas gerados automaticamente
Views
View	Descrição
vw_extras_mensais	Calcula aulas extras por aluno/mês
vw_receitas_despesas_mensais	Agrega receitas e despesas por mês
vw_situacao_pagamentos	Contagem de alunos em dia/atraso
vw_alunos_ativos	Lista alunos ativos com plano e professor
Funções
Função	Descrição
gerar_alertas_extras()	Gera alertas para alunos com extras no mês
Agendamento (Cron)	Executa gerar_alertas_extras() todo dia 1º de cada mês

🛡️ Segurança
Row Level Security (RLS) ativa para todas as tabelas.

Admin tem acesso total.

Professor só vê e gerencia seus alunos.

Variáveis de ambiente usadas para credenciais do Supabase.

.env.local e node_modules/ ignorados pelo Git.
