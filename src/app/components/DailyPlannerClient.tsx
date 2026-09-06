'use client';

import React, { useState, useCallback } from 'react';
import { useStore } from '@/lib/useStore';
import { Task, Priority } from '@/lib/store';
import DailyProgressHero from './DailyProgressHero';
import TaskFilters from './TaskFilters';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import { Plus } from 'lucide-react';

export default function DailyPlannerClient() {
  const {
    store,
    hydrated,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    reorderTasks,
  } = useStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activePriority, setActivePriority] = useState<Priority | 'all'>('all');
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  const handleCompleteTask = useCallback((taskId: string) => {
    setCompletingTaskId(taskId);
    setTimeout(() => {
      completeTask(taskId);
      if (store.preferences.confettiEnabled) {
        setConfettiTrigger(true);
        setTimeout(() => setConfettiTrigger(false), 100);
      }
      setCompletingTaskId(null);
    }, 350);
  }, [completeTask, store.preferences.confettiEnabled]);

  const todayTasks = store.tasks.filter(t => {
    const matchCat = activeFilter === 'all' || t.categoryId === activeFilter;
    const matchPri = activePriority === 'all' || t.priority === activePriority;
    return matchCat && matchPri;
  });

  const pendingTasks = todayTasks.filter(t => t.status !== 'completed').sort((a, b) => a.order - b.order);
  const completedTasks = todayTasks.filter(t => t.status === 'completed').sort((a, b) => a.order - b.order);

  const totalTasks = store.tasks.length;
  const completedCount = store.tasks.filter(t => t.status === 'completed').length;
  const completionPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const totalFocusMinutes = store.focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-12 bg-muted rounded-xl" />
          {[1,2,3,4,5].map(i => (
            <div key={`skel-${i}`} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-screen-2xl mx-auto">
      <ConfettiEffect trigger={confettiTrigger} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Planner</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sunday, September 6, 2026</p>
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
            transition-all duration-150 active:scale-95
            ${showAddForm
              ? 'bg-muted text-muted-foreground border border-border'
              : 'bg-primary text-primary-foreground glow-primary hover:opacity-90'
            }
          `}
        >
          <Plus size={16} className={`transition-transform duration-200 ${showAddForm ? 'rotate-45' : ''}`} />
          {showAddForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* Progress Hero */}
      <DailyProgressHero
        completedCount={completedCount}
        totalTasks={totalTasks}
        completionPct={completionPct}
        streak={store.streak}
        longestStreak={store.longestStreak}
        focusMinutes={totalFocusMinutes}
        dailyGoal={store.preferences.dailyGoal}
      />

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-4 slide-up">
          <AddTaskForm
            categories={store.categories}
            onAdd={(task) => {
              addTask(task);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Filters */}
      <TaskFilters
        categories={store.categories}
        activeFilter={activeFilter}
        activePriority={activePriority}
        onFilterChange={setActiveFilter}
        onPriorityChange={setActivePriority}
        taskCounts={store.tasks.reduce((acc, t) => {
          acc[t.categoryId] = (acc[t.categoryId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)}
      />

      {/* Task Lists */}
      <div className="space-y-6 mt-4">
        {/* Pending tasks */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pending
            </h2>
            <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium tabular-nums">
              {pendingTasks.length}
            </span>
          </div>
          {pendingTasks.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-foreground font-semibold">All caught up!</p>
              <p className="text-muted-foreground text-sm mt-1">No pending tasks. Add a new one or take a break.</p>
            </div>
          ) : (
            <TaskList
              tasks={pendingTasks}
              categories={store.categories}
              completingTaskId={completingTaskId}
              onComplete={handleCompleteTask}
              onUncomplete={uncompleteTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onReorder={reorderTasks}
              allTasks={store.tasks}
            />
          )}
        </div>

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Completed
              </h2>
              <span className="px-1.5 py-0.5 rounded-md bg-success/20 text-success text-xs font-medium tabular-nums">
                {completedTasks.length}
              </span>
            </div>
            <TaskList
              tasks={completedTasks}
              categories={store.categories}
              completingTaskId={completingTaskId}
              onComplete={handleCompleteTask}
              onUncomplete={uncompleteTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onReorder={reorderTasks}
              allTasks={store.tasks}
              isCompletedSection
            />
          </div>
        )}
      </div>
    </div>
  );
}