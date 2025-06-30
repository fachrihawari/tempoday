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

// Single dropdown state - only one can be open at a time
let activeDropdown = $state<string | null>(null);

// Helper function to update filters
function updateFilters(updates: Partial<SearchFilters>) {
  onFiltersChange({ ...filters, ...updates });
}

// Toggle dropdown
function toggleDropdown(dropdownName: string) {
  activeDropdown = activeDropdown === dropdownName ? null : dropdownName;
}

// Close dropdown
function closeDropdown() {
  activeDropdown = null;
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
  if (filters.dataTypes.length > 0) count += filters.dataTypes.length;
  if (filters.taskStatus.length > 0) count += filters.taskStatus.length;
  if (filters.taskPriorities.length > 0) count += filters.taskPriorities.length;
  if (filters.transactionTypes.length > 0) count += filters.transactionTypes.length;
  if (filters.transactionCategories.length > 0) count += filters.transactionCategories.length;
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

// Get status config
function getStatusConfig(status: 'completed' | 'pending') {
  switch (status) {
    case 'completed':
      return { label: 'Completed', color: 'text-green-600' };
    case 'pending':
      return { label: 'Pending', color: 'text-orange-600' };
  }
}

// Get transaction type config
function getTransactionTypeConfig(type: 'income' | 'expense') {
  switch (type) {
    case 'income':
      return { icon: 'trending-up', label: 'Income', color: 'text-green-600' };
    case 'expense':
      return { icon: 'trending-down', label: 'Expense', color: 'text-red-600' };
  }
}

// Handle click outside to close dropdowns
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!target.closest('.filter-dropdown')) {
    closeDropdown();
  }
}

$effect(() => {
  if (activeDropdown) {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }
});
</script>

<!-- Filter Bar -->
<div class="relative">
  <!-- Horizontal scrollable filter chips -->
  <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <!-- Clear Filters Button -->
    {#if hasActiveFilters()}
      <button
        onclick={onClearFilters}
        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 border border-red-200 rounded-full hover:bg-red-100 transition-colors whitespace-nowrap flex-shrink-0"
      >
        <Icon name="close" size="sm" />
        <span>Clear ({activeFilterCount()})</span>
      </button>
    {/if}

    <!-- Data Type Filter -->
    <div class="filter-dropdown relative flex-shrink-0">
      <button
        onclick={() => toggleDropdown('dataType')}
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full transition-colors whitespace-nowrap
          {filters.dataTypes.length > 0 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
      >
        <Icon name="clipboard" size="sm" />
        <span>Type</span>
        {#if filters.dataTypes.length > 0}
          <span class="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{filters.dataTypes.length}</span>
        {/if}
        <Icon name="chevron-down" size="sm" class="transition-transform {activeDropdown === 'dataType' ? 'rotate-180' : ''}" />
      </button>

      {#if activeDropdown === 'dataType'}
        <div class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div class="p-2">
            {#each ['task', 'note', 'transaction'] as type}
              {@const config = getDataTypeConfig(type)}
              <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.dataTypes.includes(type)}
                  onchange={() => toggleDataType(type)}
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Icon name={config.icon} size="sm" class={config.color} />
                <span class="text-sm text-gray-900">{config.label}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Status Filter -->
    <div class="filter-dropdown relative flex-shrink-0">
      <button
        onclick={() => toggleDropdown('status')}
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full transition-colors whitespace-nowrap
          {filters.taskStatus.length > 0 
            ? 'bg-orange-50 border-orange-200 text-orange-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
      >
        <Icon name="check-circle" size="sm" />
        <span>Status</span>
        {#if filters.taskStatus.length > 0}
          <span class="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{filters.taskStatus.length}</span>
        {/if}
        <Icon name="chevron-down" size="sm" class="transition-transform {activeDropdown === 'status' ? 'rotate-180' : ''}" />
      </button>

      {#if activeDropdown === 'status'}
        <div class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
          <div class="p-2">
            {#each ['pending', 'completed'] as status}
              {@const config = getStatusConfig(status)}
              <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.taskStatus.includes(status)}
                  onchange={() => toggleTaskStatus(status)}
                  class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span class="text-sm text-gray-900">{config.label}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Priority Filter -->
    <div class="filter-dropdown relative flex-shrink-0">
      <button
        onclick={() => toggleDropdown('priority')}
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full transition-colors whitespace-nowrap
          {filters.taskPriorities.length > 0 
            ? 'bg-purple-50 border-purple-200 text-purple-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
      >
        <Icon name="exclamation-triangle" size="sm" />
        <span>Priority</span>
        {#if filters.taskPriorities.length > 0}
          <span class="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{filters.taskPriorities.length}</span>
        {/if}
        <Icon name="chevron-down" size="sm" class="transition-transform {activeDropdown === 'priority' ? 'rotate-180' : ''}" />
      </button>

      {#if activeDropdown === 'priority'}
        <div class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
          <div class="p-2">
            {#each PRIORITY_OPTIONS as priority}
              {@const config = getPriorityConfig(priority)}
              <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.taskPriorities.includes(priority)}
                  onchange={() => toggleTaskPriority(priority)}
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="text-sm">{config.icon}</span>
                <span class="text-sm text-gray-900">{config.label}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Transaction Type Filter -->
    <div class="filter-dropdown relative flex-shrink-0">
      <button
        onclick={() => toggleDropdown('transactionType')}
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full transition-colors whitespace-nowrap
          {filters.transactionTypes.length > 0 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
      >
        <Icon name="trending-up" size="sm" />
        <span>Money</span>
        {#if filters.transactionTypes.length > 0}
          <span class="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{filters.transactionTypes.length}</span>
        {/if}
        <Icon name="chevron-down" size="sm" class="transition-transform {activeDropdown === 'transactionType' ? 'rotate-180' : ''}" />
      </button>

      {#if activeDropdown === 'transactionType'}
        <div class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
          <div class="p-2">
            {#each ['income', 'expense'] as type}
              {@const config = getTransactionTypeConfig(type)}
              <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.transactionTypes.includes(type)}
                  onchange={() => toggleTransactionType(type)}
                  class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <Icon name={config.icon} size="sm" class={config.color} />
                <span class="text-sm text-gray-900">{config.label}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Category Filter -->
    <div class="filter-dropdown relative flex-shrink-0">
      <button
        onclick={() => toggleDropdown('category')}
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-full transition-colors whitespace-nowrap
          {filters.transactionCategories.length > 0 
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}"
      >
        <Icon name="settings" size="sm" />
        <span>Category</span>
        {#if filters.transactionCategories.length > 0}
          <span class="bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{filters.transactionCategories.length}</span>
        {/if}
        <Icon name="chevron-down" size="sm" class="transition-transform {activeDropdown === 'category' ? 'rotate-180' : ''}" />
      </button>

      {#if activeDropdown === 'category'}
        <div class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-w-[280px]">
          <div class="p-2 max-h-64 overflow-y-auto">
            {#each CATEGORY_OPTIONS as category}
              {@const config = getCategoryConfig(category)}
              <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.transactionCategories.includes(category)}
                  onchange={() => toggleTransactionCategory(category)}
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
                />
                <span class="text-sm flex-shrink-0">{config.icon}</span>
                <span class="text-sm text-gray-900 truncate">{config.label}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
/* Hide scrollbar for horizontal scroll */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Custom scrollbar for category dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>