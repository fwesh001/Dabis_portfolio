# Product Requirements Document (PRD): Senior Engineer Portfolio, Blog & Admin CMS

**Project Name:** Gold-Standard Developer Portfolio & Custom CMS

**Target Client:** Senior Software Engineer (Olehi Davis)

**Architecture:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), Vercel

**Design Paradigm:** Precision Technical Minimalism (Linear / Vercel / Raycast aesthetic) + Modular Bento Grid

---

## 1. Agent Execution Directives (For Google Antigravity)

You are tasked with architecting and building a production-grade, full-stack developer portfolio, technical blog, and headless admin CMS.

* **Zero Placeholder Fluff:** Seed all initial database migrations and fallback states with realistic Senior Software Engineer data (distributed systems, scalable APIs, developer tooling, cloud architecture)—never use *Lorem Ipsum*.
* **Instant Cache Invalidation:** All public pages must use Next.js Server Components for near-instant static speed, paired with `revalidatePath()` inside Admin Server Actions so content edits reflect live immediately without redeploying.
* **Graceful Fallback Mode:** If Supabase environment variables are not yet populated in `.env.local`, the app must gracefully render using a typed local seed fallback (`src/lib/seed-data.ts`) so UI development and live browser previews never crash.

---

## 2. Design System & Bespoke UI Specifications

### 2.1 Dual Theme System & Dynamic Accent Token

* **Engine:** `next-themes` with class-based dark/light switching and zero flash of unstyled content (FOUC).
* **Color Architecture:** 95% monochrome high-contrast Zinc scale; 5% dynamic CSS variable (`--accent`) so the primary brand color can be swapped globally in one line.
* **Dark Mode Surfaces:** Background `#09090B` (`zinc-950`), Elevated Card `#121215`, Hover Surface `#18181B` (`zinc-900`), Border `#27272A` (`zinc-800`), Primary Text `#FAFAFA`, Muted Text `#A1A1AA`.
* **Light Mode Surfaces:** Background `#FAFAFA` (`zinc-50`), Elevated Card `#FFFFFF`, Hover Surface `#F4F4F5` (`zinc-100`), Border `#E4E4E7` (`zinc-200`), Primary Text `#09090B`, Muted Text `#52525B`.
* **Default Accent Variable:** `--accent: #10B981` (Emerald-500, swappable to Electric Blue `#3B82F6` or Amber `#F59E0B`).


* **Typography:** `Geist Sans` for headings and body; `Geist Mono` for metadata, dates, tags, code snippets, command shortcuts, and section indices (`01 // PROJECTS`).
* **Selective Glassmorphism:** Apply `backdrop-blur-md bg-background/75 border-border/60` strictly to the sticky top navigation bar, the `⌘K` Command Palette modal, and the custom right-click context menu.

### 2.2 Custom Micro-Interactions & Global Shell

1. **Custom Interactive Cursor (`<CustomCursor/>`):**
* Lightweight spring-physics outer ring (`28px`) + inner precision dot (`6px`) driven by `requestAnimationFrame` or Framer Motion springs.
* Morphs/scales subtly when hovering links, buttons, or project cards (`data-cursor="pointer"`).
* **Strict Guardrails:** Automatically disabled on touch devices (`@media (pointer: coarse)`) and when `prefers-reduced-motion: reduce` is active. Never hide the native OS I-beam cursor inside `<input>`, `<textarea>`, or `<code>` blocks.


2. **Custom Theme-Synced Scrollbars:**
* Styled via `::-webkit-scrollbar` and standard `scrollbar-color` properties bound to `--scrollbar-track` and `--scrollbar-thumb` CSS tokens that adapt automatically between Light and Dark modes.


3. **Custom Right-Click Context Menu (`<CustomContextMenu/>`):**
* Intercepts `onContextMenu` across public pages to render a sleek keyboard-accessible floating menu:
* *Copy Email Address* (triggers toast confirmation)
* *Copy Current Page URL*
* *Toggle Light / Dark Theme*
* *Open Command Palette (`⌘K`)*
* *Jump to Projects / Blog / Experience*
* *View Source / GitHub Profile*


