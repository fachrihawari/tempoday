<script lang="ts">
import { backupManager } from '../lib/backup';
import Alert from './ui/Alert.svelte';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';

let showBackupModal = $state(false);
let showRestoreModal = $state(false);
let isBackingUp = $state(false);
let isRestoring = $state(false);
let backupResult = $state<{
  success: boolean;
  method: string;
  message: string;
} | null>(null);
let restoreResult = $state<{
  success: boolean;
  message: string;
} | null>(null);
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

async function handleWebShareBackup() {
  isBackingUp = true;
  backupResult = null;

  try {
    const result = await backupManager.createBackup();
    backupResult = result;
    
    if (result.success) {
      // Auto-close modal after success
      setTimeout(() => {
        showBackupModal = false;
        backupResult = null;
      }, 3000);
    }
  } catch (error) {
    console.error('Backup failed:', error);
    backupResult = {
      success: false,
      method: 'error',
      message: error instanceof Error ? error.message : 'Backup failed'
    };
  } finally {
    isBackingUp = false;
  }
}

async function handleDownloadBackup() {
  isBackingUp = true;
  backupResult = null;

  try {
    const result = await backupManager.createDownloadBackup();
    backupResult = result;
    
    if (result.success) {
      // Auto-close modal after success
      setTimeout(() => {
        showBackupModal = false;
        backupResult = null;
      }, 3000);
    }
  } catch (error) {
    console.error('Download backup failed:', error);
    backupResult = {
      success: false,
      method: 'error',
      message: error instanceof Error ? error.message : 'Download backup failed'
    };
  } finally {
    isBackingUp = false;
  }
}

async function handleRestoreFromClipboard() {
  isRestoring = true;
  restoreResult = null;

  try {
    await backupManager.restoreFromClipboard();
    restoreResult = {
      success: true,
      message: 'Data restored successfully from clipboard!'
    };
    
    // Reload backup stats after restore
    await loadBackupStats();
    
    // Auto-close modal after success
    setTimeout(() => {
      showRestoreModal = false;
      restoreResult = null;
    }, 3000);
  } catch (error) {
    console.error('Restore failed:', error);
    restoreResult = {
      success: false,
      message: error instanceof Error ? error.message : 'Restore failed'
    };
  } finally {
    isRestoring = false;
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
    restoreResult = null;

    try {
      await backupManager.restoreFromFile(file);
      restoreResult = {
        success: true,
        message: 'Data restored successfully from file!'
      };
      
      // Reload backup stats after restore
      await loadBackupStats();
      
      // Auto-close modal after success
      setTimeout(() => {
        showRestoreModal = false;
        restoreResult = null;
      }, 3000);
    } catch (error) {
      console.error('Restore failed:', error);
      restoreResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Restore failed'
      };
    } finally {
      isRestoring = false;
    }
  };

  input.click();
}

function getBackupMethodIcon(method: string): string {
  switch (method) {
    case 'share': return '📤';
    case 'shareText': return '📝';
    case 'clipboard': return '📋';
    case 'download': return '💾';
    default: return '✅';
  }
}

function getBackupMethodTitle(method: string): string {
  switch (method) {
    case 'share': return 'Shared Successfully!';
    case 'shareText': return 'Shared as Text!';
    case 'clipboard': return 'Copied to Clipboard!';
    case 'download': return 'File Downloaded!';
    default: return 'Backup Complete!';
  }
}
</script>

