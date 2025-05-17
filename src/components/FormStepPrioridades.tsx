
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
import { Slider } from "@/components/ui/slider";
import { Prioridades } from "@/types/formData";
import { prioridadesSchema, PrioridadesSchema } from "@/schemas/prioridadesSchema";

interface Props {
  defaultValues?: Partial<Prioridades>;
  onComplete: (data: Prioridades) => void;
  onBack?: () => void;
}

// Define the distribution time and decision style types for type safety
type DistribuicaoTempoType = "Sim" | "Parcialmente" | "Estou sobrecarregado";
type EstiloDecisaoType = "Analítico" | "Rápido e objetivo" | "Intuitivo" | "Compartilhado com sócios / equipe";
type ProntidaoExecucaoType = "Sim" | "Com adaptações" | "Ainda não";

const FormStepPrioridades = ({ defaultValues = {}, onComplete, onBack }: Props) => {
  const form = useForm<PrioridadesSchema>({
    resolver: zodResolver(prioridadesSchema),
    defaultValues: {
      meta_90_dias: defaultValues.meta_90_dias || "",
      top3_desafios: defaultValues.top3_desafios || "",
      areas_fraqueza: defaultValues.areas_fraqueza || [],
      areas_potenciais: defaultValues.areas_potenciais || [],
      ajuda_externa_urgente: defaultValues.ajuda_externa_urgente || "",
      acao_unica_desejada: defaultValues.acao_unica_desejada || "",
      engajamento_equipe: defaultValues.engajamento_equipe || 5,
      distribuicao_tempo: (defaultValues.distribuicao_tempo as DistribuicaoTempoType) || "Sim",
      comprometimento_estrategico: defaultValues.comprometimento_estrategico || 5,
      estilo_decisao: (defaultValues.estilo_decisao as EstiloDecisaoType) || "Analítico",
      prontidao_execucao: (defaultValues.prontidao_execucao as ProntidaoExecucaoType) || "Sim",
      meta_crescimento_6_meses: defaultValues.meta_crescimento_6_meses || "",
      meta_crescimento_12_meses: defaultValues.meta_crescimento_12_meses || "",
      tipo_investimento: defaultValues.tipo_investimento || "",
      maior_gargalo: defaultValues.maior_gargalo || "",
    },
  });

  const [formValues, setForm] = useState<Prioridades>({
    meta_90_dias: defaultValues.meta_90_dias || "",
    top3_desafios: defaultValues.top3_desafios || "",
    areas_fraqueza: defaultValues.areas_fraqueza || [],
    areas_potenciais: defaultValues.areas_potenciais || [],
    ajuda_externa_urgente: defaultValues.ajuda_externa_urgente || "",
    acao_unica_desejada: defaultValues.acao_unica_desejada || "",
    engajamento_equipe: defaultValues.engajamento_equipe || 5,
    distribuicao_tempo: (defaultValues.distribuicao_tempo as DistribuicaoTempoType) || "Sim",
    comprometimento_estrategico: defaultValues.comprometimento_estrategico || 5,
    estilo_decisao: (defaultValues.estilo_decisao as EstiloDecisaoType) || "Analítico",
    prontidao_execucao: (defaultValues.prontidao_execucao as ProntidaoExecucaoType) || "Sim",
    meta_crescimento_6_meses: defaultValues.meta_crescimento_6_meses || "",
    meta_crescimento_12_meses: defaultValues.meta_crescimento_12_meses || "",
    tipo_investimento: defaultValues.tipo_investimento || "",
    maior_gargalo: defaultValues.maior_gargalo || "",
  });

  const onSubmit = (data: PrioridadesSchema) => {
    const dataWithFlag = { ...data, step_prioridades_ok: true };
    onComplete(dataWithFlag);
  };

  // Make sure that when setting form values, we convert string values to numbers where needed
  function handleChange<K extends keyof PrioridadesSchema>(key: K, value: PrioridadesSchema[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // Special handler for numeric fields to ensure they are stored as numbers
  function handleNumericChange<K extends "engajamento_equipe" | "comprometimento_estrategico">(key: K, value: string | number) {
    const numericValue = typeof value === 'string' ? Number(value) : value;
    setForm((prev) => ({
      ...prev,
      [key]: numericValue,
    }));
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-[#f1eaea] max-w-lg mx-auto animate-fade-in">
      <h2 className="font-bold text-2xl text-[#560005] mb-3">Etapa 7 – PRIORIDADES ESTRATÉGICAS</h2>
      <p className="text-base text-black mb-5">
        Vamos agora definir suas prioridades e metas para os próximos meses.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="meta_90_dias"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">1. Meta Principal (90 dias)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Aumentar vendas em 20%, lançar novo produto..." {...field} />
                </FormControl>
                <FormDescription>
                  Qual sua meta mais importante para os próximos 90 dias?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="top3_desafios"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">2. Top 3 Desafios Atuais</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Falta de clientes, equipe desmotivada, concorrência..." {...field} />
                </FormControl>
                <FormDescription>
                  Quais são os 3 maiores desafios que sua empresa enfrenta hoje?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areas_fraqueza"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">3. Áreas Frágeis</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange([value])} 
                  defaultValue={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as áreas frágeis" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Operacional">Operacional</SelectItem>
                    <SelectItem value="Gestão">Gestão</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Em quais áreas sua empresa precisa de mais atenção e melhorias?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areas_potenciais"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">4. Áreas Promissoras</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange([value])} 
                  defaultValue={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as áreas promissoras" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Operacional">Operacional</SelectItem>
                    <SelectItem value="Gestão">Gestão</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Em quais áreas sua empresa tem maior potencial de crescimento?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ajuda_externa_urgente"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">5. Ajuda Externa Urgente</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Consultoria de marketing, mentoria de gestão..." {...field} />
                </FormControl>
                <FormDescription>
                  Onde você mais precisa de ajuda externa neste momento?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acao_unica_desejada"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">6. Ação Única Desejada</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Atrair mais clientes, reduzir custos, melhorar processos..." {...field} />
                </FormControl>
                <FormDescription>
                  Se pudesse resolver um único problema agora, qual seria?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="engajamento_equipe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">7. Engajamento da Equipe (0-10)</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value || 5]}
                    max={10}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>
                  De 0 a 10, como você avalia o engajamento e motivação da sua equipe?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distribuicao_tempo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">8. Distribuição do Tempo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Parcialmente">Parcialmente</SelectItem>
                    <SelectItem value="Estou sobrecarregado">Estou sobrecarregado</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Você sente que distribui seu tempo de forma eficaz?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comprometimento_estrategico"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">9. Comprometimento Estratégico (0-10)</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value || 5]}
                    max={10}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormDescription>
                  De 0 a 10, qual o seu nível de comprometimento com a estratégia da empresa?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estilo_decisao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">10. Estilo de Decisão</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu estilo de decisão" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Analítico">Analítico</SelectItem>
                    <SelectItem value="Rápido e objetivo">Rápido e objetivo</SelectItem>
                    <SelectItem value="Intuitivo">Intuitivo</SelectItem>
                    <SelectItem value="Compartilhado com sócios / equipe">Compartilhado com sócios / equipe</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Como você costuma tomar decisões na sua empresa?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prontidao_execucao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">11. Prontidão para Execução</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Com adaptações">Com adaptações</SelectItem>
                    <SelectItem value="Ainda não">Ainda não</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Quão pronto você se sente para colocar as estratégias em prática?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_crescimento_6_meses"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">12. Meta de Crescimento (6 meses)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Aumentar a receita em X%, expandir para Y mercados..." {...field} />
                </FormControl>
                <FormDescription>
                  O que você espera alcançar em termos de crescimento nos próximos 6 meses?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_crescimento_12_meses"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">13. Meta de Crescimento (12 meses)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Dobrar o número de clientes, lançar nova linha de produtos..." {...field} />
                </FormControl>
                <FormDescription>
                  O que você almeja em termos de crescimento para o próximo ano?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo_investimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">14. Tipo de Investimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Marketing digital, equipe de vendas, tecnologia..." {...field} />
                </FormControl>
                <FormDescription>
                  Em qual área você planeja investir nos próximos meses?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maior_gargalo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">15. Maior Gargalo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Processos ineficientes, falta de leads qualificados..." {...field} />
                </FormControl>
                <FormDescription>
                  Qual o maior obstáculo que impede o crescimento da sua empresa?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                ← Voltar
              </Button>
            )}
            <Button type="submit">Finalizar Análise</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormStepPrioridades;
