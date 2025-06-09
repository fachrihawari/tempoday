import { eq } from 'drizzle-orm';
import type { DB } from '../index';
import { type NewTask, type Task, tasks } from '../schema/tasks';

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
  async createTask(
    task: Omit<NewTask, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    const [newTask] = await this.db.insert(tasks).values(task).returning();
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
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return updatedTask;
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
}
