
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RedBullet from "@/components/RedBullet";
import { FormFooterNavigation } from "./FormFooterNavigation";
import { useForcasForm } from "../hooks/useForcasForm";
import { ForcasData } from "@/schemas/forcasSchema";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileFormWrapper from "@/components/mobile/MobileFormWrapper";
import MobileNavigation from "@/components/mobile/MobileNavigation";

interface ForcasFormProps {
  onSubmit?: (data: ForcasData) => void;
  onComplete?: (data: ForcasData) => void;
  defaultValues?: ForcasData;
  onBack?: () => void;
}

export function ForcasForm({ onSubmit, onComplete, defaultValues, onBack }: ForcasFormProps) {
  const isMobile = useIsMobile();
  const formMethods = useForcasForm(defaultValues);
  const { handleSubmit, control, handleFormSubmit } = formMethods;

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const formContent = (
    <motion.div 
      className="space-y-8 mt-4 max-w-5xl mx-auto"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <Card className="bg-white p-6 text-black">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <RedBullet />Forças da Empresa
          </CardTitle>
          <CardDescription>
            Liste os principais pontos fortes, capacidades e vantagens competitivas da sua empresa.
            Preencha as perguntas que se aplicam ao seu negócio - cada resposta fortalecerá seu relatório estratégico.
          </CardDescription>
        </CardHeader>
        <Form {...formMethods}>
          <form onSubmit={handleSubmit((data) => handleFormSubmit(data, onComplete, onSubmit))}>
            <CardContent>
              <ScrollArea className="h-[60vh] md:h-[65vh]">
                <div className="space-y-6 pr-4">
                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="cultura_forte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">1. A empresa possui uma cultura organizacional forte e bem definida?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva os valores e práticas que formam a cultura da empresa" className="text-black placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="equipe_qualificada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">2. A equipe possui qualificações ou competências especiais?</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Equipe com certificações especializadas, conhecimento técnico diferenciado" className="text-black placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="marca_reconhecida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">3. Sua marca tem reconhecimento no mercado?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva o nível de reconhecimento e reputação da marca" className="text-black placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="tecnologia_propria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">4. A empresa possui tecnologia própria ou diferenciada?</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Software próprio, método exclusivo, patente" className="text-black placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="carteira_fiel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">5. A empresa tem uma carteira de clientes fiel?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva a fidelidade dos clientes e taxa de retenção" className="text-black placeholder-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="diferencial_mercado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">6. Qual o principal diferencial competitivo no mercado?</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Preço, qualidade, exclusividade, atendimento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="reputacao_regional"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">7. A empresa tem reputação forte em uma região específica?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva onde a empresa é mais reconhecida e por quê" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="canais_distribuicao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">8. Possui canais de distribuição bem estabelecidos?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva os canais de venda e distribuição mais eficientes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="estrutura_financeira"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">9. A estrutura financeira da empresa é sólida?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva pontos fortes financeiros como capital próprio, baixo endividamento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="velocidade_entrega"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">10. A empresa tem velocidade de entrega superior à concorrência?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva vantagens no tempo de produção ou entrega" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="processos_otimizados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">11. Seus processos internos são otimizados?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva eficiências operacionais ou processos bem estruturados" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="lideranca_setorial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">12. A empresa possui liderança ou destaque em algum setor específico?</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Líder em um nicho específico, premiações setoriais" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="atendimento_diferenciado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">13. O atendimento ao cliente é um ponto forte diferencial?</FormLabel>
                          <FormControl>
                            <Input placeholder="Descreva práticas de atendimento diferenciadas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="outros"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">14. Existem outros pontos fortes relevantes?</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva outras forças que não foram contempladas nas perguntas anteriores" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <FormFooterNavigation
                onBack={onBack}
                onNext={() => {}}
                nextLabel="Avançar"
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
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
        onNext={handleSubmit((data) => handleFormSubmit(data, onComplete, onSubmit))}
        onBack={onBack}
        nextLabel="Avançar"
        isNextDisabled={false}
      />
    </>
  );
}
