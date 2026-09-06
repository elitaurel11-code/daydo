'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Category } from '@/lib/store';
import PriorityBadge from '@/components/ui/PriorityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { GripVertical, CheckCircle2, Circle, Trash2, Timer, Clock, RotateCcw, Play, Pause, Square, StickyNote, Check, X,  } from 'lucide-react';

interface SortableTaskItemProps {
  task: Task;
  category?: Category;
  isCompleting: boolean;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  isDragDisabled?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SortableTaskItem({
  task,
  category,
  isCompleting,
  onComplete,
  onUncomplete,
  onDelete,
  onUpdate,
  isDragDisabled = false,
}: SortableTaskItemProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(task.description || '');
  const [editingNotes, setEditingNotes] = useState(false);

  // Timer state
  const totalSeconds = task.durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    if (elapsedRef.current > 0) {
      const minutesSpent = Math.round(elapsedRef.current / 60);
      if (minutesSpent > 0) {
        onUpdate(task.id, { focusedMinutes: task.focusedMinutes + minutesSpent });
      }
      elapsedRef.current = 0;
    }
    setSecondsLeft(totalSeconds);
    setTimerStarted(false);
  }, [stopTimer, task.id, task.focusedMinutes, totalSeconds, onUpdate]);

  const startTimer = useCallback(() => {
    if (secondsLeft <= 0) return;
    setIsRunning(true);
    setTimerStarted(true);
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          const minutesSpent = Math.round(elapsedRef.current / 60);
          if (minutesSpent > 0) {
            onUpdate(task.id, { focusedMinutes: task.focusedMinutes + minutesSpent });
          }
          elapsedRef.current = 0;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [secondsLeft, task.id, task.focusedMinutes, onUpdate]);

  const pauseTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset timer if duration changes
  useEffect(() => {
    if (!isRunning && !timerStarted) {
      setSecondsLeft(task.durationMinutes * 60);
    }
  }, [task.durationMinutes, isRunning, timerStarted]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragDisabled || task.status === 'completed',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCompleted = task.status === 'completed';
  const focusPct = task.durationMinutes > 0
    ? Math.min(Math.round((task.focusedMinutes / task.durationMinutes) * 100), 100)
    : 0;

  const timerPct = totalSeconds > 0
    ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)
    : 0;

  const handleSaveNotes = () => {
    onUpdate(task.id, { description: notesValue });
    setEditingNotes(false);
  };

  const handleCancelNotes = () => {
    setNotesValue(task.description || '');
    setEditingNotes(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        card-elevated card-hover group
        ${isDragging ? 'task-item-dragging z-50' : ''}
        ${isCompleting ? 'task-complete-exit' : ''}
        ${isCompleted ? 'opacity-60' : ''}
        transition-all duration-200
      `}
    >
      <div className="flex items-start gap-3 p-3.5">
        {/* Drag handle */}
        {!isDragDisabled && !isCompleted && (
          <div
            {...attributes}
            {...listeners}
            className="drag-handle flex-shrink-0 mt-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <GripVertical size={16} />
          </div>
        )}
        {(isDragDisabled || isCompleted) && (
          <div className="w-4 flex-shrink-0" />
        )}

        {/* Checkbox */}
        <button
          onClick={() => isCompleted ? onUncomplete(task.id) : onComplete(task.id)}
          className="flex-shrink-0 mt-0.5 transition-all duration-150 active:scale-90"
          title={isCompleted ? 'Mark as pending' : 'Complete task'}
        >
          {isCompleted ? (
            <CheckCircle2 size={20} className="text-success" />
          ) : (
            <Circle size={20} className="text-muted-foreground/40 hover:text-primary transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium leading-snug ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </p>

              <div className="flex items-center flex-wrap gap-1.5 mt-2">
                <PriorityBadge priority={task.priority} />
                {category && <CategoryBadge category={category} />}
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock size={10} />
                  {task.durationMinutes}m
                </span>
                {task.focusedMinutes > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-primary">
                    <Timer size={10} />
                    {task.focusedMinutes}m focused
                  </span>
                )}
              </div>

              {/* Focus progress bar */}
              {task.focusedMinutes > 0 && !isCompleted && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60 transition-all duration-500"
                      style={{ width: `${focusPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">{focusPct}%</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {/* Notes toggle */}
              <button
                onClick={() => { setShowNotes(v => !v); if (!showNotes) setEditingNotes(false); }}
                className={`p-1.5 rounded-md transition-all duration-150 ${showNotes ? 'text-accent bg-accent/10' : 'text-muted-foreground hover:text-accent hover:bg-accent/10'}`}
                title={showNotes ? 'Hide notes' : 'Add / view notes'}
              >
                <StickyNote size={14} />
              </button>

              {/* Timer toggle */}
              {!isCompleted && (
                <button
                  onClick={() => setShowTimer(v => !v)}
                  className={`p-1.5 rounded-md transition-all duration-150 ${showTimer ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
                  title={showTimer ? 'Hide timer' : 'Start focus timer'}
                >
                  <Timer size={14} />
                </button>
              )}

              {/* Uncomplete */}
              {isCompleted && (
                <button
                  onClick={() => onUncomplete(task.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-150"
                  title="Mark as pending"
                >
                  <RotateCcw size={14} />
                </button>
              )}

              {/* Delete */}
              {!showDelete ? (
                <button
                  onClick={() => setShowDelete(true)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-150"
                  title="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-2 py-1 rounded-md text-[10px] font-medium bg-danger/20 text-danger hover:bg-danger/30 transition-all duration-150"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDelete(false)}
                    className="px-2 py-1 rounded-md text-[10px] font-medium bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Inline Timer */}
          {showTimer && !isCompleted && (
            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/15 fade-in">
              <div className="flex items-center justify-between gap-3">
                {/* Timer ring + display */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/30" />
                      <circle
                        cx="24" cy="24" r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPct / 100)}`}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ${isRunning ? 'text-primary' : secondsLeft === 0 ? 'text-success' : 'text-primary/50'}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isRunning ? (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      ) : secondsLeft === 0 ? (
                        <CheckCircle2 size={14} className="text-success" />
                      ) : (
                        <Timer size={12} className="text-primary/60" />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className={`text-2xl font-mono font-bold tabular-nums leading-none ${isRunning ? 'text-primary' : secondsLeft === 0 ? 'text-success' : 'text-foreground'}`}>
                      {formatTime(secondsLeft)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {secondsLeft === 0 ? '🎉 Done!' : isRunning ? 'Focusing…' : timerStarted ? 'Paused' : `${task.durationMinutes}m session`}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                  {secondsLeft > 0 && (
                    <>
                      {!isRunning ? (
                        <button
                          onClick={startTimer}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all duration-150 active:scale-95"
                        >
                          <Play size={11} />
                          {timerStarted ? 'Resume' : 'Start'}
                        </button>
                      ) : (
                        <button
                          onClick={pauseTimer}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-foreground hover:bg-muted/80 transition-all duration-150 active:scale-95"
                        >
                          <Pause size={11} />
                          Pause
                        </button>
                      )}
                    </>
                  )}
                  {timerStarted && (
                    <button
                      onClick={resetTimer}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
                      title="Reset timer"
                    >
                      <Square size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Timer progress bar */}
              {timerStarted && (
                <div className="mt-2.5 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${timerPct}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Inline Notes */}
          {showNotes && (
            <div className="mt-3 fade-in">
              {editingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={notesValue}
                    onChange={e => setNotesValue(e.target.value)}
                    rows={3}
                    placeholder="Add notes, links, reminders…"
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground text-xs placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-150"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleSaveNotes}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-accent/20 text-accent hover:bg-accent/30 transition-all duration-150"
                    >
                      <Check size={11} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelNotes}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
                    >
                      <X size={11} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingNotes(true)}
                  className="group/notes cursor-text min-h-[2.5rem] px-3 py-2 rounded-lg border border-dashed border-border hover:border-accent/40 hover:bg-accent/5 transition-all duration-150"
                >
                  {task.description ? (
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {task.description}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/40 italic">
                      Click to add notes…
                    </p>
                  )}
                  <span className="text-[10px] text-accent/60 opacity-0 group-hover/notes:opacity-100 transition-opacity mt-1 block">
                    Click to edit
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}