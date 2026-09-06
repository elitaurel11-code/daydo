import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activePath: string;
}

export default function AppLayout({ children, activePath }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activePath={activePath} />
      <main className="flex-1 min-w-0 overflow-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}