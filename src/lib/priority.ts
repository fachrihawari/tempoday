// Priority system utilities for TempoDay

import type { Task } from "../dexie/models";

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface PriorityConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  sortOrder: number;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
  urgent: {
    label: 'Urgent',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    icon: '🔥',
    sortOrder: 1,
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    icon: '⚡',
    sortOrder: 2,
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    icon: '📋',
    sortOrder: 3,
  },
  low: {
    label: 'Low',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    borderColor: 'border-gray-300 dark:border-gray-600',
    icon: '📝',
    sortOrder: 4,
  },
};

export const PRIORITY_OPTIONS: TaskPriority[] = [
  'urgent',
  'high',
  'medium',
  'low',
];

/**
 * Get priority configuration for a given priority level
 * Returns medium priority config as fallback if priority is invalid or undefined
 */
export function getPriorityConfig(priority: TaskPriority): PriorityConfig {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
}

/**
 * Sort tasks
 */
export function sortTasksComprehensive<
  T extends Task,
>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // 1. Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }

    // 2. Among incomplete, sort by startedAt (earlier first, undefined last)
    const aHasStart = typeof a.startedAt === 'number';
    const bHasStart = typeof b.startedAt === 'number';
    if (aHasStart !== bHasStart) {
      return aHasStart ? -1 : 1;
    }
    if (aHasStart && bHasStart && a.startedAt !== b.startedAt) {
      return (a.startedAt as number) - (b.startedAt as number);
    }

    // 3. If startedAt is the same or undefined, sort by priority (urgent first)
    if (a.completed === 0 && b.completed === 0) {
      const aPriority = PRIORITY_CONFIG[a.priority]?.sortOrder ?? PRIORITY_CONFIG.medium.sortOrder;
      const bPriority = PRIORITY_CONFIG[b.priority]?.sortOrder ?? PRIORITY_CONFIG.medium.sortOrder;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
    }

    // 4. For completed or fully tied, sort by createdAt (newest first)
    return b.createdAt - a.createdAt;
  });
}

export const selectPriorityConfig = PRIORITY_OPTIONS.map((priority) => ({
  value: priority,
  label: PRIORITY_CONFIG[priority].label,
  icon: PRIORITY_CONFIG[priority].icon,
  color: PRIORITY_CONFIG[priority].color,
  bgColor: PRIORITY_CONFIG[priority].bgColor,
  borderColor: PRIORITY_CONFIG[priority].borderColor,
}));