* **Developer Escape Hatch:** Holding `Shift + Right-Click` bypasses the custom menu and opens the native browser context menu for DevTools inspection.


4. **Global Command Palette (`<CommandPalette/>`):**
* Triggered via `⌘K` / `Ctrl+K` or navbar button.
* Supports instant fuzzy search across Projects and Blog Posts, quick section navigation, theme switching, resume download, and one-click email copying.



---

## 3. Core Application Surfaces (Pages & Features)

### Surface 1: Main Public Portfolio (`/`, `/projects/[slug]`)

* **Sticky Minimal Navbar:** Brand monogram/logo, section links, Blog link, Theme Toggle, and `⌘K` trigger badge.
* **Hero Section:**
* Live dynamic status pill (`"Available for senior roles & consulting"` with pulsing `--accent` dot, toggled from Admin).
* High-impact engineering headline, concise bio, location badge, social links, primary CTA, and **Interactive Resume Modal** (in-browser PDF preview + direct download).


* **Modular Bento Grid Section:**
* Asymmetric responsive CSS Grid showcasing: (1) Core Architecture & Tech Stack radar/pills, (2) Featured Flagship Project spotlight, (3) Latest Technical Blog Post card, (4) GitHub/Engineering highlights & quick-copy contact card.


* **Featured Projects & Deep Case-Study Drawer/Route (`/projects/[slug]`):**
* Filterable by tech tag.
* Each project supports both quick links (Live URL, GitHub Repo) and a detailed **Engineering Case Study view** rendered from Markdown (covering *Problem Statement*, *System Architecture*, *Key Trade-offs*, and *Results*).


* **Experience Timeline:**
* Clean vertical timeline displaying Role, Company (with link), Period (`YYYY — Present`), and bulleted technical impact highlights.


* **Zero-Friction Contact Footer:**
* One-click **Copy Email** button with animated checkmark + toast notification, social matrix, and live local time display.



### Surface 2: Technical Blog (`/blog`, `/blog/[slug]`)

* **Blog Index (`/blog`):**
* Real-time client search input + clickable tag filter pills.
* Clean editorial list/cards showing publish date (`Geist Mono`), estimated read time, title, excerpt, and tags.


* **Article Reader (`/blog/[slug]`):**
* **Top Reading Progress Bar:** Thin `--accent` bar pinned to the top viewport tracking scroll percentage.
* **Auto-Generated Table of Contents (TOC):** Sticky desktop sidebar highlighting the currently active `H2`/`H3` heading on scroll.
* **Gold-Standard Markdown & Code Rendering:** Powered by `react-markdown`, `remark-gfm`, and `rehype-pretty-code` (Shiki) supporting dual-theme syntax highlighting, line numbers, filename headers, and a **One-Click Copy Code** button on every code block.



### Surface 3: Protected Admin CMS (`/admin/*`)

* **Authentication (`/admin/login`):**
* Supabase Email/Password (or Magic Link) login screen.
* Next.js Middleware (`src/middleware.ts`) intercepts all `/admin/*` routes and redirects unauthenticated sessions to `/admin/login`.


* **Admin Dashboard Layout (`/admin/(protected)/layout.tsx`):**
* Sidebar navigation: *Overview & Profile*, *Projects*, *Experience*, *Skills*, *Blog Posts*, and *View Live Site*.


* **Modules & CRUD Capabilities:**
1. **Profile & Site Settings (`/admin`):** Edit full name, headline, subheadline, Markdown bio, location, availability toggle, social URLs, accent color preference, avatar upload, and resume PDF upload.
2. **Projects Manager (`/admin/projects`):** Create/Edit/Delete projects, toggle `featured` status, adjust `display_order` (Up/Down or drag-and-drop), manage tech stack tag arrays, upload project cover images, and write Markdown case studies.
3. **Experience & Skills Manager (`/admin/experience`, `/admin/skills`):** Full CRUD and ordering for career history entries and categorized skill groups (e.g., *Languages*, *Backend & Distributed Systems*, *Cloud & DevOps*, *Frontend*).
4. **Split-Pane Blog Studio (`/admin/blog`):**
* Left pane: Metadata inputs (Title, auto-generated editable Slug, Excerpt, Tags, Cover Image uploader, `Published` toggle) + Markdown editor.
* Right pane: Live rendered preview matching the exact public blog typography and syntax highlighting.




