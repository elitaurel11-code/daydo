import React from 'react';
import { Priority } from '@/lib/store';
import { AlertCircle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'priority-badge-low',
    icon: <ArrowDown size={10} />,
  },
  medium: {
    label: 'Medium',
    className: 'priority-badge-medium',
    icon: <Minus size={10} />,
  },
  high: {
    label: 'High',
    className: 'priority-badge-high',
    icon: <ArrowUp size={10} />,
  },
  urgent: {
    label: 'Urgent',
    className: 'priority-badge-urgent',
    icon: <AlertCircle size={10} />,
  },
};

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-medium
      ${config.className}
      ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
    `}>
      {config.icon}
      {config.label}
    </span>
  );
}