'use client';

import React, { useState } from 'react';
import {
  Plus,
  Briefcase,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { saveExperienceAction, deleteExperienceAction } from '@/lib/actions/admin-actions';
import type { Experience } from '@/lib/types';

interface ExperienceViewProps {
  initialExperiences: Experience[];
}

export function ExperienceView({ initialExperiences }: ExperienceViewProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingExp({
      role: '',
      company: '',
      company_url: '',
      location: 'Remote',
      period: '2025 — Present',
      highlights: [
        'Architected high-throughput distributed services reducing p99 latency by 40%',
      ],
      display_order: experiences.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, role: string, company: string) => {
    if (!confirm(`Delete experience record: "${role} at ${company}"?`)) return;

    try {
      await deleteExperienceAction(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success(`Removed "${role} at ${company}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete record');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const newExps = [...experiences];
    const temp = newExps[index];
    newExps[index] = newExps[targetIndex];
    newExps[targetIndex] = temp;

    newExps[index].display_order = index + 1;
    newExps[targetIndex].display_order = targetIndex + 1;

    setExperiences(newExps);

    try {
      await Promise.all([
        saveExperienceAction({ id: newExps[index].id, display_order: index + 1 }),
        saveExperienceAction({ id: newExps[targetIndex].id, display_order: targetIndex + 1 }),
      ]);
      toast.success('Experience timeline updated');
    } catch {
      toast.error('Failed to save experience order');
    }
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.role || !editingExp.company) {
      toast.error('Role and Company are required');
      return;
    }

    setIsSaving(true);
    try {
      await saveExperienceAction(editingExp);
      toast.success(
        editingExp.id ? 'Experience updated successfully!' : 'Experience added successfully!'
      );
      setIsModalOpen(false);
      setEditingExp(null);

      if (editingExp.id) {
        setExperiences((prev) =>
          prev.map((e) => (e.id === editingExp.id ? ({ ...e, ...editingExp } as Experience) : e))
        );
      } else {
        setExperiences((prev) => [
          ...prev,
          {
            ...editingExp,
            id: 'temp-' + Date.now(),
          } as Experience,
        ]);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Career Experience Timeline</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Manage engineering leadership history, impact bullets, and display order
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-md self-start transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white font-sans">
                    {exp.role}
                  </h2>
                  <span className="text-xs text-zinc-400 font-mono">@</span>
                  <span className="text-sm font-semibold text-[var(--accent)] font-mono">
                    {exp.company}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.period}</span>
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                  {exp.company_url && (
                    <a
                      href={exp.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-auto text-zinc-400 font-mono text-xs">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleReorder(idx, 'up')}
                  className="p-1.5 hover:text-black dark:hover:text-white disabled:opacity-20"
                  title="Move earlier"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === experiences.length - 1}
                  onClick={() => handleReorder(idx, 'down')}
                  className="p-1.5 hover:text-black dark:hover:text-white disabled:opacity-20"
                  title="Move later"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(exp)}
                  className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id, exp.role, exp.company)}
                  className="p-1.5 text-zinc-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Highlights bullets */}
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside leading-relaxed">
              {exp.highlights?.map((bullet, bIdx) => (
                <li key={bIdx} className="pl-1">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal (Bounded max-h-[85vh] with sticky header/footer) */}
      {isModalOpen && editingExp && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-mono">
                  {editingExp.id ? 'Edit Experience' : 'Add Position'}
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
                    <label className="text-zinc-600 dark:text-zinc-400">Job Title / Role</label>
                    <input
                      type="text"
                      required
                      value={editingExp.role || ''}
                      onChange={(e) => setEditingExp((prev) => ({ ...prev, role: e.target.value }))}
                      placeholder="Senior Distributed Systems Engineer"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Company Name</label>
                    <input
                      type="text"
                      required
                      value={editingExp.company || ''}
                      onChange={(e) => setEditingExp((prev) => ({ ...prev, company: e.target.value }))}
                      placeholder="HyperScale Infrastructure"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Period (Tenure)</label>
                    <input
                      type="text"
                      required
                      value={editingExp.period || ''}
                      onChange={(e) => setEditingExp((prev) => ({ ...prev, period: e.target.value }))}
                      placeholder="2023 — Present"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Location</label>
                    <input
                      type="text"
                      value={editingExp.location || ''}
                      onChange={(e) => setEditingExp((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Remote • London, UK"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400">Company URL</label>
                  <input
                    type="url"
                    value={editingExp.company_url || ''}
                    onChange={(e) => setEditingExp((prev) => ({ ...prev, company_url: e.target.value }))}
                    placeholder="https://company.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                    <span>Impact Highlights (1 bullet per line)</span>
                    <span className="text-[10px] text-zinc-500">Metric-driven statements</span>
                  </label>
                  <textarea
                    rows={5}
                    value={editingExp.highlights?.join('\n') || ''}
                    onChange={(e) =>
                      setEditingExp((prev) => ({
                        ...prev,
                        highlights: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                      }))
                    }
                    placeholder="Architected Go-based event pipeline processing 10M+ events daily&#10;Mentored 6 engineers on concurrency patterns"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[var(--accent)] leading-relaxed"
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
                      <span>Save Position</span>
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
