'use client';

import { useState, useEffect, useCallback } from 'react';
import { DayDoStore, defaultStore, Task, Category, FocusSession, TaskStatus } from './store';

const STORAGE_KEY = 'daydo-store';

function loadStore(): DayDoStore {
  if (typeof window === 'undefined') return defaultStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore;
    return JSON.parse(raw) as DayDoStore;
  } catch {
    return defaultStore;
  }
}

function saveStore(store: DayDoStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage full or unavailable
  }
}

export function useStore() {
  const [store, setStore] = useState<DayDoStore>(defaultStore);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadStore();
    setStore(loaded);
    setHydrated(true);
  }, []);

  const update = useCallback((updater: (prev: DayDoStore) => DayDoStore) => {
    setStore(prev => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'order' | 'focusedMinutes' | 'status'>) => {
    update(prev => {
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        order: prev.tasks.length,
        focusedMinutes: 0,
        status: 'pending',
      };
      return { ...prev, tasks: [...prev.tasks, newTask] };
    });
  }, [update]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, [update]);

  const deleteTask = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  }, [update]);

  const completeTask = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id
          ? { ...t, status: 'completed' as TaskStatus, completedAt: new Date().toISOString() }
          : t
      ),
    }));
  }, [update]);

  const uncompleteTask = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id
          ? { ...t, status: 'pending' as TaskStatus, completedAt: undefined }
          : t
      ),
    }));
  }, [update]);

  const reorderTasks = useCallback((tasks: Task[]) => {
    update(prev => ({ ...prev, tasks }));
  }, [update]);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    update(prev => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: `cat-${Date.now()}` }],
    }));
  }, [update]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    update(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, [update]);

  const deleteCategory = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }));
  }, [update]);

  const addFocusSession = useCallback((session: Omit<FocusSession, 'id'>) => {
    update(prev => ({
      ...prev,
      focusSessions: [...prev.focusSessions, { ...session, id: `fs-${Date.now()}` }],
    }));
  }, [update]);

  const updatePreferences = useCallback((prefs: Partial<DayDoStore['preferences']>) => {
    update(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  }, [update]);

  const updateFocusedMinutes = useCallback((taskId: string, minutes: number) => {
    update(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, focusedMinutes: t.focusedMinutes + minutes } : t
      ),
    }));
  }, [update]);

  return {
    store,
    hydrated,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    reorderTasks,
    addCategory,
    updateCategory,
    deleteCategory,
    addFocusSession,
    updatePreferences,
    updateFocusedMinutes,
  };
}