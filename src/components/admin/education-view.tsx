'use client';

import React, { useState } from 'react';
import {
  Plus,
  GraduationCap,
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
import {
  saveEducationAction,
  deleteEducationAction,
  reorderEducationAction,
} from '@/lib/actions/admin-actions';
import type { Education } from '@/lib/types';

interface EducationViewProps {
  initialEducation: Education[];
}

export function EducationView({ initialEducation }: EducationViewProps) {
  const [educationList, setEducationList] = useState<Education[]>(initialEducation);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingEdu({
      degree: '',
      institution: '',
      institution_url: '',
      location: 'Nigeria',
      period: '2015 — 2020',
      highlights: [],
      display_order: educationList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (edu: Education) => {
    setEditingEdu({ ...edu });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, degree: string, institution: string) => {
    if (!confirm(`Delete education record: "${degree} at ${institution}"?`)) return;

    try {
      await deleteEducationAction(id);
      setEducationList((prev) => prev.filter((e) => e.id !== id));
      toast.success(`Removed "${degree}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete education record');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= educationList.length) return;

    const updated = [...educationList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    updated[index] = { ...updated[index], display_order: index + 1 };
    updated[targetIndex] = { ...updated[targetIndex], display_order: targetIndex + 1 };

    setEducationList(updated);

    try {
      await Promise.all([
        reorderEducationAction(updated[index].id, index + 1),
        reorderEducationAction(updated[targetIndex].id, targetIndex + 1),
      ]);
      toast.success('Education timeline order updated');
    } catch {
      toast.error('Failed to save education order');
    }
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.degree?.trim() || !editingEdu.institution?.trim()) {
      toast.error('Degree and Institution are required');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Education> = {
        ...editingEdu,
        degree: editingEdu.degree.trim(),
        institution: editingEdu.institution.trim(),
        institution_url: editingEdu.institution_url?.trim() || null,
        location: editingEdu.location?.trim() || null,
        period: editingEdu.period?.trim() || '',
        highlights: editingEdu.highlights || [],
      };

      const res = await saveEducationAction(payload);
      toast.success(
        editingEdu.id ? 'Education record updated!' : 'Education record added!'
      );

      const saved = res?.data;
      if (editingEdu.id) {
        setEducationList((prev) =>
          prev.map((e) =>
            e.id === editingEdu.id ? (saved || ({ ...e, ...payload } as Education)) : e
          )
        );
      } else {
        setEducationList((prev) => [
          ...prev,
          saved ||
            ({
              ...payload,
              id: 'temp-' + Date.now(),
              display_order: prev.length + 1,
            } as Education),
        ]);
      }

      setIsModalOpen(false);
      setEditingEdu(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save education record');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Education Timeline</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Manage degrees, certifications, academic institutions, and highlights (Section 05)
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-md self-start transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education Cards */}
      {educationList.length === 0 ? (
        <div className="p-10 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center space-y-3 font-mono text-xs text-zinc-500">
          <GraduationCap className="w-8 h-8 mx-auto text-zinc-400" />
          <div>No education entries yet. Click &ldquo;Add Education&rdquo; to add your first degree or certification.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu, idx) => (
            <div
              key={edu.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white font-sans">
                      {edu.degree}
                    </h2>
                    <span className="text-xs text-zinc-400 font-mono">@</span>
                    <span className="text-sm font-semibold text-[var(--accent)] font-mono">
                      {edu.institution}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.period}</span>
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{edu.location}</span>
                      </span>
                    )}
                    {edu.institution_url && (
                      <a
                        href={edu.institution_url}
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
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === educationList.length - 1}
                    onClick={() => handleReorder(idx, 'down')}
                    className="p-1.5 hover:text-black dark:hover:text-white disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(edu)}
                    className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id, edu.degree, edu.institution)}
                    className="p-1.5 text-zinc-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside leading-relaxed">
                  {edu.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className="pl-1">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal (Bounded max-h-[85vh] with sticky header/footer) */}
      {isModalOpen && editingEdu && (
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
                <GraduationCap className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-mono">
                  {editingEdu.id ? 'Edit Education' : 'Add Education'}
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
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Degree / Program *</label>
                    <input
                      type="text"
                      required
                      value={editingEdu.degree || ''}
                      onChange={(e) => setEditingEdu((prev) => ({ ...prev, degree: e.target.value }))}
                      placeholder="B.Eng. Electrical & Electronics Engineering"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Institution *</label>
                    <input
                      type="text"
                      required
                      value={editingEdu.institution || ''}
                      onChange={(e) =>
                        setEditingEdu((prev) => ({ ...prev, institution: e.target.value }))
                      }
                      placeholder="Federal University of Technology"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Period *</label>
                    <input
                      type="text"
                      required
                      value={editingEdu.period || ''}
                      onChange={(e) => setEditingEdu((prev) => ({ ...prev, period: e.target.value }))}
                      placeholder="2015 — 2020"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-600 dark:text-zinc-400">Location</label>
                    <input
                      type="text"
                      value={editingEdu.location || ''}
                      onChange={(e) =>
                        setEditingEdu((prev) => ({ ...prev, location: e.target.value }))
                      }
                      placeholder="Abuja, Nigeria"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400">Institution URL (Optional)</label>
                  <input
                    type="url"
                    value={editingEdu.institution_url || ''}
                    onChange={(e) =>
                      setEditingEdu((prev) => ({ ...prev, institution_url: e.target.value }))
                    }
                    placeholder="https://university.edu"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                    <span>Highlights / Coursework / Honors (1 per line)</span>
                    <span className="text-[10px] text-zinc-500">Optional</span>
                  </label>
                  <textarea
                    rows={4}
                    value={editingEdu.highlights?.join('\n') || ''}
                    onChange={(e) =>
                      setEditingEdu((prev) => ({
                        ...prev,
                        highlights: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                      }))
                    }
                    placeholder="First Class Honors in Embedded Systems&#10;Thesis: ESP32 real-time industrial telemetry node"
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
                      <span>Save Education</span>
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
