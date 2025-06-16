
-- CORREÇÃO DEFINITIVA DAS POLÍTICAS RLS
-- Remove todas as políticas problemáticas que causam erro 500
DROP POLICY IF EXISTS "users_can_read_own_data" ON public.users;
DROP POLICY IF EXISTS "users_can_insert_own_data" ON public.users;
DROP POLICY IF EXISTS "users_can_update_own_data" ON public.users;
DROP POLICY IF EXISTS "enable_read_own_user" ON public.users;
DROP POLICY IF EXISTS "enable_insert_own_user" ON public.users;
DROP POLICY IF EXISTS "enable_update_own_user" ON public.users;

-- Desabilita RLS temporariamente para garantir limpeza total
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com políticas ultra-simples e testadas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política SELECT ultra-simples: usuário vê apenas seus dados
CREATE POLICY "simple_select_own" ON public.users
  FOR SELECT
  USING (id = auth.uid());

-- Política INSERT ultra-simples: usuário insere apenas seus dados  
CREATE POLICY "simple_insert_own" ON public.users
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- Política UPDATE ultra-simples: usuário atualiza apenas seus dados
CREATE POLICY "simple_update_own" ON public.users
  FOR UPDATE
  USING (id = auth.uid());
