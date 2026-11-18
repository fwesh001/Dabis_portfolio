import React from 'react';
import {
  Globe,
  MonitorSmartphone,
  Cpu,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Terminal,
  Layers,
  Wrench,
  Shield,
  Sparkles,
  Server,
  CircuitBoard,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceIconOption {
  name: string;
  label: string;
  Icon: LucideIcon;
}

export const SERVICE_ICON_OPTIONS: ServiceIconOption[] = [
  { name: 'Globe', label: 'Web', Icon: Globe },
  { name: 'MonitorSmartphone', label: 'Desktop/Mobile', Icon: MonitorSmartphone },
  { name: 'Cpu', label: 'Electronics', Icon: Cpu },
  { name: 'CircuitBoard', label: 'Hardware', Icon: CircuitBoard },
  { name: 'Code2', label: 'Code', Icon: Code2 },
  { name: 'Smartphone', label: 'Mobile', Icon: Smartphone },
  { name: 'Server', label: 'Backend', Icon: Server },
  { name: 'Database', label: 'Database', Icon: Database },
  { name: 'Cloud', label: 'Cloud', Icon: Cloud },
  { name: 'Terminal', label: 'DevOps', Icon: Terminal },
  { name: 'Layers', label: 'Architecture', Icon: Layers },
  { name: 'Wrench', label: 'Engineering', Icon: Wrench },
  { name: 'Shield', label: 'Security', Icon: Shield },
  { name: 'Sparkles', label: 'AI / Craft', Icon: Sparkles },
];

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = SERVICE_ICON_OPTIONS.reduce(
  (acc, item) => {
    acc[item.name] = item.Icon;
    return acc;
  },
  {} as Record<string, LucideIcon>
);

export function renderServiceIcon(iconName?: string | null, className = 'w-6 h-6 text-[var(--accent)]') {
  const IconComp = (iconName && SERVICE_ICON_MAP[iconName]) || Globe;
  return <IconComp className={className} />;
}
