
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Trash2, Search, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import LoadingScreen from "@/components/Auth/LoadingScreen";

type Relatorio = {
  id: string;
  criado_em: string;
  dados: any;
  resultado_final: any;
  users: {
    nome_empresa: string;
    email: string;
  };
};

const PainelAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [empresasFiltradas, setEmpresasFiltradas] = useState<string[]>([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndLoadReports = async () => {
      try {
        // Check if user is admin
        const { data: userInfo, error: userError } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user?.id)
          .single();

        if (userError) {
          console.error("Error checking admin status:", userError);
          setLoading(false);
          return;
        }

        if (!userInfo?.is_admin) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);

        // Fetch all reports with company data
        const { data, error } = await supabase
          .from("relatorios")
          .select("id, criado_em, dados, resultado_final, users(nome_empresa, email)")
          .order("criado_em", { ascending: false });

        if (error) {
          console.error("Error fetching reports:", error);
          toast.error("Erro ao carregar relatórios");
        } else {
          setRelatorios(data as Relatorio[]);
          
          // Extract unique company names
          const empresas = [...new Set(data.map(r => r.users.nome_empresa))];
          setEmpresasFiltradas(empresas);
        }
      } catch (error) {
        console.error("Error in admin panel:", error);
        toast.error("Ocorreu um erro ao carregar o painel administrativo");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadReports();
  }, [user]);

  const handleViewReport = (relatorio: Relatorio) => {
    try {
      // Store the report data in sessionStorage
      sessionStorage.setItem("relatorioCarregado", JSON.stringify(relatorio.dados));
      
      // Navigate to results page
      navigate("/resultados");
    } catch (error) {
      console.error("Error viewing report:", error);
      toast.error("Erro ao visualizar relatório");
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.")) {
      try {
        const { error } = await supabase
          .from("relatorios")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting report:", error);
          toast.error("Erro ao excluir relatório");
        } else {
          // Remove the deleted report from the state
          setRelatorios(prev => prev.filter(r => r.id !== id));
          toast.success("Relatório excluído com sucesso");
        }
      } catch (error) {
        console.error("Error in delete report:", error);
        toast.error("Ocorreu um erro ao excluir o relatório");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter reports based on search term and selected company
  const filteredRelatorios = relatorios.filter(relatorio => {
    const matchesSearch = searchTerm === "" || 
      relatorio.users.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relatorio.users.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = empresaSelecionada === null || 
      relatorio.users.nome_empresa === empresaSelecionada;
    
    return matchesSearch && matchesCompany;
  });

  // Check if the report was generated by an admin
  const isAdminReport = (relatorio: Relatorio) => {
    return relatorio.dados?.fromAdmin === true;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Esta área é exclusiva para administradores do sistema.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 my-8">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por empresa ou email"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {empresaSelecionada || "Filtrar por empresa"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEmpresaSelecionada(null)}>
                Todas as empresas
              </DropdownMenuItem>
              
              {empresasFiltradas.map((empresa) => (
                <DropdownMenuItem key={empresa} onClick={() => setEmpresaSelecionada(empresa)}>
                  {empresa}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredRelatorios.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Nenhum relatório encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRelatorios.map((relatorio) => (
                <TableRow key={relatorio.id}>
                  <TableCell className="font-medium">
                    {formatDate(relatorio.criado_em)}
                  </TableCell>
                  <TableCell>{relatorio.users.nome_empresa}</TableCell>
                  <TableCell>{relatorio.users.email}</TableCell>
                  <TableCell>
                    {isAdminReport(relatorio) && (
                      <Badge variant="secondary">⚙️ Teste interno</Badge>
                    )}
                    {relatorio.resultado_final?.ai_block_pronto ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Análise completa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Em progresso
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewReport(relatorio)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteReport(relatorio.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PainelAdmin;
