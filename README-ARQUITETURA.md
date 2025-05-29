
# 🏗️ Arquitetura SWOT INSIGHTS - Documentação Técnica

## 📋 Visão Geral da Nova Arquitetura

Esta documentação descreve a arquitetura modular implementada para o sistema SWOT INSIGHTS, focando na separação de responsabilidades, escalabilidade e manutenibilidade.

## 🎯 Principais Melhorias Implementadas

### 1. **Separação de Responsabilidades**
- **Services**: Lógica de integração com APIs externas
- **Hooks**: Gerenciamento de estado e lógica de negócio
- **Utils**: Funções puras e helpers de transformação
- **Types**: Tipagem strict e contratos de dados
- **Components**: UI pura com responsabilidades específicas

### 2. **Controle de Qualidade**
- Retry automático com exponential backoff
- Timeout configurável (25s)
- Validação de dados de entrada e saída
- Error boundaries para captura de exceções
- Prevenção de múltiplas chamadas simultâneas

## 📁 Estrutura de Pastas

```
src/
├── services/           # Integração com APIs externas
│   └── groq-api.service.ts
├── hooks/             # Lógica de estado e negócio
│   └── useReportGeneration.ts
├── utils/             # Funções puras e helpers
│   └── report-parser.ts
├── types/             # Tipagem TypeScript
│   └── groq.ts
└── components/        # Componentes UI
    ├── AIBlock.tsx (refatorado)
    ├── ErrorMessageBlock.tsx
    └── ErrorBoundary.tsx
```

## 🔧 Componentes Principais

### **1. GROQ API Service** (`src/services/groq-api.service.ts`)

**Responsabilidades:**
- Integração direta com a API GROQ
- Controle de timeout e retry automático
- Geração de prompts estruturados
- Mock automático em ambiente de desenvolvimento

**Principais funcionalidades:**
```typescript
// Função principal de integração
fetchGROQResponse(formData: FormData): Promise<GROQResponse>

// Controle de retry com exponential backoff
makeGROQRequest(formData: FormData, attempt: number): Promise<GROQResponse>

// Mock para desenvolvimento
mockReport(): Promise<GROQResponse>
```

**Configurações:**
- Timeout máximo: 25 segundos
- Máximo de tentativas: 3
- Backoff: 2s, 4s, 8s

### **2. Hook de Geração** (`src/hooks/useReportGeneration.ts`)

**Responsabilidades:**
- Controle de estado da geração de relatório
- Prevenção de chamadas múltiplas simultâneas
- Integração com service e parser
- Gerenciamento de loading e erro

**Interface:**
```typescript
const { gerarRelatorio, resultado, loading, error, resetar } = useReportGeneration();
```

**Funcionalidades:**
- `gerarRelatorio(formData)`: Inicia a geração
- `resetar()`: Limpa o estado
- Estados: `loading`, `resultado`, `error`

### **3. Parser de Relatório** (`src/utils/report-parser.ts`)

**Responsabilidades:**
- Transformação da resposta bruta da IA em estrutura tipada
- Validação de delimitadores obrigatórios
- Fallbacks para dados inconsistentes
- Validação de integridade dos dados de entrada

**Funções principais:**
```typescript
parseGROQResult(response: GROQResponse): ParsedReport
validateFormData(formData: any): boolean
```

**Delimitadores obrigatórios:**
- `### MATRIZ SWOT`
- `### DIAGNÓSTICO CONSULTIVO`
- `### PLANO DE AÇÃO A/B/C`

### **4. Tipagem Global** (`src/types/groq.ts`)

**Interfaces principais:**
- `FormData`: Dados completos do formulário de 8 etapas
- `GROQResponse`: Resposta bruta da API GROQ
- `ParsedReport`: Estrutura tipada do relatório processado
- `ReportGenerationResult`: Estado do processo de geração

### **5. Componentes de UI**

#### **AIBlock.tsx (Refatorado)**
- Removida toda lógica de integração com API
- Foco exclusivo em renderização condicional
- Debounce de 1500ms para evitar chamadas desnecessárias
- Integração com ErrorBoundary

#### **ErrorMessageBlock.tsx**
- Componente reutilizável para exibição de erros
- Botão de retry integrado
- Design responsivo com Shadcn/UI

#### **ErrorBoundary.tsx**
- Captura de exceções inesperadas
- Fallback visual para erros críticos
- Placeholder para integração com Sentry

## 🧪 Ambiente de Desenvolvimento

### **Simulação Local (Mock)**

O sistema detecta automaticamente o ambiente de desenvolvimento e utiliza dados mock:

```typescript
// Em desenvolvimento, retorna automaticamente dados simulados
if (process.env.NODE_ENV === 'development') {
  return this.mockReport();
}
```

### **Como Testar Localmente**

1. **Mock automático**: Execute em modo desenvolvimento
2. **Dados mock**: Relatório pré-estruturado com todos os delimitadores
3. **Delay simulado**: 2 segundos para simular latência real
4. **Logging**: Console detalhado do processo

### **Debug do Sistema**

```typescript
// Logs automáticos disponíveis
console.log("🚀 Iniciando geração do relatório...");
console.log("✅ Resposta OK - GROQ API respondeu com sucesso");
console.log("✅ Parsing concluído com sucesso");
console.warn("⚠️ Modo desenvolvimento - usando mock data");
```

## 🔐 Segurança

### **Proteção da API Key**
- ✅ Hardcoded apenas para demonstração
- ✅ Sem logging do conteúdo da chave
- ✅ Verificação de existência antes do uso
- ⚠️ **TODO**: Migrar para variáveis de ambiente

### **Validação de Dados**
- Validação strict de entrada no parser
- Verificação de delimitadores obrigatórios
- Fallbacks seguros para dados inválidos
- Tipos TypeScript estritos (sem `any` ou `unknown`)

## 🚀 Expansão Futura

### **Novas Etapas de Formulário**
1. Adicionar interface na tipagem `FormData`
2. Incluir novos campos no prompt do service
3. Parser automaticamente processará novos dados

### **Novas IAs ou Endpoints**
1. Criar novo service seguindo o padrão `groq-api.service.ts`
2. Implementar interface comum `APIService`
3. Alternar entre services no hook `useReportGeneration`

### **Melhorias de Performance**
1. **Cache**: Implementar cache de respostas por hash do formData
2. **Chunks**: Dividir relatórios grandes em chunks menores
3. **Streaming**: Implementar resposta em tempo real via SSE

### **Monitoramento**
1. **Sentry**: Implementar captura de erros estruturada
2. **Analytics**: Métricas de uso e performance
3. **Logs**: Sistema de logging centralizado

## 📊 Métricas e Controle

### **Timeouts e Retries**
- Timeout padrão: 25s
- Máximo de tentativas: 3
- Backoff exponencial: 2^n * 1000ms

### **Prevenção de Sobrecarga**
- Flag `isFetchingRef` para bloquear chamadas simultâneas
- Debounce de 1500ms no trigger automático
- Validação de dados antes da requisição

### **Fallbacks de Erro**
- Parser retorna estrutura padrão em caso de falha
- UI exibe mensagens claras e ações de recovery
- ErrorBoundary captura exceções não tratadas

---

## 📞 Suporte e Manutenção

Esta arquitetura foi projetada para ser:
- **Escalável**: Fácil adição de novos services e funcionalidades
- **Testável**: Componentes isolados e funções puras
- **Manutenível**: Separação clara de responsabilidades
- **Robusta**: Múltiplas camadas de tratamento de erro

Para dúvidas ou melhorias, consulte a documentação de cada módulo individual.
