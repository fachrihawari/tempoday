<!-- Enhanced FinanceSection using reusable UI components -->
<script lang="ts">
import { onMount } from 'svelte';
import DatePicker from '../components/DatePicker.svelte';
import TransactionFormModal from '../components/transactions/TransactionFormModal.svelte';
import TransactionItem from '../components/transactions/TransactionItem.svelte';
import Button from '../components/ui/Button.svelte';
import Card from '../components/ui/Card.svelte';
import EmptyState from '../components/ui/EmptyState.svelte';
import Fab from '../components/ui/Fab.svelte';
import Icon from '../components/ui/Icon.svelte';
import Loading from '../components/ui/Loading.svelte';
import PageHeader from '../components/ui/PageHeader.svelte';
import { formatCurrency } from '../lib/currency';
import { formatDateKey } from '../lib/date';
import { appState } from '../stores/app.svelte';
import { reactiveRouter } from '../stores/router.svelte';
import { settingsStore } from '../stores/settings.svelte';
import { toastStore } from '../stores/toast.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';

const router = $derived(reactiveRouter);
// Reactive values from the store
let {
  transactions,
  isLoading,
  error,
  totalIncome,
  totalExpenses,
  netBalance,
  totalCount,
} = $derived(reactiveTransactions);

// Reactive settings
let { settings } = $derived(settingsStore);

let openForm = $state(false);

// Watch for date changes and load transactions
$effect(() => {
  const dateKey = formatDateKey(appState.selectedDate);
  reactiveTransactions.loadTransactions(dateKey);
});

// Load settings when component mounts
onMount(() => {
  settingsStore.loadSettings();
});

// Watch for errors and show toast
$effect(() => {
  if (error) {
    toastStore.error(error);
    reactiveTransactions.clearError();
  }
});

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  // Provide fallback values if settings haven't loaded yet
  const currency = settings?.currency || 'USD';
  const locale = settings?.locale || 'en-US';
  return formatCurrency(amount, currency, locale);
}
</script>

<!-- Header Component -->
<PageHeader title="Transactions" icon="dollar">
  <!-- Search button -->
  <Button
    onclick={() => router.navigate("/search")}
    variant="outline"
    aria-label="Go to search page"
  >
    <Icon name="search" class="text-gray-600 dark:text-gray-300" />
  </Button>
</PageHeader>

<!-- DatePicker Component -->
<DatePicker />
<Card>
  {#snippet headerAction()}
    {#if isLoading}
      <Icon name="loader" size="sm" class="animate-spin" />
    {:else if totalCount > 0}
      <span class="text-sm text-gray-500">
        {totalCount} transaction{totalCount !== 1 ? "s" : ""}
      </span>
    {/if}
  {/snippet}

  {#snippet children()}
    <!-- Daily Summary -->
    {#if transactions.length > 0 && !isLoading}
      <div
        class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4 space-y-2 border border-gray-200 dark:border-gray-700"
      >
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Income:</span>
          <span class="text-green-600 dark:text-green-400 font-medium"
            >{formatAmount(totalIncome)}</span
          >
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Expenses:</span>
          <span class="text-red-600 dark:text-red-400 font-medium"
            >{formatAmount(totalExpenses)}</span
          >
        </div>
        <hr class="border-gray-200 dark:border-gray-600" />
        <div class="flex justify-between text-sm font-semibold">
          <span class="text-gray-900 dark:text-gray-100">Net Balance:</span>
          <span
            class={netBalance >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"}
          >
            {formatAmount(netBalance)}
          </span>
        </div>
      </div>
    {/if}

    <!-- Transaction List -->
    <div class="space-y-2">
      {#if isLoading}
        <Loading size="xl" message="Loading transactions..." />
      {:else}
        {#each transactions as transaction (transaction.id)}
          <TransactionItem {transaction} />
        {/each}

        {#if transactions.length === 0}
          <EmptyState
            icon="dollar"
            title="No transactions for this day"
            subtitle="Write your first transaction to get started!"
          />
        {/if}
      {/if}
    </div>

    <TransactionFormModal bind:open={openForm} />

    <Fab icon="plus" onclick={() => (openForm = true)} />
  {/snippet}
</Card>
