import type { SiteProfile, Project, Experience, Education, SkillGroup, BlogPost, Service } from './types';

export const seedSiteProfile: SiteProfile = {
  id: 1,
  full_name: 'Olehi Davis',
  headline: "Hi I'm Davis",
  subheadline: 'Designing resilient backend services, developer tooling, and high-craft web applications for global scale.',
  about_md: 'Senior Software Engineer with 7+ years of experience engineering high-concurrency distributed systems, resilient microservice architectures, and modern web applications. Proven track record in scaling messaging infrastructure, reducing cloud operational costs, and establishing robust developer tooling. Currently leading distributed systems engineering at Apex Distributed Labs, focusing on event-driven streaming architectures, exactly-once processing guarantees, and low-latency storage engines. Experienced in Go, TypeScript, PostgreSQL, Redis, Kafka, and Next.js.',
  resume_md: `# OLEHI DAVIS
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

## Education

### B.Eng. Electrical & Electronics Engineering — Federal University of Technology (2015 — 2020)
- Focused on embedded systems architecture, microcontrollers, and hardware-software control systems.`,
  avatar_url: null,
  resume_url: '/resumes/Olehi_Davis_Senior_Engineer_CV.pdf',
  location: 'FCT, Abuja, Nigeria',
  available_for_work: true,
  accent_color: '#10B981',
  typer_words: ['Web Developer', 'Desktop & Mobile App Developer'],
  typer_speed: 75,
  typer_pause: 2000,
  visitor_count: 1,
  socials: {
    github: 'https://github.com/18d-shady',
    linkedin: 'https://www.linkedin.com/in/davis-olehi-8777951a0',
    x: 'https://x.com/olehidavis',
    email: 'olehidavis@gmail.com',
    phone: '09099249445',
    facebook: 'https://facebook.com/olehidavis',
    instagram: 'https://www.instagram.com/olehidavis?igsh=czM3azlhbmtka2R2',
  },
  updated_at: '2024-11-14T00:00:00.000Z',
};

