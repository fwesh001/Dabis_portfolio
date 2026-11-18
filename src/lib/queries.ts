import { createClient } from './supabase/server';
import { seedData } from './seed-data';
import type { SiteProfile, Project, Experience, Education, SkillGroup, BlogPost, Service } from './types';

export async function getSiteProfile(): Promise<SiteProfile> {
  try {
    const supabase = await createClient();
    if (!supabase) return seedData.site_profile;

    const { data, error } = await supabase
      .from('portfolio_site_profile')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Falling back to seed profile:', error?.message);
      return seedData.site_profile;
    }

    return data as SiteProfile;
  } catch {
    return seedData.site_profile;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return seedData.projects;

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return seedData.projects;
    }

    return data as Project[];
  } catch {
    return seedData.projects;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter(p => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return seedData.projects.find(p => p.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return seedData.projects.find(p => p.slug === slug) || null;
    }

    return data as Project;
  } catch {
    return seedData.projects.find(p => p.slug === slug) || null;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return seedData.experiences;

    const { data, error } = await supabase
      .from('portfolio_experiences')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return seedData.experiences;
    }

    return data as Experience[];
  } catch {
    return seedData.experiences;
  }
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return seedData.skill_groups;

    const { data, error } = await supabase
      .from('portfolio_skill_groups')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return seedData.skill_groups;
    }

    return data as SkillGroup[];
  } catch {
    return seedData.skill_groups;
  }
}

export async function getPosts(publishedOnly = true): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return publishedOnly ? seedData.posts.filter(p => p.published) : seedData.posts;
    }

    let query = supabase
      .from('portfolio_posts')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (publishedOnly) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return publishedOnly ? seedData.posts.filter(p => p.published) : seedData.posts;
    }

    return data as BlogPost[];
  } catch {
    return publishedOnly ? seedData.posts.filter(p => p.published) : seedData.posts;
  }
}

export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
  const posts = await getPosts(true);
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return seedData.posts.find(p => p.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from('portfolio_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return seedData.posts.find(p => p.slug === slug) || null;
    }

    return data as BlogPost;
  } catch {
    return seedData.posts.find(p => p.slug === slug) || null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return seedData.services;

    const { data, error } = await supabase
      .from('portfolio_services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      return seedData.services;
    }

    return data as Service[];
  } catch {
    return seedData.services;
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return seedData.education;

    const { data, error } = await supabase
      .from('portfolio_education')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      return seedData.education;
    }

    return data as Education[];
  } catch {
    return seedData.education;
  }
}
