
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forcasSchema, ForcasData } from "@/schemas/forcasSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import RedBullet from "@/components/RedBullet";

interface FormStepForcasProps {
  onSubmit?: (data: ForcasData) => void;
  onComplete?: (data: ForcasData) => void;  // Add onComplete prop
  defaultValues?: ForcasData;
  onBack?: () => void;
}

export default function FormStepForcas({ onSubmit, onComplete, defaultValues, onBack }: FormStepForcasProps) {
  // Initialize form with proper default values for the array of strings
  const defaultForcas = {
    respostas: Array(5).fill('') // Initialize with 5 empty strings
  };

  const form = useForm<ForcasData>({
    resolver: zodResolver(forcasSchema),
    defaultValues: defaultValues || defaultForcas
  });

  const { handleSubmit, control } = form;

  // Handle form submission using either onComplete or onSubmit
  const handleFormSubmit = (data: ForcasData) => {
    if (onComplete) {
      onComplete(data);
    } else if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <div className="space-y-8 mt-4 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <RedBullet />Forças da Empresa
          </CardTitle>
          <CardDescription>
            Liste os principais pontos fortes, capacidades e vantagens competitivas da sua empresa.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <CardContent>
              <ScrollArea className="h-[40vh]">
                <div className="space-y-4 pr-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FormField
                      key={i}
                      control={control}
                      name={`respostas.${i}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Força {i + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Ex: Equipe altamente qualificada`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack}>
                  Voltar
                </Button>
              )}
              <Button type="submit">
                Avançar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
