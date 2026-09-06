'use client';

import React from 'react';
import ProgressRing from '@/components/ui/ProgressRing';
import { Flame, Clock, Target, Trophy } from 'lucide-react';

interface DailyProgressHeroProps {
  completedCount: number;
  totalTasks: number;
  completionPct: number;
  streak: number;
  longestStreak: number;
  focusMinutes: number;
  dailyGoal: number;
}

export default function DailyProgressHero({
  completedCount,
  totalTasks,
  completionPct,
  streak,
  longestStreak,
  focusMinutes,
  dailyGoal,
}: DailyProgressHeroProps) {
  const focusHours = Math.floor(focusMinutes / 60);
  const focusMins = focusMinutes % 60;
  const focusDisplay = focusHours > 0 ? `${focusHours}h ${focusMins}m` : `${focusMins}m`;
  const goalPct = Math.min(Math.round((completedCount / dailyGoal) * 100), 100);

  const getMotivation = () => {
    if (completionPct === 100) return "🔥 Perfect day! All tasks done!";
    if (completionPct >= 75) return "Almost there — keep pushing!";
    if (completionPct >= 50) return "Great momentum — halfway done!";
    if (completionPct >= 25) return "Good start — keep going!";
    return "Let's get to work — you've got this!";
  };

  return (
    <div className="card-elevated p-5 mb-4 bg-gradient-to-br from-card via-card to-primary/5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* Progress Ring */}
        <div className="flex items-center gap-5">
          <ProgressRing
            percentage={completionPct}
            size={110}
            strokeWidth={9}
            color="var(--primary)"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground tabular-nums leading-none">{completionPct}%</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">done</div>
            </div>
          </ProgressRing>

          <div>
            <div className="text-lg font-bold text-foreground">
              {completedCount} / {totalTasks}
              <span className="text-muted-foreground font-normal text-sm ml-1">tasks</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">{getMotivation()}</p>

            {/* Daily progress bar */}
            <div className="mt-3 w-48">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Daily goal: {dailyGoal} tasks</span>
                <span className="text-[10px] text-primary font-medium tabular-nums">{goalPct}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="flex flex-wrap gap-3 lg:ml-auto">
          {/* Streak */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 min-w-[120px]">
            <Flame size={20} className="text-accent streak-fire flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-accent tabular-nums leading-none">{streak}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">day streak</div>
            </div>
          </div>

          {/* Longest streak */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 min-w-[120px]">
            <Trophy size={20} className="text-primary flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-primary-light tabular-nums leading-none">{longestStreak}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">best streak</div>
            </div>
          </div>

          {/* Focus time */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20 min-w-[120px]">
            <Clock size={20} className="text-success flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-success tabular-nums leading-none">{focusDisplay}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">focused today</div>
            </div>
          </div>

          {/* Remaining */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border min-w-[120px]">
            <Target size={20} className="text-muted-foreground flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-foreground tabular-nums leading-none">{totalTasks - completedCount}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}