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
import { IdentificacaoData } from "@/types/formData";

const formSchema = z.object({
  nomeEmpresa: z.string().min(2, {
    message: "O nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  segmento: z.string().min(2, {
    message: "O segmento deve ter pelo menos 2 caracteres.",
  }),
  faturamentoMensal: z.string().min(2, {
    message: "O faturamento mensal deve ter pelo menos 2 caracteres.",
  }),
  tempoDeMercado: z.string().min(2, {
    message: "O tempo de mercado deve ter pelo menos 2 caracteres.",
  }),
});

interface Props {
  defaultValues?: Partial<IdentificacaoData>;
  onComplete: (data: IdentificacaoData) => void;
}

const FormStep1 = ({ defaultValues = {}, onComplete }: Props) => {
  const form = useForm<IdentificacaoData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeEmpresa: defaultValues.nomeEmpresa || "",
      segmento: defaultValues.segmento || "",
      faturamentoMensal: defaultValues.faturamentoMensal || "",
      tempoDeMercado: defaultValues.tempoDeMercado || "",
    },
  });

  const onSubmit = (data: IdentificacaoData) => {
    const dataWithFlag = { 
      ...data,
      tipagem_identificacao_ok: true
    };
    onComplete(dataWithFlag);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="nomeEmpresa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
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
              <FormLabel>Segmento</FormLabel>
              <FormControl>
                <Input placeholder="Educação" {...field} />
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
              <FormLabel>Faturamento Mensal</FormLabel>
              <FormControl>
                <Input placeholder="R$ 10.000,00" {...field} />
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
              <FormLabel>Tempo de Mercado</FormLabel>
              <FormControl>
                <Input placeholder="2 anos" {...field} />
              </FormControl>
              <FormDescription>
                Há quanto tempo sua empresa atua no mercado?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Próximo</Button>
      </form>
    </Form>
  );
};

export default FormStep1;