export const seedProjects: Project[] = [
  {
    id: 'b1a2c3d4-0001-4000-8000-000000000001',
    title: 'HyperQueue — Distributed Task Engine',
    slug: 'hyperqueue',
    summary: 'High-throughput task queue engine with exactly-once delivery semantics, horizontal worker scaling, and dead-letter queue recovery.',
    description_md: `### 01 // Problem Statement
Existing message broker instances suffered from duplicate message deliveries during network partitions, causing payment processing race conditions under 30k req/sec peak spikes.

### 02 // System Architecture Flow
\`\`\`text
[Client Request] -> [API Gateway (Vanguard)]
    | (Atomic Idempotency Key Check in Redis)
    v
[HyperQueue Raft Coordinator Cluster]
    | (Write-Ahead Append Log in PostgreSQL)
    v
[Worker Pool (Go Goroutines)] -> [ACK & State Mutation]
\`\`\`

### 03 // Key Technical Trade-offs
- **Consistency vs Latency:** Opted for strict Raft consensus quorum over eventual consistency, trading ~4ms of write latency for zero ghost task executions.
- **Memory vs Durability:** In-memory Redis sliding windows cache task states while PostgreSQL WAL guarantees crash recovery without state loss.

### 04 // Quantifiable Results
- **4.8x** Throughput Gain (45,000 msg/sec)
- **0** Duplicate Task Executions
- **-65%** AWS Infrastructure Cost reduction`,
    cover_image: null,
    live_url: 'https://api.olehidavis.dev/hyperqueue',
    repo_url: 'https://github.com/18d-shady/hyperqueue',
    tech_stack: ['Go', 'Raft', 'PostgreSQL', 'Redis'],
    featured: true,
    display_order: 1,
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0002-4000-8000-000000000002',
    title: 'Vanguard — Zero-Trust API Gateway',
    slug: 'vanguard',
    summary: 'Lightweight reverse-proxy gateway implementing dynamic JWT verification, distributed rate limiting with sliding windows, and distributed tracing.',
    description_md: `### 01 // Problem Statement
Legacy API routing incurred excessive latency (p99 > 85ms) and lacked centralized cryptographic identity enforcement across 30+ internal microservices.

### 02 // Architecture & Implementation
Engineered in Go utilizing eBPF network hooks and sliding-window rate limiters backed by Redis clusters. Full OpenTelemetry tracing context propagation across all HTTP and gRPC request headers.

### 03 // Results
- **p99 Latency:** 3.2ms
- **Zero-Trust Security:** 100% mTLS and JWT coverage
- **Throughput:** 60,000 req/sec per cluster node`,
    cover_image: null,
    live_url: null,
    repo_url: 'https://github.com/18d-shady/vanguard',
    tech_stack: ['Go', 'Docker', 'eBPF', 'OpenTelemetry'],
    featured: true,
    display_order: 2,
    created_at: '2024-02-10T00:00:00.000Z',
    updated_at: '2024-02-10T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0003-4000-8000-000000000003',
    title: 'Pulse — Time-Series Metrics Broker',
    slug: 'pulse',
    summary: 'Asynchronous metrics aggregator capable of buffering 250,000 telemetry datapoints per second with automated partition compaction.',
    description_md: `### 01 // Problem Statement
High-frequency IoT and telemetry ingestion caused write saturation and lock contention on conventional relational tables during traffic surges.

### 02 // Architecture & Implementation
Streamed data via Apache Kafka into a specialized Go consumer pipeline that batches writes into TimescaleDB hypertables, coupled with automated background partition compression.

### 03 // Results
- Ingestion sustained at 250,000 points/sec
- Database storage footprint reduced by 72% via TimescaleDB compression`,
    cover_image: null,
    live_url: null,
    repo_url: 'https://github.com/18d-shady/pulse',
    tech_stack: ['Kafka', 'Go', 'TimescaleDB'],
    featured: true,
    display_order: 3,
    created_at: '2024-03-05T00:00:00.000Z',
    updated_at: '2024-03-05T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0004-4000-8000-000000000004',
    title: 'Prism — Headless Publishing Engine',
    slug: 'prism',
    summary: 'Senior engineering blog & content engine featuring Next.js Server Components, on-demand revalidation, and Supabase RLS security.',
    description_md: `### 01 // Problem Statement
Content management systems typically suffer from either slow dynamic database queries or inflexible static site generation build queues.

### 02 // Architecture & Implementation
Engineered with Next.js 15 App Router using React Server Components for near-instant edge delivery, paired with on-demand ISR revalidation triggered via Supabase Server Actions upon mutation.

### 03 // Results
- 100/100 Lighthouse Performance, SEO, and Accessibility
- Sub-50ms TTFB globally via edge caching`,
    cover_image: null,
    live_url: 'https://olehidavis.dev',
    repo_url: 'https://github.com/18d-shady/prism',
    tech_stack: ['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind'],
    featured: true,
    display_order: 4,
    created_at: '2024-04-01T00:00:00.000Z',
    updated_at: '2024-04-01T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0005-4000-8000-000000000005',
    title: 'Aura — IoT Telemetry Bridge',
    slug: 'aura-iot',
    summary: 'Hardware-to-cloud bidirectional streaming gateway bridging ESP32 microcontrollers with MQTT and gRPC time-series pipelines.',
    description_md: `### 01 // Problem Statement
Industrial environmental sensors suffered packet drops and clock drift during intermittent cellular connectivity.

### 02 // Architecture & Implementation
Firmware engineered in Embedded C/C++ on ESP32 running FreeRTOS with local ring-buffer SPI flash caching, syncing via gRPC over TLS upon connection restoration.

### 03 // Results
- 99.99% telemetry packet retention across network blackouts
- Sub-50mW sleep cycle power consumption`,
    cover_image: null,
    live_url: null,
    repo_url: 'https://github.com/18d-shady/aura-iot',
    tech_stack: ['ESP32', 'Embedded C++', 'MQTT', 'gRPC', 'FreeRTOS'],
    featured: false,
    display_order: 5,
    created_at: '2024-05-10T00:00:00.000Z',
    updated_at: '2024-05-10T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0006-4000-8000-000000000006',
    title: 'Chronos — Distributed Cron Engine',
    slug: 'chronos',
    summary: 'Fault-tolerant distributed job scheduler with leader election, lease-based locking, and millisecond dispatch accuracy.',
    description_md: `### 01 // Problem Statement
Centralized cron servers constituted single points of failure with no automatic failover or granular job concurrency throttling.

### 02 // Architecture & Implementation
Built in Go using etcd distributed locks and hierarchical time-wheel data structures, executing up to 100,000 scheduled tasks per minute.

### 03 // Results
- High-availability active-passive auto-failover in < 2 seconds
- Zero job loss across cluster reboots`,
    cover_image: null,
    live_url: null,
    repo_url: 'https://github.com/18d-shady/chronos',
    tech_stack: ['Go', 'etcd', 'Docker', 'Prometheus'],
    featured: false,
    display_order: 6,
    created_at: '2024-06-01T00:00:00.000Z',
    updated_at: '2024-06-01T00:00:00.000Z',
  },
];

