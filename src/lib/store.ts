// Backend integration point: replace this in-memory store with a persistent database (e.g. localStorage, IndexedDB, or a server API)

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  categoryId: string;
  durationMinutes: number;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  order: number;
  focusedMinutes: number;
}

export interface FocusSession {
  id: string;
  taskId: string;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
}

export interface DayDoStore {
  tasks: Task[];
  categories: Category[];
  focusSessions: FocusSession[];
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  preferences: {
    soundEnabled: boolean;
    confettiEnabled: boolean;
    reminderTime: string;
    streakNotifications: boolean;
    timerAutoStart: boolean;
    dailyGoal: number;
  };
}

export const defaultCategories: Category[] = [
  { id: 'cat-study', name: 'Study', color: '#3B82F6', icon: 'BookOpen' },
  { id: 'cat-fitness', name: 'Fitness', color: '#10B981', icon: 'Dumbbell' },
  { id: 'cat-coding', name: 'Coding', color: '#7C3AED', icon: 'Code2' },
  { id: 'cat-personal', name: 'Personal', color: '#F59E0B', icon: 'User' },
  { id: 'cat-work', name: 'Work', color: '#EF4444', icon: 'Briefcase' },
  { id: 'cat-health', name: 'Health', color: '#EC4899', icon: 'Heart' },
];

const today = new Date('2026-09-06');
const todayStr = today.toISOString();

export const defaultTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Study for Physics exam — Chapter 12 Electromagnetism',
    priority: 'urgent',
    categoryId: 'cat-study',
    durationMinutes: 90,
    status: 'pending',
    createdAt: todayStr,
    order: 0,
    focusedMinutes: 0,
  },
  {
    id: 'task-002',
    title: 'Morning gym session — chest & triceps',
    priority: 'high',
    categoryId: 'cat-fitness',
    durationMinutes: 60,
    status: 'completed',
    createdAt: todayStr,
    completedAt: todayStr,
    order: 1,
    focusedMinutes: 55,
  },
  {
    id: 'task-003',
    title: 'Implement binary search tree in TypeScript',
    priority: 'high',
    categoryId: 'cat-coding',
    durationMinutes: 45,
    status: 'pending',
    createdAt: todayStr,
    order: 2,
    focusedMinutes: 12,
  },
  {
    id: 'task-004',
    title: 'Read 30 pages of Atomic Habits',
    priority: 'medium',
    categoryId: 'cat-personal',
    durationMinutes: 30,
    status: 'completed',
    createdAt: todayStr,
    completedAt: todayStr,
    order: 3,
    focusedMinutes: 28,
  },
  {
    id: 'task-005',
    title: 'Review pull requests from yesterday',
    priority: 'high',
    categoryId: 'cat-work',
    durationMinutes: 25,
    status: 'pending',
    createdAt: todayStr,
    order: 4,
    focusedMinutes: 0,
  },
  {
    id: 'task-006',
    title: 'Take vitamins and drink 3L water',
    priority: 'medium',
    categoryId: 'cat-health',
    durationMinutes: 5,
    status: 'completed',
    createdAt: todayStr,
    completedAt: todayStr,
    order: 5,
    focusedMinutes: 3,
  },
  {
    id: 'task-007',
    title: 'Solve 3 LeetCode medium problems',
    priority: 'medium',
    categoryId: 'cat-coding',
    durationMinutes: 60,
    status: 'pending',
    createdAt: todayStr,
    order: 6,
    focusedMinutes: 0,
  },
  {
    id: 'task-008',
    title: 'Evening walk — 5km',
    priority: 'low',
    categoryId: 'cat-fitness',
    durationMinutes: 40,
    status: 'pending',
    createdAt: todayStr,
    order: 7,
    focusedMinutes: 0,
  },
  {
    id: 'task-009',
    title: 'Write weekly reflection journal entry',
    priority: 'low',
    categoryId: 'cat-personal',
    durationMinutes: 20,
    status: 'pending',
    createdAt: todayStr,
    order: 8,
    focusedMinutes: 0,
  },
];

export const defaultFocusSessions: FocusSession[] = [
  {
    id: 'fs-001',
    taskId: 'task-002',
    taskTitle: 'Morning gym session — chest & triceps',
    durationMinutes: 55,
    completedAt: '2026-09-06T07:55:00Z',
  },
  {
    id: 'fs-002',
    taskId: 'task-004',
    taskTitle: 'Read 30 pages of Atomic Habits',
    durationMinutes: 28,
    completedAt: '2026-09-06T09:28:00Z',
  },
  {
    id: 'fs-003',
    taskId: 'task-006',
    taskTitle: 'Take vitamins and drink 3L water',
    durationMinutes: 3,
    completedAt: '2026-09-06T08:03:00Z',
  },
];

export const defaultStore: DayDoStore = {
  tasks: defaultTasks,
  categories: defaultCategories,
  focusSessions: defaultFocusSessions,
  streak: 7,
  longestStreak: 14,
  lastActiveDate: '2026-09-06',
  preferences: {
    soundEnabled: true,
    confettiEnabled: true,
    reminderTime: '08:00',
    streakNotifications: true,
    timerAutoStart: false,
    dailyGoal: 6,
  },
};