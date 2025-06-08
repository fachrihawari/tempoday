// Reactive wrapper for TransactionsRepository using Svelte 5 runes
import { TransactionsRepository } from '../repositories/transactions';
import { db } from '../index';
import type { Transaction } from '../schema/transactions';

export class ReactiveTransactions {
  private repo: TransactionsRepository;

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

  constructor() {
    this.repo = new TransactionsRepository(db);
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
      const transactions = await this.repo.getTransactionsByDate(date);
      this.transactions = transactions;
      this.currentDate = date;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load transactions';
      console.error('Error loading transactions:', err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transactionData: { description: string; amount: string; type: 'income' | 'expense'; date: string }): Promise<void> {
    this.isCreating = true;
    this.error = null;

    try {
      const newTransaction = await this.repo.createTransaction(transactionData);
      this.transactions = this.transactions.concat([newTransaction]);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to create transaction';
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
      const success = await this.repo.deleteTransaction(transactionId);

      if (!success) {
        throw new Error('Transaction not found or could not be deleted');
      }

      this.transactions = this.transactions.filter(transaction => transaction.id !== transactionId);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to delete transaction';
      console.error('Error deleting transaction:', err);
    } finally {
      this.isDeleting[transactionId] = false;
    }
  }

  /**
   * Get total income (reactive derived value)
   */
  get totalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }

  /**
   * Get total expenses (reactive derived value)
   */
  get totalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }

  /**
   * Get net balance (reactive derived value)
   */
  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  /**
   * Get total transactions count
   */
  get totalCount(): number {
    return this.transactions.length;
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
