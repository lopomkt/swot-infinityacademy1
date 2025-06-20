
-- LIMPEZA COMPLETA E DEFINITIVA DO RLS (VERSÃO CORRIGIDA)
-- Remove TODAS as políticas existentes que podem estar causando conflito
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

-- Desabilita RLS temporariamente para limpeza total
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com estrutura limpa
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- POLÍTICA 1: SELECT - Usuários veem seus próprios dados
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- POLÍTICA 2: INSERT - Usuários podem inserir seus próprios dados
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- POLÍTICA 3: UPDATE - Usuários podem atualizar seus próprios dados
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Índices básicos para performance (sem predicados que causam erro)
CREATE INDEX IF NOT EXISTS idx_users_id_simple ON public.users(id);
CREATE INDEX IF NOT EXISTS idx_users_email_simple ON public.users(email);
