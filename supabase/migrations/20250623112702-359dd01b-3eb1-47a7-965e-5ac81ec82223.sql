
-- CORREÇÃO DEFINITIVA - ORDEM CORRETA PARA EVITAR DEPENDÊNCIAS
-- Remove TODAS as políticas PRIMEIRO (antes de dropar a função)
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;
DROP POLICY IF EXISTS "relatorios_select_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_insert_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_update_policy" ON public.relatorios;
DROP POLICY IF EXISTS "relatorios_delete_policy" ON public.relatorios;

-- AGORA pode remover a função sem dependências
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Desabilita RLS temporariamente para limpeza
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS SIMPLES SEM RECURSÃO - BASEADAS APENAS EM auth.email() e auth.uid()

-- TABELA USERS: Políticas baseadas apenas em email e uid (SEM consulta à tabela users)
CREATE POLICY "users_select_simple" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com') 
    OR id = auth.uid()
  );

CREATE POLICY "users_insert_simple" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
    OR id = auth.uid()
  );

CREATE POLICY "users_update_simple" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
    OR id = auth.uid()
  )
  WITH CHECK (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
    OR id = auth.uid()
  );

CREATE POLICY "users_delete_simple" ON public.users
  FOR DELETE
  TO authenticated
  USING (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
  );

-- TABELA RELATORIOS: Políticas similares sem recursão
CREATE POLICY "relatorios_select_simple" ON public.relatorios
  FOR SELECT
  TO authenticated
  USING (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
    OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_insert_simple" ON public.relatorios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
    OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_update_simple" ON public.relatorios
  FOR UPDATE
  TO authenticated
  USING (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
    OR user_id = auth.uid()
  );

CREATE POLICY "relatorios_delete_simple" ON public.relatorios
  FOR DELETE
  TO authenticated
  USING (
    auth.email() IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com')
  );

-- Índices otimizados
CREATE INDEX IF NOT EXISTS idx_users_email_admin ON public.users(email) WHERE email IN ('infinitymkt00@gmail.com', 'admin@swotinsights.com', 'admin@infinityacademy.com');
CREATE INDEX IF NOT EXISTS idx_relatorios_user_id ON public.relatorios(user_id);
