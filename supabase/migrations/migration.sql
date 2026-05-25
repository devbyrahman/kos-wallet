-- ==================================================
-- SQL MIGRATION: DYNAMIC CUSTOM CATEGORIES STABILIZATION
-- ==================================================
-- This script alters or creates the 'categories' table to support per-user dynamic custom categories 
-- with strict Row Level Security (RLS) policies, safety flags, and system protections.

-- 1. Create categories table if it does not exist
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT DEFAULT 'wallet',
    color TEXT DEFAULT '#8b5cf6',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Alter existing table to add user_id, is_system, and default values if table already exists
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'wallet';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#8b5cf6';

-- 3. Enable Row Level Security (RLS) on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing policies to prevent conflicts
DROP POLICY IF EXISTS "Categories are readable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;

-- 5. Create secure and fine-grained RLS Policies
-- SELECT POLICY: Anyone can read system categories (is_system = true OR user_id IS NULL)
-- AND logged-in users can read their own custom categories (auth.uid() = user_id)
CREATE POLICY "Categories are readable by everyone" 
  ON public.categories FOR SELECT 
  USING (is_system = true OR user_id IS NULL OR auth.uid() = user_id);

-- INSERT POLICY: Users can only insert custom categories (is_system = false) under their own auth.uid()
CREATE POLICY "Users can insert their own categories" 
  ON public.categories FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND (is_system = false OR is_system IS NULL));

-- UPDATE POLICY: Users can only update their own categories (and cannot set is_system to true)
CREATE POLICY "Users can update their own categories" 
  ON public.categories FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND (is_system = false OR is_system IS NULL));

-- DELETE POLICY: Users can only delete their own categories (cannot delete system categories)
CREATE POLICY "Users can delete their own categories" 
  ON public.categories FOR DELETE 
  USING (auth.uid() = user_id AND (is_system = false OR is_system IS NULL));
