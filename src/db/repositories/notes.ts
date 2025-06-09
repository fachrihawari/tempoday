import { eq } from 'drizzle-orm';
import type { DB } from '../index';
import { type NewNote, type Note, notes } from '../schema/notes';

export class NotesRepository {
  constructor(private db: DB) {}

  /**
   * Get note for a specific date
   */
  async getNoteByDate(date: string): Promise<Note | null> {
    const [note] = await this.db
      .select()
      .from(notes)
      .where(eq(notes.date, date))
      .limit(1);

    return note || null;
  }

  /**
   * Create or update a note for a specific date
   */
  async upsertNote(noteData: NewNote): Promise<Note> {
    // First try to find existing note for this date
    const existingNote = await this.getNoteByDate(noteData.date);

    if (existingNote) {
      // Update existing note
      const [updatedNote] = await this.db
        .update(notes)
        .set({
          content: noteData.content,
          updatedAt: new Date(),
        })
        .where(eq(notes.date, noteData.date))
        .returning();
      return updatedNote;
    } else {
      // Create new note
      const [newNote] = await this.db
        .insert(notes)
        .values({
          content: noteData.content,
          date: noteData.date,
        })
        .returning();
      return newNote;
    }
  }
}
