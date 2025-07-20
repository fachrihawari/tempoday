<script lang="ts">
import type { Transaction } from '../../dexie/models';
import { getCategoryConfig } from '../../lib/categories';
import { formatCurrency } from '../../lib/currency';
import { settingsStore } from '../../stores/settings.svelte';
import { toastStore } from '../../stores/toast.svelte';
import { reactiveTransactions } from '../../stores/transactions.svelte';
import Button from '../ui/Button.svelte';
import Icon from '../ui/Icon.svelte';
import CategorySelector from './CategorySelector.svelte';

interface Props {
  transaction: Transaction;
  compact?: boolean;
  showDate?: boolean;
}

let { transaction, compact = false, showDate = false }: Props = $props();

const { settings } = $derived(settingsStore);
const { isDeleting, isUpdating } = $derived(reactiveTransactions);
const categoryConfig = $derived(getCategoryConfig(transaction.category));
const isIncome = $derived(transaction.type === 'income');

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  const currency = settings?.currency || 'USD';
  const locale = settings?.locale || 'en-US';
  return formatCurrency(amount, currency, locale);
}
</script>

<div
  class="flex items-center {compact
    ? 'p-2 gap-2'
    : 'p-3 gap-3'} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group relative border border-gray-100 dark:border-gray-700"
>
  {#if compact}
    
  <span
    class="w-6 h-6 flex items-center justify-center text-xs rounded-full border {categoryConfig.color} {categoryConfig.bgColor} dark:bg-opacity-20 {categoryConfig.borderColor} dark:border-opacity-30"
  >
    {categoryConfig.icon}
  </span>
  {/if}

  <!-- Transaction Content -->
  <div class="flex flex-col flex-1 gap-2 min-w-0">
    <p class="text-sm text-gray-900 dark:text-gray-100 truncate">
      {transaction.description}
    </p>

    {#if !compact}
      <CategorySelector
        compact
        value={transaction.category}
        transactionType={transaction.type}
        onSelect={async (newCategory) => {
          try {
            await reactiveTransactions.updateTransaction(transaction.id, {
              category: newCategory,
            });
            toastStore.success("Category updated");
          } catch (err) {
            // Error is already handled by the store
            console.error("Failed to update category:", err);
          }
        }}
        disabled={isUpdating[transaction.id]}
      />
    {/if}

    {#if showDate && transaction.date}
      <span
        class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-fit"
      >
        {new Date(transaction.date).toLocaleDateString()}
      </span>
    {/if}
  </div>

  <!-- Amount -->
  <div class="text-right shrink-0">
    <p
      class="{compact ? 'text-sm' : 'text-base'} font-semibold
      {isIncome
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400'}"
    >
      {isIncome ? "+" : "-"}{formatAmount(transaction.amount)}
    </p>
  </div>

  <!-- Delete Button -->
  {#if !compact}
    <Button
      variant="ghost"
      size="sm"
      onclick={() => {
        reactiveTransactions.deleteTransaction(transaction.id);
      }}
      disabled={isDeleting[transaction.id]}
      class={`!p-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 !w-6 !h-6
        ${isDeleting[transaction.id] ? "opacity-50 cursor-not-allowed" : ""}
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
  {/if}
</div>
