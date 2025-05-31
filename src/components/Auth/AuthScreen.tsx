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
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
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
  const { signIn, isAuthenticated, userData } = useAuth();
  const navigate = useNavigate();

  // Redirecionamento automático quando usuário está autenticado
  useEffect(() => {
    if (isAuthenticated && userData) {
      console.log("🚀 Usuário autenticado detectado, redirecionando...", userData);
      
      // Redirecionamento baseado no tipo de usuário
      if (userData.is_admin) {
        console.log("👑 Redirecionando para admin");
        navigate("/admin", { replace: true });
      } else {
        console.log("👤 Redirecionando para área do usuário");
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, userData, navigate]);

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
    setIsLoading(true);
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      const result = await signIn(data.email, data.password, manterLogado);
      if (result.success) {
        console.log("✅ Login realizado com sucesso, aguardando redirecionamento...");
        toast.success("Login realizado com sucesso!");
        // O redirecionamento será feito pelo useEffect acima
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("❌ Erro no login:", error);
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { email, password, nome_empresa } = data;
      
      if (!email || !password || !nome_empresa) {
        toast.error("Preencha todos os campos.");
        setIsLoading(false);
        return;
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome_empresa },
        },
      });

      if (error) {
        toast.error("Erro ao cadastrar: " + error.message);
        setIsLoading(false);
        return;
      }
      
      const { user } = authData;

      if (user) {
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
              console.error("Erro ao criar registro na tabela users:", insertError);
              toast.error("Erro ao finalizar cadastro: " + insertError.message);
              setIsLoading(false);
              return;
            }
          }
        }
        
        toast.success("Cadastro realizado com sucesso!");
        setActiveTab("login");
      }
      
    } catch (error: any) {
      toast.error("Erro inesperado: " + (error?.message || "Falha no cadastro"));
    } finally {
      setIsLoading(false);
    }
  };

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
                <CardTitle>Acesse sua conta</CardTitle>
                <CardDescription>Digite seu email e senha para continuar</CardDescription>
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
                            <Input placeholder="seu@email.com" {...field} />
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
                            <Input type="password" placeholder="******" {...field} />
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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Carregando...
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
                            <Input placeholder="Sua Empresa Ltda." {...field} />
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
                            <Input placeholder="seu@email.com" {...field} />
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
                            <Input type="password" placeholder="******" {...field} />
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
