import { db } from '../dexie/db';
import type { Transaction, TransactionType } from '../dexie/models';
import { NotFoundError } from '../lib/error';
// Reactive Dexie-based transactions store using Svelte 5 runes
import { uuid } from '../lib/unique';

// Types for better API
export type CreateTransactionInput = Omit<
  Transaction,
  'id' | 'createdAt' | 'updatedAt'
>;

export class ReactiveTransactions {
  // Reactive state for transactions
  transactions = $state<Transaction[]>([]);

  // Loading states for different operations
  isLoading = $state(false);
  isCreating = $state(false);
  isDeleting = $state<Record<string, boolean>>({});

  // Error state
  error = $state<string | null>(null);

  // Current date being displayed
  currentDate = $state<string>('');

  /**
   * Get a single transaction by ID
   */
  private async getTransactionById(id: string): Promise<Transaction | null> {
    const transaction = await db.transactions.get(id);
    return transaction || null;
  }

  /**
   * Load transactions for a specific date and update reactive state
   */
  async loadTransactions(date: string): Promise<void> {
    if (this.currentDate === date) {
      return; // Already loaded for this date
    }

    this.isLoading = true;
    this.error = null;

    try {
      const transactions = await db.transactions
        .where('date')
        .equals(date)
        .sortBy('createdAt');
      this.transactions = transactions;
      this.currentDate = date;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : 'Failed to load transactions';
      console.error('Error loading transactions:', err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(input: CreateTransactionInput): Promise<void> {
    this.isCreating = true;
    this.error = null;

    try {
      const now = Date.now();
      const newTransaction: Transaction = {
        ...input,
        id: uuid(),
        createdAt: now,
        updatedAt: now,
      };

      await db.transactions.add(newTransaction);

      // Add to local state directly
      this.transactions = [...this.transactions, newTransaction];
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : 'Failed to create transaction';
      console.error('Error creating transaction:', err);
    } finally {
      this.isCreating = false;
    }
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    this.isDeleting[transactionId] = true;
    this.error = null;

    try {
      const existingTransaction = await this.getTransactionById(transactionId);
      if (!existingTransaction) {
        throw new NotFoundError(
          `Transaction with ID ${transactionId} not found`,
        );
      }

      await db.transactions.delete(transactionId);

      // Remove transaction from local state
      this.transactions = this.transactions.filter(
        (transaction) => transaction.id !== transactionId,
      );
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.error = 'Transaction not found';
      } else {
        this.error =
          err instanceof Error ? err.message : 'Failed to delete transaction';
      }
      console.error('Error deleting transaction:', err);
    } finally {
      this.isDeleting[transactionId] = false;
    }
  }

  /**
   * Get income transactions (reactive derived value)
   */
  get incomeTransactions(): Transaction[] {
    return this.transactions.filter((t) => t.type === 'income');
  }

  /**
   * Get expense transactions (reactive derived value)
   */
  get expenseTransactions(): Transaction[] {
    return this.transactions.filter((t) => t.type === 'expense');
  }

  /**
   * Get total income for current date (reactive derived value)
   */
  get totalIncome(): number {
    return this.incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get total expenses for current date (reactive derived value)
   */
  get totalExpenses(): number {
    return this.expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get net balance for current date (reactive derived value)
   */
  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  /**
   * Get total transaction count (reactive derived value)
   */
  get totalCount(): number {
    return this.transactions.length;
  }

  /**
   * Check if there are any transactions for current date
   */
  get hasTransactions(): boolean {
    return this.transactions.length > 0;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }
}

// Create singleton instance
export const reactiveTransactions = new ReactiveTransactions();
