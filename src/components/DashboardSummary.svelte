<script lang="ts">
import { formatDateKey } from '../lib/date';
import { formatCurrency } from '../lib/currency';
import { appState } from '../stores/app.svelte';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import { settingsStore } from '../stores/settings.svelte';
import Card from './ui/Card.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';
import Button from './ui/Button.svelte';
import { reactiveRouter } from '../stores/router.svelte';

// Reactive values from stores
let { tasks, isLoading: tasksLoading, completedCount, totalCount } = $derived(reactiveTasks);
let { note, isLoading: noteLoading, hasNote, content } = $derived(reactiveNotes);
let { 
  transactions, 
  isLoading: transactionsLoading, 
  totalIncome, 
  totalExpenses, 
  netBalance,
  totalCount: transactionCount 
} = $derived(reactiveTransactions);
let { settings } = $derived(settingsStore);

const router = $derived(reactiveRouter);

// Watch for date changes and load data
$effect(() => {
  const dateKey = formatDateKey(appState.selectedDate);
  reactiveTasks.loadTasks(dateKey);
  reactiveNotes.loadNote(dateKey);
  reactiveTransactions.loadTransactions(dateKey);
  settingsStore.loadSettings();
});

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  const currency = settings?.currency || 'USD';
  const locale = settings?.locale || 'en-US';
  return formatCurrency(amount, currency, locale);
}

function navigateToCalendar() {
  router.navigate('/calendar');
}

// Get incomplete tasks for preview
const incompleteTasks = $derived.by(() => {
  return tasks.filter(task => !task.completed).slice(0, 3);
});

// Get pending tasks count
const pendingCount = $derived.by(() => {
  return tasks.filter(task => !task.completed).length;
});

// Get recent transactions for preview
const recentTransactions = $derived.by(() => {
  return transactions.slice(-3).reverse();
});
</script>

<Card title="Today's Summary" icon="home" iconColor="text-blue-500">
  {#snippet headerAction()}
    <Button
      variant="ghost"
      size="sm"
      onclick={navigateToCalendar}
      class="text-blue-600 hover:text-blue-700"
    >
      {#snippet children()}
        <Icon name="calendar" size="sm" class="mr-1" />
        View All
      {/snippet}
    </Button>
  {/snippet}

  {#snippet children()}
    <div class="space-y-6">
      <!-- Tasks Summary - Only show if there are pending tasks -->
      {#if tasksLoading || pendingCount > 0}
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <Icon name="clipboard" class="text-blue-600" size="sm" />
              <h3 class="font-medium text-blue-900">Tasks</h3>
            </div>
            {#if tasksLoading}
              <Icon name="loader" size="sm" class="animate-spin text-blue-600" />
            {:else if pendingCount > 0}
              <span class="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                {pendingCount} pending
              </span>
            {/if}
          </div>

          {#if tasksLoading}
            <Loading size="md" message="Loading tasks..." />
          {:else}
            <div class="space-y-2">
              {#each incompleteTasks as task (task.id)}
                <div class="flex items-center gap-2 text-sm">
                  <div class="w-3 h-3 border border-blue-400 rounded"></div>
                  <span class="text-blue-800 truncate">{task.description}</span>
                </div>
              {/each}
              
              {#if pendingCount > 3}
                <p class="text-xs text-blue-600 mt-2">
                  +{pendingCount - 3} more pending tasks
                </p>
              {/if}
              
              {#if completedCount > 0}
                <p class="text-xs text-green-600 mt-2">
                  ✓ {completedCount} completed
                </p>
              {/if}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Notes Summary -->
      <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <Icon name="edit" class="text-purple-600" size="sm" />
            <h3 class="font-medium text-purple-900">Daily Note</h3>
          </div>
          {#if noteLoading}
            <Icon name="loader" size="sm" class="animate-spin text-purple-600" />
          {:else if hasNote}
            <span class="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
              Written
            </span>
          {/if}
        </div>

        {#if noteLoading}
          <Loading size="md" message="Loading note..." />
        {:else if !hasNote}
          <p class="text-sm text-purple-700">No note for today</p>
        {:else}
          <div class="bg-white rounded-md p-3 border border-purple-200">
            <p class="text-sm text-purple-800 leading-relaxed">
              {notePreview}
            </p>
          </div>
        {/if}
      </div>

      <!-- Transactions Summary -->
      <div class="bg-green-50 rounded-lg p-4 border border-green-200">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <Icon name="dollar" class="text-green-600" size="sm" />
            <h3 class="font-medium text-green-900">Finances</h3>
          </div>
          {#if transactionsLoading}
            <Icon name="loader" size="sm" class="animate-spin text-green-600" />
          {:else if transactionCount > 0}
            <span class="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
              {transactionCount} transactions
            </span>
          {/if}
        </div>

        {#if transactionsLoading}
          <Loading size="md" message="Loading transactions..." />
        {:else if transactionCount === 0}
          <p class="text-sm text-green-700">No transactions for today</p>
        {:else}
          <div class="space-y-3">
            <!-- Financial Summary -->
            <div class="bg-white rounded-md p-3 border border-green-200">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-xs text-green-600">Income</p>
                  <p class="text-sm font-medium text-green-800">{formatAmount(totalIncome)}</p>
                </div>
                <div>
                  <p class="text-xs text-green-600">Expenses</p>
                  <p class="text-sm font-medium text-red-600">{formatAmount(totalExpenses)}</p>
                </div>
                <div>
                  <p class="text-xs text-green-600">Net</p>
                  <p class="text-sm font-medium {netBalance >= 0 ? 'text-green-700' : 'text-red-600'}">
                    {formatAmount(netBalance)}
                  </p>
                </div>
              </div>
            </div>

            <!-- Recent Transactions -->
            {#if recentTransactions.length > 0}
              <div class="space-y-1">
                {#each recentTransactions as transaction (transaction.id)}
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full {transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}"></div>
                      <span class="text-green-800 truncate">{transaction.description}</span>
                    </div>
                    <span class="text-xs font-medium {transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                      {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/snippet}
</Card>