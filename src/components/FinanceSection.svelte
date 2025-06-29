<!-- Enhanced FinanceSection using reusable UI components -->
<script lang="ts">
import { onMount } from 'svelte';
import { formatCurrency } from '../lib/currency';
import { formatDateKey } from '../lib/date';
import { appState } from '../stores/app.svelte';
import { settingsStore } from '../stores/settings.svelte';
import { toastStore } from '../stores/toast.svelte';
import { reactiveTransactions } from '../stores/transactions.svelte';
import BottomSheet from './ui/BottomSheet.svelte';
import Button from './ui/Button.svelte';
import Card from './ui/Card.svelte';
import EmptyState from './ui/EmptyState.svelte';
import Icon from './ui/Icon.svelte';
import Input from './ui/Input.svelte';
import Loading from './ui/Loading.svelte';

// Reactive values from the store
let {
  transactions,
  isLoading,
  isCreating,
  isDeleting,
  error,
  totalIncome,
  totalExpenses,
  netBalance,
  totalCount,
} = $derived(reactiveTransactions);

// Reactive settings
let { settings } = $derived(settingsStore);

let showAddForm = $state(false);
let description = $state('');
let amount = $state(0);
let type = $state<'income' | 'expense'>('expense');

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

async function handleAddTransaction(event?: Event) {
  if (event) {
    event.preventDefault();
  }

  const desc = description.trim();

  const dateKey = formatDateKey(appState.selectedDate);
  try {
    await reactiveTransactions.createTransaction({
      description: desc,
      amount,
      type,
      date: dateKey,
    });
    toastStore.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
    resetForm();
  } catch (err) {
    console.error('Failed to add transaction:', err);
    // Error is already handled by reactive store
  }
}

function resetForm() {
  description = '';
  amount = 0;
  type = 'expense';
  showAddForm = false;
}
</script>

<Card title="Financial Records" icon="dollar" iconColor="text-green-500">
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
      <div class="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Income:</span>
          <span class="text-green-600 font-medium"
            >{formatAmount(totalIncome)}</span
          >
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Expenses:</span>
          <span class="text-red-600 font-medium"
            >{formatAmount(totalExpenses)}</span
          >
        </div>
        <hr class="border-gray-200" />
        <div class="flex justify-between text-sm font-semibold">
          <span class="text-gray-900">Net Balance:</span>
          <span class={netBalance >= 0 ? "text-green-600" : "text-red-600"}>
            {formatAmount(netBalance)}
          </span>
        </div>
      </div>
    {/if}

    <!-- Transaction List -->
    <div class="space-y-2" class:mb-4={transactions.length > 0}>
      {#if isLoading}
        <Loading size="xl" message="Loading transactions..." />
      {:else}
        {#each transactions as transaction (transaction.id)}
          <div
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group relative"
          >
            <div
              class="flex-shrink-0 w-3 h-3 rounded-full {transaction.type ===
              'income'
                ? 'bg-green-500'
                : 'bg-red-500'}"
            ></div>

            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 truncate">
                {transaction.description}
              </p>
              <p class="text-xs text-gray-500 capitalize">{transaction.type}</p>
            </div>

            <div class="text-right">
              <p
                class="text-sm font-medium {transaction.type === 'income'
                  ? 'text-green-600'
                  : 'text-red-600'}"
              >
                {transaction.type === "income" ? "+" : "-"}{formatAmount(
                  transaction.amount,
                )}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onclick={() => {
                reactiveTransactions.deleteTransaction(transaction.id);
              }}
              disabled={isDeleting[transaction.id]}
              class={`!p-1 text-red-500 hover:bg-red-50 !w-6 !h-6
                ${
                  isDeleting[transaction.id]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {#snippet children()}
                {#if isDeleting[transaction.id]}
                  <Icon name="loader" size="sm" class="animate-spin" />
                {:else}
                  <Icon name="trash" size="sm" />
                {/if}
              {/snippet}
            </Button>
          </div>
        {/each}

        {#if transactions.length === 0}
          <EmptyState
            icon="dollar"
            title="No transactions for this day"
            subtitle="Tap to track your first transaction"
            onclick={() => (showAddForm = true)}
          />
        {/if}
      {/if}
    </div>

    <!-- Add Transaction Form -->
    <BottomSheet bind:open={showAddForm} title="Add Transaction">
      {#snippet children()}
        <form onsubmit={handleAddTransaction} class="space-y-6">
          <!-- Type Selection -->
          <fieldset>
            <legend
              class="block text-sm font-medium text-gray-700 mb-3"
              >Transaction Type</legend
            >
            <div class="flex gap-2">
              <Button
                type="button"
                variant={type === "income" ? "primary" : "outline"}
                onclick={() => (type = "income")}
                class="flex-1 transition-all duration-200 {type === 'income'
                  ? '!bg-green-100 !text-green-700 !border-2 !border-green-200 shadow-sm'
                  : ''}"
              >
                {#snippet children()}
                  <Icon name="trending-up" size="sm" class="mr-2" />
                  Income
                {/snippet}
              </Button>
              <Button
                type="button"
                variant={type === "expense" ? "primary" : "outline"}
                onclick={() => (type = "expense")}
                class="flex-1 transition-all duration-200 {type === 'expense'
                  ? '!bg-red-100 !text-red-700 !border-2 !border-red-200 shadow-sm'
                  : ''}"
              >
                {#snippet children()}
                  <Icon name="trending-down" size="sm" class="mr-2" />
                  Expense
                {/snippet}
              </Button>
            </div>
          </fieldset>

          <!-- Description Input -->
          <Input
            bind:value={description}
            placeholder="What was this for?"
            label="Description"
            theme="financials"
            required
          />

          <!-- Amount Input -->
          <Input
            bind:value={amount}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            label="Amount ({settings.currencySymbol})"
            theme="financials"
            required
          />

          <div class="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onclick={resetForm}
              class="flex-none w-1/4"
            >
              {#snippet children()}
                Cancel
              {/snippet}
            </Button>
            <Button
              type="submit"
              variant="financials"
              class="flex-1"
              disabled={!description.trim() || amount <= 0 || isCreating}
            >
              {#snippet children()}
                {#if isCreating}
                  <Icon name="loader" size="sm" class="mr-2 animate-spin" />
                  Adding...
                {:else}
                  <Icon name="plus" size="sm" class="mr-2" />
                  Add {type === "income" ? "Income" : "Expense"}
                {/if}
              {/snippet}
            </Button>
          </div>
        </form>
      {/snippet}
    </BottomSheet>

    {#if !showAddForm && transactions.length > 0 && !isLoading}
      <Button
        variant="financials"
        dashed={true}
        onclick={() => (showAddForm = true)}
        class="w-full"
      >
        {#snippet children()}
          <Icon name="plus" size="sm" class="mr-2" />
          Add Transaction
        {/snippet}
      </Button>
    {/if}
  {/snippet}
</Card>