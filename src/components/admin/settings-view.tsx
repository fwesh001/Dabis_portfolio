'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Sparkles,
  User,
  Globe,
  Mail,
  Github,
  Linkedin,
  Twitter,
  FileText,
  Phone,
  Facebook,
  Instagram,
  Plus,
  Trash2,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';
import { updateSiteProfileAction } from '@/lib/actions/admin-actions';
import { applyAccentToDocument } from '@/lib/accent';
import { ImageUploader } from './image-uploader';
import type { SiteProfile, SocialLinks } from '@/lib/types';

interface SettingsViewProps {
  initialProfile: SiteProfile;
}

const ACCENT_PRESETS = [
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Electric Blue', hex: '#3B82F6' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Rose', hex: '#EC4899' },
  { name: 'Cyan', hex: '#06B6D4' },
];

const SETTINGS_SECTIONS = [
  { id: 'section-profile', label: 'Identity & Bio', icon: User },
  { id: 'section-appearance', label: 'Theme Accent', icon: Sparkles },
  { id: 'section-assets', label: 'Images & Documents', icon: FileText },
  { id: 'section-socials', label: 'Social & Contact', icon: Globe },
];

export function SettingsView({ initialProfile }: SettingsViewProps) {
  const [formData, setFormData] = useState<SiteProfile>({
    ...initialProfile,
    typer_words:
      initialProfile.typer_words && initialProfile.typer_words.length > 0
        ? initialProfile.typer_words
        : ['Web Developer', 'Desktop & Mobile App Developer'],
    typer_speed: initialProfile.typer_speed ?? 75,
    typer_pause: initialProfile.typer_pause ?? 2000,
  });
  const [newTyperPhrase, setNewTyperPhrase] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('section-profile');

  // Sync active tab while scrolling inside admin main container
  useEffect(() => {
    const scrollRoot = document.getElementById('admin-main-scroll');
    const elements = SETTINGS_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveTab(visible[0].target.id);
        }
      },
      {
        root: scrollRoot,
        rootMargin: '-80px 0px -55% 0px',
        threshold: 0.05,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (key: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [key]: value,
      },
    }));
  };

  const handleAccentChange = (hex: string) => {
    setFormData((prev) => ({ ...prev, accent_color: hex }));
    applyAccentToDocument(hex);
  };

  // Typer Effect Phrases Handlers
  const handleAddTyperPhrase = () => {
    const trimmed = newTyperPhrase.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      typer_words: [...(prev.typer_words || []), trimmed],
    }));
    setNewTyperPhrase('');
  };

  const handleUpdateTyperPhrase = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.typer_words || [])];
      updated[index] = value;
      return { ...prev, typer_words: updated };
    });
  };

  const handleRemoveTyperPhrase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      typer_words: (prev.typer_words || []).filter((_, i) => i !== index),
    }));
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const cleanedTyperWords = (formData.typer_words || [])
        .map((w) => w.trim())
        .filter(Boolean);

      const payload: Partial<SiteProfile> = {
        ...formData,
        typer_words:
          cleanedTyperWords.length > 0
            ? cleanedTyperWords
            : ['Web Developer', 'Desktop & Mobile App Developer'],
        typer_speed: Math.max(20, Number(formData.typer_speed) || 75),
        typer_pause: Math.max(300, Number(formData.typer_pause) || 2000),
      };

      await updateSiteProfileAction(payload);
      applyAccentToDocument(payload.accent_color);
      toast.success('Site Profile saved successfully & Edge cache revalidated!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Title & Meta */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Site Profile &amp; Settings</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          Manage Bio, Typer Phrases, Brand Accent Color, Images &amp; Documents, and Social Links
        </p>
      </div>

      {/* Flush Sticky Sub-Navigation Tabs Bar at Top of Admin Scroll Pane */}
      <div className="sticky -top-4 sm:-top-8 z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md border-y border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
          {SETTINGS_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--accent)]' : 'text-zinc-400'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity Section */}
        <div
          id="section-profile"
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm scroll-mt-20"
        >
          <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--accent)]" />
              <span>Personal Identity &amp; Positioning</span>
            </div>
            <span className="text-[10px] text-zinc-400">Section 01</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-600 dark:text-zinc-400">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-600 dark:text-zinc-400">Location / Address</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-zinc-600 dark:text-zinc-400">Headline</label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              required
              placeholder="Hi I'm Davis"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Dynamic Typer Effect Phrases Editor */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <label className="text-zinc-800 dark:text-zinc-200 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Typer Effect Profession Texts</span>
              </label>
              <span className="text-[10px] text-zinc-500">
                {(formData.typer_words || []).length} phrase(s)
              </span>
            </div>

            <div className="space-y-2">
              {(formData.typer_words || []).map((phrase, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => handleUpdateTyperPhrase(idx, e.target.value)}
                    placeholder="e.g. Web Developer"
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTyperPhrase(idx)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors"
                    title="Remove phrase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Phrase Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTyperPhrase}
                onChange={(e) => setNewTyperPhrase(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTyperPhrase();
                  }
                }}
                placeholder="Add new profession tag (e.g. Electronics Engineer)..."
                className="flex-1 bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={handleAddTyperPhrase}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white flex items-center gap-1 font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Add</span>
              </button>
            </div>

            {/* Speed & Pause Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500">Typing Speed (ms per char)</label>
                <input
                  type="number"
                  min={20}
                  max={300}
                  value={formData.typer_speed ?? 75}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, typer_speed: Number(e.target.value) }))
                  }
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500">Pause Duration (ms before deleting)</label>
                <input
                  type="number"
                  min={300}
                  max={10000}
                  step={100}
                  value={formData.typer_pause ?? 2000}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, typer_pause: Number(e.target.value) }))
                  }
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-zinc-600 dark:text-zinc-400">Subheadline (Lead Description)</label>
            <input
              type="text"
              name="subheadline"
              value={formData.subheadline || ''}
              onChange={handleChange}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-zinc-600 dark:text-zinc-400">Markdown Bio (About Me Section 01)</label>
            <textarea
              name="about_md"
              rows={5}
              value={formData.about_md}
              onChange={handleChange}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white font-mono text-xs focus:outline-none focus:border-[var(--accent)] leading-relaxed"
            />
          </div>
        </div>

        {/* Accent Color Palette Customization */}
        <div
          id="section-appearance"
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm scroll-mt-20"
        >
          <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span>Theme Accent Color</span>
            </div>
            <span className="text-[10px] text-zinc-400">Section 02</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => handleAccentChange(preset.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  formData.accent_color.toLowerCase() === preset.hex.toLowerCase()
                    ? 'border-zinc-900 dark:border-white ring-2 ring-[var(--accent)] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: preset.hex }}
                />
                <span>{preset.name}</span>
              </button>
            ))}

            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
              <span className="text-zinc-500">Hex:</span>
              <input
                type="color"
                value={formData.accent_color}
                onChange={(e) => handleAccentChange(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{formData.accent_color}</span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-zinc-500">
            Applies globally across the Public Portfolio, Technical Blog, and Admin CMS after saving.
          </p>
        </div>

        {/* Images & Documents Section */}
        <div
          id="section-assets"
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm scroll-mt-20"
        >
          <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[var(--accent)]" />
              <span>Images &amp; Documents</span>
            </div>
            <span className="text-[10px] text-zinc-400">Section 03</span>
          </div>

          <ImageUploader
            label="Profile Avatar Image"
            bucket="portfolio-assets"
            folder="avatars"
            accept="image/*"
            currentUrl={formData.avatar_url}
            onUploaded={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
            onDeleted={() => setFormData((prev) => ({ ...prev, avatar_url: null }))}
            description="Circular portrait displayed on Hero overview and social cards"
          />

          <ImageUploader
            label="Fallback Resume PDF Document (Optional)"
            bucket="portfolio-assets"
            folder="resumes"
            accept="application/pdf"
            currentUrl={formData.resume_url}
            onUploaded={(url) => setFormData((prev) => ({ ...prev, resume_url: url }))}
            onDeleted={() => setFormData((prev) => ({ ...prev, resume_url: null }))}
            description="Optional PDF backup (dynamic Resume / CV Studio takes priority automatically)"
          />
        </div>

        {/* Social & Contact Channels */}
        <div
          id="section-socials"
          className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm scroll-mt-20"
        >
          <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--accent)]" />
              <span>Social &amp; Contact Endpoints</span>
            </div>
            <span className="text-[10px] text-zinc-400">Section 04</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                value={formData.socials?.email || ''}
                onChange={(e) => handleSocialChange('email', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="text"
                value={formData.socials?.phone || ''}
                onChange={(e) => handleSocialChange('phone', e.target.value)}
                placeholder="09099249445"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-zinc-400" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.socials?.github || ''}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.socials?.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-zinc-400" />
                <span>Facebook Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.socials?.facebook || ''}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/username"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-zinc-400" />
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.socials?.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-zinc-400" />
                <span>X / Twitter URL</span>
              </label>
              <input
                type="url"
                value={formData.socials?.x || ''}
                onChange={(e) => handleSocialChange('x', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Submit Profile Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl text-xs font-mono font-semibold text-black flex items-center gap-2 shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile &amp; Invalidate Edge Cache</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
