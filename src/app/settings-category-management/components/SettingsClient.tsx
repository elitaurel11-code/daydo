'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import CategoryManagement from './CategoryManagement';
import PreferencesPanel from './PreferencesPanel';
import { Tag, Sliders, Info } from 'lucide-react';

type SettingsTab = 'categories' | 'preferences' | 'about';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'categories', label: 'Categories', icon: <Tag size={16} /> },
  { id: 'preferences', label: 'Preferences', icon: <Sliders size={16} /> },
  { id: 'about', label: 'About', icon: <Info size={16} /> },
];

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('categories');
  const {
    store,
    hydrated,
    addCategory,
    updateCategory,
    deleteCategory,
    updatePreferences,
  } = useStore();

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-xl w-64" />
          <div className="h-10 bg-muted rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={`skel-cat-${i}`} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your DayDo experience</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab nav */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={`stab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 active:scale-95 text-left w-full
                  ${activeTab === tab.id
                    ? 'bg-primary/15 text-primary border border-primary/20' :'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'categories' && (
            <CategoryManagement
              categories={store.categories}
              tasks={store.tasks}
              onAdd={addCategory}
              onUpdate={updateCategory}
              onDelete={deleteCategory}
            />
          )}
          {activeTab === 'preferences' && (
            <PreferencesPanel
              preferences={store.preferences}
              onUpdate={updatePreferences}
            />
          )}
          {activeTab === 'about' && (
            <AboutPanel />
          )}
        </div>
      </div>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="card-elevated p-6 space-y-4">
      <h2 className="text-base font-semibold text-foreground">About DayDo</h2>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>DayDo is your personal daily task planner — built for focus, consistency, and progress.</p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="px-4 py-3 rounded-lg bg-muted border border-border">
            <div className="text-xs text-muted-foreground">Version</div>
            <div className="text-sm font-semibold text-foreground mt-0.5">1.0.0</div>
          </div>
          <div className="px-4 py-3 rounded-lg bg-muted border border-border">
            <div className="text-xs text-muted-foreground">Build</div>
            <div className="text-sm font-semibold text-foreground mt-0.5">Sep 2026</div>
          </div>
        </div>
        <div className="pt-2 space-y-1.5">
          <p className="text-xs">🎯 Built for personal productivity — no accounts, no cloud, just your data.</p>
          <p className="text-xs">💾 All data is stored locally in your browser.</p>
          <p className="text-xs">🔒 Your tasks never leave your device.</p>
        </div>
      </div>
    </div>
  );
}