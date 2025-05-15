
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forcasSchema, ForcasSchema } from "@/schemas/forcasSchema";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Props {
  defaultValues?: any;
  onComplete: (data: any) => void;
}

const FormStepForcas: React.FC<Props> = ({ defaultValues, onComplete }) => {
  // Inicializar o formulário com validação Zod
  const form = useForm<ForcasSchema>({
    resolver: zodResolver(forcasSchema),
    defaultValues: defaultValues?.forcas || {
      // Explicitly define as string[] with 5 empty strings
      respostas: ["", "", "", "", ""],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // Configurar o useFieldArray para gerenciar dinamicamente os campos
  const { fields, append, remove } = useFieldArray({
    control,
    name: "respostas",
  });

  // Verificar se há erros gerais do formulário
  const hasGeneralErrors = errors.root?.message;

  // Função para enviar o formulário
  const onSubmit = (data: ForcasSchema) => {
    // Marcar a etapa como concluída
    const updatedData = {
      ...data,
      step_forcas_ok: true,
    };
    
    // Chamar o onComplete passando os dados validados
    onComplete({ forcas: updatedData });
  };

  return (
    <div className="p-8 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-2 text-[#560005]">Pontos Fortes da Sua Empresa</h2>
      <p className="mb-6">
        Liste os principais pontos fortes do seu negócio. Pense em vantagens competitivas, 
        diferenciais, recursos exclusivos e pontos que fazem sua empresa se destacar.
      </p>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`respostas.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder={`Ponto forte #${index + 1}`}
                          {...field}
                          className="flex-1"
                        />
                      </FormControl>
                      {index >= 5 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Botão para adicionar nova força */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Adicionar Ponto Forte
          </Button>

          {/* Exibir erro geral se houver */}
          {hasGeneralErrors && (
            <p className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
              {hasGeneralErrors}
            </p>
          )}

          {/* Erro específico do array respostas */}
          {errors.respostas && (
            <p className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded-md">
              {errors.respostas.message}
            </p>
          )}

          {/* Botão de enviar */}
          <div className="pt-4">
            <Button
              type="submit"
              className="bg-[#ef0002] hover:bg-[#cc0001] text-white px-6 py-2 rounded"
            >
              Prosseguir
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormStepForcas;
