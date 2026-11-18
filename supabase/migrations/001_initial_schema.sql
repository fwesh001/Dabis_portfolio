-- ==============================================================================
-- 001_initial_schema.sql
-- Senior Software Engineer Portfolio, Technical Blog & Headless Admin CMS
-- Target: Supabase Postgres 17 (Project: Flux - jiekqrbzdjsskevhrbts)
-- ==============================================================================

-- 0. Ensure Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. Tables Creation (Namespaced with portfolio_)
-- ==============================================================================

-- 1.1 Site Profile (Single-Row Config Table)
CREATE TABLE IF NOT EXISTS public.portfolio_site_profile (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  full_name TEXT NOT NULL DEFAULT 'Olehi Davis',
  headline TEXT NOT NULL DEFAULT 'Senior Software Engineer — Distributed Systems & Modern Web Architecture',
  subheadline TEXT DEFAULT 'Designing resilient backend services, developer tooling, and high-craft web applications.',
  about_md TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  resume_url TEXT,
  location TEXT DEFAULT 'Nigeria • Remote Worldwide',
  available_for_work BOOLEAN NOT NULL DEFAULT true,
  accent_color TEXT NOT NULL DEFAULT '#10B981',
  socials JSONB NOT NULL DEFAULT '{"github": "https://github.com/18d-shady", "linkedin": "https://linkedin.com/in/olehidavis", "x": "https://x.com/olehidavis", "email": "admin@olehidavis.dev"}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.2 Projects
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  description_md TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  live_url TEXT,
  repo_url TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.3 Work Experience
CREATE TABLE IF NOT EXISTS public.portfolio_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  company_url TEXT,
  location TEXT,
  period TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.4 Skill Groups
CREATE TABLE IF NOT EXISTS public.portfolio_skill_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0
);

-- 1.5 Technical Blog Posts
CREATE TABLE IF NOT EXISTS public.portfolio_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content_md TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  reading_time INT NOT NULL DEFAULT 3,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. Row Level Security (RLS) Setup
-- ==============================================================================

ALTER TABLE public.portfolio_site_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public read portfolio_site_profile" ON public.portfolio_site_profile;
DROP POLICY IF EXISTS "Public read portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public read portfolio_experiences" ON public.portfolio_experiences;
DROP POLICY IF EXISTS "Public read portfolio_skill_groups" ON public.portfolio_skill_groups;
DROP POLICY IF EXISTS "Public read published portfolio_posts" ON public.portfolio_posts;

DROP POLICY IF EXISTS "Admin full access portfolio_site_profile" ON public.portfolio_site_profile;
DROP POLICY IF EXISTS "Admin full access portfolio_projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admin full access portfolio_experiences" ON public.portfolio_experiences;
DROP POLICY IF EXISTS "Admin full access portfolio_skill_groups" ON public.portfolio_skill_groups;
DROP POLICY IF EXISTS "Admin full access portfolio_posts" ON public.portfolio_posts;

-- Public Read Policies
CREATE POLICY "Public read portfolio_site_profile"
  ON public.portfolio_site_profile FOR SELECT
  USING (true);

CREATE POLICY "Public read portfolio_projects"
  ON public.portfolio_projects FOR SELECT
  USING (true);

CREATE POLICY "Public read portfolio_experiences"
  ON public.portfolio_experiences FOR SELECT
  USING (true);

CREATE POLICY "Public read portfolio_skill_groups"
  ON public.portfolio_skill_groups FOR SELECT
  USING (true);

CREATE POLICY "Public read published portfolio_posts"
  ON public.portfolio_posts FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

-- Authenticated Admin Policies (ALL CRUD mutations)
CREATE POLICY "Admin full access portfolio_site_profile"
  ON public.portfolio_site_profile FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access portfolio_projects"
  ON public.portfolio_projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access portfolio_experiences"
  ON public.portfolio_experiences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access portfolio_skill_groups"
  ON public.portfolio_skill_groups FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access portfolio_posts"
  ON public.portfolio_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 3. Storage Bucket & Policies Setup
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- 50MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf'];

-- Storage Policies
DROP POLICY IF EXISTS "Public read portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete portfolio-assets" ON storage.objects;

CREATE POLICY "Public read portfolio-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated upload portfolio-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated update portfolio-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets')
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated delete portfolio-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');