* **Storage Asset Hygiene:**
* Uploading a replacement image or resume PDF to the `portfolio-assets` Supabase bucket automatically deletes the previous file path so orphaned files never accumulate.



---

## 4. Database Schema & Security (Supabase SQL)

Create `supabase/migrations/001_initial_schema.sql` with the following schema and Row Level Security (RLS) policies:

```sql
-- Enable UUID generation
create extension if not exists "pgcrypto";

-- 1. Site Profile (Single-Row Configuration Table)
create table public.site_profile (
  id int primary key default 1 check (id = 1),
  full_name text not null default 'Olehi Davis',
  headline text not null default 'Senior Software Engineer — Distributed Systems & Modern Web Architecture',
  subheadline text default 'Designing resilient backend services, developer tooling, and high-craft web applications.',
  about_md text not null default '',
  avatar_url text,
  resume_url text,
  location text default 'Nigeria • Remote Worldwide',
  available_for_work boolean not null default true,
  accent_color text not null default '#10B981',
  socials jsonb not null default '{"github": "https://github.com/18d-shady", "linkedin": "", "x": "", "email": "hello@example.com"}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text not null,
  description_md text not null default '',
  cover_image text,
  live_url text,
  repo_url text,
  tech_stack text[] not null default '{}',
  featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Work Experience
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  company_url text,
  location text,
  period text not null,
  highlights text[] not null default '{}',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Skill Groups
create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  skills text[] not null default '{}',
  display_order int not null default 0
);

-- 5. Blog Posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content_md text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security (RLS)
alter table public.site_profile enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.skill_groups enable row level security;
alter table public.posts enable row level security;

-- Public Read Policies
create policy "Public read site_profile" on public.site_profile for select using (true);
create policy "Public read projects" on public.projects for select using (true);
create policy "Public read experiences" on public.experiences for select using (true);
create policy "Public read skill_groups" on public.skill_groups for select using (true);
create policy "Public read published posts" on public.posts for select using (published = true or auth.role() = 'authenticated');

-- Authenticated Admin Write Policies
create policy "Admin full access site_profile" on public.site_profile for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access projects" on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access experiences" on public.experiences for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access skill_groups" on public.skill_groups for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin full access posts" on public.posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

```

**Storage Bucket Specification:**

* Bucket ID: `portfolio-assets` (Public read `true`; Authenticated insert/update/delete `true`).
* Sub-paths: `avatars/`, `resumes/`, `projects/`, `blog/`.

---

## 5. Target Next.js Directory Architecture

