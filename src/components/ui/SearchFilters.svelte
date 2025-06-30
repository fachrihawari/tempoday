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

// Dropdown states
let showDataTypeDropdown = $state(false);
let showStatusDropdown = $state(false);
let showPriorityDropdown = $state(false);
let showTransactionTypeDropdown = $state(false);
let showCategoryDropdown = $state(false);

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

// Close all dropdowns
function closeAllDropdowns() {
  showDataTypeDropdown = false;
  showStatusDropdown = false;
  showPriorityDropdown = false;
  showTransactionTypeDropdown = false;
  showCategoryDropdown = false;
}

// Handle click outside to close dropdowns
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!target.closest('.dropdown-container')) {
    closeAllDropdowns();
  }
}

$effect(() => {
  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
});
</script>

<!-- Filter Bar -->
<div class="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4">
  <!-- Clear Filters Button (only show when filters are active) -->
  {#if hasActiveFilters()}
    <div class="flex items-center gap-2 flex-shrink-0">
      <button
        onclick={onClearFilters}
        class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
      >
        <Icon name="close" size="sm" />
        <span>Clear ({activeFilterCount()})</span>
      </button>
      <div class="w-px h-4 bg-gray-300"></div>
    </div>
  {/if}

  <!-- Data Type Dropdown -->
  <div class="relative dropdown-container">
    <button
      onclick={() => {
        closeAllDropdowns();
        showDataTypeDropdown = !showDataTypeDropdown;
      }}
      class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-max
        {filters.dataTypes.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white text-gray-700'}"
    >
      <Icon name="clipboard" size="sm" />
      <span>Type</span>
      {#if filters.dataTypes.length > 0}
        <span class="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">{filters.dataTypes.length}</span>
      {/if}
      <Icon name="chevron-down" size="sm" class="transition-transform {showDataTypeDropdown ? 'rotate-180' : ''}" />
    </button>

    {#if showDataTypeDropdown}
      <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
        <div class="py-1">
          {#each ['task', 'note', 'transaction'] as type}
            {@const config = getDataTypeConfig(type)}
            <button
              onclick={() => toggleDataType(type)}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <div class="w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                {filters.dataTypes.includes(type) ? 'bg-blue-500 border-blue-500' : ''}">
                {#if filters.dataTypes.includes(type)}
                  <Icon name="check" size="sm" class="text-white" />
                {/if}
              </div>
              <Icon name={config.icon} size="sm" class={config.color} />
              <span class="text-sm text-gray-900">{config.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Status Dropdown -->
  <div class="relative dropdown-container">
    <button
      onclick={() => {
        closeAllDropdowns();
        showStatusDropdown = !showStatusDropdown;
      }}
      class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-max
        {filters.taskStatus.length > 0 ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white text-gray-700'}"
    >
      <Icon name="check-circle" size="sm" />
      <span>Status</span>
      {#if filters.taskStatus.length > 0}
        <span class="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{filters.taskStatus.length}</span>
      {/if}
      <Icon name="chevron-down" size="sm" class="transition-transform {showStatusDropdown ? 'rotate-180' : ''}" />
    </button>

    {#if showStatusDropdown}
      <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
        <div class="py-1">
          {#each ['pending', 'completed'] as status}
            {@const config = getStatusConfig(status)}
            <button
              onclick={() => toggleTaskStatus(status)}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <div class="w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                {filters.taskStatus.includes(status) ? 'bg-orange-500 border-orange-500' : ''}">
                {#if filters.taskStatus.includes(status)}
                  <Icon name="check" size="sm" class="text-white" />
                {/if}
              </div>
              <span class="text-sm text-gray-900">{config.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Priority Dropdown -->
  <div class="relative dropdown-container">
    <button
      onclick={() => {
        closeAllDropdowns();
        showPriorityDropdown = !showPriorityDropdown;
      }}
      class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-max
        {filters.taskPriorities.length > 0 ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white text-gray-700'}"
    >
      <Icon name="exclamation-triangle" size="sm" />
      <span>Priority</span>
      {#if filters.taskPriorities.length > 0}
        <span class="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">{filters.taskPriorities.length}</span>
      {/if}
      <Icon name="chevron-down" size="sm" class="transition-transform {showPriorityDropdown ? 'rotate-180' : ''}" />
    </button>

    {#if showPriorityDropdown}
      <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
        <div class="py-1">
          {#each PRIORITY_OPTIONS as priority}
            {@const config = getPriorityConfig(priority)}
            <button
              onclick={() => toggleTaskPriority(priority)}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <div class="w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                {filters.taskPriorities.includes(priority) ? 'bg-purple-500 border-purple-500' : ''}">
                {#if filters.taskPriorities.includes(priority)}
                  <Icon name="check" size="sm" class="text-white" />
                {/if}
              </div>
              <span class="text-sm">{config.icon}</span>
              <span class="text-sm text-gray-900">{config.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Transaction Type Dropdown -->
  <div class="relative dropdown-container">
    <button
      onclick={() => {
        closeAllDropdowns();
        showTransactionTypeDropdown = !showTransactionTypeDropdown;
      }}
      class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-max
        {filters.transactionTypes.length > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white text-gray-700'}"
    >
      <Icon name="trending-up" size="sm" />
      <span>Money</span>
      {#if filters.transactionTypes.length > 0}
        <span class="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">{filters.transactionTypes.length}</span>
      {/if}
      <Icon name="chevron-down" size="sm" class="transition-transform {showTransactionTypeDropdown ? 'rotate-180' : ''}" />
    </button>

    {#if showTransactionTypeDropdown}
      <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
        <div class="py-1">
          {#each ['income', 'expense'] as type}
            {@const config = getTransactionTypeConfig(type)}
            <button
              onclick={() => toggleTransactionType(type)}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <div class="w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                {filters.transactionTypes.includes(type) ? 'bg-green-500 border-green-500' : ''}">
                {#if filters.transactionTypes.includes(type)}
                  <Icon name="check" size="sm" class="text-white" />
                {/if}
              </div>
              <Icon name={config.icon} size="sm" class={config.color} />
              <span class="text-sm text-gray-900">{config.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Category Dropdown -->
  <div class="relative dropdown-container">
    <button
      onclick={() => {
        closeAllDropdowns();
        showCategoryDropdown = !showCategoryDropdown;
      }}
      class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-max
        {filters.transactionCategories.length > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white text-gray-700'}"
    >
      <Icon name="settings" size="sm" />
      <span>Category</span>
      {#if filters.transactionCategories.length > 0}
        <span class="bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded-full">{filters.transactionCategories.length}</span>
      {/if}
      <Icon name="chevron-down" size="sm" class="transition-transform {showCategoryDropdown ? 'rotate-180' : ''}" />
    </button>

    {#if showCategoryDropdown}
      <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-64 overflow-y-auto">
        <div class="py-1">
          {#each CATEGORY_OPTIONS as category}
            {@const config = getCategoryConfig(category)}
            <button
              onclick={() => toggleTransactionCategory(category)}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <div class="w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                {filters.transactionCategories.includes(category) ? 'bg-indigo-500 border-indigo-500' : ''}">
                {#if filters.transactionCategories.includes(category)}
                  <Icon name="check" size="sm" class="text-white" />
                {/if}
              </div>
              <span class="text-sm">{config.icon}</span>
              <span class="text-sm text-gray-900 truncate">{config.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
/* Clean scrollbar styling */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 3px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}

/* Dropdown scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 2px;
}
</style>