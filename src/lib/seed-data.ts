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
    title: 'Clintons Inventory App',
    slug: 'clintons-inventory-app',
    summary: 'An inventory application made for a drug store to keep stock of available drugs, record purchases, and track sales with an inbuilt POS and low-stock admin notifications.',
    description_md: `### 01 // Overview
An inventory application made for a drug store to keep stock of the available drugs, to make purchases, and to track sales.

### 02 // Key Capabilities
- **Inbuilt POS Application:** Enables employees to process customer sales directly while automatically refreshing inventory stock levels in real time.
- **Purchases & Stock Tracking:** Full tracking of purchased items, purchase costs, available stock counts, and recent sales history.
- **Low-Stock Admin Alerts:** Automatically notifies the administrator on low-stock items to prevent stockouts and streamline restocking.
- **Analytics Dashboard:** Real-time daily/monthly sales cards and 7-day sales trend visualization.`,
    cover_image: 'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/clintons-inventory-app.png',
    live_url: null,
    repo_url: null,
    tech_stack: ['Web Application', 'Python', 'POS', 'Inventory Management'],
    featured: true,
    status: 'Live',
    display_order: 1,
    created_at: '2024-10-18T00:00:00.000Z',
    updated_at: '2024-10-18T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0002-4000-8000-000000000002',
    title: 'BECE ERC Application',
    slug: 'bece-erc-application',
    summary: 'An Educational Resources Center desktop application designed for the BECE examination with the Access Solutions technology team to compute and manage student examination results.',
    description_md: `### 01 // Overview
An Educational Resources Center desktop application designed for the Basic Education Certificate Examination (BECE), built in collaboration with the Access Solutions technology team.

### 02 // Key Capabilities
- **Examination Result Computation:** Accurate computation and aggregation of student scores across registered BECE subjects.
- **Student & Subject Registration Analytics:** Tracks registered student counts, gender distribution breakdown, and per-subject enrollment tables.
- **Reporting & Institutional Management:** Dedicated Home, Student, Report, and Settings workflows tailored for FCT Education Resource Management, Abuja.`,
    cover_image: 'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/bece-erc-application.jpg',
    live_url: null,
    repo_url: null,
    tech_stack: ['Desktop Application', 'Java', 'Kotlin', 'Result Processing'],
    featured: true,
    status: 'Live',
    display_order: 2,
    created_at: '2024-11-01T00:00:00.000Z',
    updated_at: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0003-4000-8000-000000000003',
    title: "PAHelp's Chatbot",
    slug: 'pahelps-chatbot',
    summary: "An Android AI assistant trained with Python's Rasa model for offline communication and integrated with OpenAI's model for online communication, complete with special admin features.",
    description_md: `### 01 // Overview
A client Android chatbot application built to provide seamless enquiry handling and intelligent assistance both offline and online.

### 02 // Hybrid AI Architecture
- **Offline Communication (Rasa):** Trained with Python's Rasa NLU/dialogue framework to answer client enquiries reliably without an active internet connection.
- **Online AI Communication (OpenAI):** Integrates OpenAI's language models when connected to deliver broad, context-aware AI assistance.
- **Admin Features & Chat History:** Password-protected admin mode, organized date-grouped previous chat archive, and a clean conversational user experience.`,
    cover_image: 'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/pahelps-chatbot.jpg',
    live_url: null,
    repo_url: null,
    tech_stack: ['Android Application', 'Kotlin', 'Python', 'Rasa', 'OpenAI'],
    featured: true,
    status: 'Live',
    display_order: 3,
    created_at: '2025-03-01T00:00:00.000Z',
    updated_at: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'b1a2c3d4-0004-4000-8000-000000000004',
    title: 'Signature Pad',
    slug: 'signature-pad',
    summary: 'An electronic signature pad built with an ESP8266 NodeMCU microcontroller, 2.8-inch TFT touchscreen, and stylus supporting real-time PC preview and signature image export.',
    description_md: `### 01 // Overview
An electronic signature pad hardware device implemented with an ESP8266 NodeMCU microcontroller, a 2.8-inch TFT touchscreen display, and a stylus.

### 02 // Hardware & Software Capabilities
- **Live Touch Coordinate Capture:** Reads stylus touch coordinates directly from the 2.8-inch TFT resistive touchscreen and renders the stroke immediately on-device for the user.
- **Real-Time PC Screen Mirroring:** Streams touch coordinates to the connected PC so the signature can be viewed in real time as it is being drawn.
- **One-Click Signature Export:** Clicking send packages and transmits the captured handwritten signature as a clean image file directly to the connected PC.`,
    cover_image: 'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/signature-pad.jpg',
    live_url: null,
    repo_url: null,
    tech_stack: ['Electronic Device', 'ESP8266 NodeMCU', 'TFT Touchscreen', 'Embedded C++'],
    featured: true,
    status: 'Live',
    display_order: 4,
    created_at: '2025-01-15T00:00:00.000Z',
    updated_at: '2025-01-15T00:00:00.000Z',
  },
];

