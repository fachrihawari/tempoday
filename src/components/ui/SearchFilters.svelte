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
      return { icon: 'clipboard', label: 'Tasks', color: 'bg-blue-500 text-white' };
    case 'note':
      return { icon: 'edit', label: 'Notes', color: 'bg-purple-500 text-white' };
    case 'transaction':
      return { icon: 'dollar', label: 'Money', color: 'bg-green-500 text-white' };
  }
}

// Get status config
function getStatusConfig(status: 'completed' | 'pending') {
  switch (status) {
    case 'completed':
      return { label: 'Done', color: 'bg-green-500 text-white' };
    case 'pending':
      return { label: 'Todo', color: 'bg-orange-500 text-white' };
  }
}

// Get transaction type config
function getTransactionTypeConfig(type: 'income' | 'expense') {
  switch (type) {
    case 'income':
      return { icon: 'trending-up', label: 'Income', color: 'bg-green-500 text-white' };
    case 'expense':
      return { icon: 'trending-down', label: 'Expense', color: 'bg-red-500 text-white' };
  }
}
</script>

<!-- Clean Horizontal Filter Chips -->
{#if hasActiveFilters() || activeFilterCount() > 0}
  <div class="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
    <!-- Active Filter Count Badge -->
    {#if activeFilterCount() > 0}
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {activeFilterCount()} filter{activeFilterCount() !== 1 ? 's' : ''}
        </span>
        <button
          onclick={onClearFilters}
          class="text-gray-500 hover:text-gray-700 transition-colors"
          title="Clear all filters"
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
      
      <!-- Separator -->
      <div class="w-px h-4 bg-gray-300 flex-shrink-0"></div>
    {/if}

    <!-- Active Filter Chips -->
    <div class="flex gap-2 min-w-max">
      <!-- Data Type Chips -->
      {#each filters.dataTypes as type}
        {@const config = getDataTypeConfig(type)}
        <button
          onclick={() => toggleDataType(type)}
          class="flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-200 {config.color} shadow-sm hover:shadow-md"
        >
          <Icon name={config.icon} size="sm" />
          <span>{config.label}</span>
          <Icon name="close" size="sm" class="ml-1 opacity-80" />
        </button>
      {/each}

      <!-- Task Status Chips -->
      {#each filters.taskStatus as status}
        {@const config = getStatusConfig(status)}
        <button
          onclick={() => toggleTaskStatus(status)}
          class="flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-200 {config.color} shadow-sm hover:shadow-md"
        >
          <span>{config.label}</span>
          <Icon name="close" size="sm" class="ml-1 opacity-80" />
        </button>
      {/each}

      <!-- Task Priority Chips -->
      {#each filters.taskPriorities as priority}
        {@const config = getPriorityConfig(priority)}
        <button
          onclick={() => toggleTaskPriority(priority)}
          class="flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-200 bg-gray-800 text-white shadow-sm hover:shadow-md"
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
          <Icon name="close" size="sm" class="ml-1 opacity-80" />
        </button>
      {/each}

      <!-- Transaction Type Chips -->
      {#each filters.transactionTypes as type}
        {@const config = getTransactionTypeConfig(type)}
        <button
          onclick={() => toggleTransactionType(type)}
          class="flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-200 {config.color} shadow-sm hover:shadow-md"
        >
          <Icon name={config.icon} size="sm" />
          <span>{config.label}</span>
          <Icon name="close" size="sm" class="ml-1 opacity-80" />
        </button>
      {/each}

      <!-- Transaction Category Chips -->
      {#each filters.transactionCategories as category}
        {@const config = getCategoryConfig(category)}
        <button
          onclick={() => toggleTransactionCategory(category)}
          class="flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-200 bg-gray-700 text-white shadow-sm hover:shadow-md"
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
          <Icon name="close" size="sm" class="ml-1 opacity-80" />
        </button>
      {/each}
    </div>
  </div>
{/if}

<!-- Filter Selection (only show when no active filters) -->
{#if !hasActiveFilters()}
  <div class="overflow-x-auto pb-2 -mx-4 px-4">
    <div class="flex gap-3 min-w-max">
      <!-- Data Type Options -->
      <div class="flex gap-1">
        {#each ['task', 'note', 'transaction'] as type}
          {@const config = getDataTypeConfig(type)}
          <button
            onclick={() => toggleDataType(type)}
            class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Icon name={config.icon} size="sm" />
            <span>{config.label}</span>
          </button>
        {/each}
      </div>

      <!-- Separator -->
      <div class="w-px h-6 bg-gray-200 self-center"></div>

      <!-- Status Options -->
      <div class="flex gap-1">
        {#each ['pending', 'completed'] as status}
          {@const config = getStatusConfig(status)}
          <button
            onclick={() => toggleTaskStatus(status)}
            class="px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            {config.label}
          </button>
        {/each}
      </div>

      <!-- Separator -->
      <div class="w-px h-6 bg-gray-200 self-center"></div>

      <!-- Priority Options -->
      <div class="flex gap-1">
        {#each PRIORITY_OPTIONS.slice(0, 2) as priority}
          {@const config = getPriorityConfig(priority)}
          <button
            onclick={() => toggleTaskPriority(priority)}
            class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        {/each}
      </div>

      <!-- Separator -->
      <div class="w-px h-6 bg-gray-200 self-center"></div>

      <!-- Transaction Type Options -->
      <div class="flex gap-1">
        {#each ['income', 'expense'] as type}
          {@const config = getTransactionTypeConfig(type)}
          <button
            onclick={() => toggleTransactionType(type)}
            class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Icon name={config.icon} size="sm" />
            <span>{config.label}</span>
          </button>
        {/each}
      </div>

      <!-- More Options Button -->
      <button
        onclick={onToggle}
        class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
      >
        <Icon name="settings" size="sm" />
        <span>More</span>
      </button>
    </div>
  </div>
{/if}

<!-- Expanded Options Panel -->
{#if isOpen}
  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-medium text-gray-900">All Filters</h4>
      <Button variant="ghost" size="sm" onclick={onToggle}>
        {#snippet children()}
          <Icon name="close" size="sm" />
        {/snippet}
      </Button>
    </div>
    
    <!-- Priority Options -->
    <div class="space-y-2">
      <h5 class="text-xs font-medium text-gray-700 uppercase tracking-wide">Priority</h5>
      <div class="flex flex-wrap gap-2">
        {#each PRIORITY_OPTIONS as priority}
          {@const config = getPriorityConfig(priority)}
          <button
            onclick={() => toggleTaskPriority(priority)}
            class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-all duration-200
              {filters.taskPriorities.includes(priority)
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}"
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Categories -->
    <div class="space-y-2">
      <h5 class="text-xs font-medium text-gray-700 uppercase tracking-wide">Categories</h5>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {#each CATEGORY_OPTIONS as category}
          {@const config = getCategoryConfig(category)}
          <button
            onclick={() => toggleTransactionCategory(category)}
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-left
              {filters.transactionCategories.includes(category)
                ? 'bg-gray-700 text-white border-gray-700'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}"
          >
            <span>{config.icon}</span>
            <span class="truncate">{config.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}

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
</style>