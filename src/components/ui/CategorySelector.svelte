<script lang="ts">
import { getCategoryConfig, getCategoriesForType, type TransactionCategory } from '../../lib/categories';
import Icon from './Icon.svelte';

interface Props {
  value?: TransactionCategory;
  transactionType: 'income' | 'expense';
  onSelect?: (category: TransactionCategory) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  id?: string;
}

let {
  value = $bindable(),
  transactionType,
  onSelect,
  disabled = false,
  size = 'md',
  class: className = '',
  id,
}: Props = $props();

let isOpen = $state(false);

const currentConfig = $derived(getCategoryConfig(value || 'other'));
const availableCategories = $derived(getCategoriesForType(transactionType));

function handleSelect(category: TransactionCategory) {
  value = category;
  onSelect?.(category);
  isOpen = false;
}

function toggleOpen(event: MouseEvent) {
  // Prevent form submission
  event.preventDefault();
  event.stopPropagation();
  
  if (!disabled) {
    isOpen = !isOpen;
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!target.closest('.category-selector')) {
    isOpen = false;
  }
}

$effect(() => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }
});

const buttonSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};
</script>

<div class="relative category-selector {className}">
  <!-- Current Category Button -->
  <button
    type="button"
    {id}
    onclick={toggleOpen}
    {disabled}
    class="inline-flex items-center gap-2 rounded-lg border transition-colors {currentConfig.bgColor} {currentConfig.color} {currentConfig.borderColor} {buttonSizes[size]}
           {disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'}"
  >
    <span class="text-sm">{currentConfig.icon}</span>
    <span class="font-medium">{currentConfig.label}</span>
    {#if !disabled}
      <Icon 
        name="chevron-down" 
        size="sm" 
        class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
      />
    {/if}
  </button>

  <!-- Category Options Dropdown -->
  {#if isOpen && !disabled}
    <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-full max-w-xs">
      <div class="py-1 max-h-64 overflow-y-auto">
        {#each availableCategories as category (category)}
          {@const config = getCategoryConfig(category)}
          <button
            type="button"
            onclick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleSelect(category);
            }}
            class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-start gap-3
                   {category === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}"
          >
            <span class="text-lg flex-shrink-0 mt-0.5">{config.icon}</span>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm">{config.label}</div>
              <div class="text-xs text-gray-500 mt-0.5">{config.description}</div>
            </div>
            {#if category === value}
              <Icon name="check" size="sm" class="text-blue-600 flex-shrink-0 mt-1" />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>