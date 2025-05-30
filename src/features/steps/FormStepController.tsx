
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMobileFormNavigation } from '@/hooks/useMobileFormNavigation';
import FormStepForcas from '@/components/FormStepForcas';
import FormStepFraquezas from '@/components/FormStepFraquezas';
import FormStepOportunidades from '@/components/FormStepOportunidades';
import FormStepAmeacas from '@/components/FormStepAmeacas';
import FormStepResumo from '@/components/FormStepResumo';
import FormFinalSuccessScreen from './FormFinalSuccessScreen';

interface FormStepControllerProps {
  data?: any;
  onComplete?: (data: any) => void;
}

export default function FormStepController({ data, onComplete }: FormStepControllerProps) {
  const { currentStep, nextStep, prevStep } = useMobileFormNavigation(1);

  const handleStepComplete = (stepData: any) => {
    // Save step data logic here
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStepForcas
            onComplete={handleStepComplete}
            onBack={currentStep > 1 ? handleBack : undefined}
            defaultValues={data?.forcas}
          />
        );
      case 2:
        return (
          <FormStepFraquezas
            onComplete={handleStepComplete}
            onBack={handleBack}
            defaultValues={data?.fraquezas}
          />
        );
      case 3:
        return (
          <FormStepOportunidades
            onComplete={handleStepComplete}
            onBack={handleBack}
            defaultValues={data?.oportunidades}
          />
        );
      case 4:
        return (
          <FormStepAmeacas
            onComplete={handleStepComplete}
            onBack={handleBack}
            defaultValues={data?.ameacas}
          />
        );
      case 5:
        return (
          <FormStepResumo
            data={data}
            onComplete={() => nextStep()}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <FormFinalSuccessScreen
            onRefazer={() => {}}
            onVoltar={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {renderCurrentStep()}
      </motion.div>
    </AnimatePresence>
  );
}
