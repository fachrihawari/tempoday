<script lang="ts">
import {
  CATEGORY_OPTIONS,
  type TransactionCategory,
  getCategoryConfig,
} from '../../lib/categories';
import {
  PRIORITY_OPTIONS,
  type TaskPriority,
  getPriorityConfig,
} from '../../lib/priority';
import { type SearchFilters } from '../../stores/search.svelte';
import Icon from './Icon.svelte';
interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

let { filters, onFiltersChange, onClearFilters, isOpen, onToggle }: Props =
  $props();

// Helper function to update filters
function updateFilters(updates: Partial<SearchFilters>) {
  onFiltersChange({ ...filters, ...updates });
}

// Get the current selected data type
const selectedDataType = $derived.by(() => {
  if (filters.dataTypes.length === 0) return 'all';
  return filters.dataTypes[0];
});

// Handle filter changes
function handleDataTypeChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  if (value === 'all') {
    updateFilters({
      dataTypes: [],
      // Clear type-specific filters when changing to "all"
      taskStatus: [],
      taskPriorities: [],
      transactionTypes: [],
      transactionCategories: [],
    });
  } else {
    updateFilters({
      dataTypes: [value as 'task' | 'note' | 'transaction'],
      // Clear type-specific filters when changing data type
      taskStatus: [],
      taskPriorities: [],
      transactionTypes: [],
      transactionCategories: [],
    });
  }
}

function handleTaskStatusChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  if (value === '') {
    updateFilters({ taskStatus: [] });
  } else {
    updateFilters({ taskStatus: [value as 'completed' | 'pending'] });
  }
}

function handlePriorityChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  console.log('Priority changed to:', value); // Debug log
  if (value === '') {
    updateFilters({ taskPriorities: [] });
  } else {
    updateFilters({ taskPriorities: [value as TaskPriority] });
  }
}

function handleTransactionTypeChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  if (value === '') {
    updateFilters({ transactionTypes: [] });
  } else {
    updateFilters({ transactionTypes: [value as 'income' | 'expense'] });
  }
}

function handleCategoryChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  if (value === '') {
    updateFilters({ transactionCategories: [] });
  } else {
    updateFilters({ transactionCategories: [value as TransactionCategory] });
  }
}

// Check if any filters are active
const hasActiveFilters = $derived.by(() => {
  return (
    filters.dataTypes.length > 0 ||
    filters.taskStatus.length > 0 ||
    filters.taskPriorities.length > 0 ||
    filters.transactionTypes.length > 0 ||
    filters.transactionCategories.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end
  );
});

// Count active filters
const activeFilterCount = $derived.by(() => {
  let count = 0;
  if (filters.dataTypes.length > 0) count++;
  if (filters.taskStatus.length > 0) count++;
  if (filters.taskPriorities.length > 0) count++;
  if (filters.transactionTypes.length > 0) count++;
  if (filters.transactionCategories.length > 0) count++;
  if (filters.dateRange.start || filters.dateRange.end) count++;
  return count;
});

// Determine which filters to show based on EXACT selected data type
const shouldShowTaskFilters = $derived.by(() => {
  console.log('Selected data type:', selectedDataType); // Debug log
  console.log('Should show task filters:', selectedDataType === 'task'); // Debug log
  return selectedDataType === 'task'; // ONLY show when specifically "task" is selected
});

const shouldShowTransactionFilters = $derived.by(() => {
  return selectedDataType === 'transaction'; // ONLY show when specifically "transaction" is selected
});

const shouldShowDateFilters = $derived.by(() => {
  return true; // Date filters are always relevant
});

// Get display text for current filter state
const filterStatusText = $derived.by(() => {
  if (selectedDataType === 'all') {
    return 'Filtering all data';
  } else if (selectedDataType === 'task') {
    return 'Filtering tasks';
  } else if (selectedDataType === 'note') {
    return 'Filtering notes';
  } else if (selectedDataType === 'transaction') {
    return 'Filtering transactions';
  }
  return 'Filters active';
});

// Debug reactive values
$inspect('Current filters:', filters);
$inspect('Selected data type:', selectedDataType);
$inspect('Should show task filters:', shouldShowTaskFilters);
$inspect('Task priorities:', filters.taskPriorities);
</script>

