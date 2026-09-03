import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>;

interface DynamicIconProps {
  name?: string | null;
  size?: number;
  className?: string;
}

export default function DynamicIcon({
  name,
  size = 24,
  className,
}: DynamicIconProps) {
  const Icon = (name && iconRegistry[name]) || LucideIcons.HelpCircle;

  return <Icon aria-hidden="true" className={className} size={size} />;
}
