'use client';

import React from 'react';
import { FocusSession, Task } from '@/lib/store';
import { Clock, CheckCircle2, Zap, BarChart2 } from 'lucide-react';

interface FocusSessionLogProps {
  sessions: FocusSession[];
  tasks: Task[];
}

function formatSessionTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch {
    return '';
  }
}

export default function FocusSessionLog({ sessions, tasks }: FocusSessionLogProps) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div className="card-elevated p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Today's Sessions</h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
          <Zap size={12} className="text-primary" />
          <span className="text-xs font-bold text-primary tabular-nums">
            {totalHours > 0 ? `${totalHours}h ` : ''}{totalMins}m
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="px-3 py-2 rounded-lg bg-muted border border-border text-center">
          <div className="text-lg font-bold text-foreground tabular-nums">{sessions.length}</div>
          <div className="text-[10px] text-muted-foreground">sessions</div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-success/10 border border-success/20 text-center">
          <div className="text-lg font-bold text-success tabular-nums">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
          <div className="text-[10px] text-muted-foreground">completed</div>
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BarChart2 size={28} className="text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No sessions yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Start a focus session to track your work time
            </p>
          </div>
        ) : (
          sorted.map(session => (
            <div
              key={`log-${session.id}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/20 transition-colors duration-150"
            >
              <div className="w-7 h-7 rounded-full bg-success/15 border border-success/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 size={13} className="text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate leading-snug">
                  {session.taskTitle}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={9} />
                    {session.durationMinutes}m focused
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">
                    {formatSessionTime(session.completedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Encouragement */}
      {sessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            {sessions.length >= 3
              ? '🔥 You\'re on fire! Keep the momentum going!'
              : sessions.length >= 1
              ? '✨ Great start! Every session counts.' :''}
          </p>
        </div>
      )}
    </div>
  );
}