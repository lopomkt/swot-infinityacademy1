
-- Remove políticas RLS problemáticas que podem estar causando recursão infinita
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Desabilita RLS temporariamente para limpeza
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com políticas mais simples e robustas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política simples para SELECT - permite que usuários vejam apenas seus próprios dados
CREATE POLICY "enable_read_own_user" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Política simples para INSERT - permite que usuários criem apenas seus próprios registros
CREATE POLICY "enable_insert_own_user" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política simples para UPDATE - permite que usuários atualizem apenas seus próprios dados
CREATE POLICY "enable_update_own_user" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
