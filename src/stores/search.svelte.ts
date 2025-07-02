import { db, getDefaultDateRange } from '../dexie/db';
import type { Note, Task, Transaction } from '../dexie/models';
import { getPriorityConfig, type TaskPriority } from '../lib/priority';
import { getCategoryConfig, type TransactionCategory } from '../lib/categories';

export interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'transaction';
  title: string;
  content: string;
  date: string;
  matchedText?: string;
  priority?: string; // For tasks
  category?: string; // For transactions
  data: Task | Note | Transaction;
}

export interface SearchResults {
  tasks: SearchResult[];
  notes: SearchResult[];
  transactions: SearchResult[];
  total: number;
}

export interface SearchFilters {
  dataTypes: ('task' | 'note' | 'transaction')[];
  taskStatus: ('completed' | 'pending')[];
  taskPriorities: TaskPriority[];
  transactionTypes: ('income' | 'expense')[];
  transactionCategories: TransactionCategory[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

// Default filters (empty means no filtering)
export const defaultFilters: SearchFilters = {
  dataTypes: [],
  taskStatus: [],
  taskPriorities: [],
  transactionTypes: [],
  transactionCategories: [],
  dateRange: {
    start: null,
    end: null,
  },
};

class SearchStore {
  // Reactive state
  query = $state('');
  filters = $state<SearchFilters>(defaultFilters);
  results = $state<SearchResults>({
    tasks: [],
    notes: [],
    transactions: [],
    total: 0,
  });
  isSearching = $state(false);
  error = $state<string | null>(null);
  hasSearched = $state(false);

  // Add a flag to track if default has been applied
  hasAppliedDefault = $state(false);

  /**
   * Perform full-text search across all data types with filters
   */
  async performSearch(searchQuery: string, searchFilters?: SearchFilters): Promise<void> {
    const trimmedQuery = searchQuery.trim();
    let filtersToUse = searchFilters || this.filters;

    // Apply default ONLY on first search
    if (!this.hasAppliedDefault && !filtersToUse.dateRange.start && !filtersToUse.dateRange.end) {
      const defaultRange = getDefaultDateRange();
      filtersToUse = {
        ...filtersToUse,
        dateRange: { start: defaultRange.start, end: defaultRange.end },
      };
      // Update the store's filters so UI reflects the change
      this.filters = filtersToUse;
      this.hasAppliedDefault = true;
    }
    
    // Clear results if query is empty
    if (!trimmedQuery) {
      this.clearResults();
      return;
    }

    this.isSearching = true;
    this.error = null;
    this.query = trimmedQuery;
    this.filters = filtersToUse;

    try {
      // Search and filter each data type using Dexie.js indexes
      const taskResults = this.shouldIncludeDataType('task', filtersToUse)
        ? await this.searchTasks(trimmedQuery, filtersToUse)
        : [];

      const noteResults = this.shouldIncludeDataType('note', filtersToUse)
        ? await this.searchNotes(trimmedQuery, filtersToUse)
        : [];

      const transactionResults = this.shouldIncludeDataType('transaction', filtersToUse)
        ? await this.searchTransactions(trimmedQuery, filtersToUse)
        : [];

      // Update results
      this.results = {
        tasks: taskResults,
        notes: noteResults,
        transactions: transactionResults,
        total: taskResults.length + noteResults.length + transactionResults.length,
      };

      this.hasSearched = true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Search failed';
      console.error('Search error:', err);
    } finally {
      this.isSearching = false;
    }
  }

  /**
   * Update filters and re-run search if there's an active query
   */
  async updateFilters(newFilters: SearchFilters): Promise<void> {
    this.filters = newFilters;
    
    // Re-run search if there's an active query
    if (this.query.trim()) {
      await this.performSearch(this.query, newFilters);
    }
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    this.hasAppliedDefault = false; // Reset flag so default can be applied again
    await this.updateFilters(defaultFilters);
  }

  /**
   * Check if a data type should be included based on filters
   */
  private shouldIncludeDataType(type: 'task' | 'note' | 'transaction', filters: SearchFilters): boolean {
    // If no data types are specified, include all
    if (filters.dataTypes.length === 0) return true;
    return filters.dataTypes.includes(type);
  }

  /**
   * Search through tasks with filters
   */
  private async searchTasks(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase();
    const hasDate = !!(filters.dateRange.start || filters.dateRange.end);
    const startDate = filters.dateRange.start || '';
    const endDate = filters.dateRange.end || '9999-12-31';
    let results: Task[] = [];

    if (hasDate) {
      results = await db.tasks.where('date').between(startDate, endDate, true, true).toArray();
    } else {
      results = await db.tasks.toArray();
    }

    // Filter in-memory for priority and completed
    if (filters.taskPriorities.length > 0) {
      results = results.filter(task => filters.taskPriorities.includes(task.priority));
    }
    if (filters.taskStatus.length > 0) {
      results = results.filter(task => {
        const status = task.completed === 1 ? 'completed' : 'pending';
        return filters.taskStatus.includes(status);
      });
    }

    return results
      .filter((task: Task) => task.description.toLowerCase().includes(lowerQuery))
      .sort((a: Task, b: Task) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((task: Task) => {
        const priorityConfig = getPriorityConfig(task.priority);
        const statusText = task.completed === 1 ? 'Completed' : 'Pending';
        const priorityText = `${priorityConfig.icon} ${priorityConfig.label}`;
        return {
          id: task.id,
          type: 'task' as const,
          title: task.description,
          content: `${statusText} • ${priorityText}`,
          date: task.date,
          priority: priorityText,
          matchedText: this.highlightMatch(task.description, query),
          data: task,
        };
      });
  }

  /**
   * Search through notes with filters
   */
  private async searchNotes(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase();
    let collection;
    if (filters.dateRange.start || filters.dateRange.end) {
      collection = db.notes.where('date').between(
        filters.dateRange.start || '',
        filters.dateRange.end || '9999-12-31',
        true,
        true
      );
    } else {
      collection = db.notes.toCollection();
    }
    return await collection
      .filter(note => note.content.toLowerCase().includes(lowerQuery))
      .toArray()
      .then(notes => notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      .then(notes =>
        notes.map(note => ({
          id: note.id,
          type: 'note' as const,
          title: 'Daily Note',
          content: this.truncateText(note.content, 100),
          date: note.date,
          matchedText: this.highlightMatch(note.content, query),
          data: note,
        }))
      );
  }

  /**
   * Search through transactions with filters
   */
  private async searchTransactions(query: string, filters: SearchFilters): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase();
    const hasDate = !!(filters.dateRange.start || filters.dateRange.end);
    const startDate = filters.dateRange.start || '';
    const endDate = filters.dateRange.end || '9999-12-31';
    let results: Transaction[] = [];

    if (hasDate) {
      results = await db.transactions.where('date').between(startDate, endDate, true, true).toArray();
    } else {
      results = await db.transactions.toArray();
    }

    // Filter in-memory for type and category
    if (filters.transactionTypes.length > 0) {
      results = results.filter(tx => filters.transactionTypes.includes(tx.type));
    }
    if (filters.transactionCategories.length > 0) {
      results = results.filter(tx => filters.transactionCategories.includes(tx.category));
    }

    return results
      .filter((transaction: Transaction) => transaction.description.toLowerCase().includes(lowerQuery))
      .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((transaction: Transaction) => {
        const categoryConfig = getCategoryConfig(transaction.category);
        const categoryText = `${categoryConfig.icon} ${categoryConfig.label}`;
        return {
          id: transaction.id,
          type: 'transaction' as const,
          title: transaction.description,
          content: `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)} • ${categoryText}`,
          date: transaction.date,
          category: categoryText,
          matchedText: this.highlightMatch(transaction.description, query),
          data: transaction,
        };
      });
  }

  /**
   * Highlight matching text (simple implementation)
   */
  private highlightMatch(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Truncate text to specified length
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Clear search results
   */
  clearResults(): void {
    this.results = {
      tasks: [],
      notes: [],
      transactions: [],
      total: 0,
    };
    this.query = '';
    this.hasSearched = false;
    this.error = null;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Check if there are any results
   */
  get hasResults(): boolean {
    return this.results.total > 0;
  }

  /**
   * Check if any filters are currently active
   */
  get hasActiveFilters(): boolean {
    return (
      this.filters.dataTypes.length > 0 ||
      this.filters.taskStatus.length > 0 ||
      this.filters.taskPriorities.length > 0 ||
      this.filters.transactionTypes.length > 0 ||
      this.filters.transactionCategories.length > 0 ||
      !!this.filters.dateRange.start ||
      !!this.filters.dateRange.end
    );
  }
}

// Export singleton instance
export const searchStore = new SearchStore();