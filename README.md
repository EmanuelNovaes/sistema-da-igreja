# Comunidade Família Em Cristo — Sistema de Louvor e Palavra

Sistema de gestão para organização e envio de hinos e leituras da Palavra utilizados nos cultos da Comunidade Família Em Cristo.

## Funcionalidades

- Cadastro e envio de hinos para os cultos
- Cadastro e envio de leituras da Palavra
- Histórico de hinos e leituras por data
- Banco de dados consultável de hinos e palavras já utilizados
- Painel administrativo com login protegido
- Configurações gerais do sistema

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (autenticação e banco de dados)
- React Router

## Como rodar localmente

**Pré-requisitos:** Node.js

1. Instale as dependências:
   ```
   npm install
   ```
2. Configure as variáveis de ambiente no arquivo `.env` a partir do `.env.example`:
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
3. Rode o projeto:
   ```
   npm run dev
   ```

## Build para produção

```
npm run build
```

## Estrutura do projeto

```
src/
  components/   Componentes reutilizáveis (admin e comuns)
  context/      Contexto de autenticação
  layouts/      Layouts principais (público e admin)
  pages/        Páginas do sistema
  routes/       Definição de rotas
  services/     Integração com Supabase
  types/        Tipagens TypeScript
  utils/        Funções utilitárias
```
