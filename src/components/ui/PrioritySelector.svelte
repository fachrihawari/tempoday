<script lang="ts">
import {
  PRIORITY_OPTIONS,
  type TaskPriority,
  getPriorityConfig,
} from '../../lib/priority';
import Button from './Button.svelte';
import Icon from './Icon.svelte';

interface Props {
  value: TaskPriority;
  onSelect: (priority: TaskPriority) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  id?: string;
  dropdownWidth?: 'auto' | 'full' | 'wide';
}

let {
  value,
  onSelect,
  disabled = false,
  size = 'md',
  class: className = '',
  id,
  dropdownWidth = 'auto',
}: Props = $props();

let isOpen = $state(false);
let dropdownElement = $state<HTMLDivElement | null>(null);
let buttonElement = $state<HTMLButtonElement | null>(null);
let shouldFlipUp = $state(false);

const currentConfig = $derived(getPriorityConfig(value));

function handleSelect(priority: TaskPriority) {
  onSelect(priority);
  isOpen = false;
}

function toggleOpen(event: MouseEvent) {
  // Prevent form submission
  event.preventDefault();
  event.stopPropagation();

  if (!disabled) {
    isOpen = !isOpen;

    // Calculate dropdown position when opening
    if (isOpen && buttonElement) {
      $effect.root(() => {
        setTimeout(() => {
          calculateDropdownPosition();
        }, 0);
      });
    }
  }
}

function calculateDropdownPosition() {
  if (!buttonElement) return;

  const buttonRect = buttonElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const dropdownHeight = dropdownElement?.offsetHeight || 200; // Fallback height for priority dropdown

  // Check if we're inside a modal (BottomSheet)
  const isInModal = buttonElement.closest('[role="dialog"]') !== null;

  // For modals, use more conservative spacing and prefer showing above if needed
  const buffer = isInModal ? 20 : 10;
  const spaceBelow = viewportHeight - buttonRect.bottom - buffer;
  const spaceAbove = buttonRect.top - buffer;

  // In modals, be more aggressive about flipping up to avoid clipping
  if (isInModal) {
    shouldFlipUp = spaceBelow < dropdownHeight * 0.8 && spaceAbove > spaceBelow;
  } else {
    shouldFlipUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!target.closest('.priority-selector')) {
    isOpen = false;
    shouldFlipUp = false;
  }
}

$effect(() => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
    // Add resize listener to recalculate position
    window.addEventListener('resize', calculateDropdownPosition);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', calculateDropdownPosition);
    };
  } else {
    shouldFlipUp = false;
  }
});

const buttonSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

const dropdownWidthClasses = {
  auto: 'min-w-full',
  full: 'min-w-full w-full',
  wide: 'min-w-48 w-48',
};

const dropdownPositionClasses = {
  auto: 'left-0',
  full: 'left-0',
  wide: 'left-0 xl:right-0 xl:left-auto',
};

const getDropdownVerticalClasses = (flipUp: boolean) => {
  return flipUp ? 'bottom-full mb-1' : 'top-full mt-1';
};
</script>

<div class="relative priority-selector {className}">
  <!-- Current Priority Button -->
  <button
    bind:this={buttonElement}
    type="button"
    {id}
    onclick={toggleOpen}
    {disabled}
    class="inline-flex items-center gap-2 rounded-lg border transition-colors {buttonSizes[size]}
           {value === 'urgent' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' :
            value === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700' :
            value === 'medium' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' :
            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}
           {disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800'}"
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
    <div 
      bind:this={dropdownElement}
      class="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-900/20 z-[200] transition-all duration-200 {dropdownWidthClasses[dropdownWidth]} {dropdownPositionClasses[dropdownWidth]} {getDropdownVerticalClasses(shouldFlipUp)}"
    >
      <div class="py-1">
        {#each PRIORITY_OPTIONS as priority (priority)}
          {@const config = getPriorityConfig(priority)}
          <button
            type="button"
            onclick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleSelect(priority);
            }}
            class="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2
                   {priority === value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}"
          >
            <span class="text-sm">{config.icon}</span>
            <span class="font-medium">{config.label}</span>
            {#if priority === value}
              <Icon name="check" size="sm" class="ml-auto text-blue-600 dark:text-blue-400" />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>