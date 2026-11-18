-- ==============================================================================
-- 002_services_and_typer.sql
-- Adds dynamic Typer Effect configuration to portfolio_site_profile
-- and creates public.portfolio_services table with RLS and initial seed rows.
-- ==============================================================================

-- 1. Extend portfolio_site_profile with Typer Effect fields
ALTER TABLE public.portfolio_site_profile
  ADD COLUMN IF NOT EXISTS typer_words TEXT[] NOT NULL DEFAULT ARRAY['Web Developer', 'Desktop & Mobile App Developer'],
  ADD COLUMN IF NOT EXISTS typer_speed INT NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS typer_pause INT NOT NULL DEFAULT 2000;

-- 2. Create public.portfolio_services table
CREATE TABLE IF NOT EXISTS public.portfolio_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'Globe',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_services ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_services'
      AND policyname = 'Public read services'
  ) THEN
    CREATE POLICY "Public read services"
      ON public.portfolio_services
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_services'
      AND policyname = 'Admin full access services'
  ) THEN
    CREATE POLICY "Admin full access services"
      ON public.portfolio_services
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 4. Seed initial 3 services only if table is currently empty
INSERT INTO public.portfolio_services (title, description, icon, display_order)
SELECT v.title, v.description, v.icon, v.display_order
FROM (
  VALUES
    (
      'Web Development',
      'Architecting resilient full-stack web applications with modern Next.js, TypeScript, and edge-ready databases.',
      'Globe',
      1
    ),
    (
      'Desktop & Mobile App Dev',
      'Building cross-platform desktop and mobile apps with native UI parity and offline-first sync.',
      'MonitorSmartphone',
      2
    ),
    (
      'Electronics Engineering',
      'Designing embedded microcontroller firmware, hardware-software bridges, and IoT telemetry pipelines.',
      'Cpu',
      3
    )
) AS v(title, description, icon, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_services LIMIT 1);
