
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres")
});

const registerSchema = z.object({
  nome_empresa: z.string().min(3, "Nome da empresa precisa ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [manterLogado, setManterLogado] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  
  const { signIn, isAuthenticated, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirecionamento melhorado sem navigate nas dependências
  useEffect(() => {
    if (redirecting || authLoading) return;

    if (isAuthenticated && userData) {
      console.log("🎯 [AuthScreen] Iniciando redirecionamento para usuário autenticado:", userData.email);
      setRedirecting(true);
      
      const targetRoute = userData.is_admin ? "/admin" : "/";
      
      setTimeout(() => {
        console.log("🎯 [AuthScreen] Executando navegação para:", targetRoute);
        navigate(targetRoute, { replace: true });
      }, 300);
    }
  }, [isAuthenticated, userData, authLoading, redirecting]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome_empresa: "",
      email: "",
      password: ""
    }
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    if (isLoading || redirecting) return;
    
    setIsLoading(true);
    setLoginAttempts(prev => prev + 1);
    
    try {
      console.log("🔐 [AuthScreen] Iniciando login:", data.email);

      const result = await signIn(data.email.trim().toLowerCase(), data.password, manterLogado);
      
      if (result.success) {
        console.log("✅ [AuthScreen] Login bem-sucedido");
        toast.success("Login realizado com sucesso!", "Redirecionando...");
        // O redirecionamento será handled pelo useEffect
      } else {
        console.error("❌ [AuthScreen] Falha no login:", result.message);
        
        if (result.message.includes("Email ou senha")) {
          toast.error("Credenciais inválidas", "Verifique seu email e senha.");
        } else if (result.message.includes("Muitas tentativas")) {
          toast.error("Muitas tentativas", "Aguarde alguns minutos.");
        } else {
          toast.error("Erro no login", result.message);
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("❌ [AuthScreen] Erro inesperado no login:", error);
      toast.error("Erro inesperado", "Tente novamente em alguns instantes.");
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { email, password, nome_empresa } = data;
      
      console.log("📝 [AuthScreen] Tentativa de cadastro:", { email, nome_empresa });

      const { data: authData, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { nome_empresa },
        },
      });

      if (error) {
        console.error("❌ [AuthScreen] Erro no cadastro:", error);
        toast.error("Erro ao cadastrar", error.message);
        return;
      }
      
      const { user } = authData;

      if (user) {
        console.log("✅ [AuthScreen] Usuário criado no Auth:", user.email);
        
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id || user.id;
        
        if (userId) {
          const { data: existing } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

          if (!existing) {
            const dataValidade = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
            const dataEntrada = new Date().toISOString();
            
            const { error: insertError } = await supabase.from("users").insert({
              id: userId,
              email: user.email,
              nome_empresa,
              is_admin: false,
              data_validade: dataValidade,
              data_entrada: dataEntrada,
              ativo: true
            });

            if (insertError) {
              console.error("❌ [AuthScreen] Erro ao criar registro na tabela users:", insertError);
              toast.error("Erro ao finalizar cadastro", insertError.message);
              return;
            }
          }
        }
        
        toast.success("Cadastro realizado com sucesso!", "Você já pode fazer login.");
        setActiveTab("login");
        loginForm.setValue("email", email);
      }
      
    } catch (error: any) {
      console.error("❌ [AuthScreen] Erro inesperado no cadastro:", error);
      toast.error("Erro inesperado", error?.message || "Falha no cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state melhorado
  if (authLoading || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#ef0002] mx-auto mb-4" />
          <p className="text-gray-600">
            {redirecting ? "Redirecionando..." : "Verificando autenticação..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">SWOT INSIGHTS</h1>
          <p className="text-gray-600 mt-2">Plataforma de Diagnóstico Estratégico</p>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Acesse sua conta
                </CardTitle>
                <CardDescription>
                  Digite seu email e senha para continuar
                  {loginAttempts > 2 && (
                    <div className="flex items-center gap-1 mt-2 text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Várias tentativas detectadas</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="seu@email.com" 
                              {...field} 
                              disabled={isLoading || redirecting}
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="******" 
                              {...field} 
                              disabled={isLoading || redirecting}
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Checkbox 
                        id="manter-logado"
                        checked={manterLogado}
                        onCheckedChange={(checked) => setManterLogado(checked === true)}
                        disabled={isLoading || redirecting}
                      />
                      <label 
                        htmlFor="manter-logado" 
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Manter logado
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#ef0002] hover:bg-[#b70001]" 
                      disabled={isLoading || redirecting}
                    >
                      {isLoading || redirecting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {redirecting ? "Redirecionando..." : "Entrando..."}
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("register")}
                  className="text-sm text-gray-600"
                  disabled={isLoading || redirecting}
                >
                  Não tem uma conta? Cadastre-se
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crie sua conta</CardTitle>
                <CardDescription>Preencha os campos abaixo para cadastrar</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="nome_empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Sua Empresa Ltda." 
                              {...field} 
                              disabled={isLoading}
                              autoComplete="organization"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="seu@email.com" 
                              {...field} 
                              disabled={isLoading}
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="******" 
                              {...field} 
                              disabled={isLoading}
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-[#ef0002] hover:bg-[#b70001]" 
                      disabled={isLoading || !registerForm.formState.isValid}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Cadastrar"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("login")}
                  className="text-sm text-gray-600"
                  disabled={isLoading}
                >
                  Já tem uma conta? Faça login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthScreen;
