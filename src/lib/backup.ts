// Backup and Restore functionality using Web Share API and File Download
import { db } from '../dexie/db';
import type { Note, Settings, Task, Transaction } from '../dexie/models';

export interface BackupData {
  app: string;
  version: string;
  exportDate: string;
  data: {
    tasks: Task[];
    notes: Note[];
    transactions: Transaction[];
    settings: Settings[];
  };
}

export interface BackupResult {
  success: boolean;
  method: 'share' | 'shareText' | 'clipboard' | 'download';
  message: string;
}

export class BackupManager {
  /**
   * Export all data from the database
   */
  async exportAllData(): Promise<BackupData> {
    try {
      const [tasks, notes, transactions, settings] = await Promise.all([
        db.tasks.toArray(),
        db.notes.toArray(),
        db.transactions.toArray(),
        db.settings.toArray(),
      ]);

      return {
        app: 'TempoDay',
        version: '0.0.1',
        exportDate: new Date().toISOString(),
        data: {
          tasks,
          notes,
          transactions,
          settings,
        },
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data from database');
    }
  }

  /**
   * Create backup using Web Share API with smart fallbacks
   */
  async createBackup(): Promise<BackupResult> {
    try {
      const backupData = await this.exportAllData();
      const backupText = JSON.stringify(backupData, null, 2);
      const fileName = `tempoday-backup-${new Date().toISOString().split('T')[0]}.json`;

      // Strategy 1: Web Share API with file (Best UX)
      if (navigator.share && navigator.canShare) {
        try {
          const blob = new Blob([backupText], { type: 'application/json' });
          const file = new File([blob], fileName, {
            type: 'application/json',
          });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'TempoDay Backup',
              text: 'My personal data backup from TempoDay',
              files: [file],
            });
            return {
              success: true,
              method: 'share',
              message: 'Backup shared successfully! Choose your preferred app to save it.',
            };
          }
        } catch (error) {
          console.log('File share failed, trying text share:', error);
        }

        // Strategy 2: Web Share API with text (Fallback)
        try {
          await navigator.share({
            title: 'TempoDay Backup',
            text: `TempoDay Backup Data:\n\n${backupText}`,
          });
          return {
            success: true,
            method: 'shareText',
            message: 'Backup data shared as text! You can save it in any app.',
          };
        } catch (error) {
          console.log('Text share failed:', error);
        }
      }

      // Strategy 3: Clipboard fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(backupText);
          return {
            success: true,
            method: 'clipboard',
            message: 'Backup copied to clipboard! Paste it in your notes app or email to save.',
          };
        } catch (error) {
          console.log('Clipboard failed:', error);
        }
      }

      // Strategy 4: Download fallback
      this.downloadFile(backupText, fileName);
      return {
        success: true,
        method: 'download',
        message: 'Backup file downloaded! Check your Downloads folder.',
      };
    } catch (error) {
      console.error('Backup failed:', error);
      return {
        success: false,
        method: 'download',
        message: error instanceof Error ? error.message : 'Backup failed',
      };
    }
  }

  /**
   * Create backup and download as file directly
   */
  async createDownloadBackup(): Promise<BackupResult> {
    try {
      const backupData = await this.exportAllData();
      const backupText = JSON.stringify(backupData, null, 2);
      const fileName = `tempoday-backup-${new Date().toISOString().split('T')[0]}.json`;

      this.downloadFile(backupText, fileName);
      
      return {
        success: true,
        method: 'download',
        message: 'Backup file downloaded successfully! Check your Downloads folder.',
      };
    } catch (error) {
      console.error('Download backup failed:', error);
      return {
        success: false,
        method: 'download',
        message: error instanceof Error ? error.message : 'Download backup failed',
      };
    }
  }

  /**
   * Download file method
   */
  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Validate backup data structure
   */
  validateBackupData(data: any): data is BackupData {
    if (!data || typeof data !== 'object') return false;
    if (data.app !== 'TempoDay') return false;
    if (!data.version || !data.exportDate || !data.data) return false;
    
    const { tasks, notes, transactions, settings } = data.data;
    if (!Array.isArray(tasks) || !Array.isArray(notes) || 
        !Array.isArray(transactions) || !Array.isArray(settings)) {
      return false;
    }

    return true;
  }

  /**
   * Restore data from backup
   */
  async restoreFromBackup(backupData: BackupData): Promise<void> {
    if (!this.validateBackupData(backupData)) {
      throw new Error('Invalid backup data format');
    }

    try {
      // Clear existing data
      await Promise.all([
        db.tasks.clear(),
        db.notes.clear(),
        db.transactions.clear(),
        db.settings.clear(),
      ]);

      // Import new data
      await Promise.all([
        db.tasks.bulkAdd(backupData.data.tasks),
        db.notes.bulkAdd(backupData.data.notes),
        db.transactions.bulkAdd(backupData.data.transactions),
        db.settings.bulkAdd(backupData.data.settings),
      ]);
    } catch (error) {
      console.error('Error restoring data:', error);
      throw new Error('Failed to restore data to database');
    }
  }

  /**
   * Restore from clipboard
   */
  async restoreFromClipboard(): Promise<void> {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      throw new Error('Clipboard access not supported');
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      const backupData = JSON.parse(clipboardText);
      await this.restoreFromBackup(backupData);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON data in clipboard');
      }
      throw error;
    }
  }

  /**
   * Restore from file
   */
  async restoreFromFile(file: File): Promise<void> {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      await this.restoreFromBackup(backupData);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON data in file');
      }
      throw error;
    }
  }

  /**
   * Get backup statistics
   */
  async getBackupStats(): Promise<{
    tasks: number;
    notes: number;
    transactions: number;
    settings: number;
    totalSize: string;
  }> {
    try {
      const backupData = await this.exportAllData();
      const backupText = JSON.stringify(backupData);
      const sizeInBytes = new Blob([backupText]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);

      return {
        tasks: backupData.data.tasks.length,
        notes: backupData.data.notes.length,
        transactions: backupData.data.transactions.length,
        settings: backupData.data.settings.length,
        totalSize: `${sizeInKB} KB`,
      };
    } catch (error) {
      console.error('Error getting backup stats:', error);
      return {
        tasks: 0,
        notes: 0,
        transactions: 0,
        settings: 0,
        totalSize: '0 KB',
      };
    }
  }
}

// Export singleton instance
export const backupManager = new BackupManager();