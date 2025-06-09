import { eq } from 'drizzle-orm';
import type { DB } from '../index';
import {
  type NewTransaction,
  type Transaction,
  transactions,
} from '../schema/transactions';

export class TransactionsRepository {
  constructor(private db: DB) {}

  /**
   * Get all transactions for a specific date
   */
  async getTransactionsByDate(date: string): Promise<Transaction[]> {
    return await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.date, date))
      .orderBy(transactions.createdAt);
  }

  /**
   * Create a new transaction
   */
  async createTransaction(
    transaction: Omit<NewTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction> {
    const [newTransaction] = await this.db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId: string): Promise<boolean> {
    const result = await this.db
      .delete(transactions)
      .where(eq(transactions.id, transactionId))
      .returning();

    return result.length > 0;
  }
}
