'use client';

import React, { useState, useMemo } from 'react';
import {
  SERVICE_ICON_OPTIONS,
  SERVICE_ICON_MAP,
  renderServiceIcon,
  type ServiceIconOption,
} from '@/lib/service-icons';
import { Search } from 'lucide-react';

interface IconPickerProps {
  value?: string | null;
  onChange: (iconName: string) => void;
  label?: string;
  defaultIcon?: string;
  className?: string;
}

export function IconPicker({
  value,
  onChange,
  label = 'Select Icon',
  defaultIcon = 'Globe',
  className = '',
}: IconPickerProps) {
  const [search, setSearch] = useState('');
  const activeIconName = value || defaultIcon;

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return SERVICE_ICON_OPTIONS;
    const q = search.toLowerCase();
    return SERVICE_ICON_OPTIONS.filter(
      (opt) => opt.name.toLowerCase().includes(q) || opt.label.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className={`space-y-2 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
        <label className="font-semibold text-zinc-800 dark:text-zinc-200">{label}</label>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-[var(--accent)] font-semibold">
          {renderServiceIcon(activeIconName, 'w-3 h-3 text-[var(--accent)]')}
          <span>{activeIconName}</span>
        </span>
      </div>

      <div className="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
        {/* Quick Icon Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter icons by name or role..."
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-44 overflow-y-auto pr-1">
          {filteredIcons.map(({ name, label: optLabel, Icon }) => {
            const isSelected = activeIconName === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange(name)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center group ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-semibold shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
                title={`${optLabel} (${name})`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isSelected ? 'text-[var(--accent)]' : ''
                  }`}
                />
                <span className="text-[9px] font-mono truncate w-full">{optLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
