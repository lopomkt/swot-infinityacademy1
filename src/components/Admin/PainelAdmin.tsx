
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Eye, Trash2, Search, Clock, Building, User, Loader2, LogOut } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Relatorio {
  id: string;
  user_id: string;
  dados: any;
  resultado_final: any;
  criado_em: string;
  empresa?: string;
  email?: string;
}

interface RelatorioAgrupado {
  [key: string]: Relatorio[];
}

const formatarData = (dataString: string) => {
  try {
    return format(new Date(dataString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  } catch (e) {
    return dataString;
  }
};

const PainelAdmin = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [relatoriosFiltrados, setRelatoriosFiltrados] = useState<Relatorio[]>([]);
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>("todas");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      carregarRelatorios();
    }
  }, [user]);

  useEffect(() => {
    aplicarFiltros();
  }, [relatorios, empresaSelecionada, searchTerm]);

  const carregarRelatorios = async () => {
    try {
      setLoading(true);
      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user?.id)
        .single();

      if (userError || !userInfo?.is_admin) {
        console.error("Acesso restrito. Usuário não é administrador.");
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("relatorios")
        .select(`
          id, 
          user_id, 
          dados, 
          resultado_final, 
          criado_em,
          users (nome_empresa, email)
        `)
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao carregar relatórios:", error);
        toast.error("Não foi possível carregar os relatórios");
        return;
      }

      // Processar os dados para facilitar acesso às informações da empresa
      const relatoriosProcessados = data.map((r: any) => ({
        ...r,
        empresa: r.users?.nome_empresa || r.dados?.identificacao?.nomeEmpresa || "Empresa não especificada",
        email: r.users?.email || "Email não disponível"
      }));

      // Extrair lista de empresas únicas para o filtro
      const listaEmpresas = [...new Set(relatoriosProcessados.map((r: Relatorio) => r.empresa))];

      setRelatorios(relatoriosProcessados);
      setRelatoriosFiltrados(relatoriosProcessados);
      setEmpresas(listaEmpresas);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro ao buscar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultados = [...relatorios];
    
    // Filtrar por empresa
    if (empresaSelecionada !== "todas") {
      resultados = resultados.filter(r => r.empresa === empresaSelecionada);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultados = resultados.filter(r => 
        r.empresa?.toLowerCase().includes(termo) ||
        r.email?.toLowerCase().includes(termo) ||
        r.dados?.identificacao?.nomeEmpresa?.toLowerCase().includes(termo)
      );
    }
    
    setRelatoriosFiltrados(resultados);
  };

  const handleVisualizar = (relatorio: Relatorio) => {
    // Salvar o ID do relatório na sessionStorage para uso na página VisualizarRelatorio
    sessionStorage.setItem('relatorio_id', relatorio.id);
    
    // Redirecionar para a página de visualização
    navigate("/visualizar");
  };

  const handleExcluir = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este relatório?")) {
      try {
        setDeletingId(id);
        const { error } = await supabase
          .from("relatorios")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Erro ao excluir relatório:", error);
          toast.error("Não foi possível excluir o relatório");
          return;
        }

        setRelatorios(relatorios.filter(r => r.id !== id));
        toast.success("Relatório excluído com sucesso");
      } catch (error) {
        console.error("Erro:", error);
        toast.error("Ocorreu um erro ao excluir o relatório");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const agruparPorEmpresa = () => {
    const agrupados: RelatorioAgrupado = {};
    relatoriosFiltrados.forEach(relatorio => {
      const empresa = relatorio.empresa || "Sem empresa";
      if (!agrupados[empresa]) {
        agrupados[empresa] = [];
      }
      agrupados[empresa].push(relatorio);
    });
    return agrupados;
  };

  const isAdminReport = async (relatorio: Relatorio) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", relatorio.user_id)
        .single();
      
      if (error) {
        console.error("Erro ao verificar status de admin:", error);
        return false;
      }
      
      return data?.is_admin === true;
    } catch (error) {
      console.error("Erro ao verificar status de admin:", error);
      return false;
    }
  };

  const handleTestarComoCliente = () => {
    // Limpar qualquer relatório em sessão antes de ir para a ferramenta como cliente
    sessionStorage.removeItem("relatorio_id");
    navigate("/");
  };

  const handleLogout = async () => {
    // Limpar dados de sessão antes do logout
    sessionStorage.removeItem("relatorio_id");
    await signOut();
  };

  const hasCompleteResult = (relatorio: Relatorio) => {
    return !!relatorio.resultado_final?.ai_block_pronto;
  };

  // Se estiver carregando, mostrar indicador
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-[#ef0002] mb-4" />
        <p className="text-lg text-gray-600">Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 relative">
      <Button 
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="absolute top-4 right-6 flex gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut size={16} />
        Sair
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#560005]">Painel Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Gerencie todos os relatórios dos clientes
        </p>
      </div>

      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Buscar por empresa ou email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas empresas</SelectItem>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa} value={empresa}>
                    {empresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-8 flex justify-center">
          <Button 
            variant="outline"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={handleTestarComoCliente}
          >
            Testar ferramenta SWOT como cliente
          </Button>
        </div>

        <Tabs defaultValue="lista" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lista">Lista completa</TabsTrigger>
            <TabsTrigger value="empresas">Agrupar por empresa</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="mt-6">
            {relatoriosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-gray-400">Nenhum relatório encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatoriosFiltrados.map((relatorio) => (
                  <Card key={relatorio.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-md line-clamp-1 pr-2">
                          {relatorio.dados?.identificacao?.nomeEmpresa || "Nome não disponível"}
                        </CardTitle>
                        <div className="flex gap-1">
                          {relatorio.user_id === user?.id && (
                            <Badge variant="outline" className="bg-gray-100 text-xs">
                              ⚙️ Teste interno
                            </Badge>
                          )}
                          {hasCompleteResult(relatorio) ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                              Completo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                              Parcial
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {formatarData(relatorio.criado_em)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Building size={14} className="mr-1" />
                          {relatorio.empresa || "Empresa não especificada"}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <User size={14} className="mr-1" />
                          {relatorio.email || "Email não disponível"}
                        </div>
                      </div>
                      
                      <div className="flex mt-4 gap-2">
                        <Button 
                          className="flex-1 text-sm h-8"
                          onClick={() => handleVisualizar(relatorio)}
                        >
                          <Eye size={14} className="mr-1" />
                          Visualizar
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-sm h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleExcluir(relatorio.id)}
                          disabled={deletingId === relatorio.id}
                        >
                          {deletingId === relatorio.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="empresas" className="mt-6">
            {Object.keys(agruparPorEmpresa()).length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <p className="text-gray-400">Nenhum relatório encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(agruparPorEmpresa()).map(([empresa, relatoriosEmpresa]) => (
                  <Card key={empresa} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{empresa}</CardTitle>
                        <Badge className="bg-[#ef0002]">{relatoriosEmpresa.length} relatórios</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      <ScrollArea className="max-h-[300px]">
                        <div className="p-4 space-y-2">
                          {relatoriosEmpresa.map((relatorio) => (
                            <div key={relatorio.id} className="border rounded-md p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">
                                  {formatarData(relatorio.criado_em)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {relatorio.email}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {relatorio.user_id === user?.id && (
                                  <Badge variant="outline" className="bg-gray-100 text-xs">
                                    ⚙️ Teste interno
                                  </Badge>
                                )}
                                <Button 
                                  size="sm"
                                  onClick={() => handleVisualizar(relatorio)}
                                >
                                  <Eye size={14} className="mr-1" />
                                  Ver
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleExcluir(relatorio.id)}
                                  disabled={deletingId === relatorio.id}
                                >
                                  {deletingId === relatorio.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Tag de controle */}
      {/* fase6_admin_image_ok = true */}
    </div>
  );
};

export default PainelAdmin;
