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
  Laptop,
  Radio,
  Wifi,
  FolderGit2,
  Package,
  Bot,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceIconOption {
  name: string;
  label: string;
  Icon: LucideIcon;
}

export const SERVICE_ICON_OPTIONS: ServiceIconOption[] = [
  { name: 'Globe', label: 'Web', Icon: Globe },
  { name: 'Smartphone', label: 'Mobile', Icon: Smartphone },
  { name: 'Server', label: 'Backend', Icon: Server },
  { name: 'Cpu', label: 'Embedded / IoT', Icon: Cpu },
  { name: 'CircuitBoard', label: 'Hardware', Icon: CircuitBoard },
  { name: 'Terminal', label: 'DevOps / CLI', Icon: Terminal },
  { name: 'Database', label: 'Database', Icon: Database },
  { name: 'Cloud', label: 'Cloud', Icon: Cloud },
  { name: 'Code2', label: 'Full-Stack Code', Icon: Code2 },
  { name: 'Layers', label: 'Architecture', Icon: Layers },
  { name: 'MonitorSmartphone', label: 'Cross-Platform', Icon: MonitorSmartphone },
  { name: 'Laptop', label: 'Desktop App', Icon: Laptop },
  { name: 'Radio', label: 'RF / Signals', Icon: Radio },
  { name: 'Wifi', label: 'Networking', Icon: Wifi },
  { name: 'FolderGit2', label: 'Git / VCS', Icon: FolderGit2 },
  { name: 'Package', label: 'Packaging / Docker', Icon: Package },
  { name: 'Wrench', label: 'Tooling / Eng', Icon: Wrench },
  { name: 'Shield', label: 'Security / Auth', Icon: Shield },
  { name: 'Bot', label: 'AI / Chatbots', Icon: Bot },
  { name: 'Sparkles', label: 'AI / Innovation', Icon: Sparkles },
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
