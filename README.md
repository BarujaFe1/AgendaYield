<div align="center">
  <img src="./assets/icon.png" alt="AgendaYield Logo" width="120" height="120" />

  <h1>AgendaYield</h1>

  <p><strong>Yield da agenda, risco de no-show e recuperação de horários ociosos para negócios de serviço.</strong></p>
  <p><strong>Agenda yield, no-show risk and idle-slot recovery for service businesses.</strong></p>

  <p>
    <a href="#1-visão-geral--overview">PT-BR / English Overview</a> •
    <a href="#-product-preview">Preview</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#️-stack--tecnologias">Stack</a> •
    <a href="#-arquitetura--architecture">Architecture</a> •
    <a href="#-quick-start--início-rápido">Quick Start</a> •
    <a href="#-autor--author">Author</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Python" src="https://img.shields.io/badge/Python-Analytics-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Pandas" src="https://img.shields.io/badge/Pandas-Agenda%20Yield-150458?style=for-the-badge&logo=pandas&logoColor=white" />
    <img alt="No-Show Recovery" src="https://img.shields.io/badge/No--Show-Recovery%20Cockpit-2DD4A8?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="AgendaYield product overview" width="100%" />
</p>

---

## 1. Visão Geral / Overview

O **AgendaYield** é um SaaS de yield para negócios com agenda que perdem receita por no-show, buracos na grade, baixa ocupação e reagendamento caótico.

Ele cruza agenda, histórico, confirmação e comparecimento para mostrar **risco de falta**, **capacidade ociosa**, **receita perdida** e uma **lista de ações de recuperação**. Em vez de ser só mais uma agenda, o produto maximiza ocupação paga e reduz perda operacional.

O projeto foi desenvolvido por **Felipe Alirio Baruja** como peça de portfólio que demonstra produto de dados temporais, UX operacional, cálculo de ROI e automação preparada para clínicas estéticas, salões, studios e serviços recorrentes.

> **Operational Yield Notice**  
> O AgendaYield foi criado para gestão de ocupação e recuperação de horários. Ele **não é** prontuário eletrônico, **não armazena** dado médico sensível no MVP e **não** substitui um marketplace de reservas.

---

## ✨ Product Preview

<p align="center">
  <img src="./assets/screenshots/01-calendar-yield-cockpit.png" alt="AgendaYield Calendar Yield Cockpit" width="100%" />
</p>

O AgendaYield apresenta uma experiência operacional premium: KPIs de yield, risco de no-show, fila de confirmação, ocupação por profissional, receita perdida e ações rápidas de recuperação.

---

## 2. Por que este projeto importa? / Why this project matters

* **Cada horário vazio é receita que não volta:** No-show e cancelamento tardio geram ociosidade cara em negócios de ticket médio/alto.
* **Agenda comum não otimiza yield:** Marcar horário não é o mesmo que maximizar ocupação paga e recuperar buracos.
* **O comprador entende o ROI:** Dono/gestor de agenda visualiza receita perdida e ações com impacto estimado em R$.
* **Portfólio com dor real:** Combina analytics temporal, scoring interpretável, UX de cockpit e posicionamento SaaS vendável.

---

## 🧠 O diferencial do AgendaYield / What makes AgendaYield different

### Português
O AgendaYield não compete como agenda genérica. Ele é um **cockpit de yield**:
- mede ocupação e no-show;
- ranqueia risco de falta com score interpretável;
- organiza confirmações pendentes;
- estima receita perdida e recuperável;
- sugere encaixes e ações operacionais.

### English
AgendaYield is not a generic booking calendar. It is a **yield cockpit**:
- measures occupancy and no-shows;
- ranks absence risk with an interpretable score;
- organizes pending confirmations;
- estimates lost and recoverable revenue;
- suggests fill-in slots and operational actions.

---

## 🎯 Problema que resolve / The problem it solves

Em operações reais de clínicas, salões e studios:
- clientes esquecem, remarcam tarde ou não confirmam;
- a grade fica com buracos difíceis de reaproveitar;
- o gestor não vê receita perdida de forma clara;
- lembretes manuais no WhatsApp não escalam;
- planilhas e Google Calendar não priorizam risco.

