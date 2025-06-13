
-- Remove todas as políticas RLS problemáticas que podem estar causando recursão infinita
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "enable_read_own_user" ON public.users;
DROP POLICY IF EXISTS "enable_insert_own_user" ON public.users;
DROP POLICY IF EXISTS "enable_update_own_user" ON public.users;

-- Desabilita RLS temporariamente para limpeza completa
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com políticas mais simples e sem recursão
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política simples para SELECT - permite que usuários vejam apenas seus próprios dados
-- SEM RECURSÃO: usa auth.uid() diretamente
CREATE POLICY "users_can_read_own_data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Política simples para INSERT - permite inserção apenas para o próprio usuário
CREATE POLICY "users_can_insert_own_data" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política simples para UPDATE - permite atualização apenas dos próprios dados
CREATE POLICY "users_can_update_own_data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
