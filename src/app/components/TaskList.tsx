'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, Category } from '@/lib/store';
import SortableTaskItem from './SortableTaskItem';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  completingTaskId: string | null;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onReorder: (tasks: Task[]) => void;
  allTasks: Task[];
  isCompletedSection?: boolean;
}

export default function TaskList({
  tasks,
  categories,
  completingTaskId,
  onComplete,
  onUncomplete,
  onDelete,
  onUpdate,
  onReorder,
  allTasks,
  isCompletedSection = false,
}: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(tasks, oldIndex, newIndex).map((t, i) => ({ ...t, order: i }));
    const otherTasks = allTasks.filter(t => !tasks.find(pt => pt.id === t.id));
    onReorder([...otherTasks, ...reordered]);
  };

  if (isCompletedSection) {
    return (
      <div className="space-y-2">
        {tasks.map(task => {
          const category = categories.find(c => c.id === task.categoryId);
          return (
            <SortableTaskItem
              key={task.id}
              task={task}
              category={category}
              isCompleting={completingTaskId === task.id}
              onComplete={onComplete}
              onUncomplete={onUncomplete}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isDragDisabled
            />
          );
        })}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map(task => {
            const category = categories.find(c => c.id === task.categoryId);
            return (
              <SortableTaskItem
                key={task.id}
                task={task}
                category={category}
                isCompleting={completingTaskId === task.id}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}