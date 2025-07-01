// Backup and Restore functionality using Web Share API and File Download
import { db } from '../dexie/db';
import type { Note, Settings, Task, Transaction } from '../dexie/models';

export interface BackupData {
  app: string;
  version: string;
  schemaVersion?: number; // Add schema version tracking
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
  method: 'share' | 'clipboard' | 'download' | 'cancelled';
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
        schemaVersion: db.getCurrentSchemaVersion(), // Get current schema version dynamically
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
   * Check if file sharing is supported
   */
  isFileShareSupported(): boolean {
    if (!navigator.share) {
      return false;
    }

    // Create a test file to check if file sharing is supported
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      const testData = { files: [testFile] };
      
      return navigator.canShare ? navigator.canShare(testData) : true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Share backup file using Web Share API - NO FALLBACK
   */
  async shareBackupFile(): Promise<BackupResult> {
    try {
      const backupData = await this.exportAllData();
      const backupText = JSON.stringify(backupData, null, 2);
      const fileName = `tempoday-backup-${new Date().toISOString().split('T')[0]}.json`;

      if (!navigator.share) {
        throw new Error('Web Share API not supported on this device');
      }

      const blob = new Blob([backupText], { type: 'application/json' });
      const file = new File([blob], fileName, {
        type: 'application/json',
      });

      const shareData = {
        title: 'TempoDay Backup',
        text: 'My personal data backup from TempoDay',
        files: [file],
      };

      // Check if file sharing is supported
      if (navigator.canShare && !navigator.canShare(shareData)) {
        throw new Error('File sharing not supported on this device');
      }

      await navigator.share(shareData);
      
      return {
        success: true,
        method: 'share',
        message: 'Backup file shared successfully! Choose your preferred app to save it.',
      };
    } catch (error) {
      console.error('File share failed:', error);
      
      // Check if user cancelled the share
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          method: 'cancelled',
          message: 'Share cancelled by user',
        };
      }
      
      // For any other error, just throw it - no fallback
      throw error;
    }
  }

  /**
   * Copy backup text to clipboard
   */
  async copyBackupText(): Promise<BackupResult> {
    try {
      const backupData = await this.exportAllData();
      const backupText = JSON.stringify(backupData, null, 2);

      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard API not supported on this device');
      }

      await navigator.clipboard.writeText(backupText);
      
      return {
        success: true,
        method: 'clipboard',
        message: 'Backup copied to clipboard! Paste it in your notes app or email to save.',
      };
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      throw error;
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

    // Schema version is optional for backward compatibility
    if (data.schemaVersion !== undefined && typeof data.schemaVersion !== 'number') {
      return false;
    }

    return true;
  }

  /**
   * Migrate backup data to current schema version
   */
  private migrateBackupData(backupData: BackupData): BackupData {
    const currentSchemaVersion = db.getCurrentSchemaVersion();
    const backupSchemaVersion = backupData.schemaVersion || 1;

    console.log(`Migrating backup from schema version ${backupSchemaVersion} to ${currentSchemaVersion}`);

    if (backupSchemaVersion >= currentSchemaVersion) {
      console.log('No migration needed - backup is already up to date');
      return backupData; // No migration needed
    }

    // Clone the data to avoid modifying the original
    const migratedData = JSON.parse(JSON.stringify(backupData));

    // Migration from version 1 to 2: Add priority to tasks
    if (backupSchemaVersion < 2) {
      console.log('Migrating tasks: adding priority field');
      migratedData.data.tasks = migratedData.data.tasks.map((task: any) => ({
        ...task,
        priority: task.priority || 'medium'
      }));
    }

    // Migration from version 2 to 3: Add category to transactions
    if (backupSchemaVersion < 3) {
      console.log('Migrating transactions: adding category field');
      migratedData.data.transactions = migratedData.data.transactions.map((transaction: any) => ({
        ...transaction,
        category: transaction.category || (transaction.type === 'income' ? 'work' : 'other')
      }));
    }

    // Update schema version
    migratedData.schemaVersion = currentSchemaVersion;

    console.log('Migration completed successfully');
    return migratedData;
  }

  /**
   * Check what migrations would be applied to a backup
   */
  getMigrationInfo(backupData: BackupData): {
    currentVersion: number;
    backupVersion: number;
    needsMigration: boolean;
    migrationsNeeded: string[];
  } {
    const currentSchemaVersion = db.getCurrentSchemaVersion();
    const backupSchemaVersion = backupData.schemaVersion || 1;
    const needsMigration = backupSchemaVersion < currentSchemaVersion;
    const migrationsNeeded: string[] = [];

    if (backupSchemaVersion < 2) {
      migrationsNeeded.push('Add priority field to tasks (v1 → v2)');
    }
    if (backupSchemaVersion < 3) {
      migrationsNeeded.push('Add category field to transactions (v2 → v3)');
    }

    return {
      currentVersion: currentSchemaVersion,
      backupVersion: backupSchemaVersion,
      needsMigration,
      migrationsNeeded
    };
  }

  /**
   * Restore data from backup
   */
  async restoreFromBackup(backupData: BackupData): Promise<void> {
    if (!this.validateBackupData(backupData)) {
      throw new Error('Invalid backup data format');
    }

    try {
      // Migrate backup data to current schema version
      const migratedBackupData = this.migrateBackupData(backupData);

      // Clear existing data
      await Promise.all([
        db.tasks.clear(),
        db.notes.clear(),
        db.transactions.clear(),
        db.settings.clear(),
      ]);

      // Import migrated data
      await Promise.all([
        db.tasks.bulkAdd(migratedBackupData.data.tasks),
        db.notes.bulkAdd(migratedBackupData.data.notes),
        db.transactions.bulkAdd(migratedBackupData.data.transactions),
        db.settings.bulkAdd(migratedBackupData.data.settings),
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