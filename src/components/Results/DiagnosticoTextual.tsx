
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DiagnosticoTextualProps {
  texto: string;
}

const DiagnosticoTextual = React.memo(function DiagnosticoTextual({ texto }: DiagnosticoTextualProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Function to format diagnostic text into sections
  const formatDiagnosticSections = (text: string) => {
    if (!text) return <p className="text-sm italic text-gray-500">Diagnóstico não disponível no momento.</p>;
    
    // Define section categories with icons
    const sections = [
      { title: "Estrutura Interna", icon: "📊", indicativePhrases: ["estrutura", "interna", "processos", "equipe"] },
      { title: "Mercado", icon: "🧭", indicativePhrases: ["mercado", "concorrência", "posicionamento", "setor"] },
      { title: "Riscos", icon: "⚠️", indicativePhrases: ["risco", "ameaça", "vulnerabilidade", "perigo"] },
      { title: "Financeiro", icon: "💰", indicativePhrases: ["financeiro", "custo", "receita", "investimento", "dinheiro"] },
      { title: "Oportunidades", icon: "🚀", indicativePhrases: ["oportunidade", "crescimento", "expansão", "potencial"] },
      { title: "Operacional", icon: "🛠️", indicativePhrases: ["operação", "produção", "entrega", "eficiência"] }
    ];
    
    // Split text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
    
    // Categorize paragraphs
    const categorizedContent = {};
    let uncategorized = [];
    
    paragraphs.forEach(paragraph => {
      // Find matching section
      let matched = false;
      for (const section of sections) {
        if (section.indicativePhrases.some(phrase => 
          paragraph.toLowerCase().includes(phrase.toLowerCase()))) {
          if (!categorizedContent[section.title]) {
            categorizedContent[section.title] = {
              icon: section.icon,
              paragraphs: []
            };
          }
          categorizedContent[section.title].paragraphs.push(paragraph);
          matched = true;
          break;
        }
      }
      
      // If no section matched, add to uncategorized
      if (!matched) {
        uncategorized.push(paragraph);
      }
    });
    
    // Add "Geral" section for uncategorized paragraphs
    if (uncategorized.length > 0) {
      categorizedContent["Geral"] = {
        icon: "💡",
        paragraphs: uncategorized
      };
    }
    
    // Render sections
    return Object.entries(categorizedContent).map(([title, content]: [string, any], index) => (
      <div key={index} className="mb-6">
        <h4 className="text-base font-semibold text-[#000] mt-6 mb-1">
          {content.icon} {title}
        </h4>
        {content.paragraphs.map((paragraph, pIndex) => (
          <p key={pIndex} className="text-sm text-gray-700 mb-3 leading-relaxed">
            {highlightKeyPhrases(paragraph)}
          </p>
        ))}
      </div>
    ));
  };

  // Function to highlight key phrases in the text
  const highlightKeyPhrases = (text: string) => {
    if (!text) return text;
    
    // List of keywords to highlight
    const keywords = [
      "crítico", "urgente", "prioritário", "essencial", "fundamental",
      "oportunidade clara", "vantagem competitiva", "diferencial", 
      "recomendação", "sugestão", "estratégia", "ação imediata",
      "potencial", "crescimento", "expansão", "consolidação"
    ];
    
    // Check for keywords and wrap them in highlight span
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="font-semibold text-[#560005]">$1</span>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const renderDiagnosticoContent = () => (
    <motion.div 
      className="px-4 md:px-8"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-base overflow-x-auto max-w-full">
        {formatDiagnosticSections(texto)}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="mt-10 mb-6 px-4 md:px-12 py-8 scroll-mt-20"
      role="region"
      aria-labelledby="diagnostico-title"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        id="diagnostico-title" 
        className="text-2xl font-bold text-[#000] border-b pb-2 mb-6"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Diagnóstico Consultivo
      </motion.h2>
      
      {isMobile ? (
        <Accordion type="single" collapsible>
          <AccordionItem value="diagnostico">
            <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}>
              <AccordionTrigger className="text-[#560005] font-bold">
                Ver diagnóstico completo
              </AccordionTrigger>
            </motion.div>
            <AccordionContent>
              {renderDiagnosticoContent()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <AnimatePresence>
          {renderDiagnosticoContent()}
        </AnimatePresence>
      )}
    </motion.div>
  );
});

export default DiagnosticoTextual;
