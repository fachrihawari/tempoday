import { db } from '../dexie/db';
import type { Task } from '../dexie/models';
import { NotFoundError } from '../lib/error';
// Reactive Dexie-based tasks store using Svelte 5 runes
import { uuid } from '../lib/unique';

// Types for better API
export type CreateTaskInput = Pick<Task, 'description' | 'date'>;

export class ReactiveTasks {
  // Reactive state for tasks
  tasks = $state<Task[]>([]);

  // Loading states for different operations
  isLoading = $state(false);
  isCreating = $state(false);
  isToggling = $state<Record<string, boolean>>({});
  isDeleting = $state<Record<string, boolean>>({});

  // Error state
  error = $state<string | null>(null);

  // Current date being displayed
  currentDate = $state<string>('');

  /**
   * Get a single task by ID
   */
  private async getTaskById(id: string): Promise<Task | null> {
    const task = await db.tasks.get(id);
    return task || null;
  }

  /**
   * Load tasks for a specific date and update reactive state
   */
  async loadTasks(date: string): Promise<void> {
    if (this.currentDate === date) {
      return; // Already loaded for this date
    }

    this.isLoading = true;
    this.error = null;

    try {
      const tasks = await db.tasks
        .where('date')
        .equals(date)
        .sortBy('createdAt');
      this.tasks = tasks;
      this.currentDate = date;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load tasks';
      console.error('Error loading tasks:', err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create a new task
   */
  async createTask(input: CreateTaskInput): Promise<void> {
    this.isCreating = true;
    this.error = null;

    try {
      const now = Date.now();
      const newTask: Task = {
        ...input,
        completed: false,
        id: uuid(),
        createdAt: now,
        updatedAt: now,
      };
      await db.tasks.add(newTask);

      // Add to local state directly
      this.tasks = [...this.tasks, newTask];
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to create task';
      console.error('Error creating task:', err);
    } finally {
      this.isCreating = false;
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleTask(taskId: string): Promise<void> {
    this.isToggling[taskId] = true;
    this.error = null;

    try {
      const task = await this.getTaskById(taskId);
      if (!task) {
        throw new NotFoundError(`Task with ID ${taskId} not found`);
      }

      const updatedCount = await db.tasks.update(taskId, {
        completed: !task.completed,
      });

      if (updatedCount === 0) {
        throw new NotFoundError(`Task with ID ${taskId} not found`);
      }

      // Update the local task state
      this.tasks = this.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.error = 'Task not found';
      } else {
        this.error =
          err instanceof Error ? err.message : 'Failed to update task';
      }
      console.error('Error toggling task:', err);
    } finally {
      this.isToggling[taskId] = false;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<void> {
    this.isDeleting[taskId] = true;
    this.error = null;

    try {
      const existingTask = await this.getTaskById(taskId);
      if (!existingTask) {
        throw new NotFoundError(`Task with ID ${taskId} not found`);
      }

      await db.tasks.delete(taskId);

      // Remove task from local state
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.error = 'Task not found';
      } else {
        this.error =
          err instanceof Error ? err.message : 'Failed to delete task';
      }
      console.error('Error deleting task:', err);
    } finally {
      this.isDeleting[taskId] = false;
    }
  }

  /**
   * Get task statistics for a date
   */
  async getTaskStats(
    date: string,
  ): Promise<{ total: number; completed: number; pending: number }> {
    const tasks = await db.tasks.where('date').equals(date).toArray();
    const completed = tasks.filter((task) => task.completed).length;

    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  }

  /**
   * Get completed tasks count (reactive derived value)
   */
  get completedCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  /**
   * Get total tasks count (reactive derived value)
   */
  get totalCount(): number {
    return this.tasks.length;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }
}

// Create singleton instance
export const reactiveTasks = new ReactiveTasks();
