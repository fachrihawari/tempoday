<script lang="ts">
import { getCategoryConfig, CATEGORY_OPTIONS, type TransactionCategory } from '../../lib/categories';
import { getPriorityConfig, PRIORITY_OPTIONS, type TaskPriority } from '../../lib/priority';
import { type SearchFilters } from '../../stores/search.svelte';
import Button from './Button.svelte';
import Icon from './Icon.svelte';

interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

let {
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle,
}: Props = $props();

// Helper function to update filters
function updateFilters(updates: Partial<SearchFilters>) {
  onFiltersChange({ ...filters, ...updates });
}

// Toggle data type filter
function toggleDataType(type: 'task' | 'note' | 'transaction') {
  const newTypes = filters.dataTypes.includes(type)
    ? filters.dataTypes.filter(t => t !== type)
    : [...filters.dataTypes, type];
  updateFilters({ dataTypes: newTypes });
}

// Toggle task status filter
function toggleTaskStatus(status: 'completed' | 'pending') {
  const newStatuses = filters.taskStatus.includes(status)
    ? filters.taskStatus.filter(s => s !== status)
    : [...filters.taskStatus, status];
  updateFilters({ taskStatus: newStatuses });
}

// Toggle task priority filter
function toggleTaskPriority(priority: TaskPriority) {
  const newPriorities = filters.taskPriorities.includes(priority)
    ? filters.taskPriorities.filter(p => p !== priority)
    : [...filters.taskPriorities, priority];
  updateFilters({ taskPriorities: newPriorities });
}

// Toggle transaction type filter
function toggleTransactionType(type: 'income' | 'expense') {
  const newTypes = filters.transactionTypes.includes(type)
    ? filters.transactionTypes.filter(t => t !== type)
    : [...filters.transactionTypes, type];
  updateFilters({ transactionTypes: newTypes });
}

// Toggle transaction category filter
function toggleTransactionCategory(category: TransactionCategory) {
  const newCategories = filters.transactionCategories.includes(category)
    ? filters.transactionCategories.filter(c => c !== category)
    : [...filters.transactionCategories, category];
  updateFilters({ transactionCategories: newCategories });
}

// Update date range
function updateDateRange(field: 'start' | 'end', value: string) {
  updateFilters({
    dateRange: {
      ...filters.dateRange,
      [field]: value || null,
    },
  });
}