```text
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                 # Public shell: Navbar, Footer, CustomCursor, CustomContextMenu, CommandPalette
│   │   ├── page.tsx                   # Main Portfolio (Hero, Bento Grid, Featured Projects, Experience, Skills, Latest Posts)
│   │   ├── projects/
│   │   │   └── [slug]/page.tsx        # Deep Engineering Case-Study View
│   │   └── blog/
│   │       ├── page.tsx               # Searchable & Tag-Filterable Blog Index
│   │       └── [slug]/page.tsx        # Article Reader with TOC, Progress Bar & Shiki Code Blocks
│   ├── admin/
│   │   ├── login/page.tsx             # Supabase Auth Login UI
│   │   └── (protected)/
│   │       ├── layout.tsx             # Admin Sidebar + Session Guard
│   │       ├── page.tsx               # Profile, Bio, Availability, Accent Color & Resume Manager
│   │       ├── projects/page.tsx      # Projects CRUD + Reordering + Case Study Editor
│   │       ├── experience/page.tsx    # Work Experience CRUD + Reordering
│   │       ├── skills/page.tsx        # Categorized Skills CRUD
│   │       └── blog/page.tsx          # Split-Pane Markdown Blog Studio + Live Preview
│   ├── api/
│   │   └── rss.xml/route.ts           # Dynamic RSS 2.0 Feed Generator
│   ├── opengraph-image.tsx            # Dynamic next/og Branded Social Card
│   ├── sitemap.ts                     # Dynamic XML Sitemap (Portfolio + Projects + Posts)
│   ├── robots.ts                      # SEO Robots rules (disallowing /admin)
│   ├── globals.css                    # Dual theme CSS variables, custom scrollbar & cursor styles
│   └── layout.tsx                     # Root Layout (Geist Fonts, ThemeProvider, Toaster)
├── components/
│   ├── shell/
│   │   ├── custom-cursor.tsx
│   │   ├── custom-context-menu.tsx
│   │   ├── command-palette.tsx
│   │   ├── navbar.tsx
│   │   └── theme-toggle.tsx
│   ├── portfolio/
│   │   ├── hero-section.tsx
│   │   ├── bento-grid.tsx
│   │   ├── project-card.tsx
│   │   ├── experience-timeline.tsx
│   │   ├── skills-matrix.tsx
│   │   └── resume-modal.tsx
│   ├── blog/
│   │   ├── markdown-renderer.tsx      # react-markdown + rehype-pretty-code + copy button
│   │   ├── table-of-contents.tsx
│   │   └── reading-progress.tsx
│   └── admin/
│       ├── image-uploader.tsx         # Supabase Storage upload + old asset cleanup
│       └── markdown-split-editor.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser client
│   │   ├── server.ts                  # SSR client (@supabase/ssr)
│   │   └── storage.ts                 # Upload & delete helper functions
│   ├── actions/
│   │   └── admin-actions.ts           # Server Actions with revalidatePath()
│   ├── queries.ts                     # Data fetching with automatic fallback to seed-data.ts
│   ├── seed-data.ts                   # Realistic Senior Engineer fallback data (Olehi Davis)
│   └── types.ts                       # Strict TypeScript interfaces matching Supabase tables
└── middleware.ts                      # Protects /admin/(protected) routes

```

---

## 6. Phased Implementation Plan for Antigravity

Execute this build sequentially across 4 milestones and verify each in the browser preview:

1. **Phase 1 — Foundation, Theme Engine & Typed Data Layer:**
* Initialize Next.js (App Router, TypeScript, Tailwind CSS), install `lucide-react`, `next-themes`, `@supabase/supabase-js`, `@supabase/ssr`, `react-markdown`, `remark-gfm`, `rehype-pretty-code`, `shiki`, and `sonner`.
* Configure `globals.css` with Light/Dark CSS variables, `--accent` token, and custom scrollbar rules.
* Create `src/lib/types.ts`, `supabase/migrations/001_initial_schema.sql`, `src/lib/seed-data.ts` (populated with realistic senior engineering projects, career history, and 2 deep technical blog posts with code blocks), and `src/lib/queries.ts` (fetching from Supabase with seamless fallback to `seed-data.ts` when env vars are missing).


2. **Phase 2 — Bespoke Shell & Public Portfolio Surface:**
* Build `<CustomCursor/>`, `<CustomContextMenu/>`, `<CommandPalette/>`, and `<Navbar/>`.
* Build the `/` homepage: `<HeroSection/>` with live availability pill and `<ResumeModal/>`, `<BentoGrid/>`, `<ProjectCard/>` grid, `<ExperienceTimeline/>`, `<SkillsMatrix/>`, and one-click copy-email footer.
* Build `/projects/[slug]` for deep project architecture case studies.


3. **Phase 3 — Technical Blog Engine & SEO:**
* Build `/blog` with instant client search and tag filtering.
* Build `/blog/[slug]` with `<ReadingProgress/>`, sticky `<TableOfContents/>`, and `<MarkdownRenderer/>` featuring syntax highlighting and one-click code copy buttons.
* Add `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, and `/api/rss.xml`.


4. **Phase 4 — Supabase Auth & Full Admin CMS:**
* Build `/admin/login` and `src/middleware.ts` auth guard.
* Build the `/admin` dashboard modules (Profile/Settings editor, Projects CRUD, Experience CRUD, Skills CRUD, and Split-Pane Blog Studio) wired to `src/lib/actions/admin-actions.ts` with `revalidatePath('/', 'layout')` on every mutation.