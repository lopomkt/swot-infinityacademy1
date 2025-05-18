
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin text-[#ef0002]" />
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  );
};

export default LoadingScreen;
