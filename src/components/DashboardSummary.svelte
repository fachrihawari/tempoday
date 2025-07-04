<script lang="ts">
import { onMount } from 'svelte';
import { formatCurrency } from '../lib/currency';
import { formatDateKey } from '../lib/date';
import { getPriorityConfig } from '../lib/priority';
import { reactiveNotes } from '../stores/notes.svelte';
import { reactiveRouter } from '../stores/router.svelte';
import { settingsStore } from '../stores/settings.svelte';
import { reactiveTasks } from '../stores/tasks.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import Icon from './ui/Icon.svelte';
import Loading from './ui/Loading.svelte';

// Reactive values from stores
let {
  tasks,
  isLoading: tasksLoading,
  completedCount,
  totalCount,
} = $derived(reactiveTasks);
let {
  note,
  isLoading: noteLoading,
  hasNote,
  content,
} = $derived(reactiveNotes);
let {
  transactions,
  isLoading: transactionsLoading,
  totalIncome,
  totalExpenses,
  netBalance,
  totalCount: transactionCount,
  expenseTransactions,
} = $derived(reactiveTransactions);
let { settings } = $derived(settingsStore);

const router = $derived(reactiveRouter);

// Watch for date changes and load data
onMount(() => {
  const dateKey = formatDateKey(new Date());
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
  return tasks.filter((task) => !task.completed).slice(0, 3);
});

// Get pending tasks count
const pendingCount = $derived.by(() => {
  return tasks.filter((task) => !task.completed).length;
});

// Get recent expenses for preview (last 3 expenses)
const recentExpenses = $derived.by(() => {
  return expenseTransactions.slice(-3).reverse();
});

// Get expense count
const expenseCount = $derived.by(() => {
  return expenseTransactions.length;
});

// Check if we should show the summary card
const shouldShowSummary = $derived.by(() => {
  // Show if we're loading any data
  if (tasksLoading || transactionsLoading) {
    return true;
  }

  // Show if there are pending tasks or expenses
  return pendingCount > 0 || expenseCount > 0;
});
</script>

<!-- Only show the card if there's content to display -->
{#if shouldShowSummary}
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
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Icon name="clipboard" class="text-blue-600 dark:text-blue-400" size="sm" />
                <h3 class="font-medium text-blue-900 dark:text-blue-100">Pending Tasks</h3>
              </div>
              {#if tasksLoading}
                <Icon name="loader" size="sm" class="animate-spin text-blue-600 dark:text-blue-400" />
              {:else if pendingCount > 0}
                <span class="text-sm text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full">
                  {pendingCount} pending
                </span>
              {/if}
            </div>

            {#if tasksLoading}
              <Loading size="md" message="Loading tasks..." />
            {:else}
              <div class="space-y-2">
                {#each incompleteTasks as task (task.id)}
                  {@const priorityConfig = getPriorityConfig(task.priority)}
                  <div class="flex items-center gap-2 text-sm bg-white dark:bg-gray-800 rounded-md p-2 border border-blue-100 dark:border-blue-800">
                    <div class="w-3 h-3 border border-blue-400 dark:border-blue-500 rounded"></div>
                    <span class="text-blue-800 dark:text-blue-200 truncate flex-1">{task.description}</span>
                    <span class="text-xs px-1.5 py-0.5 rounded-full border flex items-center gap-1 font-medium
                      {task.priority === 'urgent' ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700' :
                       task.priority === 'high' ? 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700' :
                       task.priority === 'medium' ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' :
                       'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}">
                      <span>{priorityConfig.icon}</span>
                      <span>{priorityConfig.label}</span>
                    </span>
                  </div>
                {/each}
                
                {#if pendingCount > 3}
                  <p class="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    +{pendingCount - 3} more pending tasks
                  </p>
                {/if}
                
                {#if completedCount > 0}
                  <p class="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ {completedCount} completed today
                  </p>
                {/if}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Recent Expenses Summary - Only show if there are expenses -->
        {#if transactionsLoading || expenseCount > 0}
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <Icon name="trending-down" class="text-red-600 dark:text-red-400" size="sm" />
                <h3 class="font-medium text-red-900 dark:text-red-100">Recent Expenses</h3>
              </div>
              {#if transactionsLoading}
                <Icon name="loader" size="sm" class="animate-spin text-red-600 dark:text-red-400" />
              {:else if expenseCount > 0}
                <span class="text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800 px-2 py-1 rounded-full">
                  {formatAmount(totalExpenses)} spent
                </span>
              {/if}
            </div>

            {#if transactionsLoading}
              <Loading size="md" message="Loading expenses..." />
            {:else if expenseCount === 0}
              <p class="text-sm text-red-700 dark:text-red-300">No expenses for today</p>
            {:else}
              <div class="space-y-2">
                {#each recentExpenses as expense (expense.id)}
                  <div class="flex items-center justify-between text-sm bg-white dark:bg-gray-800 rounded-md p-2 border border-red-100 dark:border-red-800">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <div class="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400"></div>
                      <span class="text-red-800 dark:text-red-200 truncate">{expense.description}</span>
                    </div>
                    <span class="text-sm font-medium text-red-600 dark:text-red-400">
                      -{formatAmount(expense.amount)}
                    </span>
                  </div>
                {/each}
                
                {#if expenseCount > 3}
                  <p class="text-xs text-red-600 dark:text-red-400 mt-2">
                    +{expenseCount - 3} more expenses
                  </p>
                {/if}
                
                {#if totalIncome > 0}
                  <p class="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ {formatAmount(totalIncome)} income today
                  </p>
                {/if}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/snippet}
  </Card>
{/if}