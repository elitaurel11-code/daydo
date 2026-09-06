'use client';

import React, { useState } from 'react';
import { DayDoStore } from '@/lib/store';
import {
  Volume2,
  Sparkles,
  Bell,
  Flame,
  Play,
  Target,
  Check,
} from 'lucide-react';

interface PreferencesPanelProps {
  preferences: DayDoStore['preferences'];
  onUpdate: (prefs: Partial<DayDoStore['preferences']>) => void;
}

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-background
        disabled:opacity-40 disabled:cursor-not-allowed
        ${checked ? 'bg-primary' : 'bg-muted border border-border'}
      `}
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm
          transform transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-4' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

export default function PreferencesPanel({ preferences, onUpdate }: PreferencesPanelProps) {
  const [saved, setSaved] = useState(false);
  const [localPrefs, setLocalPrefs] = useState({ ...preferences });

  const handleChange = <K extends keyof typeof localPrefs>(key: K, value: typeof localPrefs[K]) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate(localPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">Preferences</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize how DayDo behaves and notifies you
        </p>
      </div>

      {/* Experience */}
      <div className="card-elevated p-5 space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Experience</h3>

        <div className="space-y-4">
          {/* Sound */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-info/15 border border-info/20 flex items-center justify-center flex-shrink-0">
                <Volume2 size={15} className="text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Sound effects</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Play a chime when a focus session ends
                </p>
              </div>
            </div>
            <Toggle
              checked={localPrefs.soundEnabled}
              onChange={val => handleChange('soundEnabled', val)}
            />
          </div>

          {/* Confetti */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={15} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Confetti celebrations</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Trigger confetti animation when a task is completed
                </p>
              </div>
            </div>
            <Toggle
              checked={localPrefs.confettiEnabled}
              onChange={val => handleChange('confettiEnabled', val)}
            />
          </div>

          {/* Auto-start timer */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Play size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Auto-start timer</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automatically start the timer when you open the Focus Timer
                </p>
              </div>
            </div>
            <Toggle
              checked={localPrefs.timerAutoStart}
              onChange={val => handleChange('timerAutoStart', val)}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-elevated p-5 space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notifications</h3>

        <div className="space-y-4">
          {/* Daily reminder */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/15 border border-success/20 flex items-center justify-center flex-shrink-0">
                <Bell size={15} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Daily reminder</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get a reminder to check your task list each morning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={localPrefs.reminderTime}
                onChange={e => handleChange('reminderTime', e.target.value)}
                className="
                  px-2 py-1 rounded-lg bg-input border border-border text-foreground text-xs
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                  transition-all duration-150 tabular-nums
                "
              />
            </div>
          </div>

          {/* Streak notifications */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/15 border border-warning/20 flex items-center justify-center flex-shrink-0">
                <Flame size={15} className="text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Streak notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Alert when your streak is at risk of breaking
                </p>
              </div>
            </div>
            <Toggle
              checked={localPrefs.streakNotifications}
              onChange={val => handleChange('streakNotifications', val)}
            />
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="card-elevated p-5 space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Goals</h3>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Target size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Daily task goal</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Target number of tasks to complete each day
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleChange('dailyGoal', Math.max(1, localPrefs.dailyGoal - 1))}
              className="w-7 h-7 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-150 active:scale-90 flex items-center justify-center text-sm font-bold"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-bold text-foreground tabular-nums">
              {localPrefs.dailyGoal}
            </span>
            <button
              type="button"
              onClick={() => handleChange('dailyGoal', Math.min(20, localPrefs.dailyGoal + 1))}
              className="w-7 h-7 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-150 active:scale-90 flex items-center justify-center text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <div className="flex items-center gap-1.5 text-success text-sm fade-in">
            <Check size={14} />
            <span className="font-medium">Preferences saved!</span>
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 glow-primary transition-all duration-150 active:scale-95"
        >
          <Check size={14} />
          Save Preferences
        </button>
      </div>
    </div>
  );
}