<!-- Filter Bar -->
<div class="space-y-3">
  <!-- Clear Filters Button -->
  {#if hasActiveFilters}
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {filterStatusText}
      </span>
      <button
        onclick={onClearFilters}
        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <Icon name="close" size="sm" />
        <span>Clear all ({activeFilterCount})</span>
      </button>
    </div>
  {/if}

  <!-- Horizontal Scrollable Filter Row -->
  <div class="overflow-x-auto pb-2">
    <div class="flex gap-3 min-w-max">
      <!-- Data Type Filter - Always shown -->
      <div class="flex-shrink-0 w-32">
        <label for="data-type-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
        <select
          id="data-type-filter"
          value={selectedDataType === "all"
            ? "all"
            : filters.dataTypes[0] || "all"}
          onchange={handleDataTypeChange}
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            {filters.dataTypes.length > 0 ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}"
        >
          <option value="all">All types</option>
          <option value="task">📋 Tasks</option>
          <option value="note">📝 Notes</option>
          <option value="transaction">💰 Money</option>
        </select>
      </div>

      <!-- Task-specific filters - ONLY show when "task" type is specifically selected -->
      {#if shouldShowTaskFilters}
        <!-- Status Filter -->
        <div class="flex-shrink-0 w-32">
          <label for="status-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Status</label
          >
          <select
            id="status-filter"
            value={filters.taskStatus[0] || ""}
            onchange={handleTaskStatusChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              {filters.taskStatus.length > 0
              ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20'
              : ''}"
          >
            <option value="">All status</option>
            <option value="pending">⏳ Pending</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="flex-shrink-0 w-32">
          <label for="priority-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Priority</label
          >
          <select
            id="priority-filter"
            value={filters.taskPriorities[0] || ""}
            onchange={handlePriorityChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              {filters.taskPriorities.length > 0
              ? 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20'
              : ''}"
          >
            <option value="">All priorities</option>
            {#each PRIORITY_OPTIONS as priority}
              {@const config = getPriorityConfig(priority)}
              <option value={priority}>{config.icon} {config.label}</option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Transaction-specific filters - ONLY show when "transaction" type is specifically selected -->
      {#if shouldShowTransactionFilters}
        <!-- Transaction Type Filter -->
        <div class="flex-shrink-0 w-32">
          <label for="money-type-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Money Type</label
          >
          <select
            id="money-type-filter"
            value={filters.transactionTypes[0] || ""}
            onchange={handleTransactionTypeChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              {filters.transactionTypes.length > 0
              ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
              : ''}"
          >
            <option value="">All money</option>
            <option value="income">📈 Income</option>
            <option value="expense">📉 Expense</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div class="flex-shrink-0 w-40">
          <label for="category-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Category</label
          >
          <select
            id="category-filter"
            value={filters.transactionCategories[0] || ""}
            onchange={handleCategoryChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              {filters.transactionCategories.length > 0
              ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
              : ''}"
          >
            <option value="">All categories</option>
            {#each CATEGORY_OPTIONS as category}
              {@const config = getCategoryConfig(category)}
              <option value={category}>{config.icon} {config.label}</option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Date Range Filters - Always shown as they're relevant to all data types -->
      {#if shouldShowDateFilters}
        <div class="flex-shrink-0 w-36">
          <label for="from-date-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >From Date</label
          >
          <input
            id="from-date-filter"
            type="date"
            value={filters.dateRange.start || ""}
            onchange={(e: Event) =>
              updateFilters({
                dateRange: {
                  ...filters.dateRange,
                  start: (e.target as HTMLInputElement).value || null,
                },
              })}
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              {filters.dateRange.start ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}"
          />
        </div>

        <div class="flex-shrink-0 w-36">
          <label for="to-date-filter" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >To Date</label
          >
          <input
            id="to-date-filter"
            type="date"
            value={filters.dateRange.end || ""}
            onchange={(e: Event) =>
              updateFilters({
                dateRange: {
                  ...filters.dateRange,
                  end: (e.target as HTMLInputElement).value || null,
                },
              })}
            class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              {filters.dateRange.end ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}"
          />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Hide scrollbar for cleaner look while maintaining functionality */
  .overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
  }

  /* Dark mode scrollbar colors */
  :global(.dark) .overflow-x-auto {
    scrollbar-color: #6b7280 #374151;
  }

  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }

  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  :global(.dark) .overflow-x-auto::-webkit-scrollbar-track {
    background: #374151;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  :global(.dark) .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #6b7280;
  }

  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  :global(.dark) .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>