export const seedExperiences: Experience[] = [
  {
    id: 'e1a2c3d4-0001-4000-8000-000000000001',
    role: 'Lead Distributed Systems Engineer',
    company: 'Apex Distributed Labs',
    company_url: 'https://apexlabs.example.com',
    location: 'Remote',
    period: '2022 — Present',
    highlights: [
      'Architected event streaming data pipelines processing 45k ops/sec with guaranteed at-least-once delivery.',
      'Reduced cloud database expenditures by 48% via Redis caching tier and connection pool optimization in Go.',
      'Mentored a team of 6 engineers across concurrency best practices, distributed tracing, and CI/CD automation.',
    ],
    display_order: 1,
    created_at: '2022-01-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0002-4000-8000-000000000002',
    role: 'Senior Backend & Platform Engineer',
    company: 'CloudMatrix Infrastructure',
    company_url: 'https://cloudmatrix.example.com',
    location: 'Contract',
    period: '2020 — 2022',
    highlights: [
      'Implemented zero-trust authentication service securing 30+ internal microservices using mTLS and JWTs.',
      'Engineered automated database failover using PostgreSQL streaming replication, reducing recovery time by 90%.',
      'Containerized legacy monoliths into Kubernetes deployments with zero-downtime rolling updates.',
    ],
    display_order: 2,
    created_at: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0003-4000-8000-000000000003',
    role: 'Full-Stack Software Engineer',
    company: 'Veloce Solutions',
    company_url: 'https://veloce.example.com',
    location: 'Hybrid',
    period: '2018 — 2020',
    highlights: [
      'Built high-reliability payment processing gateways and real-time customer analytics dashboards.',
      'Developed reusable React/TypeScript component systems and backend REST APIs with 99.9% test coverage.',
    ],
    display_order: 3,
    created_at: '2018-01-01T00:00:00.000Z',
  },
];

export const seedSkillGroups: SkillGroup[] = [
  {
    id: 'c1a2c3d4-0001-4000-8000-000000000001',
    category: 'Languages',
    skills: ['Go', 'TypeScript', 'Python', 'SQL', 'Rust (Basic)'],
    display_order: 1,
  },
  {
    id: 'c1a2c3d4-0002-4000-8000-000000000002',
    category: 'Distributed Systems',
    skills: ['PostgreSQL', 'Redis', 'Apache Kafka', 'gRPC', 'Raft'],
    display_order: 2,
  },
  {
    id: 'c1a2c3d4-0003-4000-8000-000000000003',
    category: 'Cloud & DevOps',
    skills: ['Docker', 'Kubernetes', 'AWS (ECS, S3)', 'Terraform', 'GitHub Actions'],
    display_order: 3,
  },
  {
    id: 'c1a2c3d4-0004-4000-8000-000000000004',
    category: 'Web & Frontend',
    skills: ['Next.js 15', 'React', 'Tailwind CSS', 'Supabase', 'Server Actions'],
    display_order: 4,
  },
];

