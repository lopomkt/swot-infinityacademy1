
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-[#560005]">
            Etapa 2 – FORÇAS DA EMPRESA
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-gray-500 mb-6">
            Liste os principais pontos fortes, capacidades e vantagens competitivas da sua empresa.
            Preencha as perguntas que se aplicam ao seu negócio - cada resposta fortalecerá seu relatório estratégico.
          </p>
          
          <Form {...formMethods}>
            <form onSubmit={handleSubmit((data) => handleFormSubmit(data, onComplete, onSubmit))}>
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="show"
                variants={containerAnimation}
              >
                <div className="space-y-6">
                  <motion.div variants={itemAnimation}>
                    <FormField
                      control={control}
                      name="cultura_forte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-left text-base font-bold text-gray-900">1. A empresa possui uma cultura organizacional forte e bem definida?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva os valores e práticas que formam a cultura da empresa" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">2. A equipe possui qualificações ou competências especiais?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Equipe com certificações especializadas, conhecimento técnico diferenciado" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">3. Sua marca tem reconhecimento no mercado?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva o nível de reconhecimento e reputação da marca" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">4. A empresa possui tecnologia própria ou diferenciada?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Software próprio, método exclusivo, patente" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">5. A empresa tem uma carteira de clientes fiel?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva a fidelidade dos clientes e taxa de retenção" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">6. Qual o principal diferencial competitivo no mercado?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Preço, qualidade, exclusividade, atendimento" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">7. A empresa tem reputação forte em uma região específica?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva onde a empresa é mais reconhecida e por quê" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">8. Possui canais de distribuição bem estabelecidos?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva os canais de venda e distribuição mais eficientes" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">9. A estrutura financeira da empresa é sólida?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva pontos fortes financeiros como capital próprio, baixo endividamento" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">10. A empresa tem velocidade de entrega superior à concorrência?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva vantagens no tempo de produção ou entrega" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">11. Seus processos internos são otimizados?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva eficiências operacionais ou processos bem estruturados" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">12. A empresa possui liderança ou destaque em algum setor específico?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: Líder em um nicho específico, premiações setoriais" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">13. O atendimento ao cliente é um ponto forte diferencial?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Descreva práticas de atendimento diferenciadas" 
                              className="text-black placeholder-gray-400 h-10" 
                              {...field} 
                            />
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
                          <FormLabel className="text-left text-base font-bold text-gray-900">14. Existem outros pontos fortes relevantes?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva outras forças que não foram contempladas nas perguntas anteriores" 
                              className="text-black placeholder-gray-400" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
              </motion.div>
              
              {!isMobile && (
                <div className="flex justify-between pt-6 gap-4 flex-wrap-reverse sm:flex-nowrap">
                  {onBack && (
                    <Button type="button" variant="outline" onClick={onBack}>
                      ← Voltar
                    </Button>
                  )}
                  <Button type="submit" className="bg-[#ef0002] text-white">
                    Avançar para Fraquezas
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
        onNext={handleSubmit((data) => handleFormSubmit(data, onComplete, onSubmit))}
        onBack={onBack}
        nextLabel="Avançar para Fraquezas"
        isNextDisabled={false}
      />
    </>
  );
}
