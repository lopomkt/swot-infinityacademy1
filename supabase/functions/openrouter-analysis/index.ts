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
    console.log('🚀 Iniciando edge function openrouter-analysis...');

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
      console.error('❌ Erro de autenticação:', userError);
      throw new Error('Usuário não autenticado')
    }

    console.log('✅ Usuário autenticado:', user.id);

    const { formData } = await req.json()
    if (!formData) {
      throw new Error('Dados do formulário não fornecidos')
    }

    console.log('📝 Dados recebidos para análise:', {
      empresa: formData.identificacao?.nomeEmpresa,
      forcas: formData.forcas?.respostas?.length || 0,
      fraquezas: formData.fraquezas?.pontos_inconsistentes?.length || 0,
      oportunidades: formData.oportunidades?.respostas?.length || 0,
      ameacas: formData.ameacas?.respostas?.length || 0
    });

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
- [análise detalhada de cada força com recomendações estratégicas]

**FRAQUEZAS:**
- [análise detalhada de cada fraqueza com planos de melhoria específicos]

**OPORTUNIDADES:**
- [análise detalhada de cada oportunidade com estratégias de aproveitamento]

**AMEAÇAS:**
- [análise detalhada de cada ameaça com planos de mitigação]

### DIAGNÓSTICO CONSULTIVO
[Análise executiva da situação atual da empresa, identificando pontos críticos, potenciais e recomendações estratégicas personalizadas. Mínimo 3 parágrafos detalhados com linguagem consultiva profissional.]

### PLANO DE AÇÃO A/B/C
**AÇÕES DE CURTO PRAZO (30-90 dias):**
1. [Ação específica com justificativa e recursos necessários]
2. [Ação específica com justificativa e recursos necessários]
3. [Ação específica com justificativa e recursos necessários]

**AÇÕES DE MÉDIO PRAZO (6-12 meses):**
1. [Ação estratégica com planejamento detalhado]
2. [Ação estratégica com planejamento detalhado]
3. [Ação estratégica com planejamento detalhado]

**MÉTRICAS DE ACOMPANHAMENTO:**
- [Indicadores específicos para medir progresso das ações]`

    console.log('🤖 Enviando requisição para OpenRouter...');

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
            content: 'Você é um consultor estratégico especialista em análise SWOT. Sempre responda seguindo EXATAMENTE o formato solicitado com os delimitadores ###. Use linguagem profissional, clara e orientada para ação.'
          },
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
      console.error('❌ Erro na API OpenRouter:', errorText)
      throw new Error(`Erro na API OpenRouter: ${openrouterResponse.status} - ${errorText}`)
    }

    const openrouterData = await openrouterResponse.json()
    const analysisContent = openrouterData.choices[0]?.message?.content

    if (!analysisContent) {
      console.error('❌ Resposta vazia da OpenRouter:', openrouterData);
      throw new Error('Resposta vazia da API OpenRouter')
    }

    console.log('✅ Análise recebida da OpenRouter, processando...');

    // Estruturar resultado final (apenas OpenRouter)
    const resultado = {
      ai_block_pronto: true,
      openrouter_prompt_ok: true,
      analise_completa: {
        diagnostico_textual: diagnostico,
        matriz_swot: matrizSwot,
        planos_acao: planoAcao,
        raw_response: analysisContent
      },
      timestamp: new Date().toISOString(),
      model_used: 'openai/gpt-4o-mini'
    }

    console.log('✅ Resultado estruturado com OpenRouter apenas');

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
    console.error('❌ Erro no edge function OpenRouter:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor OpenRouter' 
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