// Check if any filters are active
const hasActiveFilters = $derived(() => {
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
const activeFilterCount = $derived(() => {
  let count = 0;
  if (filters.dataTypes.length > 0) count++;
  if (filters.taskStatus.length > 0) count++;
  if (filters.taskPriorities.length > 0) count++;
  if (filters.transactionTypes.length > 0) count++;
  if (filters.transactionCategories.length > 0) count++;
  if (filters.dateRange.start || filters.dateRange.end) count++;
  return count;
});
</script>

<!-- Filter Toggle Button -->
<div class="relative">
  <Button
    variant="outline"
    onclick={onToggle}
    class="relative {hasActiveFilters() ? '!border-blue-500 !text-blue-700 !bg-blue-50' : ''}"
  >
    {#snippet children()}
      <Icon name="settings" size="sm" class="mr-2" />
      Filters
      {#if activeFilterCount() > 0}
        <span class="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {activeFilterCount()}
        </span>
      {/if}
      <Icon 
        name="chevron-down" 
        size="sm" 
        class="ml-2 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
      />
    {/snippet}
  </Button>

  <!-- Filter Panel -->
  {#if isOpen}
    <div class="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div class="p-4 space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-gray-900">Search Filters</h3>
          {#if hasActiveFilters()}
            <Button variant="ghost" size="sm" onclick={onClearFilters}>
              {#snippet children()}
                <Icon name="close" size="sm" class="mr-1" />
                Clear All
              {/snippet}
            </Button>
          {/if}
        </div>

        <!-- Data Types Filter -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Data Types</h4>
          <div class="flex flex-wrap gap-2">
            <button
              onclick={() => toggleDataType('task')}
              class="px-3 py-1 text-sm rounded-full border transition-colors
                {filters.dataTypes.includes('task')
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <Icon name="clipboard" size="sm" class="mr-1" />
              Tasks
            </button>
            <button
              onclick={() => toggleDataType('note')}
              class="px-3 py-1 text-sm rounded-full border transition-colors
                {filters.dataTypes.includes('note')
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <Icon name="edit" size="sm" class="mr-1" />
              Notes
            </button>
            <button
              onclick={() => toggleDataType('transaction')}
              class="px-3 py-1 text-sm rounded-full border transition-colors
                {filters.dataTypes.includes('transaction')
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <Icon name="dollar" size="sm" class="mr-1" />
              Transactions
            </button>
          </div>
        </div>

        <!-- Task Filters (only show if tasks are included) -->
        {#if filters.dataTypes.length === 0 || filters.dataTypes.includes('task')}
          <div class="space-y-3">
            <!-- Task Status -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Task Status</h4>
              <div class="flex gap-2">
                <button
                  onclick={() => toggleTaskStatus('pending')}
                  class="px-3 py-1 text-sm rounded-full border transition-colors
                    {filters.taskStatus.includes('pending')
                      ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
                >
                  Pending
                </button>
                <button
                  onclick={() => toggleTaskStatus('completed')}
                  class="px-3 py-1 text-sm rounded-full border transition-colors
                    {filters.taskStatus.includes('completed')
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
                >
                  Completed
                </button>
              </div>
            </div>

            <!-- Task Priority -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Task Priority</h4>
              <div class="flex flex-wrap gap-2">
                {#each PRIORITY_OPTIONS as priority}
                  {@const config = getPriorityConfig(priority)}
                  <button
                    onclick={() => toggleTaskPriority(priority)}
                    class="px-3 py-1 text-sm rounded-full border transition-colors
                      {filters.taskPriorities.includes(priority)
                        ? config.bgColor + ' ' + config.color + ' ' + config.borderColor
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
                  >
                    <span class="mr-1">{config.icon}</span>
                    {config.label}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Transaction Filters (only show if transactions are included) -->
        {#if filters.dataTypes.length === 0 || filters.dataTypes.includes('transaction')}
          <div class="space-y-3">
            <!-- Transaction Type -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Transaction Type</h4>
              <div class="flex gap-2">
                <button
                  onclick={() => toggleTransactionType('income')}
                  class="px-3 py-1 text-sm rounded-full border transition-colors
                    {filters.transactionTypes.includes('income')
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
                >
                  <Icon name="trending-up" size="sm" class="mr-1" />
                  Income
                </button>
                <button
                  onclick={() => toggleTransactionType('expense')}
                  class="px-3 py-1 text-sm rounded-full border transition-colors
                    {filters.transactionTypes.includes('expense')
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
                >
                  <Icon name="trending-down" size="sm" class="mr-1" />
                  Expense
                </button>
              </div>
            </div>

            <!-- Transaction Categories -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Categories</h4>
              <div class="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                {#each CATEGORY_OPTIONS as category}
                  {@const config = getCategoryConfig(category)}
                  <button
                    onclick={() => toggleTransactionCategory(category)}
                    class="px-2 py-1 text-xs rounded border transition-colors text-left
                      {filters.transactionCategories.includes(category)
                        ? config.bgColor + ' ' + config.color + ' ' + config.borderColor
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
                  >
                    <span class="mr-1">{config.icon}</span>
                    {config.label}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <!-- Date Range Filter -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">Date Range</h4>
          <div class="space-y-2">
            <div>
              <label class="block text-xs text-gray-600 mb-1">From</label>
              <input
                type="date"
                value={filters.dateRange.start || ''}
                onchange={(e) => updateDateRange('start', (e.target as HTMLInputElement).value)}
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">To</label>
              <input
                type="date"
                value={filters.dateRange.end || ''}
                onchange={(e) => updateDateRange('end', (e.target as HTMLInputElement).value)}
                class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>