
# UI Rules - Progress Bar System

## Progress Bar Display Rules

✅ **Exibe em steps**: 0 a 8
- Boas-vindas (0)
- Identificação (1) 
- Forças (2)
- Fraquezas (3)
- Oportunidades (4)
- Ameaças (5)
- Financeiro (6)
- Prioridades (7)
- Finalização (8)

🚫 **Não exibe em step 9** (Resultados)
🚫 **Não exibe em transições** (removidas)

## Calculation Logic

📐 **Cálculo baseado em indexação direta**
- Progress percentage = ((currentStep + 1) / totalSteps) * 100%
- O +1 garante que a barra avance ao entrar na etapa
- Sem lógica fracionária ou divisão por 2

## Visual Feedback

🎯 **Labels atualizados conforme jornada do usuário**
- Exibição do label da etapa atual em telas ≥ sm
- Marcadores visuais para etapas completadas, atual e futuras
- Animação suave de transição entre etapas

## Technical Implementation

**VISIBLE_STEPS Array**: `[0, 1, 2, 3, 4, 5, 6, 7, 8]`
**getProgressIndex Function**: Pure function using `VISIBLE_STEPS.indexOf(currentStep)`
**Conditional Rendering**: Progress bar only shows when `VISIBLE_STEPS.includes(currentStep)`

## Responsive Design

- Mobile: Simplified indicator
- Desktop: Full progress tracker with labels
- Labels hidden on mobile for space optimization
