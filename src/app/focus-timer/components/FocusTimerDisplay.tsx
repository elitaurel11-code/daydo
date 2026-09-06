'use client';

import React from 'react';
import { Task, Category } from '@/lib/store';
import ProgressRing from '@/components/ui/ProgressRing';
import PriorityBadge from '@/components/ui/PriorityBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Timer,
  AlertCircle,
} from 'lucide-react';

interface FocusTimerDisplayProps {
  selectedTask: Task | undefined;
  categories: Category[];
  remainingSeconds: number;
  totalSeconds: number;
  progressPct: number;
  isRunning: boolean;
  sessionCompleted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onMarkComplete: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FocusTimerDisplay({
  selectedTask,
  categories,
  remainingSeconds,
  totalSeconds,
  progressPct,
  isRunning,
  sessionCompleted,
  onStart,
  onPause,
  onReset,
  onMarkComplete,
}: FocusTimerDisplayProps) {
  const category = categories.find(c => c.id === selectedTask?.categoryId);
  const isFinished = remainingSeconds === 0;

  const ringColor = isFinished
    ? 'var(--success)'
    : isRunning
    ? 'var(--primary)'
    : 'var(--muted-foreground)';

  return (
    <div className="card-elevated p-6 flex flex-col items-center gap-6">
      {/* Task info */}
      {selectedTask ? (
        <div className="w-full text-center space-y-2">
          <p className="text-base font-semibold text-foreground leading-snug max-w-md mx-auto">
            {selectedTask.title}
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <PriorityBadge priority={selectedTask.priority} size="md" />
            {category && <CategoryBadge category={category} size="md" />}
          </div>
          {selectedTask.description && (
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">{selectedTask.description}</p>
          )}
        </div>
      ) : (
        <div className="w-full text-center p-4 rounded-lg bg-muted/50 border border-dashed border-border">
          <AlertCircle size={20} className="text-muted-foreground mx-auto mb-1.5" />
          <p className="text-sm text-muted-foreground">Select a task above to start focusing</p>
        </div>
      )}

      {/* Timer ring */}
      <div className={`${isRunning ? 'timer-pulse-active' : ''}`}>
        <ProgressRing
          percentage={progressPct}
          size={220}
          strokeWidth={10}
          color={ringColor}
          trackColor="rgba(255,255,255,0.06)"
        >
          <div className="text-center">
            <div className="font-mono-timer text-5xl font-bold text-foreground tabular-nums leading-none">
              {formatTime(remainingSeconds)}
            </div>
            <div className="text-xs text-muted-foreground mt-2 tabular-nums">
              {formatTime(totalSeconds)} total
            </div>
            {isRunning && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] text-primary font-medium">FOCUSING</span>
              </div>
            )}
            {sessionCompleted && !isFinished && (
              <div className="text-[10px] text-accent font-medium mt-2">PAUSED</div>
            )}
            {isFinished && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 size={12} className="text-success" />
                <span className="text-[10px] text-success font-medium">SESSION DONE!</span>
              </div>
            )}
          </div>
        </ProgressRing>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Reset */}
        <button
          onClick={onReset}
          disabled={remainingSeconds === totalSeconds && !isRunning}
          className="
            flex items-center justify-center w-11 h-11 rounded-full
            bg-muted border border-border text-muted-foreground
            hover:text-foreground hover:border-border/80 hover:bg-muted/80
            transition-all duration-150 active:scale-90
            disabled:opacity-30 disabled:cursor-not-allowed
          "
          title="Reset timer"
        >
          <RotateCcw size={16} />
        </button>

        {/* Play/Pause */}
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!selectedTask || isFinished}
            className="
              flex items-center justify-center w-16 h-16 rounded-full
              bg-primary text-primary-foreground
              hover:opacity-90 glow-primary
              transition-all duration-150 active:scale-90
              disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
            "
            title={isFinished ? 'Session complete — reset to start again' : 'Start focus session'}
          >
            <Play size={24} className="ml-1" />
          </button>
        ) : (
          <button
            onClick={onPause}
            className="
              flex items-center justify-center w-16 h-16 rounded-full
              bg-accent text-accent-foreground
              hover:opacity-90
              transition-all duration-150 active:scale-90
            "
            title="Pause focus session"
          >
            <Pause size={24} />
          </button>
        )}

        {/* Mark complete */}
        <button
          onClick={onMarkComplete}
          disabled={!selectedTask || selectedTask.status === 'completed'}
          className="
            flex items-center justify-center w-11 h-11 rounded-full
            bg-success/15 border border-success/30 text-success
            hover:bg-success/25 hover:border-success/50
            transition-all duration-150 active:scale-90
            disabled:opacity-30 disabled:cursor-not-allowed
          "
          title="Mark task as completed"
        >
          <CheckCircle2 size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Session progress</span>
          <span className="tabular-nums">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progressPct}%`,
              background: isFinished
                ? 'var(--success)'
                : 'linear-gradient(90deg, var(--primary), var(--primary-light))',
            }}
          />
        </div>
      </div>

      {/* Focus tip */}
      {isRunning && (
        <div className="w-full px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-center fade-in">
          <div className="flex items-center justify-center gap-2">
            <Timer size={12} className="text-primary" />
            <p className="text-xs text-primary-light">Put your phone down and stay in the zone 🎯</p>
          </div>
        </div>
      )}
    </div>
  );
}