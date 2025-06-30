import { db } from '../dexie/db';
import type { Note, Task, Transaction } from '../dexie/models';
import { getPriorityConfig } from '../lib/priority';

export interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'transaction';
  title: string;
  content: string;
  date: string;
  matchedText?: string;
  priority?: string; // For tasks
  data: Task | Note | Transaction;
}

export interface SearchResults {
  tasks: SearchResult[];
  notes: SearchResult[];
  transactions: SearchResult[];
  total: number;
}

class SearchStore {
  // Reactive state
  query = $state('');
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
   * Perform full-text search across all data types
   */
  async performSearch(searchQuery: string): Promise<void> {
    const trimmedQuery = searchQuery.trim();
    
    // Clear results if query is empty
    if (!trimmedQuery) {
      this.clearResults();
      return;
    }

    this.isSearching = true;
    this.error = null;
    this.query = trimmedQuery;

    try {
      // Fetch all data in parallel
      const [allTasks, allNotes, allTransactions] = await Promise.all([
        db.tasks.toArray(),
        db.notes.toArray(),
        db.transactions.toArray(),
      ]);

      // Search tasks
      const taskResults = this.searchTasks(allTasks, trimmedQuery);
      
      // Search notes
      const noteResults = this.searchNotes(allNotes, trimmedQuery);
      
      // Search transactions
      const transactionResults = this.searchTransactions(allTransactions, trimmedQuery);

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
   * Search through tasks
   */
  private searchTasks(tasks: Task[], query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    
    return tasks
      .filter(task => 
        task.description.toLowerCase().includes(lowerQuery)
      )
      .map(task => {
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
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Search through notes
   */
  private searchNotes(notes: Note[], query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    
    return notes
      .filter(note => 
        note.content.toLowerCase().includes(lowerQuery)
      )
      .map(note => ({
        id: note.id,
        type: 'note' as const,
        title: 'Daily Note',
        content: this.truncateText(note.content, 100),
        date: note.date,
        matchedText: this.highlightMatch(note.content, query),
        data: note,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Search through transactions
   */
  private searchTransactions(transactions: Transaction[], query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    
    return transactions
      .filter(transaction => 
        transaction.description.toLowerCase().includes(lowerQuery)
      )
      .map(transaction => ({
        id: transaction.id,
        type: 'transaction' as const,
        title: transaction.description,
        content: `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`,
        date: transaction.date,
        matchedText: this.highlightMatch(transaction.description, query),
        data: transaction,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
}

// Export singleton instance
export const searchStore = new SearchStore();