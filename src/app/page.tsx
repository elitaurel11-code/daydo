import AppLayout from '@/components/AppLayout';
import DailyPlannerClient from './components/DailyPlannerClient';

export default function DailyPlannerPage() {
  return (
    <AppLayout activePath="/">
      <DailyPlannerClient />
    </AppLayout>
  );
}