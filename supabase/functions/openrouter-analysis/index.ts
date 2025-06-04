
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Token de autorização não fornecido')
    }

    // Inicializar Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verificar usuário autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuário não autenticado')
    }

    const { formData } = await req.json()
    if (!formData) {
      throw new Error('Dados do formulário não fornecidos')
    }

    // Construir prompt estruturado para OpenRouter
    const prompt = `
Você é um consultor especialista em análise SWOT e estratégia empresarial. Analise os dados fornecidos e gere um relatório estratégico completo.

DADOS DA EMPRESA:
Nome: ${formData.identificacao?.nomeEmpresa || 'Não informado'}
Setor: ${formData.identificacao?.setorAtuacao || 'Não informado'}
Porte: ${formData.identificacao?.porteEmpresa || 'Não informado'}
Situação Financeira: ${formData.saudeFinanceira?.situacaoAtual || 'Não informado'}

FORÇAS IDENTIFICADAS:
${formData.forcas?.respostas?.map((f: any, i: number) => `${i + 1}. ${f.resposta}`).join('\n') || 'Nenhuma força identificada'}

FRAQUEZAS IDENTIFICADAS:
${formData.fraquezas?.pontos_inconsistentes?.map((f: any, i: number) => `${i + 1}. ${f.ponto} - ${f.impacto}`).join('\n') || 'Nenhuma fraqueza identificada'}

OPORTUNIDADES:
${formData.oportunidades?.respostas?.map((o: any, i: number) => `${i + 1}. ${o.resposta}`).join('\n') || 'Nenhuma oportunidade identificada'}

AMEAÇAS:
${formData.ameacas?.respostas?.map((a: any, i: number) => `${i + 1}. ${a.resposta}`).join('\n') || 'Nenhuma ameaça identificada'}

PRIORIDADES ESTRATÉGICAS:
Engajamento da Equipe: ${formData.prioridades?.engajamento_equipe || 'N/A'}/10
Comprometimento Estratégico: ${formData.prioridades?.comprometimento_estrategico || 'N/A'}/10
Foco Principal: ${formData.prioridades?.foco_principal || 'Não definido'}

GERE UM RELATÓRIO ESTRUTURADO COM:

1. DIAGNÓSTICO ESTRATÉGICO (resumo executivo da situação atual)

2. MATRIZ SWOT DETALHADA:
   - Análise de cada Força com recomendações de potencialização
   - Análise de cada Fraqueza com planos de melhoria específicos
   - Análise de cada Oportunidade com estratégias de aproveitamento
   - Análise de cada Ameaça com planos de mitigação

3. ESTRATÉGIAS CRUZADAS (TOWS):
   - FO (Forças × Oportunidades): Estratégias ofensivas
   - FA (Forças × Ameaças): Estratégias defensivas
   - DO (Fraquezas × Oportunidades): Estratégias de reorientação
   - DA (Fraquezas × Ameaças): Estratégias de sobrevivência

4. PLANO DE AÇÃO PRIORITÁRIO:
   - 3-5 ações de curto prazo (próximos 90 dias)
   - 3-5 ações de médio prazo (6-12 meses)
   - Métricas de acompanhamento sugeridas

5. SCORE ESTRATÉGICO (0-100):
   - Posição Competitiva
   - Preparação para Oportunidades
   - Gestão de Riscos
   - Score Geral

Formate a resposta em JSON seguindo esta estrutura:
{
  "diagnostico": "texto do diagnóstico executivo",
  "matriz_swot": {
    "forcas_analise": [{"item": "força", "recomendacao": "como potencializar"}],
    "fraquezas_analise": [{"item": "fraqueza", "plano_melhoria": "como corrigir"}],
    "oportunidades_analise": [{"item": "oportunidade", "estrategia": "como aproveitar"}],
    "ameacas_analise": [{"item": "ameaça", "mitigacao": "como se proteger"}]
  },
  "estrategias_cruzadas": {
    "fo": ["estratégia ofensiva 1", "estratégia ofensiva 2"],
    "fa": ["estratégia defensiva 1", "estratégia defensiva 2"],
    "do": ["estratégia reorientação 1", "estratégia reorientação 2"],
    "da": ["estratégia sobrevivência 1", "estratégia sobrevivência 2"]
  },
  "plano_acao": {
    "curto_prazo": [{"acao": "descrição", "prazo": "dias", "responsavel": "área"}],
    "medio_prazo": [{"acao": "descrição", "prazo": "meses", "responsavel": "área"}],
    "metricas": ["métrica 1", "métrica 2", "métrica 3"]
  },
  "score_estrategico": {
    "posicao_competitiva": 85,
    "preparacao_oportunidades": 75,
    "gestao_riscos": 90,
    "score_geral": 83
  }
}
`

    // Chamar OpenRouter API
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'X-Title': 'SWOT Insights Analysis',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })
    })

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text()
      console.error('OpenRouter API Error:', errorText)
      throw new Error(`Erro na API OpenRouter: ${openrouterResponse.status}`)
    }

    const openrouterData = await openrouterResponse.json()
    const analysisContent = openrouterData.choices[0]?.message?.content

    if (!analysisContent) {
      throw new Error('Resposta vazia da API OpenRouter')
    }

    // Tentar fazer parse do JSON da resposta
    let parsedAnalysis
    try {
      // Remover possível markdown formatting
      const cleanContent = analysisContent.replace(/```json\n?|\n?```/g, '').trim()
      parsedAnalysis = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta:', parseError)
      // Fallback: retornar resposta bruta se não conseguir fazer parse
      parsedAnalysis = {
        diagnostico: analysisContent,
        raw_response: true
      }
    }

    // Estruturar resultado final
    const resultado = {
      ai_block_pronto: true,
      openrouter_prompt_ok: true,
      groq_prompt_ok: true, // Manter compatibilidade
      analise_completa: parsedAnalysis,
      timestamp: new Date().toISOString(),
      model_used: 'anthropic/claude-3.5-sonnet'
    }

    return new Response(
      JSON.stringify({ success: true, resultado }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Erro no edge function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