O **AgendaYield** cria uma camada entre “a agenda está cheia no papel” e “a agenda está convertendo em receita”.

---

## 🧩 Proposta / Yield Pipeline

O AgendaYield processa eventos de agenda e entrega uma visão estruturada de ocupação, risco e recuperação:

```txt
CSV / Google Calendar (manual no MVP)
  ↓
Cadastro de clientes e profissionais
  ↓
Status: confirmado / compareceu / faltou / cancelou
  ↓
KPIs de ocupação e no-show
  ↓
Score de risco interpretável
  ↓
Receita perdida + recuperável
  ↓
Fila de confirmação + lista de encaixe
  ↓
Ações de recuperação com impacto em R$
```

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/01-calendar-yield-cockpit.png" alt="Calendar Yield Cockpit" />
      <br />
      <sub><strong>Calendar Yield Cockpit</strong> — ocupação, no-show, confirmação e receita perdida em um só painel.</sub>
    </td>
    <td width="50%">
      <img src="./assets/screenshots/02-confirmation-queue.png" alt="Confirmation Queue" />
      <br />
      <sub><strong>Confirmation Queue</strong> — horários pendentes priorizados por proximidade e canal.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/03-noshow-risk-board.png" alt="No-Show Risk Board" />
      <br />
      <sub><strong>No-Show Risk Board</strong> — clientes com score de risco, histórico e ação recomendada.</sub>
    </td>
    <td width="50%">
      <img src="./assets/screenshots/04-occupancy-by-pro.png" alt="Occupancy by Professional" />
      <br />
      <sub><strong>Occupancy by Professional</strong> — capacidade utilizada, faltas e perda por profissional.</sub>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="./assets/screenshots/05-lost-revenue.png" alt="Lost Revenue" />
      <br />
      <sub><strong>Lost Revenue</strong> — visão semanal da receita que deixou de entrar por ociosidade.</sub>
    </td>
    <td width="50%">
      <img src="./assets/screenshots/06-fill-in-slots.png" alt="Fill-in Slots" />
      <br />
      <sub><strong>Fill-in Slots</strong> — buracos recuperáveis com candidatos de waitlist.</sub>
    </td>
  </tr>
</table>

---

## 📄 Weekly Report & Upgrade

<p align="center">
  <img src="./assets/screenshots/07-weekly-report.png" alt="AgendaYield Weekly Report" width="70%" />
</p>

O relatório semanal consolida ocupação, no-show, receita perdida e ações executadas. A tela de upgrade posiciona planos Solo / Studio / Pro com add-ons de SMS, WhatsApp e IA.

---

## 📌 Estudo de Caso / Case Study

### 📌 Estudo de Caso: Studio Aurora Aesthetic
O dataset demo simula um studio estético com 3 profissionais, agenda de ~4 semanas, serviços de R$120 a R$890 e desfechos de confirmação/comparecimento. O AgendaYield calcula ocupação, no-show rate, receita perdida e prioriza clientes high-risk ainda sem confirmação.

A camada de risco usa heurística interpretável (faltas prévias, status de confirmação, lead time, fim de semana/noite). O resultado é uma lista operacional de recuperação — não um modelo caixa-preta.

### 📌 Case Study: Studio Aurora Aesthetic
The demo dataset simulates an aesthetic studio with 3 professionals, ~4 weeks of agenda, services from R$120 to R$890 and confirmation/attendance outcomes. AgendaYield computes occupancy, no-show rate, lost revenue and prioritizes high-risk unconfirmed clients.

The risk layer uses an interpretable heuristic (prior no-shows, confirmation status, lead time, weekend/evening). The output is an operational recovery list — not a black-box model.

---

## 🧭 Visual Story / Jornada Operacional

