'use client';

import React from 'react';
import { Category, Priority } from '@/lib/store';
import { Filter } from 'lucide-react';

interface TaskFiltersProps {
  categories: Category[];
  activeFilter: string;
  activePriority: Priority | 'all';
  onFilterChange: (id: string) => void;
  onPriorityChange: (p: Priority | 'all') => void;
  taskCounts: Record<string, number>;
}

const priorities: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'urgent', label: '🔴 Urgent' },
  { value: 'high', label: '🟠 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

export default function TaskFilters({
  categories,
  activeFilter,
  activePriority,
  onFilterChange,
  onPriorityChange,
  taskCounts,
}: TaskFiltersProps) {
  return (
    <div className="space-y-2">
      {/* Category filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-muted-foreground flex-shrink-0" />
        <button
          key="filter-all"
          onClick={() => onFilterChange('all')}
          className={`
            px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 active:scale-95
            ${activeFilter === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border'
            }
          `}
        >
          All tasks
        </button>
        {categories.map(cat => (
          <button
            key={`filter-${cat.id}`}
            onClick={() => onFilterChange(cat.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
              transition-all duration-150 active:scale-95
              ${activeFilter === cat.id
                ? 'text-foreground border'
                : 'bg-muted text-muted-foreground hover:text-foreground border border-transparent'
              }
            `}
            style={activeFilter === cat.id ? {
              backgroundColor: `${cat.color}20`,
              borderColor: `${cat.color}50`,
              color: cat.color,
            } : undefined}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
            {taskCounts[cat.id] ? (
              <span className="opacity-70">{taskCounts[cat.id]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Priority filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground flex-shrink-0 w-[14px]" />
        {priorities.map(p => (
          <button
            key={`pri-${p.value}`}
            onClick={() => onPriorityChange(p.value)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 active:scale-95
              ${activePriority === p.value
                ? 'bg-secondary text-secondary-foreground border border-primary/30'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
              }
            `}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}