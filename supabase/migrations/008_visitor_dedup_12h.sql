-- ==============================================================================
-- 008_visitor_dedup_12h.sql
-- Server-side 12-hour unique visitor deduplication table + atomic RPC.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.portfolio_visitor_sessions (
  visitor_hash TEXT PRIMARY KEY,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_visitor_sessions_last_seen
  ON public.portfolio_visitor_sessions (last_seen_at);

-- Keep hashed visitor IDs private; access only through the SECURITY DEFINER RPC.
ALTER TABLE public.portfolio_visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Atomic server-side deduplicated visitor counter (12-hour default window)
CREATE OR REPLACE FUNCTION public.record_unique_visitor(
  p_visitor_hash TEXT,
  p_window_hours INT DEFAULT 12
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_window INTERVAL := make_interval(hours => GREATEST(COALESCE(p_window_hours, 12), 1));
  v_should_count BOOLEAN := false;
  v_count BIGINT;
BEGIN
  -- Prune expired visitor hashes older than the greater of 24h or the dedup window
  DELETE FROM public.portfolio_visitor_sessions
  WHERE last_seen_at < v_now - GREATEST(v_window, INTERVAL '24 hours');

  -- Atomically insert a new visitor hash or refresh an expired one (>= 12h old)
  IF p_visitor_hash IS NOT NULL AND length(trim(p_visitor_hash)) >= 16 THEN
    INSERT INTO public.portfolio_visitor_sessions (visitor_hash, last_seen_at)
    VALUES (p_visitor_hash, v_now)
    ON CONFLICT (visitor_hash) DO UPDATE
      SET last_seen_at = EXCLUDED.last_seen_at
      WHERE public.portfolio_visitor_sessions.last_seen_at <= v_now - v_window
    RETURNING true INTO v_should_count;
  END IF;

  IF COALESCE(v_should_count, false) THEN
    UPDATE public.portfolio_site_profile
    SET visitor_count = COALESCE(visitor_count, 0) + 1
    WHERE id = 1
    RETURNING visitor_count INTO v_count;
  ELSE
    SELECT visitor_count INTO v_count
    FROM public.portfolio_site_profile
    WHERE id = 1;
  END IF;

  RETURN COALESCE(v_count, 1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_unique_visitor(TEXT, INT) TO anon, authenticated;

-- Revoke unguarded legacy increment RPC from public anon callers
REVOKE EXECUTE ON FUNCTION public.increment_visitor_count() FROM anon;
