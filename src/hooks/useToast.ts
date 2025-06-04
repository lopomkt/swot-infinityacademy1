
import { toast } from "@/components/ui/sonner";

/**
 * Hook customizado para notificações do sistema
 * Padroniza as mensagens e estilos das notificações
 */
export const useToast = () => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId);
  };

  // Notificações específicas do sistema
  const showSaveSuccess = () => {
    showSuccess("Dados salvos com sucesso!", "Suas informações foram armazenadas.");
  };

  const showSaveError = () => {
    showError("Erro ao salvar", "Não foi possível salvar os dados. Tente novamente.");
  };

  const showNetworkError = () => {
    showError("Erro de conexão", "Verifique sua conexão com a internet e tente novamente.");
  };

  const showAuthError = () => {
    showError("Erro de autenticação", "Sua sessão expirou. Faça login novamente.");
  };

  const showValidationError = (field?: string) => {
    showError(
      "Dados inválidos", 
      field ? `Verifique o campo: ${field}` : "Verifique os dados informados."
    );
  };

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    dismiss,
    // Notificações específicas
    saveSuccess: showSaveSuccess,
    saveError: showSaveError,
    networkError: showNetworkError,
    authError: showAuthError,
    validationError: showValidationError,
  };
};
