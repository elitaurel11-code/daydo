import AppLayout from '@/components/AppLayout';
import { Suspense } from 'react';
import FocusTimerClient from './components/FocusTimerClient';

export default function FocusTimerPage() {
  return (
    <AppLayout activePath="/focus-timer">
      <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>}>
        <FocusTimerClient />
      </Suspense>
    </AppLayout>
  );
}