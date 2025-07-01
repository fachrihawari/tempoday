import { db } from '../dexie/db';
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

  /**
   * Perform full-text search across all data types with filters
   */
  async performSearch(searchQuery: string, searchFilters?: SearchFilters): Promise<void> {
    const trimmedQuery = searchQuery.trim();
    const filtersToUse = searchFilters || this.filters;

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
    let collection;
    if (filters.dateRange.start || filters.dateRange.end) {
      collection = db.tasks.where('date').between(
        filters.dateRange.start || '',
        filters.dateRange.end || '9999-12-31',
        true,
        true
      );
    } else {
      collection = db.tasks.toCollection();
    }
    return await collection
      .filter(task => task.description.toLowerCase().includes(lowerQuery))
      .filter(task => {
        // Status filter
        if (filters.taskStatus.length > 0) {
          const status = task.completed === true ? 'completed' : 'pending';
          if (!filters.taskStatus.includes(status)) return false;
        }

        // Priority filter
        if (filters.taskPriorities.length > 0) {
          if (!filters.taskPriorities.includes(task.priority)) return false;
        }

        return true;
      })
      .toArray()
      .then(tasks => tasks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      .then(tasks =>
        tasks.map(task => {
          const priorityConfig = getPriorityConfig(task.priority);
          const statusText = task.completed ? 'Completed' : 'Pending';
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
        })
      );
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
    let collection;
    if (filters.dateRange.start || filters.dateRange.end) {
      collection = db.transactions.where('date').between(
        filters.dateRange.start || '',
        filters.dateRange.end || '9999-12-31',
        true,
        true
      );
    } else {
      collection = db.transactions.toCollection();
    }
    return await collection
      .filter(transaction => transaction.description.toLowerCase().includes(lowerQuery))
      .filter(transaction => {
        // Transaction type filter
        if (filters.transactionTypes.length > 0) {
          if (!filters.transactionTypes.includes(transaction.type)) return false;
        }

        // Category filter
        if (filters.transactionCategories.length > 0) {
          if (!filters.transactionCategories.includes(transaction.category)) return false;
        }

        return true;
      })
      .toArray()
      .then(transactions => transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      .then(transactions =>
        transactions.map(transaction => {
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
        })
      );
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
   * Get all results in a single array, sorted by date
   */
  get allResults(): SearchResult[] {
    const all = [
      ...this.results.tasks,
      ...this.results.notes,
      ...this.results.transactions,
    ];
    
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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