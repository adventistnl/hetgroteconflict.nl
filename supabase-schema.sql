-- ═══════════════════════════════════════════════════════════
-- The Great Controversy — Reading Plans Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. User profiles (extends auth.users automatically via trigger)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Plan enrollments (started, saved, completed)
CREATE TABLE IF NOT EXISTS public.plan_enrollments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id      TEXT NOT NULL,
  started_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  is_saved     BOOLEAN DEFAULT FALSE NOT NULL,
  UNIQUE (user_id, plan_id)
);

-- 3. Day completions per plan
CREATE TABLE IF NOT EXISTS public.plan_day_completions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id      TEXT NOT NULL,
  day_number   INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, plan_id, day_number)
);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_day_completions ENABLE ROW LEVEL SECURITY;

-- Profiles: user sees/edits only their own row
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Enrollments: user manages only their own rows
CREATE POLICY "enrollments_select_own"  ON public.plan_enrollments FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "enrollments_insert_own"  ON public.plan_enrollments FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments_update_own"  ON public.plan_enrollments FOR UPDATE  USING (auth.uid() = user_id);
CREATE POLICY "enrollments_delete_own"  ON public.plan_enrollments FOR DELETE  USING (auth.uid() = user_id);

-- Day completions: user manages only their own rows
CREATE POLICY "days_select_own" ON public.plan_day_completions FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "days_insert_own" ON public.plan_day_completions FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "days_delete_own" ON public.plan_day_completions FOR DELETE  USING (auth.uid() = user_id);

-- ── Indexes for performance ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id  ON public.plan_enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_day_completions_user ON public.plan_day_completions (user_id, plan_id);
