
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Relatorio {
  id: string;
  user_id: string;
  dados: any;
  resultado_final: any;
  criado_em: string;
}

const HistoricoRelatorios = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      carregarRelatorios();
    }
  }, [user]);

  const carregarRelatorios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("relatorios")
        .select("*")
        .eq("user_id", user?.id)
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao carregar relatórios:", error);
        toast.error("Não foi possível carregar seus relatórios");
        return;
      }

      setRelatorios(data || []);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro ao buscar seus relatórios");
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizar = (relatorio: Relatorio) => {
    // Salvar o formData completo na sessionStorage para uso no ResultsScreen
    sessionStorage.setItem("relatorioCarregado", JSON.stringify({
      ...relatorio.dados,
      resultadoFinal: relatorio.resultado_final
    }));
    
    // Redirecionar para a página de resultados
    navigate("/resultados");
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

  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return dataString;
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Faça login para acessar seus relatórios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ef0002]" />
        <p className="ml-2 text-gray-600">Carregando seus relatórios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#560005]">Histórico de Relatórios</h1>
        <p className="text-gray-600 mt-2">
          Seus diagnósticos estratégicos salvos
        </p>
      </div>

      {relatorios.length === 0 ? (
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-gray-400">Nenhum relatório salvo até agora.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorios.map((relatorio) => (
                <TableRow key={relatorio.id}>
                  <TableCell className="font-medium">
                    {formatarData(relatorio.criado_em)}
                  </TableCell>
                  <TableCell>
                    {relatorio.dados?.identificacao?.nomeEmpresa || "Nome não disponível"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVisualizar(relatorio)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Visualizar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleExcluir(relatorio.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingId === relatorio.id}
                      >
                        {deletingId === relatorio.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-center mt-6">
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
            >
              Voltar para página inicial
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricoRelatorios;
