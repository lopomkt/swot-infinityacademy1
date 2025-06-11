
-- Remove políticas RLS existentes que podem estar causando recursão infinita
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;

-- Desabilita RLS temporariamente para corrigir
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Reabilita RLS com políticas corretas e simples
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política simples para SELECT (usuário pode ver apenas seus próprios dados)
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Política simples para INSERT (apenas usuários autenticados podem inserir seus próprios dados)
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política simples para UPDATE (usuário pode atualizar apenas seus próprios dados)
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