<!-- Backup Stats -->
{#if backupStats}
  <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 mb-6">
    <h4 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
      <Icon name="info-circle" class="text-blue-500" size="sm" />
      Your Data Summary
    </h4>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-lg p-3 border border-blue-100">
        <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Tasks</div>
        <div class="font-semibold text-gray-900">{backupStats.tasks}</div>
      </div>
      <div class="bg-white rounded-lg p-3 border border-purple-100">
        <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</div>
        <div class="font-semibold text-gray-900">{backupStats.notes}</div>
      </div>
      <div class="bg-white rounded-lg p-3 border border-green-100">
        <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Transactions</div>
        <div class="font-semibold text-gray-900">{backupStats.transactions}</div>
      </div>
      <div class="bg-white rounded-lg p-3 border border-gray-100">
        <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Size</div>
        <div class="font-semibold text-gray-900">{backupStats.totalSize}</div>
      </div>
    </div>
  </div>
{/if}

<!-- Action Buttons -->
<div class="space-y-3">
  <Button
    variant="primary"
    fullWidth
    onclick={() => showBackupModal = true}
    class="!p-4 !text-left !justify-start"
  >
    {#snippet children()}
      <div class="flex items-center gap-4 w-full">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon name="save" class="text-blue-600" size="lg" />
        </div>
        <div class="flex-1">
          <div class="font-medium text-white">Create Backup</div>
          <div class="text-sm text-blue-100">Export your data safely</div>
        </div>
        <Icon name="chevron-right" class="text-blue-200" />
      </div>
    {/snippet}
  </Button>

  <Button
    variant="outline"
    fullWidth
    onclick={() => showRestoreModal = true}
    class="!p-4 !text-left !justify-start"
  >
    {#snippet children()}
      <div class="flex items-center gap-4 w-full">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <Icon name="trending-up" class="text-green-600" size="lg" />
        </div>
        <div class="flex-1">
          <div class="font-medium text-gray-900">Restore Data</div>
          <div class="text-sm text-gray-600">Import from backup</div>
        </div>
        <Icon name="chevron-right" class="text-gray-400" />
      </div>
    {/snippet}
  </Button>
</div>

<!-- Backup Modal -->
<BottomSheet bind:open={showBackupModal} title="Create Backup">
  {#snippet children()}
    <div class="space-y-6">
      {#if backupResult?.success}
        <!-- Success State -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div class="text-4xl mb-3">{getBackupMethodIcon(backupResult.method)}</div>
          <h3 class="font-medium text-green-900 text-lg mb-2">
            {getBackupMethodTitle(backupResult.method)}
          </h3>
          <p class="text-sm text-green-700">
            {backupResult.message}
          </p>
        </div>
      {:else if backupResult && !backupResult.success}
        <!-- Error State -->
        <Alert
          type="error"
          description={backupResult.message}
          dismissible={true}
          onDismiss={() => backupResult = null}
        />
      {:else}
        <!-- Backup Options -->
        <div class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="save" class="text-blue-600" size="xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Export Your Data</h3>
            <p class="text-sm text-gray-600">
              Choose how you'd like to save your TempoDay backup
            </p>
          </div>

          <!-- Web Share Option -->
          <Button
            variant="primary"
            fullWidth
            onclick={handleWebShareBackup}
            disabled={isBackingUp}
            class="!p-4 !text-left !justify-start"
          >
            {#snippet children()}
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <span class="text-2xl">📤</span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-white">Share to Apps</div>
                  <div class="text-sm text-blue-100">Save to Drive, email, or notes app</div>
                </div>
                {#if isBackingUp}
                  <Icon name="loader" class="animate-spin text-blue-200" />
                {:else}
                  <Icon name="chevron-right" class="text-blue-200" />
                {/if}
              </div>
            {/snippet}
          </Button>

          <!-- Download File Option -->
          <Button
            variant="outline"
            fullWidth
            onclick={handleDownloadBackup}
            disabled={isBackingUp}
            class="!p-4 !text-left !justify-start"
          >
            {#snippet children()}
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span class="text-2xl">💾</span>
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">Download File</div>
                  <div class="text-sm text-gray-600">Save backup file to Downloads</div>
                </div>
                {#if isBackingUp}
                  <Icon name="loader" class="animate-spin text-gray-400" />
                {:else}
                  <Icon name="chevron-right" class="text-gray-400" />
                {/if}
              </div>
            {/snippet}
          </Button>

          <!-- Coming Soon Option -->
          <div class="opacity-60">
            <div class="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <span class="text-2xl">☁️</span>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-700">Cloud Storage</div>
                <div class="text-sm text-gray-500">Auto-sync to cloud services</div>
              </div>
              <span class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Soon</span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        {#if isBackingUp}
          <div class="flex items-center justify-center py-8">
            <Loading size="xl" message="Creating your backup..." />
          </div>
        {/if}
      {/if}

      <!-- Tips Section -->
      {#if !backupResult}
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Backup Tips
          </h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Use "Share to Apps" for cloud backup</li>
            <li>• Use "Download File" for local backup</li>
            <li>• Keep multiple backup copies</li>
            <li>• Test restore process occasionally</li>
          </ul>
        </div>
      {/if}
    </div>
  {/snippet}
</BottomSheet>

<!-- Restore Modal -->
<BottomSheet bind:open={showRestoreModal} title="Restore Data">
  {#snippet children()}
    <div class="space-y-6">
      {#if restoreResult?.success}
        <!-- Success State -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div class="text-4xl mb-3">✅</div>
          <h3 class="font-medium text-green-900 text-lg mb-2">
            Restore Successful!
          </h3>
          <p class="text-sm text-green-700">
            {restoreResult.message}
          </p>
        </div>
      {:else if restoreResult && !restoreResult.success}
        <!-- Error State -->
        <Alert
          type="error"
          description={restoreResult.message}
          dismissible={true}
          onDismiss={() => restoreResult = null}
        />
      {:else}
        <!-- Restore Options -->
        <div class="space-y-4">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="trending-up" class="text-green-600" size="xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Import Your Data</h3>
            <p class="text-sm text-gray-600">
              Choose how you'd like to restore your TempoDay backup
            </p>
          </div>

          <!-- Restore Options -->
          <div class="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onclick={handleRestoreFromClipboard}
              disabled={isRestoring}
              class="!p-4 !text-left !justify-start"
            >
              {#snippet children()}
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span class="text-2xl">📋</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-white">Paste from Clipboard</div>
                    <div class="text-sm text-purple-100">Paste backup data you copied</div>
                  </div>
                  {#if isRestoring}
                    <Icon name="loader" class="animate-spin text-purple-200" />
                  {:else}
                    <Icon name="chevron-right" class="text-purple-200" />
                  {/if}
                </div>
              {/snippet}
            </Button>

            <Button
              variant="outline"
              fullWidth
              onclick={handleRestoreFromFile}
              disabled={isRestoring}
              class="!p-4 !text-left !justify-start"
            >
              {#snippet children()}
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span class="text-2xl">📁</span>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">Upload File</div>
                    <div class="text-sm text-gray-600">Select backup file from device</div>
                  </div>
                  <Icon name="chevron-right" class="text-gray-400" />
                </div>
              {/snippet}
            </Button>
          </div>
        </div>

        <!-- Loading State -->
        {#if isRestoring}
          <div class="flex items-center justify-center py-8">
            <Loading size="xl" message="Restoring your data..." />
          </div>
        {/if}
      {/if}

      <!-- Warning Section -->
      {#if !restoreResult}
        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 class="font-medium text-yellow-900 mb-2 flex items-center gap-2">
            <Icon name="exclamation-triangle" class="text-yellow-600" size="sm" />
            Important Notice
          </h4>
          <p class="text-sm text-yellow-800">
            Restoring will replace all your current data. Make sure you have a recent backup before proceeding.
          </p>
        </div>
      {/if}
    </div>
  {/snippet}
</BottomSheet>