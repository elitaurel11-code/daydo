'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Category, Task } from '@/lib/store';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Tag,
  BookOpen,
  Dumbbell,
  Code2,
  User,
  Briefcase,
  Heart,
  Music,
  Camera,
  Coffee,
  Globe,
  Star,
  Zap,
} from 'lucide-react';

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4',
  '#3B82F6', '#6366F1', '#7C3AED', '#A855F7',
  '#EC4899', '#F43F5E', '#64748B', '#78716C',
];

const ICON_OPTIONS = [
  { name: 'BookOpen', icon: <BookOpen size={16} /> },
  { name: 'Dumbbell', icon: <Dumbbell size={16} /> },
  { name: 'Code2', icon: <Code2 size={16} /> },
  { name: 'User', icon: <User size={16} /> },
  { name: 'Briefcase', icon: <Briefcase size={16} /> },
  { name: 'Heart', icon: <Heart size={16} /> },
  { name: 'Music', icon: <Music size={16} /> },
  { name: 'Camera', icon: <Camera size={16} /> },
  { name: 'Coffee', icon: <Coffee size={16} /> },
  { name: 'Globe', icon: <Globe size={16} /> },
  { name: 'Star', icon: <Star size={16} /> },
  { name: 'Zap', icon: <Zap size={16} /> },
];

interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
}

interface CategoryManagementProps {
  categories: Category[];
  tasks: Task[];
  onAdd: (cat: Omit<Category, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Category>) => void;
  onDelete: (id: string) => void;
}

function CategoryIcon({ iconName, size = 16 }: { iconName: string; size?: number }) {
  const found = ICON_OPTIONS.find(i => i.name === iconName);
  if (found) return <span>{found.icon}</span>;
  return <Tag size={size} />;
}

export default function CategoryManagement({
  categories,
  tasks,
  onAdd,
  onUpdate,
  onDelete,
}: CategoryManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[10]);
  const [selectedIcon, setSelectedIcon] = useState('Tag');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CategoryFormData>({
    defaultValues: { name: '', color: PRESET_COLORS[10], icon: 'Tag' },
  });

  const handleAdd = (data: CategoryFormData) => {
    onAdd({ name: data.name, color: selectedColor, icon: selectedIcon });
    reset();
    setSelectedColor(PRESET_COLORS[10]);
    setSelectedIcon('Tag');
    setShowAddForm(false);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setSelectedColor(cat.color);
    setSelectedIcon(cat.icon);
    setValue('name', cat.name);
  };

  const handleSaveEdit = (data: CategoryFormData) => {
    if (!editingId) return;
    onUpdate(editingId, { name: data.name, color: selectedColor, icon: selectedIcon });
    setEditingId(null);
    reset();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  const taskCount = (catId: string) => tasks.filter(t => t.categoryId === catId).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Task Categories</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create custom categories with color labels to organize your tasks
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(v => !v); setEditingId(null); }}
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-150 active:scale-95
            ${showAddForm
              ? 'bg-muted text-muted-foreground border border-border'
              : 'bg-primary text-primary-foreground glow-primary hover:opacity-90'
            }
          `}
        >
          <Plus size={14} className={`transition-transform duration-200 ${showAddForm ? 'rotate-45' : ''}`} />
          {showAddForm ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit(handleAdd)}
          className="card-elevated p-5 border border-primary/20 bg-gradient-to-br from-card to-primary/5 slide-up"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Create Category</h3>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5" htmlFor="cat-name">
                Category name <span className="text-danger">*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                placeholder="e.g. Meditation, Side Project, Reading..."
                className={`
                  w-full px-3 py-2.5 rounded-lg bg-input border text-foreground text-sm
                  placeholder:text-muted-foreground/50
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                  transition-all duration-150
                  ${errors.name ? 'border-danger/50' : 'border-border'}
                `}
                {...register('name', {
                  required: 'Category name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 30, message: 'Name must be under 30 characters' },
                })}
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Color label
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={`color-${color}`}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-7 h-7 rounded-full transition-all duration-150 active:scale-90
                      ${selectedColor === color ? 'color-swatch-selected scale-110' : 'hover:scale-105'}
                    `}
                    style={{ backgroundColor: color, color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: selectedColor }} />
                <span className="text-xs text-muted-foreground font-mono">{selectedColor}</span>
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(ic => (
                  <button
                    key={`icon-${ic.name}`}
                    type="button"
                    onClick={() => setSelectedIcon(ic.name)}
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      transition-all duration-150 active:scale-90
                      ${selectedIcon === ic.name
                        ? 'border-2 text-foreground'
                        : 'bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                      }
                    `}
                    style={selectedIcon === ic.name ? {
                      backgroundColor: `${selectedColor}20`,
                      borderColor: selectedColor,
                      color: selectedColor,
                    } : undefined}
                    title={ic.name}
                  >
                    {ic.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wide">Preview</div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${selectedColor}20`,
                color: selectedColor,
                border: `1px solid ${selectedColor}40`,
              }}
            >
              <CategoryIcon iconName={selectedIcon} />
              {/* name preview from watched value */}
              <span>Category name</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all duration-150 active:scale-95"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 glow-primary transition-all duration-150 active:scale-95"
            >
              <Check size={14} />
              Create Category
            </button>
          </div>
        </form>
      )}

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {categories.map(cat => (
          <div
            key={`cat-card-${cat.id}`}
            className="card-elevated card-hover p-4 relative group"
          >
            {editingId === cat.id ? (
              /* Inline edit form */
              <form onSubmit={handleSubmit(handleSaveEdit)} className="space-y-3">
                <input
                  type="text"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-input border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  {...register('name', { required: true, minLength: 2, maxLength: 30 })}
                />
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_COLORS.slice(0, 8).map(color => (
                    <button
                      key={`edit-color-${color}`}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-5 h-5 rounded-full transition-all duration-150 ${selectedColor === color ? 'scale-125 ring-2 ring-offset-1 ring-offset-card' : ''}`}
                      style={{ backgroundColor: color, ringColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Check size={12} />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); reset(); }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:text-foreground active:scale-95 transition-all"
                  >
                    <X size={12} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[inherit]"
                  style={{ backgroundColor: cat.color }}
                />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <CategoryIcon iconName={cat.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{cat.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {taskCount(cat.id)} task{taskCount(cat.id) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150 active:scale-90"
                      title="Edit category"
                    >
                      <Pencil size={13} />
                    </button>
                    {deletingId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="px-1.5 py-1 rounded-md text-[10px] font-medium bg-danger/20 text-danger hover:bg-danger/30 transition-all duration-150"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-1.5 py-1 rounded-md text-[10px] font-medium bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150 active:scale-90"
                        title="Delete category — tasks using it will become uncategorized"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Color swatch bar */}
                <div className="mt-3 flex items-center gap-1.5">
                  <div
                    className="h-1.5 flex-1 rounded-full"
                    style={{ backgroundColor: `${cat.color}40` }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: cat.color,
                        width: `${Math.min((taskCount(cat.id) / Math.max(...categories.map(c => taskCount(c.id)), 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-mono font-medium"
                    style={{ color: cat.color }}
                  >
                    {cat.color}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="card-elevated p-10 text-center">
          <Tag size={28} className="text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">No categories yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create custom categories to organize your tasks by type — Study, Fitness, Coding, and more.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 glow-primary transition-all duration-150 active:scale-95 mx-auto"
          >
            <Plus size={14} />
            Create First Category
          </button>
        </div>
      )}
    </div>
  );
}