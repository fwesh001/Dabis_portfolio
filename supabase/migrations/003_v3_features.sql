-- ==============================================================================
-- 003_v3_features.sql
-- 1. Project development status/stage column on portfolio_projects
-- 2. Dynamic resume_md + visitor_count on portfolio_site_profile
-- 3. Atomic increment_visitor_count() RPC for public visitor counter
-- 4. Real contact info seed update for Olehi Davis
-- 5. Education timeline table (public.portfolio_education) with RLS & seed
-- ==============================================================================

-- 1. Project development status / stage
ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Live';

UPDATE public.portfolio_projects SET status = 'Live' WHERE slug = 'hyperqueue' AND status = 'Live';
UPDATE public.portfolio_projects SET status = 'Beta' WHERE slug = 'vanguard';
UPDATE public.portfolio_projects SET status = 'In Development' WHERE slug = 'pulse';

-- 2. Dynamic Resume Markdown & Visitor Counter on Site Profile
ALTER TABLE public.portfolio_site_profile
  ADD COLUMN IF NOT EXISTS resume_md TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS visitor_count BIGINT NOT NULL DEFAULT 1;

-- Update contact details to Olehi Davis's live channels & location
UPDATE public.portfolio_site_profile
SET
  location = 'FCT, Abuja, Nigeria',
  socials = COALESCE(socials, '{}'::jsonb) || jsonb_build_object(
    'phone', '09099249445',
    'email', 'olehidavis@gmail.com',
    'github', 'https://github.com/18d-shady',
    'linkedin', 'https://www.linkedin.com/in/davis-olehi-8777951a0',
    'instagram', 'https://www.instagram.com/olehidavis?igsh=czM3azlhbmtka2R2'
  ),
  resume_md = CASE
    WHEN COALESCE(TRIM(resume_md), '') = '' THEN
$resume$# OLEHI DAVIS
Senior Software Engineer | Web, Desktop/Mobile & Electronics Engineering
FCT, Abuja, Nigeria • 09099249445 • olehidavis@gmail.com • github.com/18d-shady

---

## Executive Summary
Senior Software Engineer with 7+ years of hands-on experience designing and operating high-concurrency distributed backends, modern full-stack web applications, cross-platform desktop/mobile apps, and embedded electronics/IoT systems.

## Core Competencies
- **Web & Full-Stack:** Next.js, TypeScript, React, Tailwind CSS, Node.js, PostgreSQL, Supabase
- **Systems & Backend:** Go, Distributed Queues, Redis, Kafka, gRPC, Docker, Kubernetes
- **Desktop & Mobile:** React Native, Electron, Tauri, Offline-First SQLite Sync
- **Electronics & IoT:** ESP32, STM32, Embedded C/C++, MQTT, Hardware Telemetry Pipelines

## Professional Experience

### Lead Distributed Systems Engineer — Apex Distributed Labs (2022 — Present)
- Architected event streaming data pipelines processing 45k ops/sec with guaranteed at-least-once delivery.
- Reduced cloud database expenditures by 48% via Redis caching tier and connection pool optimization in Go.
- Mentored a team of 6 engineers across concurrency best practices, distributed tracing, and CI/CD automation.

### Senior Backend & Platform Engineer — CloudMatrix Infrastructure (2020 — 2022)
- Implemented zero-trust authentication service securing 30+ internal microservices using mTLS and JWTs.
- Engineered automated database failover using PostgreSQL streaming replication, reducing recovery time by 90%.
- Containerized legacy monoliths into Kubernetes deployments with zero-downtime rolling updates.

### Full-Stack Software Engineer — Veloce Solutions (2018 — 2020)
- Built high-reliability payment processing gateways and real-time customer analytics dashboards.
- Developed reusable React/TypeScript component systems and backend REST APIs with 99.9% test coverage.

## Education

### B.Eng. Electrical & Electronics Engineering — Federal University of Technology (2015 — 2020)
- Focused on embedded systems architecture, digital signal processing, and hardware-software control systems.
- Capstone project: Low-power ESP32 wireless industrial telemetry node with real-time cloud dashboard.
$resume$
    ELSE resume_md
  END
WHERE id = 1;

-- 3. Atomic Visitor Counter RPC (safe public increment without exposing table UPDATE)
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.portfolio_site_profile
  SET visitor_count = COALESCE(visitor_count, 0) + 1
  WHERE id = 1
  RETURNING visitor_count;
$$;

GRANT EXECUTE ON FUNCTION public.increment_visitor_count() TO anon, authenticated;

-- 4. Education Timeline Table
CREATE TABLE IF NOT EXISTS public.portfolio_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  institution_url TEXT,
  location TEXT,
  period TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_education ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_education'
      AND policyname = 'Public read education'
  ) THEN
    CREATE POLICY "Public read education"
      ON public.portfolio_education
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_education'
      AND policyname = 'Admin full access education'
  ) THEN
    CREATE POLICY "Admin full access education"
      ON public.portfolio_education
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

INSERT INTO public.portfolio_education (degree, institution, institution_url, location, period, highlights, display_order)
SELECT v.degree, v.institution, v.institution_url, v.location, v.period, v.highlights, v.display_order
FROM (
  VALUES
    (
      'B.Eng. Electrical & Electronics Engineering',
      'Federal University of Technology',
      NULL,
      'Nigeria',
      '2015 — 2020',
      ARRAY[
        'Specialized in embedded systems, microcontrollers, and hardware-software control architectures.',
        'Final-year thesis: Built an ESP32-based real-time wireless industrial telemetry and monitoring bridge.'
      ],
      1
    )
) AS v(degree, institution, institution_url, location, period, highlights, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_education LIMIT 1);
