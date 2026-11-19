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
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { saveSkillGroupAction, deleteSkillGroupAction } from '@/lib/actions/admin-actions';
import { IconPicker } from '@/components/admin/icon-picker';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { renderServiceIcon } from '@/lib/service-icons';
import type { SkillGroup } from '@/lib/types';

interface SkillsViewProps {
  initialSkillGroups: SkillGroup[];
}

export function SkillsView({ initialSkillGroups }: SkillsViewProps) {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(initialSkillGroups);
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Layers');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<{ id: string; category: string } | null>(null);
  const [editingIconGroupId, setEditingIconGroupId] = useState<string | null>(null);

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
      toast.success('Stack categories reordered');
    } catch {
      toast.error('Failed to save category order');
    }
  };

  const handleUpdateIcon = async (groupId: string, newIcon: string) => {
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, icon: newIcon } : g))
    );
    setEditingIconGroupId(null);

    try {
      await saveSkillGroupAction({ id: groupId, icon: newIcon });
      toast.success('Updated category icon');
    } catch {
      toast.error('Failed to save category icon');
    }
  };

  const handleDeleteGroup = async (id: string, category: string) => {
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
      icon: newCategoryIcon || 'Layers',
      skills: ['TypeScript', 'Next.js'],
      display_order: skillGroups.length + 1,
    };

    try {
      await saveSkillGroupAction(newGroup);
      toast.success(`Created category "${newCategoryName}"`);
      setNewCategoryName('');
      setNewCategoryIcon('Layers');
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Stack Management</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Organize technical competencies, stack categories, icon badges, and individual skill tags
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatingNew(true)}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-md self-start transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Stack Category</span>
        </button>
      </div>

      {/* New Category Box with Reusable Icon Picker */}
      {isCreatingNew && (
        <form
          onSubmit={handleCreateGroup}
          className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 font-mono text-xs shadow-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <span className="font-bold text-zinc-900 dark:text-white text-sm">
              Create New Stack Category
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-zinc-400 hover:text-black dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400 font-semibold">
              Category Title
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Distributed Consensus & Protocols"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Reusable Icon Picker Tray Component */}
          <IconPicker
            label="Category Icon Badge"
            value={newCategoryIcon}
            onChange={setNewCategoryIcon}
            defaultIcon="Layers"
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl font-semibold text-black flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Create Category</span>
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
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setEditingIconGroupId(editingIconGroupId === group.id ? null : group.id)
                  }
                  className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-[var(--accent)] transition-colors"
                  title="Click to change icon"
                >
                  {renderServiceIcon(group.icon, 'w-4 h-4 text-[var(--accent)]')}
                </button>
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
                  onClick={() => setDeletingGroup({ id: group.id, category: group.category })}
                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* In-place Icon Switcher */}
            {editingIconGroupId === group.id && (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Change icon for &quot;{group.category}&quot;</span>
                  <button
                    type="button"
                    onClick={() => setEditingIconGroupId(null)}
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <IconPicker
                  value={group.icon || 'Layers'}
                  onChange={(icon) => handleUpdateIcon(group.id, icon)}
                  defaultIcon="Layers"
                />
              </div>
            )}

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

      {/* Confirmation Modal replacing window.confirm */}
      <ConfirmationModal
        isOpen={Boolean(deletingGroup)}
        onClose={() => setDeletingGroup(null)}
        onConfirm={async () => {
          if (deletingGroup) {
            await handleDeleteGroup(deletingGroup.id, deletingGroup.category);
            setDeletingGroup(null);
          }
        }}
        title="Delete Stack Category?"
        description={`Are you sure you want to permanently delete "${deletingGroup?.category}"? All associated skills will be removed from your public portfolio.`}
        confirmLabel="Delete Category"
        variant="danger"
      />
    </div>
  );
}
