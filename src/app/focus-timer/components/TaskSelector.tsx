'use client';

import React, { useState } from 'react';
import { Task, Category } from '@/lib/store';
import PriorityBadge from '@/components/ui/PriorityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { ChevronDown, Clock, Lock } from 'lucide-react';

interface TaskSelectorProps {
  tasks: Task[];
  categories: Category[];
  selectedTaskId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function TaskSelector({
  tasks,
  categories,
  selectedTaskId,
  onSelect,
  disabled = false,
}: TaskSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        Task to focus on
      </label>
      <button
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-lg
          card-elevated border text-left
          transition-all duration-150
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/40 cursor-pointer active:scale-[0.99]'}
          ${open ? 'border-primary/40' : ''}
        `}
      >
        {disabled && <Lock size={14} className="text-muted-foreground flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          {selected ? (
            <div>
              <p className="text-sm font-medium text-foreground truncate">{selected.title}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <PriorityBadge priority={selected.priority} />
                {categories.find(c => c.id === selected.categoryId) && (
                  <CategoryBadge category={categories.find(c => c.id === selected.categoryId)!} />
                )}
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  {selected.durationMinutes}m
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Select a task to focus on...</span>
          )}
        </div>
        {!disabled && (
          <ChevronDown
            size={16}
            className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 card-elevated border border-primary/20 rounded-lg shadow-elevated z-50 max-h-72 overflow-y-auto scrollbar-thin fade-in">
          {tasks.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No pending tasks — all done! 🎉
            </div>
          ) : (
            tasks.map(task => {
              const cat = categories.find(c => c.id === task.categoryId);
              const isSelected = task.id === selectedTaskId;
              return (
                <button
                  key={`sel-${task.id}`}
                  onClick={() => { onSelect(task.id); setOpen(false); }}
                  className={`
                    w-full flex items-start gap-3 px-4 py-3 text-left
                    hover:bg-muted/50 transition-colors duration-100
                    border-b border-border last:border-0
                    ${isSelected ? 'bg-primary/10' : ''}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <PriorityBadge priority={task.priority} />
                      {cat && <CategoryBadge category={cat} />}
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock size={10} />
                        {task.durationMinutes}m
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}