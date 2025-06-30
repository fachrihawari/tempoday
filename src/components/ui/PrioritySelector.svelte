<script lang="ts">
import { getPriorityConfig, PRIORITY_OPTIONS, type TaskPriority } from '../../lib/priority';
import Button from './Button.svelte';
import Icon from './Icon.svelte';

interface Props {
  value: TaskPriority;
  onSelect: (priority: TaskPriority) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

let {
  value,
  onSelect,
  disabled = false,
  size = 'md',
  class: className = '',
}: Props = $props();

let isOpen = $state(false);

const currentConfig = $derived(getPriorityConfig(value));

function handleSelect(priority: TaskPriority) {
  onSelect(priority);
  isOpen = false;
}

function toggleOpen() {
  if (!disabled) {
    isOpen = !isOpen;
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!target.closest('.priority-selector')) {
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

<div class="relative priority-selector {className}">
  <!-- Current Priority Button -->
  <button
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

  <!-- Priority Options Dropdown -->
  {#if isOpen && !disabled}
    <div class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-full">
      <div class="py-1">
        {#each PRIORITY_OPTIONS as priority (priority)}
          {@const config = getPriorityConfig(priority)}
          <button
            onclick={() => handleSelect(priority)}
            class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2
                   {priority === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}"
          >
            <span class="text-sm">{config.icon}</span>
            <span class="font-medium">{config.label}</span>
            {#if priority === value}
              <Icon name="check" size="sm" class="ml-auto text-blue-600" />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>