'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../supabase/server';
import type { SiteProfile, Project, Experience, Education, SkillGroup, BlogPost, Service } from '../types';

export async function updateSiteProfileAction(data: Partial<SiteProfile>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_site_profile')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', 1);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function saveProjectAction(project: Partial<Project>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  if (project.id) {
    const { error } = await supabase
      .from('portfolio_projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', project.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('portfolio_projects')
      .insert({ ...project, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function reorderProjectAction(id: string, newOrder: number) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_projects')
    .update({ display_order: newOrder })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function saveExperienceAction(experience: Partial<Experience>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  if (experience.id) {
    const { error } = await supabase
      .from('portfolio_experiences')
      .update(experience)
      .eq('id', experience.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('portfolio_experiences')
      .insert(experience);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteExperienceAction(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_experiences')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function saveSkillGroupAction(skillGroup: Partial<SkillGroup>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  if (skillGroup.id) {
    const { error } = await supabase
      .from('portfolio_skill_groups')
      .update(skillGroup)
      .eq('id', skillGroup.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('portfolio_skill_groups')
      .insert(skillGroup);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteSkillGroupAction(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_skill_groups')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function saveBlogPostAction(post: Partial<BlogPost>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  if (post.id) {
    const { error } = await supabase
      .from('portfolio_posts')
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq('id', post.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('portfolio_posts')
      .insert({ ...post, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteBlogPostAction(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateAdminPasswordAction(newPassword: string) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function saveServiceAction(service: Partial<Service>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  if (service.id) {
    const { data, error } = await supabase
      .from('portfolio_services')
      .update({ ...service, updated_at: new Date().toISOString() })
      .eq('id', service.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return { success: true, data: data as Service };
  } else {
    const { id: _ignoreId, ...insertPayload } = service;
    const { data, error } = await supabase
      .from('portfolio_services')
      .insert({ ...insertPayload, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return { success: true, data: data as Service };
  }
}

export async function deleteServiceAction(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_services')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function reorderServiceAction(id: string, newOrder: number) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_services')
    .update({ display_order: newOrder, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function saveEducationAction(education: Partial<Education>) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  if (education.id) {
    const { data, error } = await supabase
      .from('portfolio_education')
      .update(education)
      .eq('id', education.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return { success: true, data: data as Education };
  } else {
    const { id: _ignoreId, ...insertPayload } = education;
    const { data, error } = await supabase
      .from('portfolio_education')
      .insert(insertPayload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return { success: true, data: data as Education };
  }
}

export async function deleteEducationAction(id: string) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_education')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function reorderEducationAction(id: string, newOrder: number) {
  const supabase = await createClient();
  if (!supabase) throw new Error('Supabase client not configured');

  const { error } = await supabase
    .from('portfolio_education')
    .update({ display_order: newOrder })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { success: true };
}
