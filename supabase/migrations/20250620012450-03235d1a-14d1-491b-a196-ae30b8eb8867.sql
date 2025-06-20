
-- CORREÇÃO DEFINITIVA DAS POLÍTICAS RLS - ELIMINAR RECURSÃO INFINITA
-- Remove TODAS as políticas conflitantes que causam erro 500
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "simple_select_own" ON public.users;
DROP POLICY IF EXISTS "simple_insert_own" ON public.users;
DROP POLICY IF EXISTS "simple_update_own" ON public.users;
DROP POLICY IF EXISTS "allow_authenticated_select" ON public.users;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.users;
DROP POLICY IF EXISTS "allow_authenticated_update" ON public.users;
DROP POLICY IF EXISTS "users_can_read_own_data" ON public.users;
DROP POLICY IF EXISTS "users_can_insert_own_data" ON public.users;
DROP POLICY IF EXISTS "users_can_update_own_data" ON public.users;
DROP POLICY IF EXISTS "enable_read_own_user" ON public.users;
DROP POLICY IF EXISTS "enable_insert_own_user" ON public.users;
DROP POLICY IF EXISTS "enable_update_own_user" ON public.users;

-- Remove índices problemáticos
DROP INDEX IF EXISTS idx_users_id_simple;
DROP INDEX IF EXISTS idx_users_email_simple;
DROP INDEX IF EXISTS idx_users_id;
DROP INDEX IF EXISTS idx_users_email;

-- Desabilita RLS para limpeza completa
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com estrutura limpa
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO SECURITY DEFINER para verificar admin (evita recursão)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid() LIMIT 1),
    CASE 
      WHEN auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com') 
      THEN true 
      ELSE false 
    END
  );
$$;

-- POLÍTICA 1: SELECT - Admins veem tudo, usuários veem apenas seus dados
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin_user() = true OR id = auth.uid()
  );

-- POLÍTICA 2: INSERT - Apenas admins ou próprio usuário
CREATE POLICY "users_insert_policy" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin_user() = true OR id = auth.uid()
  );

-- POLÍTICA 3: UPDATE - Apenas admins ou próprio usuário
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin_user() = true OR id = auth.uid()
  )
  WITH CHECK (
    public.is_admin_user() = true OR id = auth.uid()
  );

-- POLÍTICA 4: DELETE - Apenas admins
CREATE POLICY "users_delete_policy" ON public.users
  FOR DELETE
  TO authenticated
  USING (public.is_admin_user() = true);

-- Índices otimizados sem predicados problemáticos
CREATE INDEX IF NOT EXISTS idx_users_id_auth ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_users_email_lookup ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_admin_flag ON public.users(is_admin) WHERE is_admin = true;

-- RLS para tabela relatorios (admins veem tudo)
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "relatorios_select_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_insert_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_update_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_delete_policy" ON public.relatorios;

CREATE POLICY "relatorios_select_policy" ON public.relatorios
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin_user() = true OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_insert_policy" ON public.relatorios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin_user() = true OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_update_policy" ON public.relatorios
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin_user() = true OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_delete_policy" ON public.relatorios
  FOR DELETE
  TO authenticated
  USING (public.is_admin_user() = true);
