<script lang="ts">
import type { Transaction } from '../../dexie/models';
import { getCategoryConfig } from '../../lib/categories';
import { formatCurrency } from '../../lib/currency';
import { settingsStore } from '../../stores/settings.svelte';

interface Props {
  transaction: Transaction;
  compact?: boolean;
  showDate?: boolean;
}

let { transaction, compact = false, showDate = false }: Props = $props();

const { settings } = $derived(settingsStore);
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
  class="flex items-center gap-3 {compact
    ? 'p-2'
    : 'p-3'} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
>
  <!-- Category Icon -->
  <div
    class="flex items-center justify-center {compact
      ? 'w-8 h-8'
      : 'w-10 h-10'} rounded-full
    {isIncome
      ? 'bg-green-100 dark:bg-green-900/30'
      : 'bg-red-100 dark:bg-red-900/30'}"
  >
    <span class={compact ? "text-base" : "text-lg"}>{categoryConfig.icon}</span>
  </div>

  <!-- Transaction Content -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <p
        class="{compact
          ? 'text-sm'
          : 'text-base'} text-gray-900 dark:text-gray-100 font-medium"
      >
        {transaction.description}
      </p>

      {#if showDate && transaction.date}
        <span
          class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
        >
          {new Date(transaction.date).toLocaleDateString()}
        </span>
      {/if}
    </div>

    {#if !compact}
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {categoryConfig.label}
      </p>
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
</div>
