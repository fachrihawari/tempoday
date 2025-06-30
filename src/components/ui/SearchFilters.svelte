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
      return { icon: 'clipboard', label: 'Tasks', color: 'bg-blue-100 text-blue-700 border-blue-300' };
    case 'note':
      return { icon: 'edit', label: 'Notes', color: 'bg-purple-100 text-purple-700 border-purple-300' };
    case 'transaction':
      return { icon: 'dollar', label: 'Transactions', color: 'bg-green-100 text-green-700 border-green-300' };
  }
}

// Get status config
function getStatusConfig(status: 'completed' | 'pending') {
  switch (status) {
    case 'completed':
      return { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-300' };
    case 'pending':
      return { label: 'Pending', color: 'bg-orange-100 text-orange-700 border-orange-300' };
  }
}

// Get transaction type config
function getTransactionTypeConfig(type: 'income' | 'expense') {
  switch (type) {
    case 'income':
      return { icon: 'trending-up', label: 'Income', color: 'bg-green-100 text-green-700 border-green-300' };
    case 'expense':
      return { icon: 'trending-down', label: 'Expense', color: 'bg-red-100 text-red-700 border-red-300' };
  }
}
</script>

<!-- Horizontal Scrollable Filter Chips -->
<div class="space-y-3">
  <!-- Filter Header with Clear Button -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Icon name="settings" size="sm" class="text-gray-500" />
      <span class="text-sm font-medium text-gray-700">Filters</span>
      {#if activeFilterCount() > 0}
        <span class="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {activeFilterCount()}
        </span>
      {/if}
    </div>
    
    {#if hasActiveFilters()}
      <Button variant="ghost" size="sm" onclick={onClearFilters}>
        {#snippet children()}
          <Icon name="close" size="sm" class="mr-1" />
          Clear
        {/snippet}
      </Button>
    {/if}
  </div>

  <!-- Scrollable Filter Chips Container -->
  <div class="overflow-x-auto pb-2 -mx-4 px-4">
    <div class="flex gap-2 min-w-max">
      <!-- Data Type Chips -->
      <div class="flex gap-2 items-center">
        <span class="text-xs text-gray-500 font-medium whitespace-nowrap">Type:</span>
        {#each ['task', 'note', 'transaction'] as type}
          {@const config = getDataTypeConfig(type)}
          <button
            onclick={() => toggleDataType(type)}
            class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap
              {filters.dataTypes.includes(type)
                ? config.color + ' shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
          >
            <Icon name={config.icon} size="sm" />
            <span>{config.label}</span>
            {#if filters.dataTypes.includes(type)}
              <Icon name="close" size="sm" class="ml-1 opacity-70" />
            {/if}
          </button>
        {/each}
      </div>

      <!-- Separator -->
      <div class="w-px h-6 bg-gray-300 mx-2"></div>

      <!-- Task Status Chips (only show if tasks are included or no type filter) -->
      {#if filters.dataTypes.length === 0 || filters.dataTypes.includes('task')}
        <div class="flex gap-2 items-center">
          <span class="text-xs text-gray-500 font-medium whitespace-nowrap">Status:</span>
          {#each ['pending', 'completed'] as status}
            {@const config = getStatusConfig(status)}
            <button
              onclick={() => toggleTaskStatus(status)}
              class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap
                {filters.taskStatus.includes(status)
                  ? config.color + ' shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <span>{config.label}</span>
              {#if filters.taskStatus.includes(status)}
                <Icon name="close" size="sm" class="ml-1 opacity-70" />
              {/if}
            </button>
          {/each}
        </div>

        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300 mx-2"></div>

        <!-- Task Priority Chips -->
        <div class="flex gap-2 items-center">
          <span class="text-xs text-gray-500 font-medium whitespace-nowrap">Priority:</span>
          {#each PRIORITY_OPTIONS as priority}
            {@const config = getPriorityConfig(priority)}
            <button
              onclick={() => toggleTaskPriority(priority)}
              class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap
                {filters.taskPriorities.includes(priority)
                  ? config.bgColor + ' ' + config.color + ' ' + config.borderColor + ' shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
              {#if filters.taskPriorities.includes(priority)}
                <Icon name="close" size="sm" class="ml-1 opacity-70" />
              {/if}
            </button>
          {/each}
        </div>

        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300 mx-2"></div>
      {/if}

      <!-- Transaction Type Chips (only show if transactions are included or no type filter) -->
      {#if filters.dataTypes.length === 0 || filters.dataTypes.includes('transaction')}
        <div class="flex gap-2 items-center">
          <span class="text-xs text-gray-500 font-medium whitespace-nowrap">Money:</span>
          {#each ['income', 'expense'] as type}
            {@const config = getTransactionTypeConfig(type)}
            <button
              onclick={() => toggleTransactionType(type)}
              class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap
                {filters.transactionTypes.includes(type)
                  ? config.color + ' shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <Icon name={config.icon} size="sm" />
              <span>{config.label}</span>
              {#if filters.transactionTypes.includes(type)}
                <Icon name="close" size="sm" class="ml-1 opacity-70" />
              {/if}
            </button>
          {/each}
        </div>

        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300 mx-2"></div>

        <!-- Transaction Category Chips -->
        <div class="flex gap-2 items-center">
          <span class="text-xs text-gray-500 font-medium whitespace-nowrap">Category:</span>
          {#each CATEGORY_OPTIONS.slice(0, 6) as category}
            {@const config = getCategoryConfig(category)}
            <button
              onclick={() => toggleTransactionCategory(category)}
              class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap
                {filters.transactionCategories.includes(category)
                  ? config.bgColor + ' ' + config.color + ' ' + config.borderColor + ' shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'}"
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
              {#if filters.transactionCategories.includes(category)}
                <Icon name="close" size="sm" class="ml-1 opacity-70" />
              {/if}
            </button>
          {/each}
          
          <!-- More Categories Button -->
          {#if CATEGORY_OPTIONS.length > 6}
            <button
              onclick={onToggle}
              class="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <Icon name="plus" size="sm" />
              <span>More</span>
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Expanded Category Panel (when "More" is clicked) -->
  {#if isOpen}
    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-700">All Categories</h4>
        <Button variant="ghost" size="sm" onclick={onToggle}>
          {#snippet children()}
            <Icon name="close" size="sm" />
          {/snippet}
        </Button>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {#each CATEGORY_OPTIONS as category}
          {@const config = getCategoryConfig(category)}
          <button
            onclick={() => toggleTransactionCategory(category)}
            class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-left
              {filters.transactionCategories.includes(category)
                ? config.bgColor + ' ' + config.color + ' ' + config.borderColor + ' shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}"
          >
            <span>{config.icon}</span>
            <span class="truncate">{config.label}</span>
            {#if filters.transactionCategories.includes(category)}
              <Icon name="check" size="sm" class="ml-auto" />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
/* Custom scrollbar for horizontal scroll */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>