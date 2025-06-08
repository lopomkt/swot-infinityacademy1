
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

    // Construir prompt estruturado para GPT-4o-mini
    const prompt = `Você é um consultor estratégico especialista em análise SWOT. Gere um relatório estratégico completo no formato EXATO abaixo.

DADOS DA EMPRESA:
Nome: ${formData.identificacao?.nomeEmpresa || 'Não informado'}
Setor: ${formData.identificacao?.segmento || 'Não informado'}
Tempo de Mercado: ${formData.identificacao?.tempoDeMercado || 'Não informado'}
Situação Financeira: ${formData.saudeFinanceira?.maturidade_financeira || 'Não informado'}

FORÇAS IDENTIFICADAS:
${formData.forcas?.respostas?.map((f, i) => `${i + 1}. ${f}`).join('\n') || 'Nenhuma força identificada'}

FRAQUEZAS IDENTIFICADAS:
${formData.fraquezas?.pontos_inconsistentes?.map((f, i) => `${i + 1}. ${f}`).join('\n') || 'Nenhuma fraqueza identificada'}

OPORTUNIDADES:
${formData.oportunidades?.respostas?.map((o, i) => `${i + 1}. ${o}`).join('\n') || 'Nenhuma oportunidade identificada'}

AMEAÇAS:
${formData.ameacas?.respostas?.map((a, i) => `${i + 1}. ${a}`).join('\n') || 'Nenhuma ameaça identificada'}

RESPONDA SEGUINDO EXATAMENTE ESTE FORMATO (use os delimitadores ### obrigatoriamente):

### MATRIZ SWOT
**FORÇAS:**
- [análise detalhada de cada força com recomendações]

**FRAQUEZAS:**
- [análise detalhada de cada fraqueza com planos de melhoria]

**OPORTUNIDADES:**
- [análise detalhada de cada oportunidade com estratégias]

**AMEAÇAS:**
- [análise detalhada de cada ameaça com planos de mitigação]

### DIAGNÓSTICO CONSULTIVO
[Análise executiva da situação atual da empresa, identificando pontos críticos, potenciais e recomendações estratégicas personalizadas. Mínimo 3 parágrafos detalhados.]

### PLANO DE AÇÃO A/B/C
**AÇÕES DE CURTO PRAZO (30-90 dias):**
1. [Ação específica com justificativa]
2. [Ação específica com justificativa]
3. [Ação específica com justificativa]

**AÇÕES DE MÉDIO PRAZO (6-12 meses):**
1. [Ação estratégica com planejamento]
2. [Ação estratégica com planejamento]
3. [Ação estratégica com planejamento]

**MÉTRICAS DE ACOMPANHAMENTO:**
- [Indicadores específicos para medir progresso]`

    // Chamar OpenRouter API com GPT-4o-mini
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'X-Title': 'SWOT Insights Analysis - GPT4o-mini',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um consultor estratégico especialista em análise SWOT. Sempre responda seguindo EXATAMENTE o formato solicitado com os delimitadores ###.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
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

    // Processar resposta estruturada
    const sections = analysisContent.split('### ')
    const matrizSwot = sections.find(s => s.startsWith('MATRIZ SWOT'))?.replace('MATRIZ SWOT', '').trim() || 'Matriz SWOT não gerada'
    const diagnostico = sections.find(s => s.startsWith('DIAGNÓSTICO CONSULTIVO'))?.replace('DIAGNÓSTICO CONSULTIVO', '').trim() || 'Diagnóstico não gerado'
    const planoAcao = sections.find(s => s.startsWith('PLANO DE AÇÃO A/B/C'))?.replace('PLANO DE AÇÃO A/B/C', '').trim() || 'Plano de ação não gerado'

    // Estruturar resultado final compatível
    const resultado = {
      ai_block_pronto: true,
      openrouter_prompt_ok: true,
      groq_prompt_ok: true, // Manter compatibilidade
      analise_completa: {
        diagnostico_textual: diagnostico,
        matriz_swot: matrizSwot,
        planos_acao: planoAcao,
        raw_response: analysisContent
      },
      timestamp: new Date().toISOString(),
      model_used: 'openai/gpt-4o-mini'
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
