<script lang="ts">
import { onMount } from 'svelte';
import { formatCurrency } from '../../lib/currency';
import { formatDateKey } from '../../lib/date';
import { reactiveRouter } from '../../stores/router.svelte';
import { settingsStore } from '../../stores/settings.svelte';
import { reactiveTasks } from '../../stores/tasks.svelte';
import { reactiveTransactions } from '../../stores/transactions.svelte';
import TaskItem from '../tasks/TaskItem.svelte';
import TransactionItem from '../transactions/TransactionItem.svelte';
import Button from '../ui/Button.svelte';
import Card from '../ui/Card.svelte';
import Icon from '../ui/Icon.svelte';
import Loading from '../ui/Loading.svelte';

// Reactive values from stores
let {
  isLoading: tasksLoading,
  pendingCount,
  completedCount,
  incompleteTasks,
} = $derived(reactiveTasks);
let {
  isLoading: transactionsLoading,
  totalIncome,
  totalExpenses,
  expenseCount,
  expenseTransactions,
} = $derived(reactiveTransactions);
let { settings } = $derived(settingsStore);
const router = $derived(reactiveRouter);

// Watch for date changes and load data
onMount(() => {
  const dateKey = formatDateKey(new Date());
  reactiveTasks.loadTasks(dateKey);
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

// Get recent expenses for preview (last 3 expenses)
const recentExpenses = $derived(expenseTransactions.slice(-3).reverse());

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
  <Card>
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
        <!-- Tasks Summary -->
        {#if tasksLoading || pendingCount > 0}
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  name="clipboard"
                  class="text-blue-600 dark:text-blue-400"
                  size="sm"
                />
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">
                  Today's Tasks
                </h3>
              </div>
              {#if tasksLoading}
                <Icon
                  name="loader"
                  size="sm"
                  class="animate-spin text-blue-600 dark:text-blue-400"
                />
              {:else if pendingCount > 0}
                <span
                  class="text-sm text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full font-medium"
                >
                  {pendingCount} pending
                </span>
              {/if}
            </div>

            {#if tasksLoading}
              <Loading size="md" message="Loading tasks..." />
            {:else}
              <div class="space-y-2">
                {#each incompleteTasks as task (task.id)}
                  <TaskItem {task} compact />
                {/each}

                <div class="flex gap-x-2">
                  {#if completedCount > 0}
                    <div
                      class="text-center py-2 border-gray-200 dark:border-gray-700"
                    >
                      <p
                        class="text-sm text-green-600 dark:text-green-400 font-medium"
                      >
                        ✓ {completedCount} completed today
                      </p>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Recent Expenses Summary -->
        {#if transactionsLoading || expenseCount > 0}
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon
                  name="trending-down"
                  class="text-red-600 dark:text-red-400"
                  size="sm"
                />
                <h3 class="font-semibold text-gray-900 dark:text-gray-100">
                  Today's Expenses
                </h3>
              </div>
              {#if transactionsLoading}
                <Icon
                  name="loader"
                  size="sm"
                  class="animate-spin text-red-600 dark:text-red-400"
                />
              {:else if expenseCount > 0}
                <span
                  class="text-sm text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800 px-2 py-1 rounded-full font-medium"
                >
                  {formatAmount(totalExpenses)} spent
                </span>
              {/if}
            </div>

            {#if transactionsLoading}
              <Loading size="md" message="Loading expenses..." />
            {:else if expenseCount === 0}
              <div class="text-center py-8">
                <Icon
                  name="trending-down"
                  size="xl"
                  class="text-gray-400 dark:text-gray-600 mx-auto mb-2"
                />
                <p class="text-gray-600 dark:text-gray-400">
                  No expenses for today
                </p>
              </div>
            {:else}
              <div class="space-y-2">
                {#each recentExpenses as expense (expense.id)}
                  <TransactionItem transaction={expense} compact />
                {/each}

                <div class="flex gap-x-2">
                  {#if expenseCount > 3}
                    <div class="text-center py-2">
                      <p class="text-sm text-red-600 dark:text-red-400">
                        +{expenseCount - 3} more expenses
                      </p>
                    </div>
                  {/if}

                  {#if totalIncome > 0}
                    <div
                      class="text-center py-2 border-gray-200 dark:border-gray-700"
                    >
                      <p
                        class="text-sm text-green-600 dark:text-green-400 font-medium"
                      >
                        ✓ {formatAmount(totalIncome)} income today
                      </p>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/snippet}
  </Card>
{/if}
