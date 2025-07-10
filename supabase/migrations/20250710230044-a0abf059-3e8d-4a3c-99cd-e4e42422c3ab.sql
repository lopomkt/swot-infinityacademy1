-- CORREÇÃO DEFINITIVA - REMOVE TODAS AS POLÍTICAS E REDEFINE DE FORMA LIMPA
-- Primeiro remove TODAS as políticas existentes
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;
DROP POLICY IF EXISTS "Admins podem atualizar qualquer usuário" ON public.users;
DROP POLICY IF EXISTS "Admins podem ver todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Allow self-insert" ON public.users;
DROP POLICY IF EXISTS "Allow self-select" ON public.users;
DROP POLICY IF EXISTS "Permitir signup de novos usuários" ON public.users;
DROP POLICY IF EXISTS "Usuário acessa apenas sua linha" ON public.users;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "users_delete_simple" ON public.users;
DROP POLICY IF EXISTS "users_insert_simple" ON public.users;
DROP POLICY IF EXISTS "users_select_simple" ON public.users;
DROP POLICY IF EXISTS "users_update_simple" ON public.users;

DROP POLICY IF EXISTS "relatorios_select_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_insert_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_update_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_delete_policy" ON public.relatorios;
DROP POLICY IF EXISTS "Admin visualiza tudo" ON public.relatorios;
DROP POLICY IF EXISTS "Admins can delete all reports" ON public.relatorios;
DROP POLICY IF EXISTS "Admins can delete any report" ON public.relatorios;
DROP POLICY IF EXISTS "Admins can read all reports" ON public.relatorios;
DROP POLICY IF EXISTS "Admins can view all reports" ON public.relatorios;
DROP POLICY IF EXISTS "Admins podem ver todos os relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.relatorios;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.relatorios;
DROP POLICY IF EXISTS "Usuário acessa seus próprios relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "Usuário pode inserir seus relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "Usuários podem criar relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios relatórios" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_delete_simple" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_insert_simple" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_select_simple" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_update_simple" ON public.relatorios;

-- Desabilita RLS temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS FINAIS - SIMPLES E SEM RECURSÃO
-- Lista definitiva de emails admin
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.email() IN (
    'infinitymkt00@gmail.com',
    'admin@swotinsights.com', 
    'admin@infinityacademy.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- TABELA USERS: Políticas baseadas apenas em email e uid (SEM consulta recursiva)
CREATE POLICY "users_select_final" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin_by_email() OR id = auth.uid()
  );

CREATE POLICY "users_insert_final" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin_by_email() OR id = auth.uid()
  );

CREATE POLICY "users_update_final" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin_by_email() OR id = auth.uid()
  )
  WITH CHECK (
    public.is_admin_by_email() OR id = auth.uid()
  );

CREATE POLICY "users_delete_final" ON public.users
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin_by_email()
  );

-- TABELA RELATORIOS: Políticas similares sem recursão
CREATE POLICY "relatorios_select_final" ON public.relatorios
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin_by_email() OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_insert_final" ON public.relatorios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin_by_email() OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_update_final" ON public.relatorios
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin_by_email() OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_delete_final" ON public.relatorios
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin_by_email()
  );

-- Índices otimizados
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_relatorios_user_id ON public.relatorios(user_id);