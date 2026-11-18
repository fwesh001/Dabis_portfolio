'use client';

import React, { useState } from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Check,
  X,
  Loader2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  saveProjectAction,
  deleteProjectAction,
  reorderProjectAction,
} from '@/lib/actions/admin-actions';
import { ImageUploader } from './image-uploader';
import type { Project } from '@/lib/types';

interface ProjectsViewProps {
  initialProjects: Project[];
}

const STATUS_PRESETS = ['Live', 'Beta', 'In Development', 'MVP', 'Prototype', 'Archived'];

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingProject({
      title: '',
      slug: '',
      summary: '',
      description_md: '',
      cover_image: '',
      live_url: '',
      repo_url: '',
      tech_stack: ['Next.js', 'TypeScript'],
      featured: true,
      status: 'In Development',
      display_order: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteProjectAction(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Deleted project "${title}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const updatedFeatured = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: updatedFeatured } : p))
    );

    try {
      await saveProjectAction({ id: project.id, featured: updatedFeatured });
      toast.success(
        updatedFeatured
          ? `"${project.title}" marked as Featured`
          : `"${project.title}" removed from Featured`
      );
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: !updatedFeatured } : p))
      );
      toast.error('Failed to update featured state');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    // Update display orders
    newProjects[index].display_order = index + 1;
    newProjects[targetIndex].display_order = targetIndex + 1;

    setProjects(newProjects);

    try {
      await Promise.all([
        reorderProjectAction(newProjects[index].id, index + 1),
        reorderProjectAction(newProjects[targetIndex].id, targetIndex + 1),
      ]);
      toast.success('Project order updated');
    } catch {
      toast.error('Failed to save project order');
    }
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.slug) {
      toast.error('Title and Slug are required');
      return;
    }

    setIsSaving(true);
    try {
      await saveProjectAction(editingProject);
      toast.success(
        editingProject.id ? 'Project updated successfully!' : 'Project created successfully!'
      );
      setIsModalOpen(false);
      setEditingProject(null);

      // Optimistically update list
      if (editingProject.id) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? ({ ...p, ...editingProject } as Project) : p))
        );
      } else {
        setProjects((prev) => [
          ...prev,
          {
            ...editingProject,
            id: 'temp-' + Date.now(),
          } as Project,
        ]);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Projects &amp; Case Studies</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Manage Portfolio Showcase, Ordering, &amp; Markdown Case Studies
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-md self-start transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden font-mono text-xs shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-[11px]">
              <tr>
                <th className="p-3.5 w-14 text-center">Order</th>
                <th className="p-3.5">Title &amp; Slug</th>
                <th className="p-3.5">Summary</th>
                <th className="p-3.5">Tech Stack</th>
                <th className="p-3.5 text-center">Stage / Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-zinc-700 dark:text-zinc-300">
              {projects.map((project, idx) => (
                <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-zinc-400">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleReorder(idx, 'up')}
                        className="hover:text-black dark:hover:text-white disabled:opacity-30 p-1"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => handleReorder(idx, 'down')}
                        className="hover:text-black dark:hover:text-white disabled:opacity-30 p-1"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-zinc-900 dark:text-white font-sans text-sm">
                      {project.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      /projects/{project.slug}
                    </div>
                  </td>

                  <td className="p-3 max-w-xs font-sans text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {project.summary}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {project.tech_stack?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.tech_stack?.length || 0) > 3 && (
                        <span className="text-[9px] text-zinc-500 self-center">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-[var(--accent)] transition-colors"
                      title="Click to edit development status"
                    >
                      {project.status || 'Live'}
                    </button>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                          title="Open live URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        title="Edit project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal Dialog (Bounded max-h-[85vh] with sticky header/footer) */}
      {isModalOpen && editingProject && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-mono">
                  {editingProject.id ? 'Edit Project' : 'Add New Project'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleModalSave}
              className="flex flex-col min-h-0 flex-1 overflow-hidden font-mono text-xs"
            >
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Title</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        setEditingProject((prev) => ({
                          ...prev,
                          title,
                          slug: prev?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                        }));
                      }}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Slug</label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, slug: e.target.value }))}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400">Summary Tagline</label>
                  <input
                    type="text"
                    required
                    value={editingProject.summary || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, summary: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.tech_stack?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        tech_stack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    placeholder="Go, Raft, PostgreSQL, Redis"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Live Demo URL</label>
                    <input
                      type="url"
                      value={editingProject.live_url || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, live_url: e.target.value }))}
                      placeholder="https://..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={editingProject.repo_url || ''}
                      onChange={(e) => setEditingProject((prev) => ({ ...prev, repo_url: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                {/* Cover Image Uploader */}
                <div className="space-y-1">
                  <ImageUploader
                    label="Project Screenshot / Architecture Diagram"
                    bucket="portfolio-assets"
                    folder="projects"
                    accept="image/*"
                    currentUrl={editingProject.cover_image}
                    onUploaded={(url) => setEditingProject((prev) => ({ ...prev, cover_image: url }))}
                    onDeleted={() => setEditingProject((prev) => ({ ...prev, cover_image: null }))}
                    description="Upload to portfolio-assets/projects/ with orphan file hygiene"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400">Case Study Markdown</label>
                  <textarea
                    rows={6}
                    value={editingProject.description_md || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, description_md: e.target.value }))}
                    placeholder="## Architecture Overview&#10;&#10;Detailed technical specifications..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[var(--accent)] leading-relaxed"
                  />
                </div>

                {/* Development Status / Stage */}
                <div className="space-y-2 pt-1">
                  <label className="text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                    <span>Development Status / Stage</span>
                    <span className="text-[10px] text-zinc-500">Shown as badge on project card</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_PRESETS.map((preset) => {
                      const active = (editingProject.status || 'Live').toLowerCase() === preset.toLowerCase();
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEditingProject((prev) => ({ ...prev, status: preset }))}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                            active
                              ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] font-semibold'
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={editingProject.status || ''}
                    onChange={(e) => setEditingProject((prev) => ({ ...prev, status: e.target.value }))}
                    placeholder="Or type custom stage (e.g. v2.0 Live, Private Beta, Building...)"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl font-semibold text-black flex items-center gap-1.5 shadow disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
