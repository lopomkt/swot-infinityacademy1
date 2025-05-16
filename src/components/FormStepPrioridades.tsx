import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PrioridadesData } from "@/types/formData";
import { prioridadesSchema, PrioridadesSchema } from "@/schemas/prioridadesSchema";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const areaOptions = [
  { id: "marketing", label: "Marketing" },
  { id: "vendas", label: "Vendas" },
  { id: "gestao", label: "Gestão" },
  { id: "pessoas", label: "Pessoas" },
  { id: "operacao", label: "Operação" },
  { id: "estrategia", label: "Estratégia" },
  { id: "financeiro", label: "Financeiro" },
  { id: "produto", label: "Produto" },
  { id: "atendimento", label: "Atendimento" },
];

interface Props {
  defaultValues?: Partial<PrioridadesSchema>;
  onComplete: (data: PrioridadesData) => void;
  onBack?: () => void;
}

const FormStepPrioridades: React.FC<Props> = ({ defaultValues, onComplete, onBack }) => {
  const form = useForm<PrioridadesSchema>({
    resolver: zodResolver(prioridadesSchema),
    defaultValues: defaultValues || {
      meta_90_dias: "",
      top3_desafios: "",
      areas_fraqueza: [],
      areas_potenciais: [],
      ajuda_externa_urgente: "",
      acao_unica_desejada: "",
      engajamento_equipe: 5,
      distribuicao_tempo: "Parcialmente",
      comprometimento_estrategico: 5,
      estilo_decisao: "Analítico",
    },
  });

  const comprometimentoValue = form.watch("comprometimento_estrategico");
  const mostrarProntidao = comprometimentoValue >= 8;

  function onSubmit(data: PrioridadesSchema) {
    toast({
      title: "Diagnóstico finalizado!",
      description: "Preparando análise estratégica...",
    });
    // Flag de validação concluída
    const validacao_prioridades_ok = true;
    onComplete(data as PrioridadesData);
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-[#560005] mb-2">
          Vamos fechar com foco, clareza e prioridade
        </h2>
        <p className="text-gray-600">
          Com base em tudo o que foi respondido, agora queremos entender o que realmente importa neste momento.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="meta_90_dias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual é a principal meta da sua empresa para os próximos 90 dias?</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: aumentar o faturamento, estruturar time, abrir filial…" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="top3_desafios"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quais são os três maiores desafios hoje?</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Liste os principais desafios com breves descrições" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areas_fraqueza"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Quais áreas você considera mais frágeis no momento?</FormLabel>
                  <FormDescription>
                    Selecione todas que se aplicam.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {areaOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="areas_fraqueza"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areas_potenciais"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Quais áreas mais promissoras para crescimento?</FormLabel>
                  <FormDescription>
                    Selecione todas que se aplicam.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {areaOptions.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="areas_potenciais"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ajuda_externa_urgente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Em qual ponto você mais sente que precisa de ajuda externa?</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acao_unica_desejada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Se pudesse resolver uma única coisa agora, qual seria?</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="engajamento_equipe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você sente que sua equipe está engajada no processo de crescimento?</FormLabel>
                <FormDescription className="flex justify-between">
                  <span>0 - Nada engajada</span>
                  <span>10 - Totalmente engajada</span>
                </FormDescription>
                <FormControl>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="w-full"
                    />
                  </div>
                </FormControl>
                <div className="text-center mt-2">
                  <span className="font-semibold">{field.value}</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distribuicao_tempo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Você sente que seu tempo como gestor está bem distribu��do?</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comprometimento_estrategico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Em uma escala de 0 a 10, qual o seu nível de comprometimento com mudanças estratégicas reais?</FormLabel>
                <FormDescription className="flex justify-between">
                  <span>0 - Pouco comprometido</span>
                  <span>10 - Totalmente comprometido</span>
                </FormDescription>
                <FormControl>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="w-full"
                    />
                  </div>
                </FormControl>
                <div className="text-center mt-2">
                  <span className="font-semibold">{field.value}</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estilo_decisao"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Qual o seu estilo de decisão atual?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Analítico" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Analítico
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Rápido e objetivo" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Rápido e objetivo
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Intuitivo" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Intuitivo
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Compartilhado com sócios / equipe" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Compartilhado com sócios / equipe
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mostrarProntidao && (
            <FormField
              control={form.control}
              name="prontidao_execucao"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Está pronto para colocar em prática as soluções que o relatório irá propor?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Sim" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Sim
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Com adaptações" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Com adaptações
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Ainda não" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Ainda não
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-between pt-4 gap-4 flex-wrap-reverse sm:flex-nowrap">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                ← Voltar
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-[#ef0002] hover:bg-[#c50000] text-white px-8 py-2"
            >
              Finalizar Diagnóstico
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormStepPrioridades;
