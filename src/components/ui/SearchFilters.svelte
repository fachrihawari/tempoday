<script lang="ts">
import { getCategoryConfig, CATEGORY_OPTIONS, type TransactionCategory } from '../../lib/categories';
import { getPriorityConfig, PRIORITY_OPTIONS, type TaskPriority } from '../../lib/priority';
import { type SearchFilters } from '../../stores/search.svelte';
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

// Get the current selected data type
const selectedDataType = $derived(() => {
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
      transactionCategories: []
    });
  } else {
    updateFilters({ 
      dataTypes: [value as 'task' | 'note' | 'transaction'],
      // Clear type-specific filters when changing data type
      taskStatus: [],
      taskPriorities: [],
      transactionTypes: [],
      transactionCategories: []
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

// Determine which filters to show based on selected data type
const shouldShowTaskFilters = $derived(() => {
  return selectedDataType === 'all' || selectedDataType === 'task';
});

const shouldShowTransactionFilters = $derived(() => {
  return selectedDataType === 'all' || selectedDataType === 'transaction';
});

const shouldShowDateFilters = $derived(() => {
  return true; // Date filters are always relevant
});

// Get display text for current filter state
const filterStatusText = $derived(() => {
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
</script>

<!-- Filter Bar -->
<div class="space-y-3">
  <!-- Clear Filters Button -->
  {#if hasActiveFilters}
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">
        {filterStatusText}
      </span>
      <button
        onclick={onClearFilters}
        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
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
        <label class="block text-xs font-medium text-gray-700 mb-1">Type</label>
        <select
          value={selectedDataType === 'all' ? 'all' : filters.dataTypes[0] || 'all'}
          onchange={handleDataTypeChange}
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
            {filters.dataTypes.length > 0 ? 'border-blue-300 bg-blue-50' : ''}"
        >
          <option value="all">All types</option>
          <option value="task">📋 Tasks</option>
          <option value="note">📝 Notes</option>
          <option value="transaction">💰 Money</option>
        </select>
      </div>

      <!-- Task-specific filters - Only show when task type is selected or all types are selected -->
      {#if shouldShowTaskFilters}
        <!-- Status Filter -->
        <div class="flex-shrink-0 w-32">
          <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.taskStatus[0] || ''}
            onchange={handleTaskStatusChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
              {filters.taskStatus.length > 0 ? 'border-orange-300 bg-orange-50' : ''}"
          >
            <option value="">All status</option>
            <option value="pending">⏳ Pending</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="flex-shrink-0 w-32">
          <label class="block text-xs font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.taskPriorities[0] || ''}
            onchange={handlePriorityChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
              {filters.taskPriorities.length > 0 ? 'border-purple-300 bg-purple-50' : ''}"
          >
            <option value="">All priorities</option>
            {#each PRIORITY_OPTIONS as priority}
              {@const config = getPriorityConfig(priority)}
              <option value={priority}>{config.icon} {config.label}</option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Transaction-specific filters - Only show when transaction type is selected or all types are selected -->
      {#if shouldShowTransactionFilters}
        <!-- Transaction Type Filter -->
        <div class="flex-shrink-0 w-32">
          <label class="block text-xs font-medium text-gray-700 mb-1">Money Type</label>
          <select
            value={filters.transactionTypes[0] || ''}
            onchange={handleTransactionTypeChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
              {filters.transactionTypes.length > 0 ? 'border-green-300 bg-green-50' : ''}"
          >
            <option value="">All money</option>
            <option value="income">📈 Income</option>
            <option value="expense">📉 Expense</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div class="flex-shrink-0 w-40">
          <label class="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.transactionCategories[0] || ''}
            onchange={handleCategoryChange}
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
              {filters.transactionCategories.length > 0 ? 'border-indigo-300 bg-indigo-50' : ''}"
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
          <label class="block text-xs font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={filters.dateRange.start || ''}
            onchange={(e) => updateFilters({ 
              dateRange: { 
                ...filters.dateRange, 
                start: (e.target as HTMLInputElement).value || null 
              } 
            })}
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
              {filters.dateRange.start ? 'border-blue-300 bg-blue-50' : ''}"
          />
        </div>

        <div class="flex-shrink-0 w-36">
          <label class="block text-xs font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={filters.dateRange.end || ''}
            onchange={(e) => updateFilters({ 
              dateRange: { 
                ...filters.dateRange, 
                end: (e.target as HTMLInputElement).value || null 
              } 
            })}
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
              {filters.dateRange.end ? 'border-blue-300 bg-blue-50' : ''}"
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
  
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
</style>