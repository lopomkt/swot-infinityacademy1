
-- MIGRAÇÃO RLS ULTRA SIMPLES E ROBUSTA
-- Remove todas as políticas existentes
DROP POLICY IF EXISTS "simple_select_own" ON public.users;
DROP POLICY IF EXISTS "simple_insert_own" ON public.users;
DROP POLICY IF EXISTS "simple_update_own" ON public.users;

-- Desabilita RLS temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política SELECT ultra-permissiva para testes
CREATE POLICY "allow_authenticated_select" ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Política INSERT permissiva
CREATE POLICY "allow_authenticated_insert" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Política UPDATE permissiva  
CREATE POLICY "allow_authenticated_update" ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_id ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
