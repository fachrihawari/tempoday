<script lang="ts">
import { getCategoryConfig, CATEGORY_OPTIONS, type TransactionCategory } from '../../lib/categories';
import { getPriorityConfig, PRIORITY_OPTIONS, type TaskPriority } from '../../lib/priority';
import { type SearchFilters } from '../../stores/search.svelte';
import DropdownPicker from './DropdownPicker.svelte';
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

// Data type options
const dataTypeOptions = [
  { value: '', label: 'All types', icon: '📂' },
  { value: 'task', label: 'Tasks', icon: '📋' },
  { value: 'note', label: 'Notes', icon: '📝' },
  { value: 'transaction', label: 'Money', icon: '💰' },
];

// Status options
const statusOptions = [
  { value: '', label: 'All status', icon: '📊' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'completed', label: 'Completed', icon: '✅' },
];

// Priority options
const priorityOptions = [
  { value: '', label: 'All priorities', icon: '📋' },
  ...PRIORITY_OPTIONS.map(priority => {
    const config = getPriorityConfig(priority);
    return {
      value: priority,
      label: config.label,
      icon: config.icon,
    };
  }),
];

// Transaction type options
const transactionTypeOptions = [
  { value: '', label: 'All money', icon: '💰' },
  { value: 'income', label: 'Income', icon: '📈' },
  { value: 'expense', label: 'Expense', icon: '📉' },
];

// Category options
const categoryOptions = [
  { value: '', label: 'All categories', icon: '📂' },
  ...CATEGORY_OPTIONS.map(category => {
    const config = getCategoryConfig(category);
    return {
      value: category,
      label: config.label,
      icon: config.icon,
    };
  }),
];

// Handle filter changes
function handleDataTypeChange(value: string) {
  if (value === '') {
    updateFilters({ dataTypes: [] });
  } else {
    updateFilters({ dataTypes: [value as 'task' | 'note' | 'transaction'] });
  }
}

function handleTaskStatusChange(value: string) {
  if (value === '') {
    updateFilters({ taskStatus: [] });
  } else {
    updateFilters({ taskStatus: [value as 'completed' | 'pending'] });
  }
}

function handlePriorityChange(value: string) {
  if (value === '') {
    updateFilters({ taskPriorities: [] });
  } else {
    updateFilters({ taskPriorities: [value as TaskPriority] });
  }
}

function handleTransactionTypeChange(value: string) {
  if (value === '') {
    updateFilters({ transactionTypes: [] });
  } else {
    updateFilters({ transactionTypes: [value as 'income' | 'expense'] });
  }
}

function handleCategoryChange(value: string) {
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
      <DropdownPicker
        options={dataTypeOptions}
        value={filters.dataTypes[0] || ''}
        placeholder="All types"
        onSelect={handleDataTypeChange}
        class={filters.dataTypes.length > 0 ? 'border-blue-300 bg-blue-50' : ''}
      />
    </div>

    <!-- Status Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Status</label>
      <DropdownPicker
        options={statusOptions}
        value={filters.taskStatus[0] || ''}
        placeholder="All status"
        onSelect={handleTaskStatusChange}
        class={filters.taskStatus.length > 0 ? 'border-orange-300 bg-orange-50' : ''}
      />
    </div>

    <!-- Priority Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Priority</label>
      <DropdownPicker
        options={priorityOptions}
        value={filters.taskPriorities[0] || ''}
        placeholder="All priorities"
        onSelect={handlePriorityChange}
        class={filters.taskPriorities.length > 0 ? 'border-purple-300 bg-purple-50' : ''}
      />
    </div>

    <!-- Transaction Type Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Money Type</label>
      <DropdownPicker
        options={transactionTypeOptions}
        value={filters.transactionTypes[0] || ''}
        placeholder="All money"
        onSelect={handleTransactionTypeChange}
        class={filters.transactionTypes.length > 0 ? 'border-green-300 bg-green-50' : ''}
      />
    </div>

    <!-- Category Filter -->
    <div class="space-y-1">
      <label class="block text-xs font-medium text-gray-700">Category</label>
      <DropdownPicker
        options={categoryOptions}
        value={filters.transactionCategories[0] || ''}
        placeholder="All categories"
        onSelect={handleCategoryChange}
        class={filters.transactionCategories.length > 0 ? 'border-indigo-300 bg-indigo-50' : ''}
      />
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