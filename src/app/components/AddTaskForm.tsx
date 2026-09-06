'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Category, Priority, Task } from '@/lib/store';
import { Check, X } from 'lucide-react';

interface AddTaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  categoryId: string;
  durationMinutes: number;
}

interface AddTaskFormProps {
  categories: Category[];
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'order' | 'focusedMinutes' | 'status'>) => void;
  onCancel: () => void;
}

export default function AddTaskForm({ categories, onAdd, onCancel }: AddTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddTaskFormData>({
    defaultValues: {
      priority: 'medium',
      categoryId: categories[0]?.id || '',
      durationMinutes: 30,
    },
  });

  const onSubmit = (data: AddTaskFormData) => {
    onAdd({
      title: data.title,
      description: data.description,
      priority: data.priority,
      categoryId: data.categoryId,
      durationMinutes: Number(data.durationMinutes),
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-elevated p-5 border border-primary/20 bg-gradient-to-br from-card to-primary/5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">New Task</h3>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="task-title">
            Task title <span className="text-danger">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="e.g. Study for Physics exam — Chapter 12"
            className={`
              w-full px-3 py-2.5 rounded-lg bg-input border text-foreground text-sm
              placeholder:text-muted-foreground/50
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
              transition-all duration-150
              ${errors.title ? 'border-danger/50' : 'border-border'}
            `}
            {...register('title', {
              required: 'Task title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
              maxLength: { value: 120, message: 'Title must be under 120 characters' },
            })}
          />
          {errors.title && (
            <p className="text-danger text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="task-desc">
            Notes <span className="text-muted-foreground/50 font-normal">(optional)</span>
          </label>
          <textarea
            id="task-desc"
            rows={2}
            placeholder="Any extra details or context..."
            className="
              w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm
              placeholder:text-muted-foreground/50 resize-none
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
              transition-all duration-150
            "
            {...register('description')}
          />
        </div>

        {/* Row: Priority + Category + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="
                w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                transition-all duration-150 cursor-pointer
              "
              {...register('priority')}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="task-category">
              Category
            </label>
            <select
              id="task-category"
              className="
                w-full px-3 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                transition-all duration-150 cursor-pointer
              "
              {...register('categoryId', { required: true })}
            >
              {categories.map(cat => (
                <option key={`opt-${cat.id}`} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="task-duration">
              Duration (minutes)
            </label>
            <input
              id="task-duration"
              type="number"
              min={1}
              max={480}
              className={`
                w-full px-3 py-2.5 rounded-lg bg-input border text-foreground text-sm tabular-nums
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                transition-all duration-150
                ${errors.durationMinutes ? 'border-danger/50' : 'border-border'}
              `}
              {...register('durationMinutes', {
                required: 'Duration is required',
                min: { value: 1, message: 'Min 1 minute' },
                max: { value: 480, message: 'Max 480 minutes' },
              })}
            />
            {errors.durationMinutes && (
              <p className="text-danger text-xs mt-1">{errors.durationMinutes.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all duration-150 active:scale-95"
        >
          <X size={14} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
        >
          {isSubmitting ? (
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Add Task
        </button>
      </div>
    </form>
  );
}