A experiência do AgendaYield foi pensada como uma jornada de yield:
```txt
1. Importar agenda CSV (ou carregar o demo do Studio Aurora)
2. Ler os KPIs de ocupação, no-show e receita perdida
3. Abrir o No-Show Risk Board e atacar high-risk pendentes
4. Trabalhar a fila de confirmação por proximidade do horário
5. Oferecer buracos na lista de encaixe / waitlist
6. Executar ações de recuperação com impacto estimado em R$
7. Revisar ocupação por profissional e rebalancear a grade
8. Evoluir para lembretes automáticos e depósito/sinal (Fase 2)
```

---

## ⚙️ Funcionalidades Principais / Core Features

### Calendar Yield Cockpit
Painel inicial com ocupação, no-show, confirmação, buracos, receita perdida e receita recuperável.

### No-Show Risk Board
Score interpretável por horário/cliente com banda low/medium/high e ação recomendada.

### Confirmation Queue
Lista operacional de confirmações pendentes com canal e tempo até o atendimento.

### Occupancy by Professional
Comparativo de capacidade utilizada, faltas e perda financeira por profissional.

### Fill-in / Recovery Actions
Buracos elegíveis para encaixe e backlog de ações priorizadas (`now` / `today` / `this_week`).

### Billing-ready positioning
Planos Solo R$49 · Studio R$129 · Pro R$249, com add-ons de SMS/WhatsApp/IA preparados para evolução comercial.

---

## 🛠️ Stack / Tecnologias

### Frontend
- **Framework:** Next.js 15 (App Router) & React 19
- **Linguagem:** TypeScript
- **Estilização:** CSS operacional premium (tema yield)
- **Gráficos:** Recharts
- **Ícones:** Lucide Icons

### Backend
- **Framework API:** FastAPI & Uvicorn (Python)
- **Modelagem & Validação:** Pydantic v2
- **Processamento de Agenda:** Pandas / NumPy
- **Suite de Testes:** Pytest

### Infra prevista
- Supabase, Google Calendar API, Resend/WhatsApp provider
- Stripe / Mercado Pago, PostHog, Sentry, Vercel

---

## 🧱 Arquitetura / Architecture

O projeto adota uma arquitetura monorepo simplificada:

```text
AgendaYield/
├── apps/
│   ├── web/                         # Frontend Next.js (App Router)
│   │   ├── app/                     # Cockpit principal
│   │   ├── components/              # Charts e blocos de UI
│   │   ├── lib/                     # API client
│   │   └── types/                   # Tipos TypeScript
│   │
│   └── api/                         # Backend FastAPI
│       ├── app/
│       │   ├── api/                 # Endpoints REST
│       │   ├── models/              # Schemas Pydantic
│       │   └── services/            # Yield analytics + risk score
│       └── tests/                   # Pytest
│
├── data/
│   └── seed/                        # studio_agenda_demo.csv
│
├── docs/                            # Pitch, roadmap e metodologia
├── assets/                          # Ícone, hero, screenshots
├── scripts/                         # Geração de seed + assets
├── start.bat                        # Inicializador Windows
└── README.md                        # Esta documentação
```

---

## 🧱 Visual Architecture

<p align="center">
  <img src="./assets/architecture-pipeline.png" alt="AgendaYield visual architecture" width="100%" />
</p>

AgendaYield follows a yield flow: agenda events enter the pipeline, get classified by confirmation/attendance, scored for no-show risk, converted into occupancy/lost-revenue KPIs and surfaced as recovery actions.

---

## 🔁 Data Flow Pipeline

```txt
Agenda Events (CSV / Calendar)
  ↓
Client + Professional Mapping
  ↓
Confirmation / Attendance Status
  ↓
Occupancy & No-Show KPIs
  ↓
Interpretable Risk Score
  ↓
Lost / Recoverable Revenue
  ↓
Confirmation Queue + Fill-in Slots
  ↓
Recovery Action Board
```

---

## 🚀 Quick Start / Início Rápido

### Pré-requisitos
- **Node.js** v20 ou superior
- **Python** v3.10 ou superior
- **Git**

### Opção 1 — Execução integrada no Windows
Na pasta raiz do projeto:
```bash
start.bat
```
Este script cria o venv Python, instala dependências, sobe a API FastAPI na porta `8000`, o frontend Next.js na porta `3000` e abre o navegador.

### Opção 2 — Execução manual

