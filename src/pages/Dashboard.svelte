<script lang="ts">
import { onMount } from 'svelte';
import { formatDate } from '../lib/date';
import { appState } from '../stores/app.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { settingsStore } from '../stores/settings.svelte';
import { formatCurrency } from '../lib/currency';
import { formatDateKey } from '../lib/date';
import { navigate } from '../stores/router.svelte';
import Card from '../components/ui/Card.svelte';
import Button from '../components/ui/Button.svelte';
import Icon from '../components/ui/Icon.svelte';
import Loading from '../components/ui/Loading.svelte';

// Reactive values from stores
let { tasks, isLoading: tasksLoading } = $derived(reactiveTasks);
let { transactions, totalIncome, totalExpenses, netBalance, isLoading: transactionsLoading } = $derived(reactiveTransactions);
let { hasNote, isLoading: notesLoading } = $derived(reactiveNotes);
let { settings } = $derived(settingsStore);

// Load data for today
onMount(async () => {
  const today = formatDateKey(new Date());
  
  // Load settings first
  await settingsStore.loadSettings();
  
  // Load data for today
  await Promise.all([
    reactiveTasks.loadTasks(today),
    reactiveTransactions.loadTransactions(today),
    reactiveNotes.loadNote(today)
  ]);
});

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  const currency = settings?.currency || 'USD';
  const locale = settings?.locale || 'en-US';
  return formatCurrency(amount, currency, locale);
}

function goToCalendar() {
  navigate('/calendar');
}
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">TempoDay</h1>
      <p class="text-sm text-gray-600">{formatDate(new Date())}</p>
    </div>
    <Button variant="primary" onclick={goToCalendar} class="px-4 py-2">
      {#snippet children()}
        <Icon name="calendar" size="sm" class="mr-2" />
        View Calendar
      {/snippet}
    </Button>
  </div>

  <!-- Dashboard Content -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Tasks Summary -->
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <Icon name="clipboard" class="text-blue-500 mb-2" />
            <p class="text-sm text-blue-600 font-medium">Today's Tasks</p>
            {#if tasksLoading}
              <div class="flex items-center mt-1">
                <Icon name="loader" size="sm" class="animate-spin mr-1" />
                <span class="text-xs text-blue-500">Loading...</span>
              </div>
            {:else}
              <p class="text-2xl font-bold text-blue-700">
                {tasks.filter(t => t.completed).length}/{tasks.length}
              </p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Finance Summary -->
      <div class="bg-green-50 rounded-lg p-4 border border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <Icon name="dollar" class="text-green-500 mb-2" />
            <p class="text-sm text-green-600 font-medium">Net Balance</p>
            {#if transactionsLoading}
              <div class="flex items-center mt-1">
                <Icon name="loader" size="sm" class="animate-spin mr-1" />
                <span class="text-xs text-green-500">Loading...</span>
              </div>
            {:else}
              <p class="text-lg font-bold {netBalance >= 0 ? 'text-green-700' : 'text-red-600'}">
                {formatAmount(netBalance)}
              </p>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Overview -->
    <Card title="Today's Overview" class="space-y-4">
      {#snippet children()}
        <!-- Tasks Section -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-900 flex items-center gap-2">
            <Icon name="clipboard" size="sm" class="text-blue-500" />
            Tasks
          </h3>
          {#if tasksLoading}
            <Loading size="md" message="Loading tasks..." />
          {:else if tasks.length === 0}
            <p class="text-sm text-gray-500 pl-6">No tasks for today</p>
          {:else}
            <div class="pl-6 space-y-1">
              {#each tasks.slice(0, 3) as task}
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-2 h-2 rounded-full {task.completed ? 'bg-green-500' : 'bg-gray-300'}"></div>
                  <span class="{task.completed ? 'line-through text-gray-500' : 'text-gray-900'}">{task.description}</span>
                </div>
              {/each}
              {#if tasks.length > 3}
                <p class="text-xs text-gray-500">+{tasks.length - 3} more tasks</p>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Note Section -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-900 flex items-center gap-2">
            <Icon name="edit" size="sm" class="text-purple-500" />
            Daily Note
          </h3>
          {#if notesLoading}
            <Loading size="md" message="Loading note..." />
          {:else if hasNote}
            <p class="text-sm text-gray-600 pl-6">✓ Note added for today</p>
          {:else}
            <p class="text-sm text-gray-500 pl-6">No note for today</p>
          {/if}
        </div>

        <!-- Finance Section -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-900 flex items-center gap-2">
            <Icon name="dollar" size="sm" class="text-green-500" />
            Finances
          </h3>
          {#if transactionsLoading}
            <Loading size="md" message="Loading transactions..." />
          {:else if transactions.length === 0}
            <p class="text-sm text-gray-500 pl-6">No transactions for today</p>
          {:else}
            <div class="pl-6 space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Income:</span>
                <span class="text-green-600 font-medium">{formatAmount(totalIncome)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Expenses:</span>
                <span class="text-red-600 font-medium">{formatAmount(totalExpenses)}</span>
              </div>
              <div class="flex justify-between font-medium">
                <span class="text-gray-900">Net:</span>
                <span class="{netBalance >= 0 ? 'text-green-600' : 'text-red-600'}">{formatAmount(netBalance)}</span>
              </div>
            </div>
          {/if}
        </div>
      {/snippet}
    </Card>
  </div>
</div>