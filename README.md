# LUMIS INTELLIGENCE MVP

[![Version](https://img.shields.io/badge/version-2.1-blue.svg)](https://github.com/lumis-intelligence/lumis-insight)
[![AI](https://img.shields.io/badge/AI-Predictive+Prescriptive-blue.svg)](https://github.com/lumis-intelligence/lumis-insight)
[![Audit](https://img.shields.io/badge/Audit-Continuous-blue.svg)](https://github.com/lumis-intelligence/lumis-insight)

**Plataforma de IA para decisões clínicas e administrativas com auditoria e compliance integrados**

![Dashboard](https://github.com/user-attachments/assets/fd70e369-8439-4812-a9db-823648a216e7)

![Análises](https://github.com/user-attachments/assets/443d6ec9-6f47-4d93-897d-6bb365b5020a)

---

## Visão Geral

O **Lumis Insight** é um sistema híbrido de inteligência artificial que transforma dados brutos de prontuários eletrônicos em **insights acionáveis** para hospitais e redes de saúde. Combinando modelos de classificação, regressão e recomendação, a plataforma auxilia na priorização de atendimentos, alocação de leitos, provisionamento financeiro e definição de protocolos clínicos — sempre com **rastreabilidade e conformidade** embutidas.

### Arquitetura Resumida

| Entrada | Processamento | Saída | Governança |
|---------|---------------|-------|------------|
| Dados estruturados do prontuário: idade, gênero, CEP, convênio, CID‑10, exames laboratoriais, histórico de internações e custos. | Modelos estatísticos e de machine learning (Random Forest, regressão linear, filtragem colaborativa) treinados com milhares de casos históricos. | Classificação de risco (Baixo / Médio / Alto), previsão de custos e tempo de internação, recomendações de protocolos clínicos. | Auditoria automática de viés, explicabilidade (SHAP/LIME), revisão humana em decisões críticas e relatórios de compliance. |

---

## Funcionalidades Principais

- **Classificação de Risco** – categorização em três níveis (Baixo, Médio, Alto) com base em aprendizado supervisionado.
- **Previsão de Custo e Tempo** – estimativas contínuas em reais e dias de internação, com minimização de erro.
- **Recomendação de Protocolos** – sugestões baseadas em perfil de risco e diagnóstico, utilizando filtragem por conteúdo ou colaborativa.
- **Painel Dinâmico** – visualização de indicadores, gráficos de distribuição (risco por idade, por convênio), tendências temporais e acumulação de pacientes.
- **Filtros e Pesquisa** – busca por nome, CID‑10, filtros por risco, convênio e faixa etária.
- **Exportação** – relatórios em PDF com dados filtrados, incluindo colunas de auditoria e compliance.
- **Modo Escuro / Claro** – interface adaptável para conforto visual.

---

## Auditoria e Compliance

O sistema incorpora uma **camada de auditoria contínua** que avalia cada paciente individualmente e a base como um todo, gerando alertas sobre:

- **Viés Indireto** – detecção de correlações espúrias entre variáveis proxy (CEP, convênio) e classificação de risco, evitando discriminação socioeconômica ou racial.
- **Representatividade** – monitoramento da distribuição de idade, gênero e grupo étnico (quando disponível) para prevenir viés de seleção.
- **Opacidade** – recomendação de práticas de explicabilidade (SHAP, LIME) e revisão humana para decisões críticas.
- **Responsabilização** – registro de auditorias e status de compliance por paciente, visível na tabela e em relatórios.

### Exemplo de Avaliação Individual de Compliance

| ID | Nome | Convênio | Risco | Status Compliance | Observação |
|----|------|----------|-------|-------------------|------------|
| 1  | Maria Oliveira | Público | Alto | CRÍTICO | Alto risco em paciente público – alerta de viés |
| 6  | José Santos | Privado | Médio | ATENÇÃO | Idoso com convênio público – possível viés socioeconômico |
| 11 | Ana Clara | Privado | Baixo | OK | Em conformidade |

---

## Como Executar (Simulação)

A versão de demonstração é uma aplicação web auto‑contida (HTML + JavaScript + Chart.js + jsPDF). Para executar localmente:

```bash
git clone https://github.com/lumis-intelligence/lumis-insight.git
cd lumis-insight
open index.html

