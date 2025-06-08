import { db } from '../index';
// Reactive wrapper for NotesRepository using Svelte 5 runes
import { NotesRepository } from '../repositories/notes';
import type { Note } from '../schema/notes';

export class ReactiveNotes {
  private repo: NotesRepository;

  // Reactive state for note
  note = $state<Note | null>(null);

  // Loading states for different operations
  isLoading = $state(false);
  isSaving = $state(false);

  // Error state
  error = $state<string | null>(null);

  // Current date being displayed
  currentDate = $state<string>('');

  // Auto-save timeout
  private saveTimeout: number | null = null;

  constructor() {
    this.repo = new NotesRepository(db);
  }

  /**
   * Load note for a specific date and update reactive state
   */
  async loadNote(date: string): Promise<void> {
    if (this.currentDate === date) {
      return; // Already loaded for this date
    }

    this.isLoading = true;
    this.error = null;

    try {
      const note = await this.repo.getNoteByDate(date);
      this.note = note;
      this.currentDate = date;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load note';
      console.error('Error loading note:', err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Save or update note content for the current date
   */
  async saveNote(content: string, date: string): Promise<void> {
    this.isSaving = true;
    this.error = null;

    try {
      const savedNote = await this.repo.upsertNote({ content, date });
      this.note = savedNote;
      this.currentDate = date;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to save note';
      console.error('Error saving note:', err);
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Auto-save note content with debounce
   */
  autoSaveNote(content: string, date: string, delayMs: number = 1000): void {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Set new timeout
    this.saveTimeout = setTimeout(() => {
      this.saveNote(content, date).catch((err) => {
        console.error('Auto-save failed:', err);
      });
    }, delayMs);
  }

  /**
   * Cancel pending auto-save
   */
  cancelAutoSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
  }

  /**
   * Get note content (reactive derived value)
   */
  get content(): string {
    return this.note?.content || '';
  }

  /**
   * Check if note has content
   */
  get hasContent(): boolean {
    return this.content.trim().length > 0;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }
}

// Create singleton instance
export const reactiveNotes = new ReactiveNotes();
