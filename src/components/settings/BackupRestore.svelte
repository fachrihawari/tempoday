<script lang="ts">
import { backupManager } from '../../lib/backup';
import { formatDateKey } from '../../lib/date';
import { appState } from '../../stores/app.svelte';
import { reactiveNotes } from '../../stores/notes.svelte';
import { settingsStore } from '../../stores/settings.svelte';
import { reactiveTasks } from '../../stores/tasks.svelte';
import { toastStore } from '../../stores/toast.svelte';
import { reactiveTransactions } from '../../stores/transactions.svelte';
import Button from '../ui/Button.svelte';
import Icon from '../ui/Icon.svelte';

let isBackingUp = $state(false);
let isRestoring = $state(false);

let backupStats = $state<{
  tasks: number;
  notes: number;
  transactions: number;
  settings: number;
  totalSize: string;
} | null>(null);

// Load backup stats when component mounts
$effect(() => {
  loadBackupStats();
});

async function loadBackupStats() {
  try {
    backupStats = await backupManager.getBackupStats();
  } catch (error) {
    console.error('Failed to load backup stats:', error);
  }
}

// Helper function to force refetch all data for current date
async function forceRefetchCurrentData() {
  try {
    const currentDateKey = formatDateKey(appState.selectedDate);

    // Clear the current date cache to force reload
    reactiveTasks.currentDate = '';
    reactiveNotes.currentDate = '';
    reactiveTransactions.currentDate = '';

    // Force reload all data for the current selected date
    await Promise.all([
      reactiveTasks.loadTasks(currentDateKey),
      reactiveTransactions.loadTransactions(currentDateKey),
      settingsStore.loadSettings(),
    ]);

    console.log(
      'Successfully force refetched data for current date:',
      currentDateKey,
    );
  } catch (error) {
    console.error('Failed to force refetch current data:', error);
  }
}

async function handleDownloadBackup() {
  isBackingUp = true;

  try {
    await backupManager.createDownloadBackup();

    toastStore.success('Backup file downloaded successfully!');
  } catch (error) {
    toastStore.error((error as Error).message);
  } finally {
    isBackingUp = false;
  }
}

async function handleRestoreFromFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';

  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    isRestoring = true;

    try {
      await backupManager.restoreFromFile(file);
      // Only show success in the bottom sheet - no toast needed
      toastStore.success('Data restored successfully from file!');

      // Reload backup stats after restore
      await loadBackupStats();

      // Force refetch current data to show restored content
      await forceRefetchCurrentData();
    } catch (error) {
      console.error('Restore failed:', error);
      const message = error instanceof Error ? error.message : 'Restore failed';
      toastStore.error(message);
    } finally {
      isRestoring = false;
    }
  };

  input.click();
}
</script>

<!-- Backup Stats -->
{#if backupStats}
  <div
    class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-4"
  >
    <h4
      class="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"
    >
      <Icon
        name="info-circle"
        class="text-blue-500 dark:text-blue-400"
        size="sm"
      />
      Your Data Summary
    </h4>
    <div class="grid grid-cols-2 gap-3">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-blue-800"
      >
        <div
          class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1"
        >
          Tasks
        </div>
        <div class="font-semibold text-gray-900 dark:text-gray-100">
          {backupStats.tasks}
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800"
      >
        <div
          class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1"
        >
          Notes
        </div>
        <div class="font-semibold text-gray-900 dark:text-gray-100">
          {backupStats.notes}
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-100 dark:border-green-800"
      >
        <div
          class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1"
        >
          Transactions
        </div>
        <div class="font-semibold text-gray-900 dark:text-gray-100">
          {backupStats.transactions}
        </div>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700"
      >
        <div
          class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1"
        >
          Total Size
        </div>
        <div class="font-semibold text-gray-900 dark:text-gray-100">
          {backupStats.totalSize}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Sync Options (Integrated, no modals, minimal borders) -->
<div class="flex flex-col gap-y-3">
  <Button
    variant="primary"
    fullWidth
    onclick={handleDownloadBackup}
    class="!p-4 !text-left !justify-start"
    disabled={isBackingUp}
  >
    {#snippet children()}
      <div class="flex items-center gap-4 w-full">
        <div
          class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center"
        >
          <Icon
            name="save"
            class="text-blue-600 dark:text-blue-400"
            size="lg"
          />
        </div>
        <div class="flex-1">
          <div class="font-medium text-white">Create Backup</div>
          <div class="text-sm text-blue-100 dark:text-blue-200">
            Export your data safely
          </div>
        </div>
        {#if isBackingUp}
          <Icon
            name="loader"
            class="animate-spin text-gray-400 dark:text-gray-500"
          />
        {:else}
          <Icon name="chevron-right" class="text-blue-200 dark:text-blue-300" />
        {/if}
      </div>
    {/snippet}
  </Button>
  <Button
    variant="outline"
    fullWidth
    onclick={handleRestoreFromFile}
    class="!p-4 !text-left !justify-start"
    disabled={isRestoring}
  >
    {#snippet children()}
      <div class="flex items-center gap-4 w-full">
        <div
          class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center"
        >
          <Icon
            name="trending-up"
            class="text-green-600 dark:text-green-400"
            size="lg"
          />
        </div>
        <div class="flex-1">
          <div class="font-medium text-gray-900 dark:text-gray-100">
            Restore Data
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            Import from backup
          </div>
        </div>
        <Icon name="chevron-right" class="text-gray-400 dark:text-gray-500" />
      </div>
    {/snippet}
  </Button>
</div>