export const seedPosts: BlogPost[] = [
  {
    id: 'f1a2c3d4-0001-4000-8000-000000000001',
    title: 'Building Distributed Idempotency Keys with Redis & PostgreSQL',
    slug: 'building-distributed-idempotency-keys',
    excerpt: 'Preventing double charges and duplicate mutations in asynchronous payment pipelines using atomic leases and transaction isolation.',
    tags: ['Distributed Systems', 'PostgreSQL', 'Go', 'Redis'],
    reading_time: 8,
    published: true,
    published_at: '2024-11-10T00:00:00Z',
    cover_image: null,
    created_at: '2024-11-10T00:00:00.000Z',
    updated_at: '2024-11-10T00:00:00.000Z',
    content_md: `In high-throughput transactional backends, duplicate requests are inevitable. Unreliable client mobile connections, automatic reverse-proxy retries, and network partition timeouts frequently cause the exact same mutation request to hit an API gateway multiple times in milliseconds.

## 01 // The Duplicate Mutation Dilemma
Without strict idempotency guarantees, submitting an order or initiating a payment twice results in double billing. While standard database unique constraints work for simple records, complex workflows involving external third-party payment gateways (Stripe, Adyen) cannot be rolled back with a simple database rollback.

> An idempotency key must be atomic: if two concurrent threads submit key \`idemp_48f9a2\`, exactly one must proceed to execute the business logic, while the concurrent duplicate waits or returns the cached response.

## 02 // Two-Tier Lease Architecture
To achieve high performance without overloading the primary relational database, we pair an in-memory **Redis distributed lock lease** with a durable **PostgreSQL write-ahead idempotency ledger**.

1. Client Request -> Header: \`Idempotency-Key: uuid-4\`
2. Redis \`SETNX idemp:{key}\` with 30s TTL
   - If Locked -> Poll for result or return 409 Conflict
   - If Acquired -> Begin PostgreSQL Transaction
3. Execute Business Logic -> Write Result to DB
4. Release Redis Lock & Cache Final Response in Redis for 24h

## 03 // Production Go Implementation
Below is the production-grade Go middleware demonstrating atomic key acquisition using Redis \`SET NX EX\`:

\`\`\`go
package idempotency

import (
    "context"
    "fmt"
    "time"
    "github.com/redis/go-redis/v9"
)

type Middleware struct {
    rdb *redis.Client
}

func (m *Middleware) AcquireLease(ctx context.Context, key string) (bool, error) {
    redisKey := fmt.Sprintf("idemp:%s", key)
    
    // Atomic SET if Not Exists with 30-second crash-recovery expiration
    acquired, err := m.rdb.SetNX(ctx, redisKey, "PROCESSING", 30*time.Second).Result()
    if err != nil {
        return false, fmt.Errorf("failed to query redis cluster: %w", err)
    }
    
    return acquired, nil
}
\`\`\`

## 04 // Failure Modes & Recovery
What happens if the backend worker node crashes mid-transaction after claiming the Redis lease?

- **Lease Expiration:** The 30-second TTL on Redis ensures that dead worker locks automatically expire, allowing subsequent retries to succeed.
- **PostgreSQL WAL Verification:** If the database committed before the worker crashed, the recovery worker detects the existing committed row in PostgreSQL and immediately updates Redis with the completed status.`,
  },
  {
    id: 'f1a2c3d4-0002-4000-8000-000000000002',
    title: 'Zero-Downtime Database Migrations in High-Throughput Production Environments',
    slug: 'zero-downtime-database-migrations',
    excerpt: 'Tactics for migrating schemas with millions of active rows: expand-contract workflows, lock timeouts, concurrent index creation, and shadow writing.',
    tags: ['PostgreSQL', 'Migrations', 'Performance'],
    reading_time: 6,
    published: true,
    published_at: '2024-10-22T00:00:00Z',
    cover_image: null,
    created_at: '2024-10-22T00:00:00.000Z',
    updated_at: '2024-10-22T00:00:00.000Z',
    content_md: `Altering a database table with tens of millions of records in a live production system is among the most precarious operations in software engineering. A naive \`ALTER TABLE ADD COLUMN\` or \`CREATE INDEX\` statement can acquire an exclusive table lock (\`ACCESS EXCLUSIVE\`), halting all read and write queries, driving connection pools to exhaustion, and triggering an outage.

## 01 // The Expand-Contract Pattern
The foundation of zero-downtime migrations is the **Expand-Contract (or Parallel Run)** pattern:

1. **Expand:** Add the new column, table, or constraint without altering existing application read paths.
2. **Dual-Write:** Deploy application code that reads from the old structure but writes to both old and new.
3. **Backfill:** Execute an asynchronous, chunked background job to migrate historical records without table locks.
4. **Contract:** Switch application reads to the new structure, deprecate old write paths, and safely drop the legacy column.

## 02 // Setting Aggressive Lock Timeouts
Before running any DDL statement in PostgreSQL, always set an aggressive statement and lock timeout:

\`\`\`sql
SET lock_timeout = '2s';
SET statement_timeout = '5s';
ALTER TABLE portfolio_projects ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
\`\`\`

If an exclusive lock cannot be acquired within 2 seconds due to running transactions, PostgreSQL aborts the migration rather than blocking client queries behind it.

## 03 // Concurrent Index Creation
Never run \`CREATE INDEX\` on a live table. Always use \`CREATE INDEX CONCURRENTLY\`:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_projects_featured ON portfolio_projects (featured) WHERE featured = true;
\`\`\`

Concurrent indexing builds the index in the background without taking an exclusive write lock.`,
  },
  {
    id: 'f1a2c3d4-0003-4000-8000-000000000003',
    title: 'Optimizing Next.js 15 App Router: Server Components & Edge Revalidation',
    slug: 'optimizing-nextjs-15-app-router',
    excerpt: 'Deep architectural teardown of React Server Components, streaming SSR with Suspense, and on-demand cache invalidation via Server Actions.',
    tags: ['Next.js 15', 'React', 'Performance'],
    reading_time: 5,
    published: true,
    published_at: '2024-09-18T00:00:00Z',
    cover_image: null,
    created_at: '2024-09-18T00:00:00.000Z',
    updated_at: '2024-09-18T00:00:00.000Z',
    content_md: `Next.js 15 represents a fundamental shift in web rendering paradigms. By default, every component in the App Router is a React Server Component (RSC), executing purely on the server and producing zero client-side JavaScript bundle overhead.

## 01 // Server Components vs Client Boundaries
Server components allow direct server-side data fetching directly inside asynchronous components without boilerplate \`useEffect\` or client state management:

\`\`\`tsx
// src/app/(public)/projects/[slug]/page.tsx
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return (
    <article className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold">{project.title}</h1>
      <p className="text-zinc-400">{project.summary}</p>
    </article>
  );
}
\`\`\`

## 02 // On-Demand Cache Invalidation with Server Actions
Rather than relying on arbitrary time-based revalidation (e.g., \`revalidate = 3600\`), Next.js 15 paired with Supabase enables precise on-demand invalidation via \`revalidatePath\`:

\`\`\`ts
// src/lib/actions/admin-actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function updateProject(id: string, data: Partial<Project>) {
  await supabase.from('portfolio_projects').update(data).eq('id', id);
  revalidatePath('/', 'layout');
}
\`\`\`

Whenever the admin saves a change, the edge cache is purged instantly for all worldwide visitors.`,
  },
];

