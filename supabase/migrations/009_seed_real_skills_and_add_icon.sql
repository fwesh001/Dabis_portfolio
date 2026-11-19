-- ==============================================================================
-- 009_seed_real_skills_and_add_icon.sql
-- Add icon column to portfolio_skill_groups and seed authentic stack categories
-- ==============================================================================

ALTER TABLE public.portfolio_skill_groups
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Layers';

-- Remove legacy dummy/test skill groups
DELETE FROM public.portfolio_skill_groups;

-- Seed authentic technical stack categories for Olehi Davis
INSERT INTO public.portfolio_skill_groups (category, icon, skills, display_order)
VALUES
  (
    'Full-Stack Web',
    'Globe',
    ARRAY['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS'],
    1
  ),
  (
    'Mobile Development',
    'Smartphone',
    ARRAY['Flutter (Dart)', 'Kotlin (Jetpack Compose)', 'Android SDK'],
    2
  ),
  (
    'Backend & APIs',
    'Server',
    ARRAY['Django', 'Django REST Framework (DRF)', 'Python', 'PostgreSQL', 'RESTful APIs'],
    3
  ),
  (
    'IoT & Embedded',
    'Cpu',
    ARRAY['Arduino IDE', 'ESP8266 / ESP32', 'C/C++', 'MQTT', 'HTTP REST', 'WebSockets', 'Sensors & Actuators'],
    4
  ),
  (
    'DevOps & Tools',
    'Terminal',
    ARRAY['Git/GitHub', 'Docker', 'JWT Authentication', 'Clean Architecture'],
    5
  );
