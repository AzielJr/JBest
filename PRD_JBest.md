# 📑 PRD - JBest (Jogo do Bicho Online)

## 1. Visão Geral do Sistema

O **JBest** é uma plataforma online para apostas no jogo do bicho,
desenvolvida em **React (frontend)** e **Spring Boot (backend)**, com
banco de dados relacional (MySQL ou PostgreSQL).\
O sistema será responsivo (desktop e mobile), intuitivo para o apostador
e robusto para o administrador, fornecendo **segurança, clareza e gestão
financeira avançada**.

### Objetivos Principais

-   Oferecer uma **experiência simples e rápida** para o apostador
    realizar suas apostas.\
-   Garantir ao administrador **controle total do financeiro**, com
    **dashboards, relatórios e consultas detalhadas**.\
-   Automatizar a apuração das apostas e disponibilizar relatórios de
    forma clara.\
-   Possibilitar **expansão futura** para novos jogos ou modalidades.

### Público-Alvo

-   **Apostadores**: usuários que acessam via celular ou web e desejam
    apostar de forma simples.\
-   **Administradores**: responsáveis pela gestão financeira, relatórios
    e visão de todo o sistema.\
-   **Operadores**: apoio ao administrador em tarefas de arrecadação e
    controle.

------------------------------------------------------------------------

## 2. Arquitetura e Tecnologias

-   **Frontend**: React (componentes reutilizáveis, responsividade,
    hooks).\
-   **Backend**: Spring Boot (API RESTful, autenticação JWT,
    segurança).\
-   **Banco de Dados**: MySQL ou PostgreSQL (armazenamento de usuários,
    apostas, relatórios).\
-   **Infraestrutura**: implantação em nuvem (AWS, Azure ou GCP).\
-   **Segurança**: criptografia de senhas (BCrypt), autenticação JWT,
    logs de auditoria.

------------------------------------------------------------------------

## 3. Perfis de Usuário

### 3.1 Jogador

-   Realiza cadastro/login.\
-   Faz apostas em diferentes modalidades.\
-   Gerencia sua carteira digital.\
-   Consulta histórico de apostas e resultados.

### 3.2 Administrador

-   Acessa o **dashboard financeiro completo**.\
-   Consulta relatórios detalhados por período, modalidade e apostador.\
-   Monitora entradas, saídas, saldos e lucro líquido.\
-   Configura horários de arrecadação e políticas de apostas.

### 3.3 Operador

-   Apoia o administrador em tarefas de arrecadação.\
-   Consulta relatórios operacionais.\
-   Acompanha movimentações financeiras.

------------------------------------------------------------------------

## 4. Funcionalidades Principais

### 4.1 Cadastro e Login

-   Autenticação com e-mail e senha.\
-   Recuperação de senha via e-mail.\
-   Autenticação JWT (token de acesso).

### 4.2 Carteira Digital

-   Depósitos (manual ou integração futura com Pix).\
-   Retiradas (validação pelo administrador).\
-   Consulta de saldo em tempo real.\
-   Histórico de movimentações financeiras.

### 4.3 Modalidades de Aposta

-   **Milhar**\
-   **Centena**\
-   **Dezena**\
-   **Terno de Dezena**\
-   **Milhar Pura**\
-   **Grupo**

Cada modalidade deverá ter **descrição clara, valor de aposta,
multiplicador e forma de apuração**.

### 4.4 Apostas

-   Interface intuitiva para selecionar números.\
-   Resumo da aposta antes da confirmação.\
-   Registro automático da aposta no banco de dados.\
-   Comprovante digital da aposta.

### 4.5 Apuração Automática

-   Integração com resultados oficiais.\
-   Comparação automática das apostas.\
-   Cálculo de ganhos de acordo com multiplicadores.\
-   Atualização imediata da carteira do jogador.

### 4.6 Dashboard Administrativo

-   **Resumo financeiro geral** (entradas, saídas, lucro líquido).\
-   **Gráficos interativos** (linhas, barras, pizza).\
-   **Consultas avançadas** (filtros por data, usuário, modalidade,
    valor).\
-   **Relatórios exportáveis** (PDF, Excel, CSV).\
-   **Monitoramento em tempo real** de apostas em andamento.

### 4.7 Relatórios

-   Apostas por período.\
-   Premiações pagas.\
-   Lucro líquido.\
-   Ranking de modalidades mais apostadas.\
-   Ranking de apostadores ativos.

### 4.8 Controle de Horários de Arrecadação

-   Configuração de períodos de apostas (ex.: das 9h às 17h).\
-   Bloqueio automático após o encerramento.\
-   Avisos aos apostadores sobre prazos de fechamento.

------------------------------------------------------------------------

## 5. Telas e Fluxos

### 5.1 Usuário (Jogador)

1.  **Tela Inicial** -- visão clara das modalidades disponíveis.\
2.  **Tela de Aposta** -- interface com botões numéricos e seleção
    rápida.\
3.  **Resumo da Aposta** -- valores, multiplicadores, confirmação.\
4.  **Carteira Digital** -- saldo, depósitos, retiradas.\
5.  **Histórico de Apostas** -- apostas anteriores, ganhos/perdas.

### 5.2 Administrador

1.  **Dashboard Financeiro** -- visão geral (saldo total, entradas,
    saídas, lucro).\
2.  **Relatórios Detalhados** -- consultas avançadas com filtros.\
3.  **Gestão de Apostas** -- apostas registradas e situação.\
4.  **Gestão de Usuários** -- cadastro, bloqueio, permissões.\
5.  **Gestão de Carteira** -- depósitos, retiradas, saldo geral.

------------------------------------------------------------------------

## 6. Regras de Negócio

-   Apostas só podem ser realizadas dentro dos horários de arrecadação.\
-   Valores de aposta mínimos e máximos serão configuráveis.\
-   Multiplicadores definidos conforme a modalidade.\
-   Saldo da carteira deve ser validado antes da aposta.\
-   Retiradas só podem ser aprovadas pelo administrador.
-   O usuário poderá fazer na mesma aposta, uma ou várias modalidades.
-   Temos que ter a tela de apuração onde o operador terá que digitar o resultado
    das minhares e será calculado os valores a serem pagos em cada modalidade e mostrado
    um resumo de qtd e total R$ de apostas, os pagamentos de premios e o lucro daquela extração
-   no mesmo dia o sistema poderá ter várias extrações, com telas de configurações para horário limite de aposta,
    horário de apuração, etc.
    


------------------------------------------------------------------------

## 7. Requisitos Não Funcionais

-   **Performance**: tempo de resposta \< 2 segundos.\
-   **Escalabilidade**: suportar picos de até 10.000 usuários
    simultâneos.\
-   **Segurança**: criptografia, autenticação JWT, logs de auditoria.\
-   **Disponibilidade**: 99,5% uptime.\
-   **Responsividade**: telas adaptáveis para desktop, tablet e mobile.

------------------------------------------------------------------------

## 8. Métricas e Relatórios

-   Número total de apostas realizadas.\
-   Volume financeiro por período.\
-   Modalidade mais jogada.\
-   Lucro líquido e bruto.\
-   Perfil de apostadores ativos.\
-   Relatórios exportáveis em PDF/Excel.

------------------------------------------------------------------------

## 9. Futuras Expansões

-   Integração com Pix para depósitos e retiradas automáticas.\
-   Notificações push no celular.\
-   Programa de fidelidade para jogadores frequentes.
