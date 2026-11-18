'use client';

import React, { useState } from 'react';
import {
  Plus,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  Check,
  Loader2,
  Tag,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { saveSkillGroupAction, deleteSkillGroupAction } from '@/lib/actions/admin-actions';
import type { SkillGroup } from '@/lib/types';

interface SkillsViewProps {
  initialSkillGroups: SkillGroup[];
}

export function SkillsView({ initialSkillGroups }: SkillsViewProps) {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(initialSkillGroups);
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddTag = async (groupId: string) => {
    const tag = newTagInputs[groupId]?.trim();
    if (!tag) return;

    const group = skillGroups.find((g) => g.id === groupId);
    if (!group) return;
    if (group.skills.includes(tag)) {
      toast.info('Skill already exists in this group');
      return;
    }

    const updatedSkills = [...group.skills, tag];
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, skills: updatedSkills } : g))
    );
    setNewTagInputs((prev) => ({ ...prev, [groupId]: '' }));

    try {
      await saveSkillGroupAction({ id: groupId, skills: updatedSkills });
      toast.success(`Added "${tag}" to ${group.category}`);
    } catch {
      toast.error('Failed to update skills');
    }
  };

  const handleRemoveTag = async (groupId: string, tagToRemove: string) => {
    const group = skillGroups.find((g) => g.id === groupId);
    if (!group) return;

    const updatedSkills = group.skills.filter((s) => s !== tagToRemove);
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, skills: updatedSkills } : g))
    );

    try {
      await saveSkillGroupAction({ id: groupId, skills: updatedSkills });
      toast.success(`Removed "${tagToRemove}"`);
    } catch {
      toast.error('Failed to update skills');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skillGroups.length) return;

    const newGroups = [...skillGroups];
    const temp = newGroups[index];
    newGroups[index] = newGroups[targetIndex];
    newGroups[targetIndex] = temp;

    newGroups[index].display_order = index + 1;
    newGroups[targetIndex].display_order = targetIndex + 1;

    setSkillGroups(newGroups);

    try {
      await Promise.all([
        saveSkillGroupAction({ id: newGroups[index].id, display_order: index + 1 }),
        saveSkillGroupAction({ id: newGroups[targetIndex].id, display_order: targetIndex + 1 }),
      ]);
      toast.success('Skill groups reordered');
    } catch {
      toast.error('Failed to save group order');
    }
  };

  const handleDeleteGroup = async (id: string, category: string) => {
    if (!confirm(`Delete skill category "${category}"?`)) return;

    try {
      await deleteSkillGroupAction(id);
      setSkillGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success(`Deleted category "${category}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSaving(true);
    const newGroup: Partial<SkillGroup> = {
      category: newCategoryName.trim(),
      skills: ['TypeScript', 'Next.js'],
      display_order: skillGroups.length + 1,
    };

    try {
      await saveSkillGroupAction(newGroup);
      toast.success(`Created category "${newCategoryName}"`);
      setNewCategoryName('');
      setIsCreatingNew(false);

      setSkillGroups((prev) => [
        ...prev,
        {
          ...newGroup,
          id: 'temp-' + Date.now(),
        } as SkillGroup,
      ]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create group');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Skills Matrix Management</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Organize technical competencies, stack categories, and individual skill tags
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatingNew(true)}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-md self-start transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Category</span>
        </button>
      </div>

      {/* New Category Box */}
      {isCreatingNew && (
        <form
          onSubmit={handleCreateGroup}
          className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 font-mono text-xs shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-900 dark:text-white">New Category Name</span>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-zinc-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Distributed Consensus & Protocols"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg font-semibold text-black flex items-center gap-1 shadow"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Create</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Groups */}
      <div className="space-y-4">
        {skillGroups.map((group, idx) => (
          <div
            key={group.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">
                  {group.category}
                </h2>
                <span className="text-[10px] text-zinc-500 font-mono">
                  ({group.skills.length} skills)
                </span>
              </div>

              <div className="flex items-center gap-1 text-zinc-400">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleReorder(idx, 'up')}
                  className="p-1 hover:text-black dark:hover:text-white disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === skillGroups.length - 1}
                  onClick={() => handleReorder(idx, 'down')}
                  className="p-1 hover:text-black dark:hover:text-white disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteGroup(group.id, group.category)}
                  className="p-1 text-zinc-400 hover:text-red-500"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 items-center">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(group.id, skill)}
                    className="text-zinc-400 hover:text-red-500 p-0.5 rounded transition-colors"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Inline Add Skill Input */}
              <div className="inline-flex items-center gap-1 font-mono text-xs">
                <input
                  type="text"
                  placeholder="+ Add skill..."
                  value={newTagInputs[group.id] || ''}
                  onChange={(e) =>
                    setNewTagInputs((prev) => ({ ...prev, [group.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(group.id);
                    }
                  }}
                  className="w-32 bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(group.id)}
                  className="p-1 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                  title="Add skill tag"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