export const seedExperiences: Experience[] = [
  {
    id: 'e1a2c3d4-0001-4000-8000-000000000001',
    role: 'Embedded System Engineer',
    company: 'Access Solutions Limited',
    company_url: null,
    location: 'Nigeria',
    period: 'Aug 2023 — Present',
    highlights: [
      'Implementing and developing electronics systems using microcontrollers.',
      'Designing and implementing software for embedded devices and systems.',
      'Developing Java and Kotlin mobile and desktop applications.',
    ],
    display_order: 1,
    created_at: '2023-08-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0002-4000-8000-000000000002',
    role: 'Freelance Web Developer',
    company: 'Insight Computers Institute',
    company_url: null,
    location: 'Nigeria',
    period: 'Oct 2021 — Present',
    highlights: [
      'Engineered and launched innovative web pages, enhancing user engagement and client satisfaction.',
      'Engaged in freelance projects, utilizing Python and web technologies to develop customized solutions for clients.',
    ],
    display_order: 2,
    created_at: '2021-10-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0003-4000-8000-000000000003',
    role: 'Physical Education Teacher',
    company: 'Foundation International School',
    company_url: null,
    location: 'Nigeria',
    period: 'Sep 2022 — Jul 2023',
    highlights: [
      'Educated and managed different classes with 78 students, achieving notable improvements in their mathematical skills and physical well-being.',
      'Designed curriculum and assessment methods tailored to varied learning styles.',
    ],
    display_order: 3,
    created_at: '2022-09-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0004-4000-8000-000000000004',
    role: 'Junior Web Developer',
    company: 'Splufic Automation Limited',
    company_url: null,
    location: 'Nigeria',
    period: 'Jan 2020 — Sep 2021',
    highlights: [
      'Designed and implemented interactive web solutions, focusing on user experience and responsive design.',
      'Contributed to a team in developing 12 embedded system projects, enhancing device connectivity and functionality.',
      'Conducted workshops on web design and Python programming for over 50 aspiring developers.',
    ],
    display_order: 4,
    created_at: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0005-4000-8000-000000000005',
    role: 'Junior Assistant',
    company: 'Tracks Logics Limited',
    company_url: null,
    location: 'Nigeria',
    period: 'Jul 2017 — Feb 2021',
    highlights: [
      'Assisted in the installation and troubleshooting of CCTV systems for a variety of clients.',
      'Played a key role in the digital marketing efforts for a range of electrical products.',
    ],
    display_order: 5,
    created_at: '2017-07-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0006-4000-8000-000000000006',
    role: 'Electrical Engineering Intern',
    company: 'Federal Medical Center',
    company_url: null,
    location: 'Nigeria',
    period: 'Oct 2018 — Feb 2019',
    highlights: [
      'Supported the Electrical Maintenance and Works department in installing and maintaining critical healthcare infrastructure.',
      'Presented educational seminars on the safe usage and maintenance of electrical appliances to hospital staff.',
    ],
    display_order: 6,
    created_at: '2018-10-01T00:00:00.000Z',
  },
  {
    id: 'e1a2c3d4-0007-4000-8000-000000000007',
    role: 'Technical Specialist',
    company: 'Insight Computers Institute',
    company_url: null,
    location: 'Nigeria',
    period: 'Jun 2013 — Jun 2016',
    highlights: [
      'Engaged in data entry and proofreading of documents with Microsoft Word for customers.',
      'Coached 23 students on basic computer training and accurate typing.',
      "Rebranded the company's reputation by facilitating rapid delivery of accurately designed pages using Microsoft Word, PowerPoint, and CorelDraw.",
    ],
    display_order: 7,
    created_at: '2013-06-01T00:00:00.000Z',
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
    degree: 'H.N.D., Electrical & Electronics Engineering Technology',
    institution: 'Federal Polytechnic Nasarawa',
    institution_url: 'https://www.linkedin.com/company/94044061/',
    location: 'Nasarawa, Nigeria',
    period: 'Mar 2021 — Sep 2022',
    highlights: [
      'Higher National Diploma in Electrical and Electronics Engineering Technology.',
    ],
    display_order: 1,
    created_at: '2021-03-01T00:00:00.000Z',
  },
  {
    id: 'ed1a2c3d-0002-4000-8000-000000000002',
    degree: 'N.D., Electrical & Electronics Engineering Technology',
    institution: 'Federal Polytechnic Nasarawa',
    institution_url: 'https://www.linkedin.com/company/94044061/',
    location: 'Nasarawa, Nigeria',
    period: 'Dec 2017 — Dec 2019',
    highlights: [
      'National Diploma in Electrical and Electronics Engineering Technology.',
    ],
    display_order: 2,
    created_at: '2017-12-01T00:00:00.000Z',
  },
  {
    id: 'ed1a2c3d-0003-4000-8000-000000000003',
    degree: 'Secondary Education',
    institution: 'Flobam British International Academy',
    institution_url: null,
    location: 'Nigeria',
    period: 'Sep 2011 — Jul 2017',
    highlights: [],
    display_order: 3,
    created_at: '2011-09-01T00:00:00.000Z',
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

