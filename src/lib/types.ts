// ==============================================================================
// Strict TypeScript Data Models for Olehi Davis Portfolio & Blog
// ==============================================================================

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
}

export interface SiteProfile {
  id: number;
  full_name: string;
  headline: string;
  subheadline?: string | null;
  about_md: string;
  resume_md?: string | null;
  avatar_url?: string | null;
  resume_url?: string | null;
  location: string;
  available_for_work: boolean;
  accent_color: string;
  socials: SocialLinks;
  typer_words?: string[];
  typer_speed?: number;
  typer_pause?: number;
  visitor_count?: number;
  resume_downloads?: number;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string | null;
  icon: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description_md: string;
  cover_image?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  tech_stack: string[];
  featured: boolean;
  status?: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  company_url?: string | null;
  location?: string | null;
  period: string;
  highlights: string[];
  display_order: number;
  created_at?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  institution_url?: string | null;
  location?: string | null;
  period: string;
  highlights: string[];
  display_order: number;
  created_at?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
  display_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  cover_image?: string | null;
  tags: string[];
  reading_time: number;
  published: boolean;
  pinned?: boolean;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}
