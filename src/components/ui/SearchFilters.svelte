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

// Handle data type change
function handleDataTypeChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  
  if (value === '') {
    updateFilters({ dataTypes: [] });
  } else {
    updateFilters({ dataTypes: [value as 'task' | 'note' | 'transaction'] });
  }
}

// Handle task status change
function handleTaskStatusChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  
  if (value === '') {
    updateFilters({ taskStatus: [] });
  } else {
    updateFilters({ taskStatus: [value as 'completed' | 'pending'] });
  }
}

// Handle priority change
function handlePriorityChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  
  if (value === '') {
    updateFilters({ taskPriorities: [] });
  } else {
    updateFilters({ taskPriorities: [value as TaskPriority] });
  }
}

// Handle transaction type change
function handleTransactionTypeChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  
  if (value === '') {
    updateFilters({ transactionTypes: [] });
  } else {
    updateFilters({ transactionTypes: [value as 'income' | 'expense'] });
  }
}

// Handle category change
function handleCategoryChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const value = select.value;
  
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

// Get data type config
function getDataTypeConfig(type: 'task' | 'note' | 'transaction') {
  switch (type) {
    case 'task':
      return { icon: 'clipboard', label: 'Tasks', color: 'text-blue-600' };
    case 'note':
      return { icon: 'edit', label: 'Notes', color: 'text-purple-600' };
    case 'transaction':
      return { icon: 'dollar', label: 'Money', color: 'text-green-600' };
  }
}
</script>

<!-- Filter Bar -->
<div class="space-y-3">
  <!-- Clear Filters Button -->
  {#if hasActiveFilters()}
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">Filters active</span>
      <button
        onclick={onClearFilters}
        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
      >
        <Icon name="close" size="sm" />
        <span>Clear all ({activeFilterCount()})</span>
      </button>
    </div>
  {/if}

  <!-- Filter Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    <!-- Data Type Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Type</label>
      <select
        onchange={handleDataTypeChange}
        value={filters.dataTypes[0] || ''}
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
          {filters.dataTypes.length > 0 ? 'border-blue-300 bg-blue-50' : ''}"
      >
        <option value="">All types</option>
        <option value="task">📋 Tasks</option>
        <option value="note">📝 Notes</option>
        <option value="transaction">💰 Money</option>
      </select>
    </div>

    <!-- Status Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Status</label>
      <select
        onchange={handleTaskStatusChange}
        value={filters.taskStatus[0] || ''}
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white
          {filters.taskStatus.length > 0 ? 'border-orange-300 bg-orange-50' : ''}"
      >
        <option value="">All status</option>
        <option value="pending">⏳ Pending</option>
        <option value="completed">✅ Completed</option>
      </select>
    </div>

    <!-- Priority Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Priority</label>
      <select
        onchange={handlePriorityChange}
        value={filters.taskPriorities[0] || ''}
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white
          {filters.taskPriorities.length > 0 ? 'border-purple-300 bg-purple-50' : ''}"
      >
        <option value="">All priorities</option>
        {#each PRIORITY_OPTIONS as priority}
          {@const config = getPriorityConfig(priority)}
          <option value={priority}>{config.icon} {config.label}</option>
        {/each}
      </select>
    </div>

    <!-- Transaction Type Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Money Type</label>
      <select
        onchange={handleTransactionTypeChange}
        value={filters.transactionTypes[0] || ''}
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white
          {filters.transactionTypes.length > 0 ? 'border-green-300 bg-green-50' : ''}"
      >
        <option value="">All money</option>
        <option value="income">📈 Income</option>
        <option value="expense">📉 Expense</option>
      </select>
    </div>

    <!-- Category Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Category</label>
      <select
        onchange={handleCategoryChange}
        value={filters.transactionCategories[0] || ''}
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white
          {filters.transactionCategories.length > 0 ? 'border-indigo-300 bg-indigo-50' : ''}"
      >
        <option value="">All categories</option>
        {#each CATEGORY_OPTIONS as category}
          {@const config = getCategoryConfig(category)}
          <option value={category}>{config.icon} {config.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Date Range Filter -->
  <div class="grid grid-cols-2 gap-3">
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">From Date</label>
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
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">To Date</label>
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
  </div>
</div>