-- ==============================================================================
-- 4. Automatic updated_at Trigger
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_portfolio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_portfolio_site_profile_updated_at ON public.portfolio_site_profile;
CREATE TRIGGER tr_portfolio_site_profile_updated_at
  BEFORE UPDATE ON public.portfolio_site_profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_portfolio_updated_at();

DROP TRIGGER IF EXISTS tr_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER tr_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_portfolio_updated_at();

DROP TRIGGER IF EXISTS tr_portfolio_posts_updated_at ON public.portfolio_posts;
CREATE TRIGGER tr_portfolio_posts_updated_at
  BEFORE UPDATE ON public.portfolio_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_portfolio_updated_at();

-- ==============================================================================
-- 5. Olehi Davis Initial Seed Data
-- ==============================================================================

-- 5.1 Site Profile
INSERT INTO public.portfolio_site_profile (
  id,
  full_name,
  headline,
  subheadline,
  about_md,
  avatar_url,
  resume_url,
  location,
  available_for_work,
  accent_color,
  socials
) VALUES (
  1,
  'Olehi Davis',
  'Senior Software Engineer — Distributed Systems & Modern Web Architecture',
  'Designing resilient backend services, developer tooling, and high-craft web applications for global scale.',
  'Senior Software Engineer with 7+ years of experience engineering high-concurrency distributed systems, resilient microservice architectures, and modern web applications. Proven track record in scaling messaging infrastructure, reducing cloud operational costs, and establishing robust developer tooling. Currently leading distributed systems engineering at Apex Distributed Labs.',
  NULL,
  '/resumes/Olehi_Davis_Senior_Engineer_CV.pdf',
  'Nigeria • Remote Worldwide',
  true,
  '#10B981',
  '{"github": "https://github.com/18d-shady", "linkedin": "https://linkedin.com/in/olehidavis", "x": "https://x.com/olehidavis", "email": "admin@olehidavis.dev"}'::JSONB
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  headline = EXCLUDED.headline,
  subheadline = EXCLUDED.subheadline,
  about_md = EXCLUDED.about_md,
  resume_url = EXCLUDED.resume_url,
  location = EXCLUDED.location,
  available_for_work = EXCLUDED.available_for_work,
  accent_color = EXCLUDED.accent_color,
  socials = EXCLUDED.socials;

-- 5.2 Projects (4 Projects)
INSERT INTO public.portfolio_projects (id, title, slug, summary, description_md, cover_image, live_url, repo_url, tech_stack, featured, display_order)
VALUES
(
  'b1a2c3d4-0001-4000-8000-000000000001',
  'HyperQueue — Distributed Task Engine',
  'hyperqueue',
  'High-throughput task queue engine with exactly-once delivery semantics, horizontal worker scaling, and dead-letter queue recovery.',
  '### 01 // Problem Statement
Existing message broker instances suffered from duplicate message deliveries during network partitions, causing payment processing race conditions under 30k req/sec peak spikes.

### 02 // System Architecture Flow
```text
[Client Request] -> [API Gateway (Vanguard)]
    | (Atomic Idempotency Key Check in Redis)
    v
[HyperQueue Raft Coordinator Cluster]
    | (Write-Ahead Append Log in PostgreSQL)
    v
[Worker Pool (Go Goroutines)] -> [ACK & State Mutation]
```

### 03 // Key Technical Trade-offs
- **Consistency vs Latency:** Opted for strict Raft consensus quorum over eventual consistency, trading ~4ms of write latency for zero ghost task executions.
- **Memory vs Durability:** In-memory Redis sliding windows cache task states while PostgreSQL WAL guarantees crash recovery without state loss.

### 04 // Quantifiable Results
- **4.8x** Throughput Gain (45,000 msg/sec)
- **0** Duplicate Task Executions
- **-65%** AWS Infrastructure Cost reduction',
  NULL,
  'https://api.olehidavis.dev/hyperqueue',
  'https://github.com/18d-shady/hyperqueue',
  ARRAY['Go', 'Raft', 'PostgreSQL', 'Redis'],
  true,
  1
),
(
  'b1a2c3d4-0002-4000-8000-000000000002',
  'Vanguard — Zero-Trust API Gateway',
  'vanguard',
  'Lightweight reverse-proxy gateway implementing dynamic JWT verification, distributed rate limiting with sliding windows, and distributed tracing.',
  '### 01 // Problem Statement
Legacy API routing incurred excessive latency (p99 > 85ms) and lacked centralized cryptographic identity enforcement across 30+ internal microservices.

### 02 // Architecture & Implementation
Engineered in Go utilizing eBPF network hooks and sliding-window rate limiters backed by Redis clusters. Full OpenTelemetry tracing context propagation across all HTTP and gRPC request headers.

### 03 // Results
- **p99 Latency:** 3.2ms
- **Zero-Trust Security:** 100% mTLS and JWT coverage
- **Throughput:** 60,000 req/sec per cluster node',
  NULL,
  NULL,
  'https://github.com/18d-shady/vanguard',
  ARRAY['Go', 'Docker', 'eBPF', 'OpenTelemetry'],
  true,
  2
),
(
  'b1a2c3d4-0003-4000-8000-000000000003',
  'Pulse — Time-Series Metrics Broker',
  'pulse',
  'Asynchronous metrics aggregator capable of buffering 250,000 telemetry datapoints per second with automated partition compaction.',
  '### 01 // Problem Statement
High-frequency IoT and telemetry ingestion caused write saturation and lock contention on conventional relational tables during traffic surges.

### 02 // Architecture & Implementation
Streamed data via Apache Kafka into a specialized Go consumer pipeline that batches writes into TimescaleDB hypertables, coupled with automated background partition compression.

### 03 // Results
- Ingestion sustained at 250,000 points/sec
- Database storage footprint reduced by 72% via TimescaleDB compression',
  NULL,
  NULL,
  'https://github.com/18d-shady/pulse',
  ARRAY['Kafka', 'Go', 'TimescaleDB'],
  true,
  3
),
(
  'b1a2c3d4-0004-4000-8000-000000000004',
  'Prism — Headless Publishing Engine',
  'prism',
  'Senior engineering blog & content engine featuring Next.js Server Components, on-demand revalidation, and Supabase RLS security.',
  '### 01 // Problem Statement
Content management systems typically suffer from either slow dynamic database queries or inflexible static site generation build queues.

### 02 // Architecture & Implementation
Engineered with Next.js 15 App Router using React Server Components for near-instant edge delivery, paired with on-demand ISR revalidation triggered via Supabase Server Actions upon mutation.

### 03 // Results
- 100/100 Lighthouse Performance, SEO, and Accessibility
- Sub-50ms TTFB globally via edge caching',
  NULL,
  'https://olehidavis.dev',
  'https://github.com/18d-shady/prism',
  ARRAY['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind'],
  true,
  4
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  description_md = EXCLUDED.description_md,
  tech_stack = EXCLUDED.tech_stack,
  featured = EXCLUDED.featured,
  display_order = EXCLUDED.display_order;

-- 5.3 Work Experience (3 Roles)
INSERT INTO public.portfolio_experiences (id, role, company, company_url, location, period, highlights, display_order)
VALUES
(
  'e1a2c3d4-0001-4000-8000-000000000001',
  'Lead Distributed Systems Engineer',
  'Apex Distributed Labs',
  'https://apexlabs.example.com',
  'Remote',
  '2022 — Present',
  ARRAY[
    'Architected event streaming data pipelines processing 45k ops/sec with guaranteed at-least-once delivery.',
    'Reduced cloud database expenditures by 48% via Redis caching tier and connection pool optimization in Go.',
    'Mentored a team of 6 engineers across concurrency best practices, distributed tracing, and CI/CD automation.'
  ],
  1
),
(
  'e1a2c3d4-0002-4000-8000-000000000002',
  'Senior Backend & Platform Engineer',
  'CloudMatrix Infrastructure',
  'https://cloudmatrix.example.com',
  'Contract',
  '2020 — 2022',
  ARRAY[
    'Implemented zero-trust authentication service securing 30+ internal microservices using mTLS and JWTs.',
    'Engineered automated database failover using PostgreSQL streaming replication, reducing recovery time by 90%.',
    'Containerized legacy monoliths into Kubernetes deployments with zero-downtime rolling updates.'
  ],
  2
),
(
  'e1a2c3d4-0003-4000-8000-000000000003',
  'Full-Stack Software Engineer',
  'Veloce Solutions',
  'https://veloce.example.com',
  'Hybrid',
  '2018 — 2020',
  ARRAY[
    'Built high-reliability payment processing gateways and real-time customer analytics dashboards.',
    'Developed reusable React/TypeScript component systems and backend REST APIs with 99.9% test coverage.'
  ],
  3
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  company_url = EXCLUDED.company_url,
  location = EXCLUDED.location,
  period = EXCLUDED.period,
  highlights = EXCLUDED.highlights,
  display_order = EXCLUDED.display_order;

-- 5.4 Skill Groups (4 Groups)
INSERT INTO public.portfolio_skill_groups (id, category, skills, display_order)
VALUES
('c1a2c3d4-0001-4000-8000-000000000001', 'Languages', ARRAY['Go', 'TypeScript', 'Python', 'SQL', 'Rust (Basic)'], 1),
('c1a2c3d4-0002-4000-8000-000000000002', 'Distributed Systems', ARRAY['PostgreSQL', 'Redis', 'Apache Kafka', 'gRPC', 'Raft'], 2),
('c1a2c3d4-0003-4000-8000-000000000003', 'Cloud & DevOps', ARRAY['Docker', 'Kubernetes', 'AWS (ECS, S3)', 'Terraform', 'GitHub Actions'], 3),
('c1a2c3d4-0004-4000-8000-000000000004', 'Web & Frontend', ARRAY['Next.js 15', 'React', 'Tailwind CSS', 'Supabase', 'Server Actions'], 4)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  skills = EXCLUDED.skills,
  display_order = EXCLUDED.display_order;

-- 5.5 Technical Blog Posts (3 Posts)
INSERT INTO public.portfolio_posts (id, title, slug, excerpt, content_md, cover_image, tags, reading_time, published, published_at)
VALUES
(
  'f1a2c3d4-0001-4000-8000-000000000001',
  'Building Distributed Idempotency Keys with Redis & PostgreSQL',
  'building-distributed-idempotency-keys',
  'Preventing double charges and duplicate mutations in asynchronous payment pipelines using atomic leases and transaction isolation.',
  E'In high-throughput transactional backends, duplicate requests are inevitable. Unreliable client mobile connections, automatic reverse-proxy retries, and network partition timeouts frequently cause the exact same mutation request to hit an API gateway multiple times in milliseconds.\n\n## 01 // The Duplicate Mutation Dilemma\nWithout strict idempotency guarantees, submitting an order or initiating a payment twice results in double billing. While standard database unique constraints work for simple records, complex workflows involving external third-party payment gateways (Stripe, Adyen) cannot be rolled back with a simple database rollback.\n\n> An idempotency key must be atomic: if two concurrent threads submit key `idemp_48f9a2`, exactly one must proceed to execute the business logic, while the concurrent duplicate waits or returns the cached response.\n\n## 02 // Two-Tier Lease Architecture\nTo achieve high performance without overloading the primary relational database, we pair an in-memory **Redis distributed lock lease** with a durable **PostgreSQL write-ahead idempotency ledger**.\n\n1. Client Request -> Header: `Idempotency-Key: uuid-4`\n2. Redis `SETNX idemp:{key}` with 30s TTL\n   - If Locked -> Poll for result or return 409 Conflict\n   - If Acquired -> Begin PostgreSQL Transaction\n3. Execute Business Logic -> Write Result to DB\n4. Release Redis Lock & Cache Final Response in Redis for 24h\n\n## 03 // Production Go Implementation\nBelow is the production-grade Go middleware demonstrating atomic key acquisition using Redis `SET NX EX`:\n\n```go\npackage idempotency\n\nimport (\n    "context"\n    "fmt"\n    "time"\n    "github.com/redis/go-redis/v9"\n)\n\ntype Middleware struct {\n    rdb *redis.Client\n}\n\nfunc (m *Middleware) AcquireLease(ctx context.Context, key string) (bool, error) {\n    redisKey := fmt.Sprintf("idemp:%s", key)\n    \n    // Atomic SET if Not Exists with 30-second crash-recovery expiration\n    acquired, err := m.rdb.SetNX(ctx, redisKey, "PROCESSING", 30*time.Second).Result()\n    if err != nil {\n        return false, fmt.Errorf("failed to query redis cluster: %w", err)\n    }\n    \n    return acquired, nil\n}\n```\n\n## 04 // Failure Modes & Recovery\nWhat happens if the backend worker node crashes mid-transaction after claiming the Redis lease?\n\n- **Lease Expiration:** The 30-second TTL on Redis ensures that dead worker locks automatically expire, allowing subsequent retries to succeed.\n- **PostgreSQL WAL Verification:** If the database committed before the worker crashed, the recovery worker detects the existing committed row in PostgreSQL and immediately updates Redis with the completed status.',
  NULL,
  ARRAY['Distributed Systems', 'PostgreSQL', 'Go', 'Redis'],
  8,
  true,
  '2024-11-10T00:00:00Z'
),
(
  'f1a2c3d4-0002-4000-8000-000000000002',
  'Zero-Downtime Database Migrations in High-Throughput Production Environments',
  'zero-downtime-database-migrations',
  'Tactics for migrating schemas with millions of active rows: expand-contract workflows, lock timeouts, concurrent index creation, and shadow writing.',
  E'Altering a database table with tens of millions of records in a live production system is among the most precarious operations in software engineering. A naive `ALTER TABLE ADD COLUMN` or `CREATE INDEX` statement can acquire an exclusive table lock (`ACCESS EXCLUSIVE`), halting all read and write queries, driving connection pools to exhaustion, and triggering an outage.\n\n## 01 // The Expand-Contract Pattern\nThe foundation of zero-downtime migrations is the **Expand-Contract (or Parallel Run)** pattern:\n\n1. **Expand:** Add the new column, table, or constraint without altering existing application read paths.\n2. **Dual-Write:** Deploy application code that reads from the old structure but writes to both old and new.\n3. **Backfill:** Execute an asynchronous, chunked background job to migrate historical records without table locks.\n4. **Contract:** Switch application reads to the new structure, deprecate old write paths, and safely drop the legacy column.\n\n## 02 // Setting Aggressive Lock Timeouts\nBefore running any DDL statement in PostgreSQL, always set an aggressive statement and lock timeout:\n\n```sql\nSET lock_timeout = \'2s\';\nSET statement_timeout = \'5s\';\nALTER TABLE portfolio_projects ADD COLUMN metadata jsonb DEFAULT \'{}\'::jsonb;\n```\n\nIf an exclusive lock cannot be acquired within 2 seconds due to running transactions, PostgreSQL aborts the migration rather than blocking client queries behind it.\n\n## 03 // Concurrent Index Creation\nNever run `CREATE INDEX` on a live table. Always use `CREATE INDEX CONCURRENTLY`:\n\n```sql\nCREATE INDEX CONCURRENTLY idx_projects_featured ON portfolio_projects (featured) WHERE featured = true;\n```\n\nConcurrent indexing builds the index in the background without taking an exclusive write lock.',
  NULL,
  ARRAY['PostgreSQL', 'Migrations', 'Performance'],
  6,
  true,
  '2024-10-22T00:00:00Z'
),
(
  'f1a2c3d4-0003-4000-8000-000000000003',
  'Optimizing Next.js 15 App Router: Server Components & Edge Revalidation',
  'optimizing-nextjs-15-app-router',
  'Deep architectural teardown of React Server Components, streaming SSR with Suspense, and on-demand cache invalidation via Server Actions.',
  E'Next.js 15 represents a fundamental shift in web rendering paradigms. By default, every component in the App Router is a React Server Component (RSC), executing purely on the server and producing zero client-side JavaScript bundle overhead.\n\n## 01 // Server Components vs Client Boundaries\nServer components allow direct server-side data fetching directly inside asynchronous components without boilerplate `useEffect` or client state management:\n\n```tsx\n// src/app/(public)/projects/[slug]/page.tsx\nexport default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  const project = await getProjectBySlug(slug);\n\n  return (\n    <article className="max-w-4xl mx-auto py-12">\n      <h1 className="text-4xl font-bold">{project.title}</h1>\n      <p className="text-zinc-400">{project.summary}</p>\n    </article>\n  );\n}\n```\n\n## 02 // On-Demand Cache Invalidation with Server Actions\nRather than relying on arbitrary time-based revalidation (e.g., `revalidate = 3600`), Next.js 15 paired with Supabase enables precise on-demand invalidation via `revalidatePath`:\n\n```ts\n// src/lib/actions/admin-actions.ts\n\'use server\';\n\nimport { revalidatePath } from \'next/cache\';\n\nexport async function updateProject(id: string, data: Partial<Project>) {\n  await supabase.from(\'portfolio_projects\').update(data).eq(\'id\', id);\n  revalidatePath(\'/\', \'layout\');\n}\n```\n\nWhenever the admin saves a change, the edge cache is purged instantly for all worldwide visitors.',
  NULL,
  ARRAY['Next.js 15', 'React', 'Performance'],
  5,
  true,
  '2024-09-18T00:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_md = EXCLUDED.content_md,
  tags = EXCLUDED.tags,
  reading_time = EXCLUDED.reading_time,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at;
