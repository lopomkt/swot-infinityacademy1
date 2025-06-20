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
import { Eye, Trash2, Search, Clock, Building, User, Loader2, LogOut, AlertCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

interface Usuario {
  id: string;
  email: string;
  nome_empresa: string;
  data_validade: string;
  data_entrada: string;
  is_admin: boolean;
  ativo: boolean;
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
  const [error, setError] = useState<string | null>(null);
  
  // Estados para gestão de usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosLoading, setUsuariosLoading] = useState(true);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [diasExtras, setDiasExtras] = useState<number>(30);
  const [mostrarModalDias, setMostrarModalDias] = useState(false);
  const [processandoOperacao, setProcessandoOperacao] = useState(false);
  
  const { user, signOut, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userData) {
      console.log("🔍 [PainelAdmin] Iniciando carregamento com usuário:", {
        userId: user.id,
        email: user.email,
        isAdmin: userData.is_admin
      });
      carregarDados();
    }
  }, [user, userData]);

  useEffect(() => {
    aplicarFiltros();
  }, [relatorios, empresaSelecionada, searchTerm]);

  const carregarDados = async () => {
    await Promise.all([carregarRelatorios(), carregarUsuarios()]);
  };

  const carregarRelatorios = async () => {
    try {
      console.log("📊 [PainelAdmin] Carregando relatórios...");
      setLoading(true);
      setError(null);
      
      const { data, error, count } = await supabase
        .from("relatorios")
        .select(`
          id, 
          user_id, 
          dados, 
          resultado_final, 
          criado_em,
          users (nome_empresa, email)
        `, { count: 'exact' })
        .order("criado_em", { ascending: false });

      console.log("📊 [PainelAdmin] Resposta da query relatórios:", {
        success: !error,
        count,
        dataLength: data?.length,
        error: error?.message
      });

      if (error) {
        console.error("❌ [PainelAdmin] Erro ao carregar relatórios:", error);
        setError(`Erro ao carregar relatórios: ${error.message}`);
        toast.error("Não foi possível carregar os relatórios");
        return;
      }

      const relatoriosProcessados = (data || []).map((r: any) => ({
        ...r,
        empresa: r.users?.nome_empresa || r.dados?.identificacao?.nomeEmpresa || "Empresa não especificada",
        email: r.users?.email || "Email não disponível"
      }));

      const listaEmpresas = [...new Set(relatoriosProcessados.map((r: Relatorio) => r.empresa))];

      console.log("✅ [PainelAdmin] Relatórios processados:", {
        total: relatoriosProcessados.length,
        empresas: listaEmpresas.length
      });

      setRelatorios(relatoriosProcessados);
      setRelatoriosFiltrados(relatoriosProcessados);
      setEmpresas(listaEmpresas);
    } catch (error: any) {
      console.error("❌ [PainelAdmin] Erro interno ao carregar relatórios:", error);
      setError("Erro interno ao buscar relatórios");
      toast.error("Ocorreu um erro ao buscar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    try {
      console.log("👥 [PainelAdmin] Carregando usuários...");
      setUsuariosLoading(true);
      
      const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: 'exact' })
        .order("data_entrada", { ascending: false });

      console.log("👥 [PainelAdmin] Resposta da query usuários:", {
        success: !error,
        count,
        dataLength: data?.length,
        error: error?.message
      });

      if (error) {
        console.error("❌ [PainelAdmin] Erro ao carregar usuários:", error);
        toast.error(`Não foi possível carregar usuários: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("⚠️ [PainelAdmin] Nenhum usuário encontrado na tabela users");
        toast.warning("Nenhum usuário encontrado no sistema");
      } else {
        console.log("✅ [PainelAdmin] Usuários carregados com sucesso:", {
          total: data.length,
          usuarios: data.map(u => ({ email: u.email, nome: u.nome_empresa, admin: u.is_admin }))
        });
      }

      setUsuarios(data || []);
    } catch (error: any) {
      console.error("❌ [PainelAdmin] Erro interno ao carregar usuários:", error);
      toast.error("Erro interno ao buscar usuários");
    } finally {
      setUsuariosLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultados = [...relatorios];
    
    if (empresaSelecionada !== "todas") {
      resultados = resultados.filter(r => r.empresa === empresaSelecionada);
    }
    
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
    sessionStorage.setItem('relatorio_id', relatorio.id);
    navigate(`/visualizar?id=${relatorio.id}`);
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
          console.error("❌ [PainelAdmin] Erro ao excluir relatório:", error);
          toast.error("Não foi possível excluir o relatório");
          return;
        }

        setRelatorios(relatorios.filter(r => r.id !== id));
        toast.success("Relatório excluído com sucesso");
      } catch (error: any) {
        console.error("❌ [PainelAdmin] Erro interno ao excluir:", error);
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
    sessionStorage.removeItem("relatorio_id");
    localStorage.clear();
    navigate("/?modo_teste_admin=true");
  };

  const handleLogout = async () => {
    await signOut();
  };

  const hasCompleteResult = (relatorio: Relatorio) => {
    return !!relatorio.resultado_final?.ai_block_pronto;
  };

  // Função para verificar se um usuário está com acesso expirado
  const isUsuarioExpirado = (usuario: Usuario) => {
    return new Date(usuario.data_validade) < new Date();
  };

  // Novas funções de gestão de usuários
  const editarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setMostrarModalEditar(true);
  };

  const excluirUsuario = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      try {
        setProcessandoOperacao(true);
        const { error } = await supabase
          .from("users")
          .delete() 
          .eq("id", id);

        if (error) {
          console.error("❌ [PainelAdmin] Erro ao excluir usuário:", error);
          toast.error("Não foi possível excluir o usuário");
          return;
        }

        toast.success("Usuário removido com sucesso");
        carregarUsuarios();
      } catch (error: any) {
        console.error("❌ [PainelAdmin] Erro interno ao excluir usuário:", error);
        toast.error("Ocorreu um erro ao tentar excluir o usuário");
      } finally {
        setProcessandoOperacao(false);
      }
    }
  };

  // Nova função para abrir o modal de prolongar prazo (reativar acesso)
  const abrirModalProlongarPrazo = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setDiasExtras(30); // Reset para valor padrão
    setMostrarModalDias(true);
  };

  // Função para prolongar o prazo de acesso (reativar usuário)
  const prolongarPrazo = async () => {
    if (!usuarioSelecionado) return;
    
    try {
      setProcessandoOperacao(true);
      
      const dataAtual = new Date(usuarioSelecionado.data_validade);
      const novaData = addDays(dataAtual, diasExtras);
      
      const { error } = await supabase
        .from("users")
        .update({ 
          data_validade: novaData.toISOString() 
        })
        .eq("id", usuarioSelecionado.id);

      if (error) {
        console.error("❌ [PainelAdmin] Erro ao prolongar prazo:", error);
        toast.error("Não foi possível atualizar a data de validade");
        return;
      }

      toast.success(`Validade estendida em ${diasExtras} dias com sucesso!`);
      setMostrarModalDias(false);
      carregarUsuarios();
    } catch (error: any) {
      console.error("❌ [PainelAdmin] Erro interno ao prolongar prazo:", error);
      toast.error("Ocorreu um erro ao estender o prazo de validade");
    } finally {
      setProcessandoOperacao(false);
    }
  };

  const salvarEdicaoUsuario = async () => {
    if (!usuarioSelecionado) return;

    try {
      setProcessandoOperacao(true);
      
      const { error } = await supabase
        .from("users")
        .update({
          nome_empresa: usuarioSelecionado.nome_empresa,
          email: usuarioSelecionado.email,
          ativo: usuarioSelecionado.ativo
        })
        .eq("id", usuarioSelecionado.id);

      if (error) {
        console.error("❌ [PainelAdmin] Erro ao atualizar usuário:", error);
        toast.error("Não foi possível atualizar os dados do usuário");
        return;
      }

      toast.success("Dados do usuário atualizados com sucesso!");
      setMostrarModalEditar(false);
      carregarUsuarios();
    } catch (error: any) {
      console.error("❌ [PainelAdmin] Erro interno ao atualizar usuário:", error);
      toast.error("Ocorreu um erro ao salvar os dados do usuário");
    } finally {
      setProcessandoOperacao(false);
    }
  };

  // Estados de carregamento
  if (loading || usuariosLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-[#ef0002] mb-4" />
        <p className="text-lg text-gray-600">Carregando painel administrativo...</p>
        <p className="text-sm text-gray-500 mt-2">
          {usuariosLoading ? "Carregando usuários..." : "Carregando relatórios..."}
        </p>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-red-600 mb-4">Erro no Painel Admin</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={carregarDados} className="mb-4">
          Tentar Novamente
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          Fazer Logout
        </Button>
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
        <h1 className="text-2xl font-bold text-[#560005] mb-2">Painel Administrativo</h1>
        <p className="text-gray-600 mt-2 mb-6">
          Gerencie os acessos dos usuários à ferramenta
        </p>
        
        <div className="flex justify-center mb-8">
          <Button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
            onClick={handleTestarComoCliente}
          >
            Testar ferramenta SWOT como cliente
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="usuarios">
              Gestão de Usuários ({usuarios.length})
            </TabsTrigger>
            <TabsTrigger value="relatorios">
              Relatórios ({relatorios.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab de Gestão de Usuários */}
          <TabsContent value="usuarios">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Usuários Cadastrados ({usuarios.length})</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={carregarUsuarios}
                    disabled={usuariosLoading}
                  >
                    {usuariosLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usuarios.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Nenhum usuário encontrado.</p>
                    <Button onClick={carregarUsuarios} variant="outline">
                      Recarregar Usuários
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {usuarios.map((usuario) => (
                      <Card key={usuario.id} className="bg-white p-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">{usuario.nome_empresa}</span>
                              {usuario.is_admin && (
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200">Admin</Badge>
                              )}
                              {!usuario.ativo && (
                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Inativo</Badge>
                              )}
                              {isUsuarioExpirado(usuario) && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Expirado</Badge>
                              )}
                            </div>
                            <p className="text-gray-500 flex items-center gap-1">
                              <User size={14} /> {usuario.email}
                            </p>
                            <p className={`flex items-center gap-1 ${isUsuarioExpirado(usuario) ? 'text-red-500' : 'text-gray-500'}`}>
                              <Clock size={14} /> 
                              Validade: {format(new Date(usuario.data_validade), "dd/MM/yyyy")}
                              {isUsuarioExpirado(usuario) && <span className="text-red-500 text-xs ml-2">(Acesso expirado)</span>}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => editarUsuario(usuario)}
                              disabled={processandoOperacao}
                            >
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => abrirModalProlongarPrazo(usuario)}
                              disabled={processandoOperacao}
                            >
                              {isUsuarioExpirado(usuario) ? "Reativar Acesso" : "+ Dias"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => excluirUsuario(usuario.id)}
                              disabled={processandoOperacao || usuario.is_admin || usuario.id === user?.id}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Relatórios */}
          <TabsContent value="relatorios">
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

            {relatoriosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Nenhum relatório encontrado.</p>
                  <Button onClick={carregarRelatorios} variant="outline" size="sm">
                    Recarregar Relatórios
                  </Button>
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
                          {relatorio.resultado_final?.ai_block_pronto ? (
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
        </Tabs>
      </div>
      
      {/* Modals */}
      <Dialog open={mostrarModalEditar} onOpenChange={setMostrarModalEditar}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          
          {usuarioSelecionado && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={usuarioSelecionado.email}
                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, email: e.target.value})}
                  disabled={processandoOperacao}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input 
                  value={usuarioSelecionado.nome_empresa}
                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, nome_empresa: e.target.value})}
                  disabled={processandoOperacao}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="ativo"
                  checked={usuarioSelecionado.ativo}
                  onChange={(e) => setUsuarioSelecionado({...usuarioSelecionado, ativo: e.target.checked})}
                  disabled={processandoOperacao}
                />
                <label htmlFor="ativo" className="text-sm font-medium">Usuário ativo</label>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-4">
                <p className="text-sm text-yellow-700">
                  Data de validade atual: {format(new Date(usuarioSelecionado.data_validade), "dd/MM/yyyy")}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Para alterar a data de validade, use o botão "+ Dias" na lista de usuários.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarModalEditar(false)} disabled={processandoOperacao}>
              Cancelar
            </Button>
            <Button onClick={salvarEdicaoUsuario} disabled={processandoOperacao}>
              {processandoOperacao ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para Prolongar Prazo / Reativar Acesso */}
      <Dialog open={mostrarModalDias} onOpenChange={setMostrarModalDias}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {usuarioSelecionado && isUsuarioExpirado(usuarioSelecionado) 
                ? "Reativar Acesso do Usuário" 
                : "Prolongar Prazo de Validade"}
            </DialogTitle>
          </DialogHeader>
          
          {usuarioSelecionado && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm mb-2">
                  <strong>Usuário:</strong> {usuarioSelecionado.nome_empresa}
                </p>
                <p className="text-sm mb-4">
                  <strong>Validade atual:</strong> {format(new Date(usuarioSelecionado.data_validade), "dd/MM/yyyy")}
                  {isUsuarioExpirado(usuarioSelecionado) && (
                    <span className="text-red-500 text-xs ml-2">(Expirado)</span>
                  )}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Adicionar dias</label>
                <div className="flex gap-2 flex-wrap">
                  {[15, 30, 60, 90, 180, 365].map((dias) => (
                    <Button 
                      key={dias}
                      type="button"
                      size="sm"
                      variant={diasExtras === dias ? "default" : "outline"}
                      onClick={() => setDiasExtras(dias)}
                      disabled={processandoOperacao}
                    >
                      {dias}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Input 
                    type="number" 
                    value={diasExtras}
                    onChange={(e) => setDiasExtras(parseInt(e.target.value) || 0)}
                    disabled={processandoOperacao}
                    min={1}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Nova data de validade: {format(addDays(new Date(usuarioSelecionado.data_validade), diasExtras), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarModalDias(false)} disabled={processandoOperacao}>
              Cancelar
            </Button>
            <Button onClick={prolongarPrazo} disabled={processandoOperacao || diasExtras <= 0}>
              {processandoOperacao ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {usuarioSelecionado && isUsuarioExpirado(usuarioSelecionado) 
                ? "Reativar Acesso" 
                : "Prolongar Assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PainelAdmin;
