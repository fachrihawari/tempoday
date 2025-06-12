// Reactive Dexie-based notes store using Svelte 5 runes
import { uuid } from '../lib/unique';
import { db } from '../dexie/db';
import type { Note } from '../dexie/models';
import { NotFoundError } from '../lib/error';

// Types for better API
export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export class ReactiveNotes {
  // Reactive state for notes
  note = $state<Note | null>(null);

  // Loading states for different operations
  isLoading = $state(false);
  isSaving = $state(false);

  // Error state
  error = $state<string | null>(null);

  // Current date being displayed
  currentDate = $state<string>('');

  // Auto-save timeout
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Get a note by date
   */
  private async getNoteByDate(date: string): Promise<Note | null> {
    const note = await db.notes.where('date').equals(date).first();
    return note || null;
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
      const note = await this.getNoteByDate(date);
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
   * Save or update a note
   */
  async saveNote({ content, date }: CreateNoteInput): Promise<void> {
    this.isSaving = true;
    this.error = null;

    try {
      const existingNote = await this.getNoteByDate(date);

      if (existingNote) {
        // Update existing note
        const updatedCount = await db.notes.update(existingNote.id, {
          content,
        });

        if (updatedCount === 0) {
          throw new NotFoundError(`Note for date ${date} not found`);
        }

        // Update local state
        this.note = { ...existingNote, content };
      } else {
        // Create new note with timestamps (hooks should update these)
        const now = Date.now();
        const newNote: Note = {
          id: uuid(),
          date,
          content,
          createdAt: now,
          updatedAt: now,
        };

        await db.notes.add(newNote);
        
        // Update local state directly since we have the complete object
        this.note = newNote;
      }
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.error = 'Note not found';
      } else {
        this.error = err instanceof Error ? err.message : 'Failed to save note';
      }
      console.error('Error saving note:', err);
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Auto-save note with debouncing
   */
  autoSave(content: string, date: string, delay: number = 1000): void {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Set new timeout
    this.saveTimeout = setTimeout(() => {
      this.saveNote({ content, date });
    }, delay);
  }

  /**
   * Delete a note
   */
  async deleteNote(date: string): Promise<void> {
    this.error = null;

    try {
      const existingNote = await this.getNoteByDate(date);
      if (!existingNote) {
        throw new NotFoundError(`Note for date ${date} not found`);
      }

      await db.notes.delete(existingNote.id);
      
      // Clear local state if this is the current note
      if (this.currentDate === date) {
        this.note = null;
      }
    } catch (err) {
      if (err instanceof NotFoundError) {
        this.error = 'Note not found';
      } else {
        this.error = err instanceof Error ? err.message : 'Failed to delete note';
      }
      console.error('Error deleting note:', err);
    }
  }

  /**
   * Get note content (reactive derived value)
   */
  get content(): string {
    return this.note?.content || '';
  }

  /**
   * Check if note exists for current date
   */
  get hasNote(): boolean {
    return this.note !== null && this.note.content.trim().length > 0;
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error = null;
  }

  /**
   * Cancel any pending auto-save
   */
  cancelAutoSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
  }
}

// Create singleton instance
export const reactiveNotes = new ReactiveNotes();
