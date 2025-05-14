
import React from "react";

interface Props {
  defaultValues?: any;
  onComplete: (data: any) => void;
}

const FormStepForcas: React.FC<Props> = ({ defaultValues, onComplete }) => {
  // Temporary placeholder UI
  return (
    <div className="p-8 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-2 text-[#560005]">[FORÇAS] Etapa em desenvolvimento</h2>
      <p className="mb-4">Esta etapa ainda está sendo implementada.</p>
      <button
        type="button"
        className="bg-[#ef0002] text-white px-4 py-2 rounded"
        onClick={() => onComplete({ placeholder: true })}
      >
        Prosseguir
      </button>
    </div>
  );
};

export default FormStepForcas;
