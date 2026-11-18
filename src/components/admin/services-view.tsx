'use client';

import React, { useState } from 'react';
import {
  Plus,
  Wrench,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  saveServiceAction,
  deleteServiceAction,
  reorderServiceAction,
} from '@/lib/actions/admin-actions';
import { SERVICE_ICON_OPTIONS, renderServiceIcon } from '@/lib/service-icons';
import type { Service } from '@/lib/types';

interface ServicesViewProps {
  initialServices: Service[];
}

export function ServicesView({ initialServices }: ServicesViewProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingService({
      title: '',
      description: '',
      icon: 'Globe',
      display_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      await deleteServiceAction(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success(`Deleted service "${title}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const newList = [...services];
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    newList[index] = { ...newList[index], display_order: index + 1 };
    newList[targetIndex] = { ...newList[targetIndex], display_order: targetIndex + 1 };

    setServices(newList);

    try {
      await Promise.all([
        reorderServiceAction(newList[index].id, index + 1),
        reorderServiceAction(newList[targetIndex].id, targetIndex + 1),
      ]);
      toast.success('Service display order updated');
    } catch {
      toast.error('Failed to save service order');
    }
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title?.trim()) {
      toast.error('Service name is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Service> = {
        ...editingService,
        title: editingService.title.trim(),
        description: editingService.description?.trim() || null,
        icon: editingService.icon || 'Globe',
      };

      const res = await saveServiceAction(payload);
      toast.success(
        editingService.id ? 'Service updated successfully!' : 'Service created successfully!'
      );

      const saved = res?.data;
      if (editingService.id) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id ? (saved || ({ ...s, ...payload } as Service)) : s
          )
        );
      } else {
        setServices((prev) => [
          ...prev,
          saved ||
            ({
              ...payload,
              id: 'temp-' + Date.now(),
              display_order: prev.length + 1,
            } as Service),
        ]);
      }

      setIsModalOpen(false);
      setEditingService(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Services Management</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Add, edit, reorder, or remove service cards displayed in Section 02 (What I Offer)
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-md self-start transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <div className="p-10 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center space-y-3 font-mono text-xs text-zinc-500">
          <Wrench className="w-8 h-8 mx-auto text-zinc-400" />
          <div>No services configured yet. Click &ldquo;Add Service&rdquo; to create your first card.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {renderServiceIcon(service.icon, 'w-5 h-5 text-[var(--accent)]')}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white font-sans">
                      {service.title}
                    </h2>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Icon: {service.icon} &bull; Order #{idx + 1}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 text-zinc-400 flex-shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, 'up')}
                    className="p-1.5 hover:text-black dark:hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === services.length - 1}
                    onClick={() => handleReorder(idx, 'down')}
                    className="p-1.5 hover:text-black dark:hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                    title="Edit service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id, service.title)}
                    className="p-1.5 text-zinc-400 hover:text-red-500"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {service.description ? (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans border-t border-zinc-100 dark:border-zinc-800/70 pt-3">
                  {service.description}
                </p>
              ) : (
                <p className="text-[11px] font-mono italic text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/70 pt-3">
                  No optional note (minimal icon + title card)
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Service Modal (Bounded max-h-[85vh] with sticky header/footer) */}
      {isModalOpen && editingService && (
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
                <Wrench className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-mono">
                  {editingService.id ? 'Edit Service Card' : 'Add New Service'}
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

            <form onSubmit={handleModalSave} className="flex flex-col min-h-0 flex-1 overflow-hidden font-mono text-xs">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400">Service Name *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Web Development"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {/* Icon Picker Grid */}
                <div className="space-y-2">
                  <label className="text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                    <span>Select Icon</span>
                    <span className="text-[10px] text-[var(--accent)] font-semibold">
                      {editingService.icon || 'Globe'}
                    </span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {SERVICE_ICON_OPTIONS.map(({ name, label, Icon }) => {
                      const isSelected = (editingService.icon || 'Globe') === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setEditingService((prev) => ({ ...prev, icon: name }))}
                          title={label}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                            isSelected
                              ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] ring-1 ring-[var(--accent)]'
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[9px] truncate max-w-full">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                    <span>Short Note</span>
                    <span className="text-[10px] text-zinc-500">Optional — leave blank for title-only card</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional short description of what you offer..."
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white font-sans text-xs focus:outline-none focus:border-[var(--accent)] leading-relaxed"
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
                      <span>Save Service</span>
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
