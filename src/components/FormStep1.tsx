
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IdentificacaoData } from "@/types/formData";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFormWrapper from "@/components/mobile/MobileFormWrapper";
import MobileNavigation from "@/components/mobile/MobileNavigation";
import { TransitionMessage } from '@/components/shared/TransitionMessage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MESSAGE = "Vamos começar entendendo melhor sobre seu negócio.";

// Schema simplificado - apenas campos essenciais obrigatórios
const formSchema = z.object({
  // OBRIGATÓRIOS (6 campos essenciais)
  nomeEmpresa: z.string().min(2, {
    message: "O nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  segmento: z.string().min(2, {
    message: "O segmento deve ter pelo menos 2 caracteres.",
  }),
  faturamentoMensal: z.string().min(1, {
    message: "Informe o faturamento mensal.",
  }),
  tempoDeMercado: z.string().min(1, {
    message: "Informe o tempo de mercado.",
  }),
  numero_colaboradores: z.string().min(1, {
    message: "Informe o número de colaboradores.",
  }),
  perfil_cliente_ideal: z.string().min(3, {
    message: "Descreva brevemente seu cliente ideal.",
  }),
  
  // OPCIONAIS (podem ser vazios)
  tipo_produto_servico: z.string().optional(),
  tempo_retencao_clientes: z.string().optional(),
  fonte_trafego_principal: z.string().optional(), 
  nivel_automacao: z.string().optional(),
  canais_venda_atuais: z.string().optional(),
  modelo_precificacao: z.string().optional(),
});

interface Props {
  defaultValues?: Partial<IdentificacaoData>;
  onComplete: (data: IdentificacaoData) => void;
  onBack?: () => void;
}

const FormStep1 = ({ defaultValues = {}, onComplete, onBack }: Props) => {
  const isMobile = useIsMobile();
  
  const form = useForm<IdentificacaoData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeEmpresa: defaultValues.nomeEmpresa || "",
      segmento: defaultValues.segmento || "",
      faturamentoMensal: defaultValues.faturamentoMensal || "",
      tempoDeMercado: defaultValues.tempoDeMercado || "",
      tipo_produto_servico: defaultValues.tipo_produto_servico || "",
      tempo_retencao_clientes: defaultValues.tempo_retencao_clientes || "",
      perfil_cliente_ideal: defaultValues.perfil_cliente_ideal || "",
      fonte_trafego_principal: defaultValues.fonte_trafego_principal || "", 
      nivel_automacao: defaultValues.nivel_automacao || "",
      canais_venda_atuais: defaultValues.canais_venda_atuais || "",
      numero_colaboradores: defaultValues.numero_colaboradores || "",
      modelo_precificacao: defaultValues.modelo_precificacao || "",
    },
  });

  // Monitorar mudanças para salvamento automático
  const watchedValues = form.watch();
  useState(() => {
    const timer = setTimeout(() => {
      if (Object.keys(watchedValues).length > 0) {
        console.log("💾 Auto-salvando progresso da identificação...");
        localStorage.setItem('swot-form-identificacao', JSON.stringify(watchedValues));
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  });

  const onSubmit = (data: IdentificacaoData) => {
    console.log("✅ FormStep1 - Dados validados:", data);
    
    const dataWithFlag = { 
      ...data,
      tipagem_identificacao_ok: true
    };
    
    // Salvar no localStorage antes de avançar
    localStorage.setItem('swot-form-identificacao', JSON.stringify(dataWithFlag));
    
    onComplete(dataWithFlag);
  };

  const nivelAutomacaoOpcoes = [
    "Básico (processos manuais)",
    "Intermediário (alguns processos automatizados)",
    "Avançado (maioria dos processos automatizados)",
    "Completo (operação totalmente automatizada)"
  ];

  const formContent = (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <TransitionMessage message={MESSAGE} />
      
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-[#560005]">
            Etapa 1 – IDENTIFICAÇÃO DA EMPRESA
          </CardTitle>
          <p className="text-sm text-gray-600">
            Campos com * são obrigatórios. Outros podem ser preenchidos depois.
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-${isMobile ? '4' : '6'}`}>
              {/* CAMPOS OBRIGATÓRIOS */}
              <FormField
                control={form.control}
                name="nomeEmpresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">1. Nome da Empresa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Infinity Academy" {...field} />
                    </FormControl>
                    <FormDescription>
                      Qual o nome da empresa que você está analisando?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="segmento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">2. Segmento *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Educação, Tecnologia, Varejo..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Em qual segmento sua empresa atua?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="faturamentoMensal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">3. Faturamento Mensal *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: R$ 10.000, R$ 50.000..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Qual o faturamento médio mensal da sua empresa?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tempoDeMercado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">4. Tempo de Mercado *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2 anos, 6 meses..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Há quanto tempo sua empresa atua no mercado?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numero_colaboradores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">5. Número de Colaboradores *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 5, 12, 30..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Quantos colaboradores sua empresa possui atualmente?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="perfil_cliente_ideal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">6. Perfil do Cliente Ideal *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Empresários, Profissionais de RH, Estudantes..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Quem é o cliente ideal para seu negócio?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DIVISOR */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Informações Complementares (Opcionais)
                </h3>
              </div>
              
              {/* CAMPOS OPCIONAIS */}
              <FormField
                control={form.control}
                name="tipo_produto_servico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">7. Principal Produto ou Serviço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cursos online, Software, Consultoria..." {...field} />
                    </FormControl>
                    <FormDescription>
                      O que sua empresa oferece como principal solução? (Opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tempo_retencao_clientes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">8. Tempo Médio de Retenção de Clientes</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 3 meses, 1 ano, 5 anos..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Por quanto tempo, em média, você mantém seus clientes? (Opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fonte_trafego_principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">9. Principal Fonte de Tráfego/Clientes</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Instagram, Google, Indicações..." {...field} />
                    </FormControl>
                    <FormDescription>
                      De onde vêm a maioria dos seus clientes? (Opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="canais_venda_atuais"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">10. Canais de Venda Atuais</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Site próprio, WhatsApp, Marketplace..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Quais são seus principais canais de venda? (Opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nivel_automacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">11. Nível de Automação do Negócio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de automação (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nivelAutomacaoOpcoes.map((opcao) => (
                          <SelectItem key={opcao} value={opcao}>{opcao}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Qual o grau de automação dos processos no seu negócio? (Opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="modelo_precificacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">12. Modelo de Precificação</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mensal, Por projeto, Recorrência anual..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Como você cobra por seus produtos ou serviços? (Opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isMobile && (
                <div className="flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap">
                  {onBack && (
                    <Button type="button" variant="outline" onClick={onBack}>
                      ← Voltar
                    </Button>
                  )}
                  <Button type="submit" className="bg-[#ef0002] text-white">
                    Avançar para Forças
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <MobileFormWrapper>
          {formContent}
        </MobileFormWrapper>
      ) : (
        formContent
      )}

      <MobileNavigation
        onNext={form.handleSubmit(onSubmit)}
        onBack={onBack}
        nextLabel="Avançar para Forças"
        isNextDisabled={!form.formState.isValid}
      />
    </>
  );
};

export default FormStep1;
