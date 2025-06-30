<script lang="ts">
import { onMount } from 'svelte';
import Icon from './Icon.svelte';

interface Option {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface Props {
  options: Option[];
  value: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  onSelect: (value: string) => void;
}

let {
  options,
  value,
  placeholder = 'Select option...',
  disabled = false,
  class: className = '',
  onSelect,
}: Props = $props();

let isOpen = $state(false);
let dropdownElement: HTMLDivElement = $state()!;
let triggerElement: HTMLButtonElement = $state()!;

// Get selected option
const selectedOption = $derived(options.find(opt => opt.value === value));

// Toggle dropdown
function toggleDropdown() {
  if (disabled) return;
  isOpen = !isOpen;
}

// Close dropdown
function closeDropdown() {
  isOpen = false;
}

// Handle option selection
function handleSelect(optionValue: string) {
  if (disabled) return;
  onSelect(optionValue);
  closeDropdown();
}

// Handle click outside to close dropdown
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (!dropdownElement?.contains(target) && !triggerElement?.contains(target)) {
    closeDropdown();
  }
}

// Handle escape key to close dropdown
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDropdown();
  }
}

// Position dropdown
function positionDropdown() {
  if (!isOpen || !dropdownElement || !triggerElement) return;

  const triggerRect = triggerElement.getBoundingClientRect();
  const dropdownRect = dropdownElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate available space below and above
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  // Determine if dropdown should open upward or downward
  const shouldOpenUpward = spaceBelow < dropdownRect.height && spaceAbove > spaceBelow;

  // Set position
  if (shouldOpenUpward) {
    dropdownElement.style.bottom = `${viewportHeight - triggerRect.top + 4}px`;
    dropdownElement.style.top = 'auto';
  } else {
    dropdownElement.style.top = `${triggerRect.bottom + 4}px`;
    dropdownElement.style.bottom = 'auto';
  }

  // Horizontal positioning
  dropdownElement.style.left = `${triggerRect.left}px`;
  dropdownElement.style.width = `${triggerRect.width}px`;

  // Ensure dropdown doesn't go off-screen horizontally
  const rightEdge = triggerRect.left + triggerRect.width;
  if (rightEdge > viewportWidth) {
    dropdownElement.style.left = `${viewportWidth - triggerRect.width - 8}px`;
  }
}

// Setup event listeners and positioning
$effect(() => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    
    // Position dropdown after DOM update
    setTimeout(positionDropdown, 0);
    
    // Reposition on scroll/resize
    window.addEventListener('scroll', positionDropdown, true);
    window.addEventListener('resize', positionDropdown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', positionDropdown, true);
      window.removeEventListener('resize', positionDropdown);
    };
  }
});
</script>

<div class="relative {className}">
  <!-- Trigger Button -->
  <button
    bind:this={triggerElement}
    onclick={toggleDropdown}
    {disabled}
    class="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
      {disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
      {isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}"
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      {#if selectedOption}
        {#if selectedOption.icon}
          <span class="text-sm">{selectedOption.icon}</span>
        {/if}
        <span class="truncate">{selectedOption.label}</span>
      {:else}
        <span class="text-gray-500 truncate">{placeholder}</span>
      {/if}
    </div>
    
    <Icon 
      name="chevron-down" 
      size="sm" 
      class="text-gray-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
    />
  </button>

  <!-- Dropdown Menu (Portal to body) -->
  {#if isOpen}
    <div
      bind:this={dropdownElement}
      class="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      style="min-width: 200px;"
    >
      <div class="py-1">
        {#each options as option (option.value)}
          <button
            onclick={() => handleSelect(option.value)}
            disabled={option.disabled}
            class="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2
              {option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
              {option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
          >
            {#if option.icon}
              <span class="text-sm">{option.icon}</span>
            {/if}
            <span class="flex-1 truncate">{option.label}</span>
            {#if option.value === value}
              <Icon name="check" size="sm" class="text-blue-600" />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>