export const seedServices: Service[] = [
  {
    id: 's1a2c3d4-0001-4000-8000-000000000001',
    title: 'Web Development',
    description: 'Architecting resilient full-stack web applications with modern Next.js, TypeScript, and edge-ready databases.',
    icon: 'Globe',
    display_order: 1,
  },
  {
    id: 's1a2c3d4-0002-4000-8000-000000000002',
    title: 'Desktop & Mobile App Dev',
    description: 'Building cross-platform desktop and mobile apps with native UI parity and offline-first sync.',
    icon: 'MonitorSmartphone',
    display_order: 2,
  },
  {
    id: 's1a2c3d4-0003-4000-8000-000000000003',
    title: 'Electronics Engineering',
    description: 'Designing embedded microcontroller firmware, hardware-software bridges, and IoT telemetry pipelines.',
    icon: 'Cpu',
    display_order: 3,
  },
];

export const seedEducation: Education[] = [
  {
    id: 'ed1a2c3d-0001-4000-8000-000000000001',
    degree: 'B.Eng. Electrical & Electronics Engineering',
    institution: 'Federal University of Technology',
    institution_url: null,
    location: 'Nigeria',
    period: '2015 — 2020',
    highlights: [
      'Specialized in embedded systems, microcontrollers, and hardware-software control architectures.',
      'Final-year thesis: Built an ESP32-based real-time wireless industrial telemetry and monitoring bridge.',
    ],
    display_order: 1,
    created_at: '2020-01-01T00:00:00.000Z',
  },
];

export const seedData = {
  site_profile: seedSiteProfile,
  services: seedServices,
  projects: seedProjects,
  experiences: seedExperiences,
  education: seedEducation,
  skill_groups: seedSkillGroups,
  posts: seedPosts,
};

