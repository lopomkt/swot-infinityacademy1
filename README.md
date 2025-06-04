
# 🔍 SWOT INSIGHTS - Análise Estratégica Empresarial

Uma ferramenta completa de análise SWOT para empresas B2B e PMEs, com geração de relatórios estratégicos inteligentes usando IA.

## 🚀 Características Principais

- **Análise SWOT Completa**: Formulário guiado para identificar Forças, Fraquezas, Oportunidades e Ameaças
- **IA Integrada**: Geração de relatórios estratégicos com OpenRouter (Claude 3.5 Sonnet)
- **Interface Intuitiva**: UX otimizada com feedback visual e progressão clara
- **Sistema de Autenticação**: Login seguro com controle de acesso baseado em roles
- **Relatórios Personalizados**: Análise baseada na situação financeira e prioridades da empresa
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🏗️ Arquitetura

### Frontend
- **React 18** + **TypeScript**
- **Vite** para build e desenvolvimento
- **Tailwind CSS** + **Shadcn/UI** para styling
- **React Router** para navegação
- **TanStack Query** para gerenciamento de estado servidor

### Backend
- **Supabase** para autenticação e database
- **Edge Functions** para integração com IA
- **Row Level Security (RLS)** para segurança de dados

### IA & APIs
- **OpenRouter API** (Claude 3.5 Sonnet) para análise estratégica
- **Prompts estruturados** para geração de insights específicos

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Conta no Supabase
- API Key do OpenRouter

## ⚙️ Configuração Local

### 1. Clone o repositório
```bash
git clone <repository-url>
cd swot-insights
```

### 2. Instale as dependências
```bash
npm install
# ou
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://pkbomgocnpvxylwqlksb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter API (para Edge Functions)
OPENROUTER_API_KEY=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
```

### 4. Configure o Supabase

#### 4.1 Execute as migrações SQL
Execute os scripts SQL fornecidos para criar as tabelas e políticas RLS:

```sql
-- Criar tabelas users e relatorios
-- Configurar Row Level Security
-- Adicionar políticas de acesso
```

#### 4.2 Configure a URL da aplicação
No painel do Supabase, vá em **Authentication > URL Configuration** e defina:
- **Site URL**: `http://localhost:5173` (desenvolvimento)
- **Redirect URLs**: `http://localhost:5173/**`

#### 4.3 Adicione as secrets para Edge Functions
No painel do Supabase, vá em **Edge Functions > Settings** e adicione:
- `OPENROUTER_API_KEY`: Sua chave da API OpenRouter

### 5. Execute o projeto
```bash
npm run dev
# ou
bun dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🗂️ Estrutura do Projeto

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── Auth/            # Componentes de autenticação
│   ├── Admin/           # Painel administrativo
│   ├── ui/              # Componentes base (Shadcn/UI)
│   └── ...
├── hooks/               # Hooks customizados
├── services/            # Serviços de API e integração
├── types/               # Definições TypeScript
├── lib/                 # Utilitários e configurações
└── pages/               # Páginas principais

supabase/
├── functions/           # Edge Functions
│   └── openrouter-analysis/  # Integração com IA
└── migrations/          # Migrações do banco de dados
```

## 🔐 Sistema de Autenticação

### Tipos de Usuário
- **Usuário Regular**: Acesso às funcionalidades de análise
- **Administrador**: Acesso completo + painel administrativo

### Controle de Acesso
- **RLS (Row Level Security)** no Supabase
- **Políticas por usuário** para dados pessoais
- **Políticas especiais** para administradores

## 🤖 Integração com IA

### OpenRouter API
- **Modelo**: Claude 3.5 Sonnet (Anthropic)
- **Prompts estruturados** para análise SWOT
- **Respostas em JSON** para processamento

### Edge Functions
Localização: `supabase/functions/openrouter-analysis/`

A função processa:
1. Validação de autenticação
2. Estruturação do prompt
3. Chamada para OpenRouter API
4. Formatação da resposta
5. Tratamento de erros

## 📊 Fluxo da Aplicação

1. **Autenticação**: Login/Cadastro de usuários
2. **Formulário SWOT**: 
   - Identificação da empresa
   - Análise de Forças
   - Análise de Fraquezas
   - Identificação de Oportunidades
   - Mapeamento de Ameaças
   - Avaliação financeira
   - Definição de prioridades
3. **Geração de Relatório**: IA processa dados e gera insights
4. **Visualização**: Apresentação do relatório estruturado
5. **Histórico**: Armazenamento e recuperação de análises

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:coverage
```

## 📦 Build e Deploy

### Build local
```bash
npm run build
# ou
bun run build
```

### Deploy no Supabase
```bash
# Deploy das Edge Functions
supabase functions deploy openrouter-analysis
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de autenticação "requested path is invalid"
- Verifique as URLs configuradas no Supabase Auth
- Certifique-se que a **Site URL** e **Redirect URLs** estão corretas

#### 2. Erro de permissão no banco de dados
- Verifique se as políticas RLS estão configuradas
- Execute novamente os scripts de migração

#### 3. Falha na geração de relatórios
- Verifique se a API Key do OpenRouter está configurada
- Confirme se a Edge Function está deployada

#### 4. Problemas de carregamento
- Limpe o cache do navegador
- Verifique o console para erros JavaScript

## 🔧 Configurações Avançadas

### Personalização de Prompts
Edite o arquivo `supabase/functions/openrouter-analysis/index.ts` para ajustar os prompts da IA.

### Configuração de Rate Limiting
Configure limites de uso no painel do OpenRouter.

### Monitoramento
- Logs das Edge Functions disponíveis no painel Supabase
- Console logs detalhados para debug

## 📞 Suporte

- **Documentação Técnica**: Verifique os comentários no código
- **Issues**: Use o sistema de issues do repositório
- **Email**: [seu-email@empresa.com]

## 📄 Licença

Este projeto está sob licença [MIT/Proprietária - definir].

---

**Desenvolvido com ❤️ para impulsionar estratégias empresariais**
