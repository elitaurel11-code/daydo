'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/useStore';
import { Task } from '@/lib/store';
import FocusTimerDisplay from './FocusTimerDisplay';
import FocusSessionLog from './FocusSessionLog';
import TaskSelector from './TaskSelector';
import { useSearchParams } from 'next/navigation';
import ConfettiEffect from '@/components/ui/ConfettiEffect';

const QUOTES = [
  "The secret of getting ahead is getting started.",
  "Focus is not about saying yes. It\'s about saying no.",
  "One task at a time. One step at a time.",
  "Deep work is the ability to focus without distraction.",
  "You don't need more time, you need more focus.",
  "Small steps every day lead to massive results.",
  "Stay in the zone. Everything else can wait.",
];

export default function FocusTimerClient() {
  const { store, hydrated, addFocusSession, updateFocusedMinutes, completeTask } = useStore();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get('taskId');

  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepRef = useRef<AudioContext | null>(null);

  // Set initial task from URL param
  useEffect(() => {
    if (preselectedId && store.tasks.find(t => t.id === preselectedId && t.status !== 'completed')) {
      setSelectedTaskId(preselectedId);
      const task = store.tasks.find(t => t.id === preselectedId);
      if (task) {
        const secs = task.durationMinutes * 60;
        setTotalSeconds(secs);
        setRemainingSeconds(secs);
      }
    } else if (!selectedTaskId && store.tasks.length > 0) {
      const pending = store.tasks.find(t => t.status === 'pending');
      if (pending) {
        setSelectedTaskId(pending.id);
        const secs = pending.durationMinutes * 60;
        setTotalSeconds(secs);
        setRemainingSeconds(secs);
      }
    }
  }, [hydrated, preselectedId]);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(i => (i + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const playBeep = useCallback(() => {
    if (!store.preferences.soundEnabled) return;
    try {
      if (!beepRef.current) {
        beepRef.current = new AudioContext();
      }
      const ctx = beepRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio not available
    }
  }, [store.preferences.soundEnabled]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    setSessionCompleted(true);
    playBeep();

    if (sessionStartTime && selectedTaskId) {
      const minutesFocused = Math.round((Date.now() - sessionStartTime) / 60000);
      const task = store.tasks.find(t => t.id === selectedTaskId);
      if (task) {
        addFocusSession({
          taskId: selectedTaskId,
          taskTitle: task.title,
          durationMinutes: minutesFocused,
          completedAt: new Date().toISOString(),
        });
        updateFocusedMinutes(selectedTaskId, minutesFocused);
      }
    }

    if (store.preferences.confettiEnabled) {
      setConfettiTrigger(true);
      setTimeout(() => setConfettiTrigger(false), 100);
    }
  }, [sessionStartTime, selectedTaskId, store.tasks, store.preferences.confettiEnabled, addFocusSession, updateFocusedMinutes, playBeep]);

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleSessionComplete]);

  const handleStart = () => {
    setSessionStartTime(Date.now());
    setSessionCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (sessionStartTime && selectedTaskId) {
      const minutesFocused = Math.round((Date.now() - sessionStartTime) / 60000);
      if (minutesFocused > 0) {
        updateFocusedMinutes(selectedTaskId, minutesFocused);
      }
    }
    setSessionStartTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionCompleted(false);
    setRemainingSeconds(totalSeconds);
    setSessionStartTime(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTaskSelect = (taskId: string) => {
    if (isRunning) return;
    setSelectedTaskId(taskId);
    const task = store.tasks.find(t => t.id === taskId);
    if (task) {
      const secs = task.durationMinutes * 60;
      setTotalSeconds(secs);
      setRemainingSeconds(secs);
    }
    setSessionCompleted(false);
  };

  const handleMarkComplete = () => {
    if (selectedTaskId) {
      completeTask(selectedTaskId);
      if (store.preferences.confettiEnabled) {
        setConfettiTrigger(true);
        setTimeout(() => setConfettiTrigger(false), 100);
      }
    }
  };

  const selectedTask = store.tasks.find(t => t.id === selectedTaskId);
  const pendingTasks = store.tasks.filter(t => t.status !== 'completed');
  const progressPct = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-xl w-64" />
          <div className="h-80 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-screen-2xl mx-auto">
      <ConfettiEffect trigger={confettiTrigger} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Focus Timer</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Lock in and get it done — one task at a time</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Timer */}
        <div className="xl:col-span-2 space-y-4">
          {/* Quote */}
          <div className="card-elevated px-5 py-3 border-l-2 border-l-primary">
            <p className="text-sm text-muted-foreground italic fade-in" key={`quote-${quoteIndex}`}>
              "{QUOTES[quoteIndex]}"
            </p>
          </div>

          {/* Task selector */}
          <TaskSelector
            tasks={pendingTasks}
            categories={store.categories}
            selectedTaskId={selectedTaskId}
            onSelect={handleTaskSelect}
            disabled={isRunning}
          />

          {/* Timer display */}
          <FocusTimerDisplay
            selectedTask={selectedTask}
            categories={store.categories}
            remainingSeconds={remainingSeconds}
            totalSeconds={totalSeconds}
            progressPct={progressPct}
            isRunning={isRunning}
            sessionCompleted={sessionCompleted}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onMarkComplete={handleMarkComplete}
          />
        </div>

        {/* Right: Session log */}
        <div className="xl:col-span-1">
          <FocusSessionLog
            sessions={store.focusSessions}
            tasks={store.tasks}
          />
        </div>
      </div>
    </div>
  );
}