#### 0. Gerar seed e assets (se necessário)
```bash
python scripts/generate_assets_and_seed.py
```

#### 1. Backend FastAPI (`apps/api`)
```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate            # Windows
source .venv/bin/activate          # Linux/macOS
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*API ativa em [http://127.0.0.1:8000](http://127.0.0.1:8000). Docs em `/docs`.*

#### 2. Frontend Next.js (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```
*Frontend ativo em [http://localhost:3000](http://localhost:3000).*

---

## 🧪 Scripts e Testes / Scripts and Testing

### Backend (FastAPI / Pytest)
```bash
cd apps/api
.venv\Scripts\python -m pytest
```

### Frontend (Next.js)
```bash
cd apps/web
npm run lint
npm run typecheck
npm run build
```

---

## 📊 Metodologia de Risco / Risk Methodology

O MVP usa um score interpretável (não caixa-preta):
* **Prior no-shows:** histórico de faltas aumenta o risco.
* **Confirmação pendente/recusada:** maior peso operacional.
* **Lead time curto ou muito longo:** ajusta probabilidade de ausência.
* **Fim de semana / noite:** leve incremento contextual.
* **Bandas:** low &lt; 0.40 · medium ≥ 0.40 · high ≥ 0.65.

Detalhes em [docs/technical_methodology.md](./docs/technical_methodology.md).

---

## 🛡️ Segurança e Escopo Responsável

* **Sem dado médico sensível no MVP:** foco em agenda operacional, não prontuário.
* **Demo sintético:** seed de studio estético sem clientes reais.
* **Segredos fora do Git:** `.env` ignorado; apenas `.env.example` versionado.
* **Não é marketplace:** o produto recupera horários da operação do cliente, não cria praça pública de reservas.

---

## 🧭 Roadmap do Produto

* **MVP:** CSV/demo, dashboard, risk board, confirmações, encaixe, ações, billing preparado.
* **Fase 2:** Google Calendar, lembretes automáticos, depósito/sinal, templates.
* **Fase 3:** otimização de grade, previsão de demanda, pagamentos, multiunidade.

Ver [docs/product_roadmap.md](./docs/product_roadmap.md).

---

## 💼 Valor para Portfólio / Portfolio Value

O AgendaYield demonstra competências de **product analytics**, **SaaS operacional** e **full-stack**:
- tradução de dor econômica (receita perdida) em UX acionável;
- scoring interpretável com limites explícitos;
- monorepo Next.js + FastAPI;
- narrativa comercial clara (ICP, pricing, roadmap).

---

## 📚 Documentação Complementar

- [docs/portfolio_pitch.md](./docs/portfolio_pitch.md) — pitch, LinkedIn e talking points
- [docs/product_roadmap.md](./docs/product_roadmap.md) — fases MVP → 3 e fora de escopo
- [docs/technical_methodology.md](./docs/technical_methodology.md) — score, KPIs e limites

---

## 🖼️ GitHub Social Preview

Uma imagem para visualização social está disponível em:
```txt
assets/social-preview.png
```
*Dimensão recomendada: 1280x640, &lt;1MB. Faça upload em: Repository Settings → Social Preview.*

---

## 🔖 GitHub Repository Metadata

### About sugerido
```txt
Agenda yield cockpit for service businesses — occupancy, no-show risk, confirmation backlog and recoverable revenue.
```

### Topics sugeridos
```txt
agendayield
no-show
appointment-scheduling
yield-management
occupancy
fastapi
nextjs
typescript
python
pandas
saas
portfolio-project
operational-analytics
calendar-analytics
```

---

## 👤 Autor / Author

Desenvolvido por **Felipe Alirio Baruja**.

- **Portfolio:** [barujafe.vercel.app](https://barujafe.vercel.app/)
- **GitHub:** [@BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [Gustavo Felipe Alirio Baruja](https://www.linkedin.com/in/barujafe/)

---

## 📄 Licença / License

MIT License. Copyright (c) 2026 Felipe Alirio Baruja.
O código está disponível sob a licença MIT caso o arquivo `LICENSE` esteja presente no repositório.
