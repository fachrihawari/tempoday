<script lang="ts">
import { getCategoryConfig } from '../../lib/categories';
import { formatCurrency } from '../../lib/currency';
import type { ParsedCommand } from '../../lib/nlp';
import { settingsStore } from '../../stores/settings.svelte';

type Props = {
  preview: ParsedCommand;
};

const { preview }: Props = $props();

// Reactive settings for currency formatting
const {
  settings: { currency, locale },
} = settingsStore;

// Helper function to format currency with current settings
function formatAmount(amount: number): string {
  return formatCurrency(amount, currency, locale);
}

// Helper function to get type badge classes
function getTypeBadgeClasses(type: string): string {
  const baseClasses = 'px-2 py-1 rounded text-xs font-medium';

  switch (type) {
    case 'task':
      return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300`;
    case 'note':
      return `${baseClasses} bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300`;
    case 'transaction':
      return `${baseClasses} bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300`;
    default:
      return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`;
  }
}

// Helper function to get priority badge classes
function getPriorityBadgeClasses(priority: string): string {
  const baseClasses =
    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2';

  switch (priority) {
    case 'urgent':
      return `${baseClasses} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300`;
    case 'high':
      return `${baseClasses} bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300`;
    case 'medium':
      return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300`;
    default:
      return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300`;
  }
}

// Helper function to get priority icon
function getPriorityIcon(priority: string): string {
  switch (priority) {
    case 'urgent':
      return '🔥';
    case 'high':
      return '⚡';
    case 'medium':
      return '📋';
    default:
      return '📝';
  }
}

// Helper function to get type label with icon
function getTypeLabel(type: string, transactionType?: string): string {
  switch (type) {
    case 'task':
      return '📋 Task';
    case 'note':
      return '📝 Note';
    case 'transaction':
      return `💰 ${transactionType === 'income' ? 'Income' : 'Expense'}`;
    default:
      return '❓ Unknown';
  }
}

// Helper function to get transaction amount classes
function getTransactionAmountClasses(transactionType: string): string {
  const baseClasses = 'font-medium ml-1';
  return transactionType === 'income'
    ? `${baseClasses} text-green-600 dark:text-green-400`
    : `${baseClasses} text-red-600 dark:text-red-400`;
}
</script>

<div
  class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
>
  <div class="flex items-center gap-2 text-sm">
    <span class={getTypeBadgeClasses(preview.type)}>
      {getTypeLabel(preview.type, preview.transactionType)}
    </span>
    <span class="text-gray-600 dark:text-gray-400">
      {Math.round(preview.confidence * 100)}% confident
    </span>
  </div>

  <p class="text-sm text-gray-800 dark:text-gray-200 mt-2">
    <strong>"{preview.content}"</strong>
    
    {#if preview.priority && preview.type === "task"}
      <span class={getPriorityBadgeClasses(preview.priority)}>
        {getPriorityIcon(preview.priority)}
        {preview.priority}
      </span>
    {/if}
    
    {#if preview.amount}
      <span class={getTransactionAmountClasses(preview.transactionType || 'expense')}>
        {preview.transactionType === "income" ? "+" : "-"}{formatAmount(preview.amount)}
      </span>
    {/if}
    
    {#if preview.category && preview.type === "transaction"}
      {@const categoryConfig = getCategoryConfig(preview.category)}
      <span class="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        {categoryConfig.icon}
        {categoryConfig.label}
      </span>
    {/if}
  </p>
</div>
