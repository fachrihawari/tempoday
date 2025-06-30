// Priority system utilities for TempoDay

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
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: '📝',
    sortOrder: 4,
  },
};

export const PRIORITY_OPTIONS: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];

/**
 * Get priority configuration for a given priority level
 * Returns medium priority config as fallback if priority is invalid or undefined
 */
export function getPriorityConfig(priority: TaskPriority): PriorityConfig {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
}

/**
 * Sort tasks by priority (urgent first, then high, medium, low)
 */
export function sortTasksByPriority<T extends { priority: TaskPriority }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const aPriority = PRIORITY_CONFIG[a.priority]?.sortOrder ?? PRIORITY_CONFIG.medium.sortOrder;
    const bPriority = PRIORITY_CONFIG[b.priority]?.sortOrder ?? PRIORITY_CONFIG.medium.sortOrder;
    return aPriority - bPriority;
  });
}

/**
 * Sort tasks by priority, then by completion status, then by creation date
 */
export function sortTasksComprehensive<T extends { 
  priority: TaskPriority; 
  completed: boolean; 
  createdAt: number 
}>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status (incomplete tasks first)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority (urgent first) - handle undefined priorities gracefully
    const aPriority = PRIORITY_CONFIG[a.priority]?.sortOrder ?? PRIORITY_CONFIG.medium.sortOrder;
    const bPriority = PRIORITY_CONFIG[b.priority]?.sortOrder ?? PRIORITY_CONFIG.medium.sortOrder;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    // Finally by creation date (newest first)
    return b.createdAt - a.createdAt;
  });
}

/**
 * Filter tasks by priority
 */
export function filterTasksByPriority<T extends { priority: TaskPriority }>(
  tasks: T[], 
  priorities: TaskPriority[]
): T[] {
  if (priorities.length === 0) return tasks;
  return tasks.filter(task => priorities.includes(task.priority));
}

/**
 * Get priority statistics for a list of tasks
 */
export function getPriorityStats<T extends { priority: TaskPriority; completed: boolean }>(
  tasks: T[]
): Record<TaskPriority, { total: number; completed: number; pending: number }> {
  const stats: Record<TaskPriority, { total: number; completed: number; pending: number }> = {
    urgent: { total: 0, completed: 0, pending: 0 },
    high: { total: 0, completed: 0, pending: 0 },
    medium: { total: 0, completed: 0, pending: 0 },
    low: { total: 0, completed: 0, pending: 0 },
  };

  tasks.forEach(task => {
    // Handle undefined or invalid priorities gracefully
    const priority = PRIORITY_CONFIG[task.priority] ? task.priority : 'medium';
    stats[priority].total++;
    if (task.completed) {
      stats[priority].completed++;
    } else {
      stats[priority].pending++;
    }
  });

  return stats;
}

/**
 * Get the next higher priority level
 */
export function getNextHigherPriority(priority: TaskPriority): TaskPriority | null {
  const currentOrder = PRIORITY_CONFIG[priority]?.sortOrder;
  if (currentOrder === undefined) return null;
  
  const higherPriority = PRIORITY_OPTIONS.find(p => 
    PRIORITY_CONFIG[p].sortOrder === currentOrder - 1
  );
  return higherPriority || null;
}

/**
 * Get the next lower priority level
 */
export function getNextLowerPriority(priority: TaskPriority): TaskPriority | null {
  const currentOrder = PRIORITY_CONFIG[priority]?.sortOrder;
  if (currentOrder === undefined) return null;
  
  const lowerPriority = PRIORITY_OPTIONS.find(p => 
    PRIORITY_CONFIG[p].sortOrder === currentOrder + 1
  );
  return lowerPriority || null;
}