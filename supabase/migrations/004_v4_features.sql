-- ==============================================================================
-- 004_v4_features.sql
-- 1. Live Resume Downloads counter & atomic RPC on portfolio_site_profile
-- 2. Blog post pinning support (pinned BOOLEAN) on portfolio_posts
-- ==============================================================================

-- 1. Resume Downloads tracking
ALTER TABLE public.portfolio_site_profile
  ADD COLUMN IF NOT EXISTS resume_downloads BIGINT NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_resume_downloads()
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.portfolio_site_profile
  SET resume_downloads = COALESCE(resume_downloads, 0) + 1
  WHERE id = 1
  RETURNING resume_downloads;
$$;

GRANT EXECUTE ON FUNCTION public.increment_resume_downloads() TO anon, authenticated;

-- 2. Blog Post Pinning
ALTER TABLE public.portfolio_posts
  ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT false;
