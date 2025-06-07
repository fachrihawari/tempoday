import { eq } from 'drizzle-orm';
import type { DB } from '../index';
import { tasks, type Task, type NewTask } from '../schema/tasks';

export class TasksRepository {
  constructor(private db: DB) {}

  /**
   * Get all tasks for a specific date
   */
  async getTasksByDate(date: string): Promise<Task[]> {
    return await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.date, date))
      .orderBy(tasks.createdAt);
  }

  /**
   * Create a new task
   */
  async createTask(task: Omit<NewTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const [newTask] = await this.db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  /**
   * Update task completion status
   */
  async toggleTaskCompletion(taskId: string): Promise<Task | null> {
    // First get the current task to toggle its completion status
    const [currentTask] = await this.db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!currentTask) {
      return null;
    }

    const [updatedTask] = await this.db
      .update(tasks)
      .set({ 
        completed: !currentTask.completed,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return updatedTask;
  }

  /**
   * Update task title
   */
  async updateTask(taskId: string, updates: Partial<Pick<Task, 'title' | 'completed'>>): Promise<Task | null> {
    const [updatedTask] = await this.db
      .update(tasks)
      .set({ 
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return updatedTask || null;
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    const result = await this.db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning();

    return result.length > 0;
  }

  /**
   * Get task statistics for a specific date
   */
  async getTaskStats(date: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  }> {
    const allTasks = await this.getTasksByDate(date);

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      completionRate
    };
  }
}
