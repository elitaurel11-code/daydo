'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { CheckSquare, Timer, Settings, ChevronLeft, ChevronRight, Flame, BarChart2,  } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Daily Planner',
    href: '/',
    icon: <CheckSquare size={20} />,
  },
  {
    label: 'Focus Timer',
    href: '/focus-timer',
    icon: <Timer size={20} />,
  },
  {
    label: 'Settings',
    href: '/settings-category-management',
    icon: <Settings size={20} />,
  },
];

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border text-foreground hover:border-primary/50 transition-all duration-150 active:scale-95"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <BarChart2 size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col
          h-screen
          bg-card border-r border-border
          sidebar-transition
          ${collapsed ? 'w-[68px]' : 'w-[220px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform lg:transition-none
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center px-2' : ''}`}>
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-bold text-lg text-foreground tracking-tight">DayDo</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={`nav-${item.href}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-150
                  group
                  ${isActive
                    ? 'bg-primary/15 text-primary border border-primary/20' :'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                  }
                  ${collapsed ? 'justify-center px-2' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`
                    absolute ${collapsed ? 'top-1 right-1' : 'right-3'}
                    flex items-center justify-center
                    min-w-[18px] h-[18px] px-1
                    rounded-full text-[10px] font-bold
                    bg-primary text-primary-foreground
                  `}>
                    {item.badge}
                  </span>
                )}
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Streak indicator */}
        {!collapsed && (
          <div className="mx-2 mb-3 p-3 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-accent streak-fire" />
              <div>
                <div className="text-xs text-muted-foreground">Current Streak</div>
                <div className="text-sm font-bold text-accent tabular-nums">7 days</div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              w-full flex items-center justify-center gap-2 p-2 rounded-lg
              text-muted-foreground hover:text-foreground hover:bg-muted
              transition-all duration-150 active:scale-95
              text-xs font-medium
            `}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}