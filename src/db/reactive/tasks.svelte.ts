// Reactive wrapper for TasksRepository using Svelte 5 runes
import { TasksRepository } from '../repositories/tasks';
import { db } from '../index';
import type { Task } from '../schema/tasks';

export class ReactiveTasks {
  private repo: TasksRepository;

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

  constructor() {
    this.repo = new TasksRepository(db);
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
      const tasks = await this.repo.getTasksByDate(date);
      this.tasks = tasks;
      this.currentDate = date;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load tasks';
      console.error('Error loading tasks:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async createTask(title: string, date: string): Promise<void> {
    this.isCreating = true;
    this.error = null;
    try {
      const newTask = await this.repo.createTask({ title, completed: false, date });
      this.tasks = this.tasks.concat([newTask]);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to create task';
      console.error('Error creating task:', err);
    } finally {
      this.isCreating = false;
    }
  }

  async toggleTask(taskId: string): Promise<void> {
    this.isToggling[taskId] = true;
    this.error = null;

    try {
      const updatedTask = await this.repo.toggleTaskCompletion(taskId);

      if (updatedTask) {
        this.tasks = this.tasks.map(task =>
          task.id === taskId ? updatedTask : task
        );
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to update task';
      console.error('Error toggling task:', err);
    } finally {
      this.isToggling[taskId] = false;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    this.isDeleting[taskId] = true;
    this.error = null;

    try {
      const success = await this.repo.deleteTask(taskId);

      if (!success) {
        throw new Error('Task not found or could not be deleted');
      }

      this.tasks = this.tasks.filter(task => task.id !== taskId);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to delete task';
      console.error('Error deleting task:', err);
    } finally {
      this.isDeleting[taskId] = false;
    }
  }

  /**
   * Get completed tasks count (reactive derived value)
   */
  get completedCount(): number {
    return this.tasks.filter(task => task.completed).length;
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
